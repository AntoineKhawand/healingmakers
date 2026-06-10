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

  const { orderId, form, items, paymentMethod, shippingCost, discount, total } = body as {
    orderId: unknown; form: Record<string, unknown>; items: unknown[];
    paymentMethod: unknown; shippingCost: unknown; discount: unknown; total: unknown;
  };

  if (!orderId || !form || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const safeTotal = typeof total === "number" ? total : 0;
  const safeDiscount = typeof discount === "number" ? discount : 0;
  const safeShipping = typeof shippingCost === "number" ? shippingCost : 0;
  const isInternational = safeShipping === 0 && form.country !== "LB";
  const shippingLabel = isInternational ? "To be confirmed via WhatsApp" : `$${safeShipping.toFixed(2)}`;

  const itemRows = items
    .map(
      (it: unknown) => {
        const i = it as { name: unknown; size: unknown; color: unknown; quantity: unknown; price: unknown };
        const price = typeof i.price === "number" ? i.price : 0;
        return `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;">${esc(i.name)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;color:#888;">${esc(i.size)} / ${esc(i.color)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;text-align:center;">${esc(String(i.quantity))}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0ebe4;text-align:right;font-weight:600;">$${price.toFixed(2)}</td>
        </tr>`;
      }
    )
    .join("");

  const itemsTableHtml = `
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:13px;">
        <thead>
          <tr style="background:#faf8f5;">
            <th style="padding:10px 12px;text-align:left;color:#888;font-weight:600;">Product</th>
            <th style="padding:10px 12px;text-align:left;color:#888;font-weight:600;">Variant</th>
            <th style="padding:10px 12px;text-align:center;color:#888;font-weight:600;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#888;font-weight:600;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>`;

  const totalsHtml = `
      <div style="background:#faf8f5;border-radius:12px;padding:18px 20px;margin-bottom:28px;">
        ${safeDiscount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:8px;"><span>Discount</span><span style="color:#22c55e;">−$${safeDiscount.toFixed(2)}</span></div>` : ""}
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#888;margin-bottom:8px;"><span>Shipping</span><span>${shippingLabel}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;color:#1a1a1a;border-top:1px solid #e8e0d8;padding-top:12px;margin-top:4px;"><span>Total</span><span>$${safeTotal.toFixed(2)}</span></div>
      </div>`;

  const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:28px 32px;text-align:center;">
      <p style="margin:0;color:#c9a97a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">HealingMakers</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">New Order Received 🛍️</h1>
    </div>

    <!-- Order ID Banner -->
    <div style="background:#fdf3f0;border-left:4px solid #c9a97a;padding:14px 32px;">
      <p style="margin:0;font-size:13px;color:#888;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${esc(orderId)}</p>
    </div>

    <div style="padding:28px 32px;">

      <!-- Customer Info -->
      <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;">Customer</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr><td style="padding:6px 0;color:#888;font-size:13px;width:120px;">Name</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:#1a1a1a;">${esc(form.fullName)}</td></tr>
        ${form.phone ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Phone</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${esc(form.phone)}</td></tr>` : ""}
        ${form.email ? `<tr><td style="padding:6px 0;color:#888;font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${esc(form.email)}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#888;font-size:13px;">Address</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${esc(form.address)}, ${esc(form.city)}${form.zip ? ` ${esc(form.zip)}` : ""}, ${esc(form.country)}</td></tr>
      </table>

      <!-- Items -->
      <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;">Items Ordered</h2>
      ${itemsTableHtml}

      <!-- Totals -->
      ${totalsHtml}

      <!-- Payment -->
      <div style="display:flex;align-items:center;gap:10px;background:#fdf3f0;border-radius:10px;padding:14px 18px;">
        <span style="font-size:20px;">💳</span>
        <div>
          <p style="margin:0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Payment Method</p>
          <p style="margin:4px 0 0;font-size:14px;font-weight:600;color:#1a1a1a;">${esc(paymentMethod)}</p>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#faf8f5;padding:20px 32px;text-align:center;border-top:1px solid #f0ebe4;">
      <p style="margin:0;font-size:12px;color:#aaa;">This notification was sent automatically by HealingMakers.<br>Go to <strong>/admin</strong> on your site to manage this order.</p>
    </div>

  </div>
</body>
</html>`;

  const firstName = esc(typeof form.fullName === "string" ? form.fullName.trim().split(/\s+/)[0] : "");
  const nextSteps: string[] = [];
  if (paymentMethod === "Whish Money") {
    nextSteps.push("If you haven't sent payment yet, transfer your order total via Whish Money to <strong>+961 76 072 936</strong> and share a screenshot with us on WhatsApp.");
  } else if (paymentMethod === "Cash on Delivery") {
    nextSteps.push("Please have the order total ready in cash when your delivery arrives.");
  } else {
    nextSteps.push("We'll reach out on WhatsApp shortly to confirm your order details.");
  }
  if (isInternational) {
    nextSteps.push("Since you're shipping outside Lebanon, we'll confirm your exact delivery fee with you over WhatsApp before your order ships.");
  }
  nextSteps.push("You'll receive delivery and tracking updates via WhatsApp.");

  const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06);">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:28px 32px;text-align:center;">
      <p style="margin:0;color:#c9a97a;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">HealingMakers</p>
      <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">Thank you for your order! 🎉</h1>
      <p style="margin:8px 0 0;color:#ccc;font-size:13px;">Hi ${firstName || "there"}, we've got it and we're getting it ready with love.</p>
    </div>

    <!-- Order ID Banner -->
    <div style="background:#fdf3f0;border-left:4px solid #c9a97a;padding:14px 32px;">
      <p style="margin:0;font-size:13px;color:#888;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#1a1a1a;letter-spacing:1px;">${esc(orderId)}</p>
    </div>

    <div style="padding:28px 32px;">

      <!-- Items -->
      <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;">Your Order</h2>
      ${itemsTableHtml}

      <!-- Totals -->
      ${totalsHtml}

      <!-- Shipping Address -->
      <h2 style="margin:0 0 14px;font-size:14px;font-weight:700;color:#1a1a1a;text-transform:uppercase;letter-spacing:1px;">Shipping To</h2>
      <p style="margin:0 0 28px;font-size:13px;color:#1a1a1a;line-height:1.6;">
        ${esc(form.fullName)}<br>
        ${esc(form.address)}, ${esc(form.city)}${form.zip ? ` ${esc(form.zip)}` : ""}, ${esc(form.country)}
      </p>

      <!-- Next Steps -->
      <div style="background:#fdf3f0;border-radius:10px;padding:16px 18px;">
        <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">What happens next</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#1a1a1a;line-height:1.7;">
          ${nextSteps.map((s) => `<li>${s}</li>`).join("")}
        </ul>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#faf8f5;padding:20px 32px;text-align:center;border-top:1px solid #f0ebe4;">
      <p style="margin:0 0 6px;font-size:12px;color:#aaa;">Questions? Message us on WhatsApp or Instagram <strong>@healingmakerslb</strong>.</p>
      <p style="margin:0;font-size:11px;color:#bbb;">Every purchase funds a medical donation through @medonations 💊</p>
    </div>

  </div>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const sendJobs: Promise<unknown>[] = [
    resend.emails.send({
      from: "HealingMakers Orders <orders@healingmakerslb.com>",
      to: process.env.ADMIN_EMAIL!,
      subject: `New Order ${String(orderId).slice(0, 50)} — $${safeTotal.toFixed(2)} (${String(form.fullName).slice(0, 80)})`,
      html: adminHtml,
    }),
  ];

  const customerEmail = typeof form.email === "string" ? form.email.trim() : "";
  if (EMAIL_REGEX.test(customerEmail)) {
    sendJobs.push(
      resend.emails.send({
        from: "HealingMakers <orders@healingmakerslb.com>",
        to: customerEmail,
        subject: `Your HealingMakers Order ${String(orderId).slice(0, 50)} — Confirmed`,
        html: customerHtml,
      })
    );
  }

  const results = await Promise.allSettled(sendJobs);
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(i === 0 ? "Admin order notification email failed:" : "Customer receipt email failed:", r.reason);
    }
  });

  return NextResponse.json({ ok: results[0].status === "fulfilled" });
}
