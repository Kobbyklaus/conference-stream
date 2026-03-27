const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { Pool } = require("pg");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

// Initialize database tables
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      video_url TEXT NOT NULL,
      host_token TEXT,
      status TEXT DEFAULT 'live',
      start_time TEXT,
      end_time TEXT,
      subtitle_url TEXT,
      peak_viewers INTEGER DEFAULT 0,
      total_joins INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      room_code TEXT NOT NULL,
      username TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Add columns if they don't exist (for existing databases)
  const migrations = [
    "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS subtitle_url TEXT",
    "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS peak_viewers INTEGER DEFAULT 0",
    "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS total_joins INTEGER DEFAULT 0",
  ];
  for (const sql of migrations) {
    try {
      await pool.query(sql);
    } catch {
      // Column may already exist
    }
  }
}

// In-memory state
const roomViewers = new Map();
const roomHosts = new Map();
const roomParticipants = new Map();
const roomPlaybackState = new Map();

// Helper: verify host token against database
async function verifyHost(roomCode, hostToken) {
  if (!hostToken) return false;
  try {
    const result = await pool.query("SELECT host_token FROM rooms WHERE code = $1", [roomCode]);
    return result.rows[0] && result.rows[0].host_token === hostToken;
  } catch {
    return false;
  }
}

// Helper: get room status from database
async function getRoomStatus(roomCode) {
  try {
    const result = await pool.query(
      "SELECT status, start_time, end_time FROM rooms WHERE code = $1",
      [roomCode]
    );
    return result.rows[0] || null;
  } catch {
    return null;
  }
}

// Helper: update room status in database
async function setRoomStatus(roomCode, status) {
  try {
    await pool.query("UPDATE rooms SET status = $1 WHERE code = $2", [status, roomCode]);
  } catch (err) {
    console.error("Failed to update room status:", err);
  }
}

// Helper: broadcast participant list to room
function broadcastParticipants(io, roomCode) {
  const participants = roomParticipants.get(roomCode) || [];
  io.to(roomCode).emit("participant-list", participants);
}

