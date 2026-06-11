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
    .slice(0, 500)
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

  const { amount, purchaserEmail, recipientName, recipientEmail, message } = body as {
    amount: unknown; purchaserEmail: unknown; recipientName: unknown; recipientEmail: unknown; message: unknown;
  };

  const safeAmount = typeof amount === "number" ? amount : 0;
  const buyerEmail = typeof purchaserEmail === "string" ? purchaserEmail.trim() : "";

  if (safeAmount < 10 || typeof recipientName !== "string" || !recipientName.trim() || !EMAIL_REGEX.test(buyerEmail)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const safeRecipientName = esc(recipientName);
  const safeRecipientEmail = typeof recipientEmail === "string" ? recipientEmail.trim() : "";
  const safeMessage = typeof message === "string" ? message.trim() : "";

  const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:28px 32px;text-align:center;">
      <p style="margin:0;color:#c9a97a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">HealingMakers</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">New Gift Card Request 🎁</h1>
    </div>

    <!-- Amount Banner -->
    <div style="background:#fdf3f0;border-left:4px solid #c9a97a;padding:14px 32px;">
      <p style="margin:0;font-size:13px;color:#888;">Amount</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">$${safeAmount.toFixed(2)}</p>
    </div>

    <div style="padding:28px 32px;">
      <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;">Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
        <tr><td style="padding:6px 0;color:#888;font-size:13px;width:140px;">Purchaser Email</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${esc(buyerEmail)}</td></tr>
        <tr><td style="padding:6px 0;color:#888;font-size:13px;">Recipient Name</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${safeRecipientName}</td></tr>
        ${safeRecipientEmail ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Recipient Email</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${esc(safeRecipientEmail)}</td></tr>` : ""}
      </table>
      ${safeMessage ? `<h2 style="margin:20px 0 10px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;">Personal Message</h2>
      <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;white-space:pre-wrap;background:#faf8f5;border-radius:10px;padding:16px 18px;">${esc(safeMessage)}</p>` : ""}
    </div>

    <!-- Footer -->
    <div style="background:#faf8f5;padding:20px 32px;text-align:center;border-top:1px solid #f0ebe4;">
      <p style="margin:0;font-size:12px;color:#aaa;">A WhatsApp message with these details should also be on its way. Generate the gift card code and confirm payment with the customer.</p>
    </div>

  </div>
</body>
</html>`;

  const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:28px 32px;text-align:center;">
      <img src="https://healingmakerslb.com/email-heart.png" width="40" height="40" alt="HealingMakers" style="display:block;margin:0 auto 10px;border-radius:50%;" />
      <p style="margin:0;color:#c9a97a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">HealingMakers</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">Gift Card Request Received! 🎁</h1>
      <p style="margin:8px 0 0;color:#ccc;font-size:13px;">We've got your $${safeAmount.toFixed(2)} gift card request${safeRecipientName ? ` for ${safeRecipientName}` : ""}.</p>
    </div>

    <div style="padding:28px 32px;">

      <!-- Next Steps -->
      <div style="background:#fdf3f0;border-radius:10px;padding:16px 18px;margin-bottom:16px;">
        <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">What happens next</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#1a1a1a;line-height:1.7;">
          <li>Send the WhatsApp confirmation message if you haven't already — that's how we'll reach you.</li>
          <li>Pay $${safeAmount.toFixed(2)} via Whish Money to <strong>+961 76 072 936</strong> or Cash on Delivery (Lebanon only). We'll confirm on WhatsApp.</li>
          <li>Once confirmed, your unique gift card code (e.g. HM-GC-${safeAmount}) will be delivered within minutes via WhatsApp${safeRecipientEmail ? " or email" : ""}.</li>
        </ul>
      </div>

      <p style="margin:0;font-size:12px;color:#888;line-height:1.7;">
        Every gift card purchase still funds a medical donation through @medonations 💊. Questions? Message us on WhatsApp or Instagram <strong>@healingmakerslb</strong>.
      </p>

    </div>

  </div>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const sendJobs: Promise<unknown>[] = [
    resend.emails.send({
      from: "HealingMakers Orders <orders@healingmakerslb.com>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Gift Card Request — $${safeAmount.toFixed(2)} for ${recipientName.slice(0, 80)}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: "HealingMakers <orders@healingmakerslb.com>",
      to: buyerEmail,
      subject: `Your $${safeAmount.toFixed(2)} HealingMakers Gift Card Request`,
      html: customerHtml,
    }),
  ];

  const results = await Promise.allSettled(sendJobs);
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(i === 0 ? "Admin gift card notification email failed:" : "Customer gift card email failed:", r.reason);
    }
  });

  return NextResponse.json({ ok: results[0].status === "fulfilled" });
}
