import { NextRequest, NextResponse } from "next/server";
import { getAllRoomsWithStats } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rooms = await getAllRoomsWithStats();
    return NextResponse.json(rooms);
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
