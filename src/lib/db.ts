import path from "path";

// Use SQLite locally, PostgreSQL in production
const isProduction = process.env.NODE_ENV === "production" && process.env.DATABASE_URL;

/* ---------- SQLite implementation (local dev) ---------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sqliteDb: any | null = null;

function getSqliteDb() {
  if (!sqliteDb) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    const dbPath = path.join(process.cwd(), "conference.db");
    sqliteDb = new Database(dbPath) as any;
    (sqliteDb as any).pragma("journal_mode = WAL");

    // Create tables
    (sqliteDb as any).exec(`
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

      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_code TEXT NOT NULL,
        username TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
  }
  return sqliteDb;
}

/* ---------- PostgreSQL implementation (production) ---------- */

let pgPool: import("pg").Pool | null = null;

function getPgPool() {
  if (!pgPool) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg");
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pgPool!;
}

/* ---------- Unified API ---------- */

export async function initDb() {
  if (isProduction) {
    const pool = getPgPool();
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
    const migrations = [
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS subtitle_url TEXT",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS peak_viewers INTEGER DEFAULT 0",
      "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS total_joins INTEGER DEFAULT 0",
    ];
    for (const sql of migrations) {
      try { await pool.query(sql); } catch { /* ignore */ }
    }
  } else {
    getSqliteDb(); // Tables created on init
  }
}

export async function createRoom(
  code: string,
  name: string,
  videoUrl: string,
  hostToken: string,
  status: string = "live",
  startTime?: string,
  endTime?: string,
  subtitleUrl?: string
) {
  if (isProduction) {
    const result = await getPgPool().query(
      `INSERT INTO rooms (code, name, video_url, host_token, status, start_time, end_time, subtitle_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [code, name, videoUrl, hostToken, status, startTime || null, endTime || null, subtitleUrl || null]
    );
    return result.rows[0];
  } else {
    const db = getSqliteDb();
    const stmt = db.prepare(
      `INSERT INTO rooms (code, name, video_url, host_token, status, start_time, end_time, subtitle_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(code, name, videoUrl, hostToken, status, startTime || null, endTime || null, subtitleUrl || null);
    return db.prepare("SELECT * FROM rooms WHERE code = ?").get(code);
  }
}

export async function getRoomByCode(code: string) {
  if (isProduction) {
    const result = await getPgPool().query("SELECT * FROM rooms WHERE code = $1", [code]);
    return result.rows[0] as RoomRow | undefined;
  } else {
    return getSqliteDb().prepare("SELECT * FROM rooms WHERE code = ?").get(code) as RoomRow | undefined;
  }
}

export async function getRoomHostToken(code: string): Promise<string | null> {
  if (isProduction) {
    const result = await getPgPool().query("SELECT host_token FROM rooms WHERE code = $1", [code]);
    return result.rows[0]?.host_token || null;
  } else {
    const row = getSqliteDb().prepare("SELECT host_token FROM rooms WHERE code = ?").get(code) as { host_token: string } | undefined;
    return row?.host_token || null;
  }
}

export async function updateRoomStatus(code: string, status: string) {
  if (isProduction) {
    await getPgPool().query("UPDATE rooms SET status = $1 WHERE code = $2", [status, code]);
  } else {
    getSqliteDb().prepare("UPDATE rooms SET status = ? WHERE code = ?").run(status, code);
  }
}

export async function addComment(roomCode: string, username: string, message: string) {
  if (isProduction) {
    await getPgPool().query(
      "INSERT INTO comments (room_code, username, message) VALUES ($1, $2, $3)",
      [roomCode, username, message]
    );
  } else {
    getSqliteDb().prepare(
      "INSERT INTO comments (room_code, username, message) VALUES (?, ?, ?)"
    ).run(roomCode, username, message);
  }
}

export async function getCommentsByRoom(roomCode: string) {
  if (isProduction) {
    const result = await getPgPool().query(
      "SELECT * FROM comments WHERE room_code = $1 ORDER BY created_at ASC",
      [roomCode]
    );
    return result.rows as CommentRow[];
  } else {
    return getSqliteDb().prepare(
      "SELECT * FROM comments WHERE room_code = ? ORDER BY created_at ASC"
    ).all(roomCode) as CommentRow[];
  }
}

export async function getAllRoomsWithStats() {
  if (isProduction) {
    const result = await getPgPool().query(`
      SELECT r.code, r.name, r.status, r.peak_viewers, r.total_joins, r.created_at,
             (SELECT COUNT(*) FROM comments WHERE room_code = r.code) as total_comments
      FROM rooms r ORDER BY r.created_at DESC
    `);
    return result.rows;
  } else {
    return getSqliteDb().prepare(`
      SELECT r.code, r.name, r.status, r.peak_viewers, r.total_joins, r.created_at,
             (SELECT COUNT(*) FROM comments WHERE room_code = r.code) as total_comments
      FROM rooms r ORDER BY r.created_at DESC
    `).all();
  }
}

interface RoomRow {
  id: number;
  code: string;
  name: string;
  video_url: string;
  host_token: string;
  status: string;
  start_time: string | null;
  end_time: string | null;
  subtitle_url: string | null;
  peak_viewers: number;
  total_joins: number;
  created_at: string;
}

interface CommentRow {
  id: number;
  room_code: string;
  username: string;
  message: string;
  created_at: string;
}

// For backward compatibility (server.js uses pool directly)
export const pool = isProduction ? getPgPool() : null;
export default pool;
