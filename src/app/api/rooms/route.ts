import { NextRequest, NextResponse } from "next/server";
import { createRoom, getRoomByCode } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { name, videoUrl, startTime, endTime } = await req.json();

  if (!name || !videoUrl) {
    return NextResponse.json({ error: "Name and video URL are required" }, { status: 400 });
  }

  const code = nanoid(6).toUpperCase();
  const hostToken = nanoid(16);

  // If start time is in the future, set status to 'scheduled', otherwise 'live'
  let status = "live";
  if (startTime) {
    const start = new Date(startTime);
    if (start > new Date()) {
      status = "scheduled";
    }
  }

  createRoom(code, name, videoUrl, hostToken, status, startTime, endTime);

  return NextResponse.json({ code, name, videoUrl, hostToken, status, startTime, endTime });
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

  // Don't expose host_token in GET responses
  const { host_token, ...safeRoom } = room;
  return NextResponse.json(safeRoom);
}
