import { NextRequest, NextResponse } from "next/server";
import { updateRoomStatus } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
