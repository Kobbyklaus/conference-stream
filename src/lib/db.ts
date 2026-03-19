import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "conference.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    video_url TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_code TEXT NOT NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (room_code) REFERENCES rooms(code)
  );
`);

export function createRoom(code: string, name: string, videoUrl: string) {
  const stmt = db.prepare(
    "INSERT INTO rooms (code, name, video_url) VALUES (?, ?, ?)"
  );
  return stmt.run(code, name, videoUrl);
}

export function getRoomByCode(code: string) {
  const stmt = db.prepare("SELECT * FROM rooms WHERE code = ?");
  return stmt.get(code) as
    | { id: number; code: string; name: string; video_url: string; created_at: string }
    | undefined;
}

export function addComment(roomCode: string, username: string, message: string) {
  const stmt = db.prepare(
    "INSERT INTO comments (room_code, username, message) VALUES (?, ?, ?)"
  );
  return stmt.run(roomCode, username, message);
}

export function getCommentsByRoom(roomCode: string) {
  const stmt = db.prepare(
    "SELECT * FROM comments WHERE room_code = ? ORDER BY created_at ASC"
  );
  return stmt.all(roomCode) as Array<{
    id: number;
    room_code: string;
    username: string;
    message: string;
    created_at: string;
  }>;
}

export default db;
