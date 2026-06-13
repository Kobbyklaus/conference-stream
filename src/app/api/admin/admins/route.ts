import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { listAdmins, createAdmin, deleteAdmin } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admins = await listAdmins();
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, password } = await req.json();
  if (!name?.trim() || !password) {
    return NextResponse.json({ error: "Name and password are required" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const admin = await createAdmin(name.trim(), hashPassword(password));
  return NextResponse.json(admin);
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Admin id is required" }, { status: 400 });
  }
  await deleteAdmin(id);
  return NextResponse.json({ success: true });
}
