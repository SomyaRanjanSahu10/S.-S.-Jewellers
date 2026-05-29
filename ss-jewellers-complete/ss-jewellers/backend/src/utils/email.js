const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  pool: true, maxConnections: 5,
});

transporter.verify((err) => {
  if (err) console.warn('SMTP not configured:', err.message);
  else     console.log('Email transport ready');
});

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

function base(content) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
body{margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;}
.wrap{max-width:600px;margin:0 auto;background:#0A0A0A;}
.hdr{background:linear-gradient(135deg,#8B6914,#C9A84C,#E8CC7A);padding:28px 36px;text-align:center;}
.logo{font-size:26px;font-weight:700;color:#0A0A0A;letter-spacing:3px;}
.sub{font-size:10px;letter-spacing:3px;color:rgba(0,0,0,0.5);text-transform:uppercase;margin-top:4px;}
.body{padding:36px;color:#FAF6EE;}
h2{color:#E8CC7A;margin:0 0 16px;font-size:22px;}
p{font-size:14px;line-height:1.8;color:#888;margin:0 0 14px;}
.hl{color:#FAF6EE;}
.btn{display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#8B6914,#C9A84C);color:#0A0A0A;text-decoration:none;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-size:10px;font-family:Arial,sans-serif;margin:8px 0;}
.div{height:1px;background:rgba(201,168,76,0.2);margin:20px 0;}
td{padding:9px 10px;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;color:#FAF6EE;}
.lbl{color:#C9A84C;text-transform:uppercase;letter-spacing:1px;font-size:10px;width:38%;}
.ftr{background:#141414;padding:20px 36px;text-align:center;}
.ftr p{font-size:10px;color:#3D3D3D;letter-spacing:1px;margin:3px 0;}
.ftr a{color:#8B6914;text-decoration:none;}
.bar{height:3px;background:linear-gradient(90deg,#8B6914,#C9A84C,#E8CC7A,#C9A84C,#8B6914);}
</style></head><body>
<div class="wrap"><div class="bar"></div>
<div class="hdr"><div class="logo">S.S. JEWELLERS</div><div class="sub">Est. 2016 · Berhampur · Pure Gold · BIS Certified</div></div>
<div class="body">${content}</div>
<div class="ftr"><p>S.S. Jewellers Pvt. Ltd. · Road No. 12, Banjara Hills, Berhampur – 500034</p>
<p>📞 +91 40 2345 6789 · <a href="mailto:hello@ssjewellers.in">hello@ssjewellers.in</a> · <a href="https://ssjewellers.in">ssjewellers.in</a></p></div>
<div class="bar"></div></div></body></html>`;
}

async function sendEmail({ to, subject, html, text }) {
  if (!process.env.SMTP_USER) {
    console.log(`[Email skipped] To:${to} | ${subject}`);
    return { skipped: true };
  }
  return transporter.sendMail({ from:`"S.S. Jewellers" <${process.env.SMTP_USER}>`, to, subject, html: html || `<pre>${text}</pre>`, text });
}

async function sendWelcomeEmail(user) {
  return sendEmail({ to: user.email, subject: 'Welcome to S.S. Jewellers ✨',
    html: base(`<h2>Welcome, ${user.name.split(' ')[0]}!</h2>
<p>Thank you for joining S.S. Jewellers — three generations of trust, crafting heirloom gold jewellery since 2016.</p>
<div class="div"></div>
<table width="100%"><tr><td class="lbl">🛍 Shop</td><td>500+ handcrafted 22K &amp; 24K gold pieces</td></tr>
<tr><td class="lbl">❤ Wishlist</td><td>Save favourites for later</td></tr>
<tr><td class="lbl">✨ AI Stylist</td><td>Get personalised recommendations</td></tr></table>
<div class="div"></div>
<a href="https://ssjewellers.in/catalog" class="btn">Explore Collections →</a>`) });
}

async function sendOrderConfirmation(order, user) {
  const items = (order.items||[]).map(i=>`<tr><td>${i.name}</td><td>${i.purity}·${i.weight}g</td><td style="text-align:right">${fmt(i.price*i.qty)}</td></tr>`).join('');
  return sendEmail({ to: user.email, subject: `Order #${order.orderNumber} Confirmed 🏅 | S.S. Jewellers`,
    html: base(`<h2>Order Confirmed! 🏅</h2>
<p>Dear <span class="hl">${user.name.split(' ')[0]}</span>, your order is placed and payment received.</p>
<div class="div"></div>
<table width="100%"><tr><td class="lbl">Order</td><td style="color:#E8CC7A">#${order.orderNumber}</td></tr>
<tr><td class="lbl">Payment</td><td style="color:#4CAF50">✓ Paid</td></tr>
<tr><td class="lbl">Total</td><td style="color:#E8CC7A;font-size:16px">${fmt(order.total)}</td></tr>
<tr><td class="lbl">Deliver To</td><td>${order.shippingAddress?.city}, ${order.shippingAddress?.state}</td></tr></table>
<div class="div"></div>
<table width="100%" style="font-size:13px"><tbody>${items}</tbody></table>
<div class="div"></div>
<p>Expected delivery: <span class="hl">5–7 business days</span>.</p>
<a href="https://ssjewellers.in/profile/orders/${order._id}" class="btn">Track Order →</a>`) });
}

async function sendShipmentEmail(order, user) {
  return sendEmail({ to: user.email, subject: `Your jewellery is on its way! 🚚 | #${order.orderNumber}`,
    html: base(`<h2>Your Jewellery is Shipped! 🚚</h2>
<p>Dear <span class="hl">${user.name.split(' ')[0]}</span>, your order is on its way!</p>
<div class="div"></div>
<table width="100%"><tr><td class="lbl">Order</td><td style="color:#E8CC7A">#${order.orderNumber}</td></tr>
<tr><td class="lbl">Courier</td><td>${order.courier||'Blue Dart'}</td></tr>
<tr><td class="lbl">AWB</td><td style="color:#E8CC7A;font-family:monospace">${order.trackingId||'Updating...'}</td></tr></table>
<div class="div"></div>
<a href="https://ssjewellers.in/track-order" class="btn">Track Live Status →</a>`) });
}

async function sendDeliveryEmail(order, user) {
  return sendEmail({ to: user.email, subject: `Delivered! How's your jewellery? 💍`,
    html: base(`<h2>Your Jewellery Has Arrived! 💍</h2>
<p>Your order <span class="hl">#${order.orderNumber}</span> has been delivered. We hope you love it!</p>
<div class="div"></div>
<p>Share your experience — your review helps thousands of customers.</p>
<a href="https://ssjewellers.in/profile/orders/${order._id}" class="btn">Write a Review →</a>`) });
}

async function sendPasswordResetEmail(user, resetToken) {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  return sendEmail({ to: user.email, subject: 'Reset Your S.S. Jewellers Password',
    html: base(`<h2>Password Reset</h2>
<p>Click below to reset your password. This link expires in <span class="hl">30 minutes</span>.</p>
<a href="${url}" class="btn">Reset Password →</a>
<div class="div"></div>
<p style="font-size:11px;color:#444;word-break:break-all">Or copy: ${url}</p>
<p style="font-size:12px">If you didn't request this, ignore this email.</p>`) });
}

async function sendAppointmentEmail(appt) {
  if (!appt.email) return { skipped: true };
  return sendEmail({ to: appt.email, subject: 'Appointment Confirmed | S.S. Jewellers ✨',
    html: base(`<h2>Appointment Received! ✨</h2>
<p>Dear <span class="hl">${appt.name}</span>, we'll call you at <span class="hl">${appt.phone}</span> within 24 hours to confirm.</p>
<div class="div"></div>
<table width="100%">
<tr><td class="lbl">Purpose</td><td>${(appt.purpose||'').replace('_',' ')}</td></tr>
<tr><td class="lbl">Type</td><td>${(appt.type||'').replace('_',' ')}</td></tr>
<tr><td class="lbl">Date</td><td>${new Date(appt.date).toLocaleDateString('en-IN',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</td></tr>
<tr><td class="lbl">Time</td><td>${appt.timeSlot||appt.slot||'TBD'}</td></tr>
${appt.store?`<tr><td class="lbl">Store</td><td>${appt.store}</td></tr>`:''}
</table>
<div class="div"></div>
<a href="https://ssjewellers.in/catalog" class="btn">Browse Collections →</a>`) });
}

module.exports = { sendEmail, sendWelcomeEmail, sendOrderConfirmation, sendShipmentEmail, sendDeliveryEmail, sendPasswordResetEmail, sendAppointmentEmail };
