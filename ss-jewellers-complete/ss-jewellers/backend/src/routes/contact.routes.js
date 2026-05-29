// ============================================================
// routes/contact.routes.js
// ============================================================
const express      = require('express');
const router       = express.Router();
const { sendEmail }= require('../utils/email');
const rateLimit    = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      5,
  message:  { success: false, message: 'Too many contact requests. Please try again later.' },
});

// POST /api/contact
router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, subject, message, type } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Send to admin
    sendEmail({
      to:      process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `[SS Jewellers Contact] ${subject || type || 'General Enquiry'} — ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Type:</strong> ${type || 'General'}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    }).catch(console.error);

    // Auto-reply to user
    sendEmail({
      to:      email,
      subject: 'We received your message | S.S. Jewellers',
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to S.S. Jewellers. We've received your message and will respond within 24 hours.</p>
        <p>For urgent queries, WhatsApp us at +91 40 2345 6789.</p>
        <p>Warm regards,<br/>S.S. Jewellers Customer Care Team</p>
      `,
    }).catch(console.error);

    res.json({ success: true, message: 'Message received. We\'ll respond within 24 hours.' });
  } catch (err) { next(err); }
});

module.exports = router;


// ============================================================
// routes/goldprice.routes.js
// ============================================================
const goldRouter  = express.Router();
const { getGoldPrices, calculateJewelleryPrice } = require('../utils/goldPrice');

// GET /api/gold-price
goldRouter.get('/', async (req, res, next) => {
  try {
    const prices = await getGoldPrices();
    res.json({ success: true, data: prices });
  } catch (err) { next(err); }
});

// GET /api/gold-price/calculate?weight=15&purity=22K&making=12
goldRouter.get('/calculate', async (req, res, next) => {
  try {
    const { weight, purity = '22K', making = 12 } = req.query;
    if (!weight || isNaN(weight) || weight <= 0) {
      return res.status(400).json({ success: false, message: 'Valid weight (grams) required.' });
    }
    const result = await calculateJewelleryPrice(Number(weight), purity, Number(making));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

module.exports = { contactRouter: router, goldRouter };
