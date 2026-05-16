const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ── Retry helper ──────────────────────────────────────────────
// Wraps an async email call with up to `retries` attempts and
// exponential back-off (1s → 2s → 4s). Logs failures so they
// are visible in server logs without crashing the request.
async function withRetry(fn, label = "email", retries = 2, delayMs = 1000) {
  let lastErr;
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt <= retries) {
        console.warn(`[email] ${label} attempt ${attempt} failed: ${err.message}. Retrying in ${delayMs}ms…`);
        await new Promise((r) => setTimeout(r, delayMs));
        delayMs *= 2; // exponential back-off
      }
    }
  }
  console.error(`[email] ${label} failed after ${retries + 1} attempts:`, lastErr.message);
}

// ── Order Confirmation ─────────────────────────────────────────
async function sendOrderConfirmationEmail(to, order) {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#2d6a4f;padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0">🛍️ Paperbag</h1>
      </div>
      <div style="padding:32px">
        <h2 style="color:#2d6a4f">Order Confirmed!</h2>
        <p>Hi <strong>${order.customer.name}</strong>, your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> #${String(order._id).slice(-8).toUpperCase()}</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f0f0f0">
              <th style="padding:8px;text-align:left">Product</th>
              <th style="padding:8px;text-align:center">Qty</th>
              <th style="padding:8px;text-align:right">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:8px;font-weight:bold;text-align:right">Total</td>
              <td style="padding:8px;font-weight:bold;text-align:right">₹${Number(order.total).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <p><strong>Shipping to:</strong><br>
          ${order.customer.address}, ${order.customer.city} — ${order.customer.zipCode}
        </p>

        <p style="color:#888;font-size:13px">We'll notify you when your order ships.</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#888">
        © ${new Date().getFullYear()} Paperbag. Eco-friendly packaging for a better tomorrow.
      </div>
    </div>`;

  await withRetry(() => transporter.sendMail({
    from:    process.env.SMTP_FROM || "Paperbag <noreply@paperbag.com>",
    to,
    subject: `✅ Order Confirmed — #${String(order._id).slice(-8).toUpperCase()}`,
    html,
  }), `order-confirmation to ${to}`);
}

// ── Order Status Update ────────────────────────────────────────
async function sendOrderStatusEmail(to, order) {
  const statusMessages = {
    processing:        "Your order is being carefully processed and packed. 📦",
    shipped:           "🚚 Great news! Your order has been shipped and is on its way to you.",
    "out for delivery":"🛵 Your order is out for delivery! Keep an eye out — it's almost there.",
    delivered:         "✅ Your order has been delivered. Enjoy your eco-friendly bags! We'd love a review.",
    cancelled:         "Your order has been cancelled. If this was unexpected, please contact us.",
  };

  const message = statusMessages[order.status] || `Order status updated to: ${order.status}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#2d6a4f;padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0">🛍️ Paperbag</h1>
      </div>
      <div style="padding:32px">
        <h2 style="color:#2d6a4f">Order Update</h2>
        <p>Hi <strong>${order.customer.name}</strong>,</p>
        <p>${message}</p>
        <p><strong>Order ID:</strong> #${String(order._id).slice(-8).toUpperCase()}</p>
        <p><strong>Status:</strong> <span style="text-transform:capitalize;font-weight:bold">${order.status}</span></p>
      </div>
    </div>`;

  await withRetry(() => transporter.sendMail({
    from:    process.env.SMTP_FROM || "Paperbag <noreply@paperbag.com>",
    to,
    subject: `Order #${String(order._id).slice(-8).toUpperCase()} — Status: ${order.status}`,
    html,
  }), `order-status to ${to}`);
}

// ── Welcome Email ──────────────────────────────────────────────
async function sendWelcomeEmail(to, name) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#2d6a4f;padding:24px;text-align:center">
        <h1 style="color:#fff;margin:0">🛍️ Paperbag</h1>
      </div>
      <div style="padding:32px">
        <h2 style="color:#2d6a4f">Welcome, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>Explore our range of eco-friendly paper bags and make a difference for the planet.</p>
        <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/products"
           style="display:inline-block;background:#2d6a4f;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px">
          Shop Now
        </a>
      </div>
    </div>`;

  await withRetry(() => transporter.sendMail({
    from:    process.env.SMTP_FROM || "Paperbag <noreply@paperbag.com>",
    to,
    subject: "Welcome to Paperbag! 🌿",
    html,
  }), `welcome to ${to}`);
}

// ── OTP Email ──────────────────────────────────────────────────
async function sendOtpEmail(to, otp, type = "auth") {
  const isReset = type === "reset";
  const subject = isReset ? "🔐 Paperbag — Reset Your Password" : "🔑 Paperbag — Your Login OTP";
  const heading  = isReset ? "Reset Your Password" : "Your One-Time Password";
  const subtext  = isReset
    ? "Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>."
    : "Use the OTP below to sign in to your Paperbag account. It expires in <strong>10 minutes</strong>.";

  const digits = otp.split("").map(d =>
    `<span style="display:inline-block;width:48px;height:56px;line-height:56px;
      text-align:center;font-size:28px;font-weight:700;
      background:#f0faf5;border:2px solid #2d6a4f;border-radius:10px;
      margin:0 4px;color:#1a3a2a">${d}</span>`
  ).join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto">
      <div style="background:linear-gradient(135deg,#1a3a2a,#2d6a4f);padding:28px 24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#faf7f2;margin:0;font-size:26px;letter-spacing:-0.5px">🛍️ Paperbag</h1>
        <p style="color:#a8d5b5;margin:6px 0 0;font-size:13px">Eco-Friendly Packaging</p>
      </div>
      <div style="background:#fff;padding:36px 32px;border:1px solid #e8ede9;border-top:none">
        <h2 style="color:#1a3a2a;margin:0 0 8px">${heading}</h2>
        <p style="color:#555;margin:0 0 28px;line-height:1.6">${subtext}</p>
        <div style="text-align:center;margin:28px 0">${digits}</div>
        <p style="color:#888;font-size:13px;text-align:center;margin-top:24px">
          Never share this OTP with anyone. Paperbag will never ask for your OTP.
        </p>
      </div>
      <div style="background:#f5f5f5;padding:14px;text-align:center;font-size:12px;color:#999;border-radius:0 0 12px 12px">
        © ${new Date().getFullYear()} Paperbag. If you didn't request this, ignore this email.
      </div>
    </div>`;

  await withRetry(() => transporter.sendMail({
    from:    process.env.SMTP_FROM || "Paperbag <noreply@paperbag.com>",
    to,
    subject,
    html,
  }), `otp-${type} to ${to}`);
}

module.exports = { sendOrderConfirmationEmail, sendOrderStatusEmail, sendWelcomeEmail, sendOtpEmail };
