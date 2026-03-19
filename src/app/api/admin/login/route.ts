import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// In-memory admin sessions (resets on server restart)
const adminSessions = new Set<string>();

export function isValidAdminToken(token: string): boolean {
  return adminSessions.has(token);
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = nanoid(32);
  adminSessions.add(token);

  return NextResponse.json({ token });
}
