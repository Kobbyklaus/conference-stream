import { NextRequest, NextResponse } from "next/server";
import { getCommentsByRoom } from "@/lib/db";

export async function GET(req: NextRequest) {
  const roomCode = req.nextUrl.searchParams.get("room");

  if (!roomCode) {
    return NextResponse.json({ error: "Room code is required" }, { status: 400 });
  }

  const comments = getCommentsByRoom(roomCode.toUpperCase());
  return NextResponse.json(comments);
}
