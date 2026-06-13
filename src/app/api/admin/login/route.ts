import { NextRequest, NextResponse } from "next/server";
import { issueToken, verifyPassword } from "@/lib/auth";
import { getAdminHashes } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  // 1) Bootstrap super-admin password from the environment.
  const envPassword = process.env.ADMIN_PASSWORD || "admin123";
  let ok = password === envPassword;
  let who = ok ? "Owner" : "";

  // 2) Any admin account created via the dashboard.
  if (!ok) {
    const admins = await getAdminHashes();
    const match = admins.find((a) => verifyPassword(password, a.password_hash));
    if (match) {
      ok = true;
      who = match.name;
    }
  }

  if (!ok) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = issueToken(who);
  return NextResponse.json({ token, name: who });
}
