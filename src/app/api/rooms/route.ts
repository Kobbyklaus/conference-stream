import { NextRequest, NextResponse } from "next/server";
import { createRoom, getRoomByCode } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { name, videoUrl } = await req.json();

  if (!name || !videoUrl) {
    return NextResponse.json({ error: "Name and video URL are required" }, { status: 400 });
  }

  const code = nanoid(6).toUpperCase();
  createRoom(code, name, videoUrl);

  return NextResponse.json({ code, name, videoUrl });
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Room code is required" }, { status: 400 });
  }

  const room = getRoomByCode(code.toUpperCase());

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}
