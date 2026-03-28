import { NextRequest, NextResponse } from "next/server";
import { getAttendanceByRoom } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const attendance = await getAttendanceByRoom(code);
    return NextResponse.json(attendance);
  } catch (err) {
    console.error("Failed to fetch attendance:", err);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}
