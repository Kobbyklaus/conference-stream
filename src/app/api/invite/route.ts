import { NextRequest, NextResponse } from "next/server";
import { getRoomByCode, getRoomHostToken } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { roomCode, emails, hostToken } = await req.json();

  if (!roomCode || !emails || !hostToken) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify host
  const storedToken = await getRoomHostToken(roomCode);
  if (!storedToken || storedToken !== hostToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const room = await getRoomByCode(roomCode);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://conference-stream.onrender.com";
  const roomUrl = `${baseUrl}/room/${roomCode}`;

  // Configure Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const emailList: string[] = Array.isArray(emails)
    ? emails
    : emails.split(/[,\n]/).map((e: string) => e.trim()).filter(Boolean);

  let sent = 0;
  let failed = 0;

  for (const email of emailList) {
    try {
      await transporter.sendMail({
        from: `Conference Stream <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `You're invited to: ${room.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4f46e5;">You're Invited!</h2>
            <p>You've been invited to join the conference <strong>${room.name}</strong>.</p>
            <p>Click the button below to join:</p>
            <a href="${roomUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">
              Join Conference
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 24px;">
              Or copy this link: ${roomUrl}
            </p>
          </div>
        `,
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
