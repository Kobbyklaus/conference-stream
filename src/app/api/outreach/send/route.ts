import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface SendRequest {
  gmailUser: string;
  gmailAppPassword: string;
  senderName: string;
  recipients: {
    email: string;
    subject: string;
    html: string;
    pastorId: string;
  }[];
  batchSize: number;
  delayMs: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: SendRequest = await req.json();
    const { gmailUser, gmailAppPassword, senderName, recipients, batchSize, delayMs } = body;

    if (!gmailUser || !gmailAppPassword || !recipients?.length) {
      return NextResponse.json(
        { error: "Missing required fields: gmailUser, gmailAppPassword, recipients" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Verify connection
    await transporter.verify();

    const results: { pastorId: string; status: "sent" | "failed"; error?: string }[] = [];

    for (let i = 0; i < recipients.length; i++) {
      const r = recipients[i];
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${gmailUser}>`,
          to: r.email,
          subject: r.subject,
          html: r.html,
        });
        results.push({ pastorId: r.pastorId, status: "sent" });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        results.push({ pastorId: r.pastorId, status: "failed", error: message });
      }

      // Delay between batches
      if ((i + 1) % batchSize === 0 && i + 1 < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    const sent = results.filter((r) => r.status === "sent").length;
    const failed = results.filter((r) => r.status === "failed").length;

    return NextResponse.json({ sent, failed, results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to send: ${message}` },
      { status: 500 }
    );
  }
}
