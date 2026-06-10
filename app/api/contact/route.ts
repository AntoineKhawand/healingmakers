import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter: max 5 requests per IP per minute
const rateMap = new Map<string, { count: number; reset: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .slice(0, 2000)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { name, email, subject, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim() || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const senderEmail = typeof email === "string" ? email.trim() : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">

    <div style="background:#1a1a1a;padding:28px 32px;text-align:center;">
      <p style="margin:0;color:#c9a97a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">HealingMakers</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">New Contact Message ✉️</h1>
    </div>

    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="padding:6px 0;color:#888;font-size:13px;width:100px;">Name</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${esc(name)}</td></tr>
        ${senderEmail ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${esc(senderEmail)}</td></tr>` : ""}
        ${subject ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Subject</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${esc(subject)}</td></tr>` : ""}
      </table>

      <h2 style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;">Message</h2>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;background:#faf8f5;border-radius:10px;padding:16px 18px;">${esc(message)}</p>
    </div>

    <div style="background:#faf8f5;padding:20px 32px;text-align:center;border-top:1px solid #f0ebe4;">
      <p style="margin:0;font-size:12px;color:#aaa;">Sent from the Contact form on healingmakerslb.com</p>
    </div>

  </div>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: "HealingMakers Website <contact@healingmakerslb.com>",
      to: process.env.ADMIN_EMAIL!,
      ...(EMAIL_REGEX.test(senderEmail) ? { replyTo: senderEmail } : {}),
      subject: `New Contact Message — ${esc(subject) || "General Inquiry"}`,
      html,
    });

    if (result.error) {
      console.error("Contact email failed:", result.error);
      return NextResponse.json({ ok: false }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact email failed:", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
