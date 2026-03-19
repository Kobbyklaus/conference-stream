import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

export async function initDb() {
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
  const result = await pool.query(
    `INSERT INTO rooms (code, name, video_url, host_token, status, start_time, end_time, subtitle_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [code, name, videoUrl, hostToken, status, startTime || null, endTime || null, subtitleUrl || null]
  );
  return result.rows[0];
}

export async function getRoomByCode(code: string) {
  const result = await pool.query("SELECT * FROM rooms WHERE code = $1", [code]);
  return result.rows[0] as
    | {
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
    | undefined;
}

export async function getRoomHostToken(code: string): Promise<string | null> {
  const result = await pool.query("SELECT host_token FROM rooms WHERE code = $1", [code]);
  return result.rows[0]?.host_token || null;
}

export async function updateRoomStatus(code: string, status: string) {
  await pool.query("UPDATE rooms SET status = $1 WHERE code = $2", [status, code]);
}

export async function addComment(roomCode: string, username: string, message: string) {
  await pool.query(
    "INSERT INTO comments (room_code, username, message) VALUES ($1, $2, $3)",
    [roomCode, username, message]
  );
}

export async function getCommentsByRoom(roomCode: string) {
  const result = await pool.query(
    "SELECT * FROM comments WHERE room_code = $1 ORDER BY created_at ASC",
    [roomCode]
  );
  return result.rows as Array<{
    id: number;
    room_code: string;
    username: string;
    message: string;
    created_at: string;
  }>;
}

export async function getAllRoomsWithStats() {
  const result = await pool.query(`
    SELECT r.code, r.name, r.status, r.peak_viewers, r.total_joins, r.created_at,
           (SELECT COUNT(*) FROM comments WHERE room_code = r.code) as total_comments
    FROM rooms r
    ORDER BY r.created_at DESC
  `);
  return result.rows;
}

export { pool };
export default pool;
