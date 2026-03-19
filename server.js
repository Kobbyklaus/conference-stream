const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const Database = require("better-sqlite3");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// In-memory state
const roomViewers = new Map();
const roomHosts = new Map(); // roomCode -> { socketId, username }
const roomParticipants = new Map(); // roomCode -> [{ socketId, username, isHost }]
const roomPlaybackState = new Map(); // roomCode -> { currentTime, isPlaying, updatedAt }

// Helper: verify host token against database
function verifyHost(roomCode, hostToken) {
  if (!hostToken) return false;
  try {
    const dbPath = path.join(process.cwd(), "conference.db");
    const db = new Database(dbPath);
    const row = db.prepare("SELECT host_token FROM rooms WHERE code = ?").get(roomCode);
    db.close();
    return row && row.host_token === hostToken;
  } catch {
    return false;
  }
}

// Helper: get room status from database
function getRoomStatus(roomCode) {
  try {
    const dbPath = path.join(process.cwd(), "conference.db");
    const db = new Database(dbPath);
    const row = db.prepare("SELECT status, start_time, end_time FROM rooms WHERE code = ?").get(roomCode);
    db.close();
    return row;
  } catch {
    return null;
  }
}

// Helper: update room status in database
function setRoomStatus(roomCode, status) {
  try {
    const dbPath = path.join(process.cwd(), "conference.db");
    const db = new Database(dbPath);
    db.prepare("UPDATE rooms SET status = ? WHERE code = ?").run(status, roomCode);
    db.close();
  } catch (err) {
    console.error("Failed to update room status:", err);
  }
}

// Helper: broadcast participant list to room
function broadcastParticipants(io, roomCode) {
  const participants = roomParticipants.get(roomCode) || [];
  io.to(roomCode).emit("participant-list", participants);
}

app.prepare().then(() => {
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

    socket.on("join-room", ({ roomCode, username, hostToken }) => {
      // Check room status
      const roomInfo = getRoomStatus(roomCode);
      if (roomInfo && roomInfo.status === "ended") {
        socket.emit("room-ended");
        return;
      }

      currentRoom = roomCode;
      currentUser = username;
      socket.join(roomCode);

      // Check if this user is the host
      isHost = verifyHost(roomCode, hostToken);

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

      // Send current playback state to late joiners (not the host)
      if (!isHost && roomPlaybackState.has(roomCode)) {
        const state = roomPlaybackState.get(roomCode);
        let adjustedTime = state.currentTime;
        // If video is playing, calculate where it should be now
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
          setRoomStatus(roomCode, "live");
          io.to(roomCode).emit("room-started");
        }
      }
    });

    // Host playback controls
    socket.on("host-play", ({ roomCode, hostToken, currentTime }) => {
      if (!verifyHost(roomCode, hostToken)) return;
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying: true,
        updatedAt: Date.now(),
      });
      socket.to(roomCode).emit("sync-playback", { currentTime, isPlaying: true });
    });

    socket.on("host-pause", ({ roomCode, hostToken, currentTime }) => {
      if (!verifyHost(roomCode, hostToken)) return;
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying: false,
        updatedAt: Date.now(),
      });
      socket.to(roomCode).emit("sync-playback", { currentTime, isPlaying: false });
    });

    socket.on("host-seek", ({ roomCode, hostToken, currentTime }) => {
      if (!verifyHost(roomCode, hostToken)) return;
      const state = roomPlaybackState.get(roomCode) || { isPlaying: true };
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying: state.isPlaying,
        updatedAt: Date.now(),
      });
      socket.to(roomCode).emit("sync-playback", { currentTime, isPlaying: state.isPlaying });
    });

    // Periodic sync from host (every 5s) to keep server state fresh
    socket.on("host-sync-tick", ({ roomCode, hostToken, currentTime, isPlaying }) => {
      if (!verifyHost(roomCode, hostToken)) return;
      roomPlaybackState.set(roomCode, {
        currentTime,
        isPlaying,
        updatedAt: Date.now(),
      });

      // Check if end_time has passed
      const roomInfo = getRoomStatus(roomCode);
      if (roomInfo && roomInfo.end_time) {
        const endTime = new Date(roomInfo.end_time);
        if (endTime <= new Date()) {
          setRoomStatus(roomCode, "ended");
          io.to(roomCode).emit("room-ended");
          roomPlaybackState.delete(roomCode);
          roomParticipants.delete(roomCode);
          roomHosts.delete(roomCode);
        }
      }
    });

    // Host kicks a participant
    socket.on("host-kick", ({ roomCode, hostToken, targetSocketId }) => {
      if (!verifyHost(roomCode, hostToken)) return;

      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket) {
        targetSocket.emit("you-were-kicked");
        targetSocket.leave(roomCode);
        targetSocket.disconnect(true);
      }

      // Remove from participants
      const participants = roomParticipants.get(roomCode) || [];
      roomParticipants.set(
        roomCode,
        participants.filter((p) => p.socketId !== targetSocketId)
      );

      // Update viewer count
      const count = Math.max((roomViewers.get(roomCode) || 1) - 1, 0);
      roomViewers.set(roomCode, count);
      if (count === 0) roomViewers.delete(roomCode);
      io.to(roomCode).emit("viewer-count", count);

      broadcastParticipants(io, roomCode);
    });

    // Host ends the stream
    socket.on("host-end-stream", ({ roomCode, hostToken }) => {
      if (!verifyHost(roomCode, hostToken)) return;

      setRoomStatus(roomCode, "ended");
      io.to(roomCode).emit("room-ended");

      // Clean up
      roomPlaybackState.delete(roomCode);
      roomParticipants.delete(roomCode);
      roomHosts.delete(roomCode);
      roomViewers.delete(roomCode);
    });

    // Host starts a scheduled stream
    socket.on("host-start-stream", ({ roomCode, hostToken }) => {
      if (!verifyHost(roomCode, hostToken)) return;

      setRoomStatus(roomCode, "live");
      io.to(roomCode).emit("room-started");
    });

    socket.on("send-comment", ({ roomCode, username, message }) => {
      const timestamp = new Date().toISOString();

      // Persist to database
      try {
        const dbPath = path.join(process.cwd(), "conference.db");
        const db = new Database(dbPath);
        db.prepare(
          "INSERT INTO comments (room_code, username, message) VALUES (?, ?, ?)"
        ).run(roomCode, username, message);
        db.close();
      } catch (err) {
        console.error("Failed to persist comment:", err);
      }

      // Broadcast to room
      io.to(roomCode).emit("new-comment", {
        username,
        message,
        created_at: timestamp,
      });
    });

    socket.on("disconnect", () => {
      if (currentRoom) {
        // Remove from participants
        const participants = roomParticipants.get(currentRoom) || [];
        roomParticipants.set(
          currentRoom,
          participants.filter((p) => p.socketId !== socket.id)
        );

        // Update viewer count
        const count = Math.max((roomViewers.get(currentRoom) || 1) - 1, 0);
        roomViewers.set(currentRoom, count);
        if (count === 0) roomViewers.delete(currentRoom);
        io.to(currentRoom).emit("viewer-count", count);
        io.to(currentRoom).emit("user-left", {
          username: currentUser,
          count,
        });

        broadcastParticipants(io, currentRoom);

        // If host disconnects, keep the host slot (they can reconnect with token)
        // Don't end the stream
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`> Conference Stream ready on http://localhost:${PORT}`);
  });
});
