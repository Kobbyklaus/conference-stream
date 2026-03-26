import { NextRequest, NextResponse } from "next/server";
import { updateRoomStatus } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Room code is required" }, { status: 400 });
    }

    // Set the room status to 'ended' in the database
    await updateRoomStatus(code, "ended");

    return NextResponse.json({ success: true, code, status: "ended" });
  } catch (err) {
    console.error("Failed to end room:", err);
    return NextResponse.json({ error: "Failed to end room" }, { status: 500 });
  }
}