app.prepare().then(async () => {
  // Initialize database
  await initDb();
  console.log("Database initialized");

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    path: "/api/socketio",
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    let currentRoom = null;
    let currentUser = null;
    let isHost = false;

    // Allow components to request current state on mount
    socket.on("request-participants", (requestedRoom) => {
      const participants = roomParticipants.get(requestedRoom) || [];
      socket.emit("participant-list", participants);
    });

    socket.on("request-viewer-count", (requestedRoom) => {
      const count = roomViewers.get(requestedRoom) || 0;
      socket.emit("viewer-count", count);
    });

    socket.on("join-room", async ({ roomCode, username, hostToken }) => {
      try {
        // Check room status
        const roomInfo = await getRoomStatus(roomCode);
        if (roomInfo && roomInfo.status === "ended") {
          socket.emit("room-ended");
          return;
        }

        currentRoom = roomCode;
        currentUser = username;
        socket.join(roomCode);

        // Check if this user is the host
        isHost = await verifyHost(roomCode, hostToken);

        if (isHost) {
          roomHosts.set(roomCode, { socketId: socket.id, username });
        }

        // Add to participants list
        if (!roomParticipants.has(roomCode)) {
          roomParticipants.set(roomCode, []);
        }
        roomParticipants.get(roomCode).push({
          socketId: socket.id,
          username,
          isHost,
        });

        // Increment viewer count
        const count = (roomViewers.get(roomCode) || 0) + 1;
        roomViewers.set(roomCode, count);
        io.to(roomCode).emit("viewer-count", count);

        // Notify room
        io.to(roomCode).emit("user-joined", { username, count });

        // Broadcast updated participant list
        broadcastParticipants(io, roomCode);

        // Track analytics
        try {
          await pool.query(
            "UPDATE rooms SET total_joins = total_joins + 1, peak_viewers = GREATEST(peak_viewers, $1) WHERE code = $2",
            [count, roomCode]
          );
        } catch (err) {
          console.error("Failed to update analytics:", err);
        }

        // Send current playback state to ALL joiners (including host on refresh)
        if (roomPlaybackState.has(roomCode)) {
          const state = roomPlaybackState.get(roomCode);
          let adjustedTime = state.currentTime;
          if (state.isPlaying) {
            const elapsed = (Date.now() - state.updatedAt) / 1000;
            adjustedTime = state.currentTime + elapsed;
          }
          socket.emit("sync-playback", {
            currentTime: adjustedTime,
            isPlaying: state.isPlaying,
          });
        }

        // If room is scheduled and start time has passed, auto-start
        if (roomInfo && roomInfo.status === "scheduled" && roomInfo.start_time) {
          const startTime = new Date(roomInfo.start_time);
          if (startTime <= new Date()) {
            await setRoomStatus(roomCode, "live");
            io.to(roomCode).emit("room-started");
          }
        }
      } catch (err) {
        console.error("Error in join-room:", err);
      }
    });

    // Host playback controls
    socket.on("host-play", async ({ roomCode, hostToken, currentTime }) => {
      if (!(await verifyHost(roomCode, hostToken))) return;
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying: true,
        updatedAt: Date.now(),
      });
      socket.to(roomCode).emit("sync-playback", { currentTime, isPlaying: true });
    });

    socket.on("host-pause", async ({ roomCode, hostToken, currentTime }) => {
      if (!(await verifyHost(roomCode, hostToken))) return;
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying: false,
        updatedAt: Date.now(),
      });
      socket.to(roomCode).emit("sync-playback", { currentTime, isPlaying: false });
    });

    socket.on("host-seek", async ({ roomCode, hostToken, currentTime }) => {
      if (!(await verifyHost(roomCode, hostToken))) return;
      const state = roomPlaybackState.get(roomCode) || { isPlaying: true };
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying: state.isPlaying,
        updatedAt: Date.now(),
      });
      socket.to(roomCode).emit("sync-playback", { currentTime, isPlaying: state.isPlaying });
    });

    // Periodic sync from host (every 5s)
    socket.on("host-sync-tick", async ({ roomCode, hostToken, currentTime, isPlaying }) => {
      if (!(await verifyHost(roomCode, hostToken))) return;
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying,
        updatedAt: Date.now(),
      });

      // Check if end_time has passed
      const roomInfo = await getRoomStatus(roomCode);
      if (roomInfo && roomInfo.end_time) {
        const endTime = new Date(roomInfo.end_time);
        if (endTime <= new Date()) {
          await setRoomStatus(roomCode, "ended");
          io.to(roomCode).emit("room-ended");
          roomPlaybackState.delete(roomCode);
          roomParticipants.delete(roomCode);
          roomHosts.delete(roomCode);
        }
      }
    });

    // Host kicks a participant
    socket.on("host-kick", async ({ roomCode, hostToken, targetSocketId }) => {
      if (!(await verifyHost(roomCode, hostToken))) return;

      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket) {
        targetSocket.emit("you-were-kicked");
        targetSocket.leave(roomCode);
        targetSocket.disconnect(true);
      }

      const participants = roomParticipants.get(roomCode) || [];
      roomParticipants.set(
        roomCode,
        participants.filter((p) => p.socketId !== targetSocketId)
      );

      const count = Math.max((roomViewers.get(roomCode) || 1) - 1, 0);
      roomViewers.set(roomCode, count);
      if (count === 0) roomViewers.delete(roomCode);
      io.to(roomCode).emit("viewer-count", count);

      broadcastParticipants(io, roomCode);
    });

    // Host ends the stream
    socket.on("host-end-stream", async ({ roomCode, hostToken }) => {
      if (!(await verifyHost(roomCode, hostToken))) return;

      await setRoomStatus(roomCode, "ended");
      io.to(roomCode).emit("room-ended");

      roomPlaybackState.delete(roomCode);
      roomParticipants.delete(roomCode);
      roomHosts.delete(roomCode);
      roomViewers.delete(roomCode);
    });

    // Host starts a scheduled stream
    socket.on("host-start-stream", async ({ roomCode, hostToken }) => {
      if (!(await verifyHost(roomCode, hostToken))) return;

      await setRoomStatus(roomCode, "live");
      io.to(roomCode).emit("room-started");
    });

    // Reactions
    socket.on("send-reaction", ({ roomCode, emoji }) => {
      const allowed = ["👏", "🔥", "❤️", "😂", "🎉"];
      if (allowed.includes(emoji)) {
        io.to(roomCode).emit("new-reaction", { emoji });
      }
    });

    socket.on("send-comment", async ({ roomCode, username, message }) => {
      const timestamp = new Date().toISOString();

      try {
        await pool.query(
          "INSERT INTO comments (room_code, username, message) VALUES ($1, $2, $3)",
          [roomCode, username, message]
        );
      } catch (err) {
        console.error("Failed to persist comment:", err);
      }

      io.to(roomCode).emit("new-comment", {
        username,
        message,
        created_at: timestamp,
      });
    });

    socket.on("disconnect", () => {
      if (currentRoom) {
        const participants = roomParticipants.get(currentRoom) || [];
        roomParticipants.set(
          currentRoom,
          participants.filter((p) => p.socketId !== socket.id)
        );

        const count = Math.max((roomViewers.get(currentRoom) || 1) - 1, 0);
        roomViewers.set(currentRoom, count);
        if (count === 0) roomViewers.delete(currentRoom);
        io.to(currentRoom).emit("viewer-count", count);
        io.to(currentRoom).emit("user-left", {
          username: currentUser,
          count,
        });

        broadcastParticipants(io, currentRoom);
      }
    });
  });

  // Auto-start scheduled rooms (check every 10s)
  setInterval(async () => {
    try {
      const result = await pool.query(
        "SELECT code, start_time FROM rooms WHERE status = 'scheduled' AND start_time IS NOT NULL"
      );
      const now = new Date();
      for (const room of result.rows) {
        const startTime = new Date(room.start_time);
        if (startTime <= now) {
          await setRoomStatus(room.code, "live");
          io.to(room.code).emit("room-started");
          console.log(`Auto-started room ${room.code}`);
        }
      }
    } catch (err) {
      console.error("Auto-start check failed:", err);
    }
  }, 10000);

  server.listen(PORT, () => {
    console.log(`> Conference Stream ready on http://localhost:${PORT}`);
  });
});
