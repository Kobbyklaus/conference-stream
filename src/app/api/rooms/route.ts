import { NextRequest, NextResponse } from "next/server";
import { createRoom, getRoomByCode } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const { name, videoUrl, startTime, endTime, subtitleUrl } = await req.json();

  if (!name || !videoUrl) {
    return NextResponse.json({ error: "Name and video URL are required" }, { status: 400 });
  }

  const code = nanoid(6).toUpperCase();
  const hostToken = nanoid(16);

  let status = "live";
  if (startTime) {
    const start = new Date(startTime);
    if (start > new Date()) {
      status = "scheduled";
    }
  }

  await createRoom(code, name, videoUrl, hostToken, status, startTime, endTime, subtitleUrl);

  return NextResponse.json({ code, name, videoUrl, hostToken, status, startTime, endTime });
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Room code is required" }, { status: 400 });
  }

  const room = await getRoomByCode(code.toUpperCase());

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { host_token, ...safeRoom } = room;
  return NextResponse.json(safeRoom);
}
