import { NextResponse } from "next/server";
import { getAllRoomsWithStats } from "@/lib/db";

export async function GET() {
  try {
    const rooms = await getAllRoomsWithStats();
    return NextResponse.json(rooms);
  } catch (err) {
    console.error("Failed to fetch analytics:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
