import { NextRequest, NextResponse } from "next/server";
import { getAttendanceByRoom } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { code } = await params;
    const attendance = await getAttendanceByRoom(code);
    return NextResponse.json(attendance);
  } catch (err) {
    console.error("Failed to fetch attendance:", err);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}
