const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// Database: PostgreSQL in production (DATABASE_URL set), SQLite locally.
// Both expose the same pool.query(text, params) -> { rows } interface so the
// rest of this file is dialect-agnostic.
const usePg = !!process.env.DATABASE_URL;
let pool;

if (usePg) {
  const { Pool } = require("pg");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });
} else {
  // SQLite-backed shim mimicking pg's Pool.query. Same conference.db file the
  // Next.js API routes (src/lib/db.ts) use.
  const path = require("path");
  const Database = require("better-sqlite3");
  const sdb = new Database(path.join(process.cwd(), "conference.db"));
  sdb.pragma("journal_mode = WAL");

  pool = {
    async query(text, params = []) {
      // Translate Postgres dialect to SQLite: $n placeholders and GREATEST().
      const sql = text.replace(/\$(\d+)/g, "?").replace(/GREATEST\(/gi, "MAX(");
      const stmt = sdb.prepare(sql);
      if (stmt.reader) {
        const rows = stmt.all(...params);
        return { rows, rowCount: rows.length };
      }
      const info = stmt.run(...params);
      return { rows: [], rowCount: info.changes };
    },
  };
}

// Initialize database tables
async function initDb() {
  if (usePg) {
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

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        room_code TEXT NOT NULL,
        username TEXT NOT NULL,
        country TEXT,
        joined_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(room_code, username)
      );
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Add columns if they don't exist (for existing databases)
    const migrations = [
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS subtitle_url TEXT",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS peak_viewers INTEGER DEFAULT 0",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS total_joins INTEGER DEFAULT 0",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS paypal_url TEXT",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS regional_label TEXT",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS regional_url TEXT",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS flyer_url TEXT",
      "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS email TEXT",
    ];
    for (const sql of migrations) {
      try {
        await pool.query(sql);
      } catch {
        // Column may already exist
      }
    }
  } else {
    // SQLite (local dev): one statement per query() call (prepare handles one).
    // Mirrors the schema in src/lib/db.ts.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_code TEXT NOT NULL,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_code TEXT NOT NULL,
        username TEXT NOT NULL,
        country TEXT,
        joined_at TEXT DEFAULT (datetime('now')),
        UNIQUE(room_code, username)
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    // SQLite lacks ADD COLUMN IF NOT EXISTS — try each, ignore "duplicate column".
    const sqliteMigrations = [
      "ALTER TABLE rooms ADD COLUMN paypal_url TEXT",
      "ALTER TABLE rooms ADD COLUMN regional_label TEXT",
      "ALTER TABLE rooms ADD COLUMN regional_url TEXT",
      "ALTER TABLE rooms ADD COLUMN flyer_url TEXT",
      "ALTER TABLE attendance ADD COLUMN email TEXT",
    ];
    for (const sql of sqliteMigrations) {
      try { await pool.query(sql); } catch { /* column already exists */ }
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

  const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
  const MIME = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".gif": "image/gif",
  };

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    // Serve uploaded images (flyers) straight from disk so it works reliably
    // in production regardless of Next's static handling.
    if (parsedUrl.pathname && parsedUrl.pathname.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", decodeURIComponent(parsedUrl.pathname));
      if (!filePath.startsWith(UPLOADS_DIR)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        res.setHeader("Content-Type", MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.end(data);
      });
      return;
    }

    handle(req, res, parsedUrl);
  });

  // Restrict which origins may open a socket. Same-origin viewers (the actual
  // watch.dhmm190.com site) are unaffected; this blocks other websites from
  // connecting to flood chat, inflate viewer counts, or brute-force room codes.
  // Override with ALLOWED_ORIGINS (comma-separated) in the environment.
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "https://watch.dhmm190.com")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const io = new Server(server, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  // Take a scheduled room live. Anchors playback at t=0 the moment it starts,
  // so every viewer — and anyone who joins late — can sync to elapsed time even
  // when no host is actively driving playback. Attendees still can't control it;
  // this is the system starting the conference on schedule.
  async function goLive(roomCode) {
    if (!roomPlaybackState.has(roomCode)) {
      roomPlaybackState.set(roomCode, {
        currentTime: 0,
        isPlaying: true,
        updatedAt: Date.now(),
      });
    }
    await setRoomStatus(roomCode, "live");
    io.to(roomCode).emit("room-started");

    const state = roomPlaybackState.get(roomCode);
    const elapsed = state.isPlaying ? (Date.now() - state.updatedAt) / 1000 : 0;
    io.to(roomCode).emit("sync-playback", {
      currentTime: state.currentTime + elapsed,
      isPlaying: state.isPlaying,
    });
  }

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

    socket.on("join-room", async ({ roomCode, username, country, email, hostToken }) => {
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

        // Track analytics and attendance
        try {
          await pool.query(
            "UPDATE rooms SET total_joins = total_joins + 1, peak_viewers = GREATEST(peak_viewers, $1) WHERE code = $2",
            [count, roomCode]
          );
          
          await pool.query(
            "INSERT INTO attendance (room_code, username, country, email) VALUES ($1, $2, $3, $4) ON CONFLICT (room_code, username) DO NOTHING",
            [roomCode, username, country || null, email || null]
          );
        } catch (err) {
          console.error("Failed to update analytics/attendance:", err);
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

        // If a scheduled stream's start time has passed, take it live now so the
        // joiner sees the video (system-driven, not an attendee action).
        if (roomInfo && roomInfo.status === "scheduled" && roomInfo.start_time) {
          if (new Date(roomInfo.start_time) <= new Date()) {
            await goLive(roomCode);
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
      await goLive(roomCode);
    });

    // Any client may nudge a DUE scheduled stream to start (e.g. its countdown
    // hit zero). The server only goes live if the start time has actually passed,
    // so this is not attendee control — it can't start a conference early.
    socket.on("start-if-due", async (roomCode) => {
      const info = await getRoomStatus(roomCode);
      if (
        info &&
        info.status === "scheduled" &&
        info.start_time &&
        new Date(info.start_time) <= new Date()
      ) {
        await goLive(roomCode);
      }
    });

    // Reactions
    socket.on("send-reaction", ({ roomCode, emoji }) => {
      const allowed = ["👏", "🔥", "❤️", "😂", "🎉"];
      if (allowed.includes(emoji)) {
        io.to(roomCode).emit("new-reaction", { emoji });
      }
    });

    socket.on("send-comment", async ({ message }) => {
      // Must have joined a room first; use the server-tracked room and
      // username so a client can't post to arbitrary rooms or impersonate
      // another name per-message.
      if (!currentRoom || !currentUser) return;

      // Validate the message: must be a non-empty string, capped at 500 chars.
      if (typeof message !== "string") return;
      const text = message.trim();
      if (!text || text.length > 500) return;

      // Rate-limit: max 8 messages per 10 seconds per socket (anti-flood).
      const now = Date.now();
      if (!socket.data.commentTimes) socket.data.commentTimes = [];
      socket.data.commentTimes = socket.data.commentTimes.filter((t) => now - t < 10000);
      if (socket.data.commentTimes.length >= 8) return;
      socket.data.commentTimes.push(now);

      const roomCode = currentRoom;
      const username = currentUser;
      const timestamp = new Date().toISOString();

      try {
        await pool.query(
          "INSERT INTO comments (room_code, username, message) VALUES ($1, $2, $3)",
          [roomCode, username, text]
        );
      } catch (err) {
        console.error("Failed to persist comment:", err);
      }

      io.to(roomCode).emit("new-comment", {
        username,
        message: text,
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

  // Take scheduled streams live at their start time (checked every 10s) so the
  // conference begins on schedule whether or not the host is present. Attendees
  // can never start/stop/control it — only watch, chat, react, give, and share.
  setInterval(async () => {
    try {
      const result = await pool.query(
        "SELECT code, start_time FROM rooms WHERE status = 'scheduled' AND start_time IS NOT NULL"
      );
      const now = new Date();
      for (const room of result.rows) {
        if (new Date(room.start_time) <= now) {
          await goLive(room.code);
          console.log(`Auto-started room ${room.code} at scheduled time`);
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
