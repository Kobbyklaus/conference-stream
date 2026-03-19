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
    host_token TEXT,
    status TEXT DEFAULT 'live',
    start_time TEXT,
    end_time TEXT,
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

// Migrate existing databases: add new columns if they don't exist
try { db.exec("ALTER TABLE rooms ADD COLUMN host_token TEXT"); } catch {}
try { db.exec("ALTER TABLE rooms ADD COLUMN status TEXT DEFAULT 'live'"); } catch {}
try { db.exec("ALTER TABLE rooms ADD COLUMN start_time TEXT"); } catch {}
try { db.exec("ALTER TABLE rooms ADD COLUMN end_time TEXT"); } catch {}

export function createRoom(
  code: string,
  name: string,
  videoUrl: string,
  hostToken: string,
  status: string = "live",
  startTime?: string,
  endTime?: string
) {
  const stmt = db.prepare(
    "INSERT INTO rooms (code, name, video_url, host_token, status, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  return stmt.run(code, name, videoUrl, hostToken, status, startTime || null, endTime || null);
}

export function getRoomByCode(code: string) {
  const stmt = db.prepare("SELECT * FROM rooms WHERE code = ?");
  return stmt.get(code) as
    | {
        id: number;
        code: string;
        name: string;
        video_url: string;
        host_token: string;
        status: string;
        start_time: string | null;
        end_time: string | null;
        created_at: string;
      }
    | undefined;
}

export function getRoomHostToken(code: string): string | null {
  const stmt = db.prepare("SELECT host_token FROM rooms WHERE code = ?");
  const row = stmt.get(code) as { host_token: string } | undefined;
  return row?.host_token || null;
}

export function updateRoomStatus(code: string, status: string) {
  const stmt = db.prepare("UPDATE rooms SET status = ? WHERE code = ?");
  return stmt.run(status, code);
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
