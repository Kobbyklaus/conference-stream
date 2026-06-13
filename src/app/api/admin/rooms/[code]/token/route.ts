import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getRoomHostToken } from "@/lib/db";

// Returns a room's host (control) token — ONLY to a logged-in admin.
// This is how an admin gains host control of a conference; attendees can
// never reach this endpoint, so they can never control the stream.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await params;
  const hostToken = await getRoomHostToken(code.toUpperCase());
  if (!hostToken) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json({ hostToken });
}
