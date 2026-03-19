const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

// Track viewers per room
const roomViewers = new Map();

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

    socket.on("join-room", ({ roomCode, username }) => {
      currentRoom = roomCode;
      currentUser = username;
      socket.join(roomCode);

      // Increment viewer count
      const count = (roomViewers.get(roomCode) || 0) + 1;
      roomViewers.set(roomCode, count);
      io.to(roomCode).emit("viewer-count", count);

      // Notify room
      io.to(roomCode).emit("user-joined", { username, count });
    });

    socket.on("send-comment", ({ roomCode, username, message }) => {
      const timestamp = new Date().toISOString();

      // Persist to database
      try {
        const Database = require("better-sqlite3");
        const path = require("path");
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
        const count = Math.max((roomViewers.get(currentRoom) || 1) - 1, 0);
        roomViewers.set(currentRoom, count);
        if (count === 0) roomViewers.delete(currentRoom);
        io.to(currentRoom).emit("viewer-count", count);
        io.to(currentRoom).emit("user-left", {
          username: currentUser,
          count,
        });
      }
    });
  });

  server.listen(PORT, () => {
    console.log(`> Conference Stream ready on http://localhost:${PORT}`);
  });
});
