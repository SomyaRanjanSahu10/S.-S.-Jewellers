// ============================================================
// backend/src/utils/otpService.js
// OTP generation, storage and verification
// Uses in-memory store for dev; use Redis in production
// ============================================================

const crypto = require('crypto');

// In-memory OTP store: { phone: { otp, expiresAt, attempts } }
// In production: replace with Redis (ioredis)
const store = new Map();

const OTP_EXPIRY_MS    = 10 * 60 * 1000;  // 10 minutes
const MAX_ATTEMPTS     = 5;
const RESEND_COOLDOWN  = 60 * 1000;       // 1 minute

/**
 * Generate a 6-digit numeric OTP
 */
function generateOTP() {
  return String(crypto.randomInt(100000, 999999));
}

/**
 * Create and store an OTP for a phone number.
 * Returns { otp, canResend: false } if in cooldown period.
 */
function createOTP(phone) {
  const existing = store.get(phone);
  const now      = Date.now();

  // Enforce resend cooldown
  if (existing && now - existing.createdAt < RESEND_COOLDOWN) {
    const waitSec = Math.ceil((RESEND_COOLDOWN - (now - existing.createdAt)) / 1000);
    return { success: false, message: `Please wait ${waitSec} seconds before requesting a new OTP.` };
  }

  const otp = generateOTP();
  store.set(phone, {
    otp,
    expiresAt: now + OTP_EXPIRY_MS,
    createdAt: now,
    attempts:  0,
  });

  return { success: true, otp };
}

/**
 * Verify an OTP for a phone number.
 * @returns {{ valid: boolean, message: string }}
 */
function verifyOTP(phone, inputOTP) {
  const record = store.get(phone);
  const now    = Date.now();

  if (!record) {
    return { valid: false, message: 'No OTP found for this number. Please request a new one.' };
  }
  if (now > record.expiresAt) {
    store.delete(phone);
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    store.delete(phone);
    return { valid: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  record.attempts += 1;

  if (record.otp !== String(inputOTP).trim()) {
    const remaining = MAX_ATTEMPTS - record.attempts;
    return { valid: false, message: `Incorrect OTP. ${remaining} attempt(s) remaining.` };
  }

  store.delete(phone); // invalidate after successful use
  return { valid: true, message: 'OTP verified successfully.' };
}

/**
 * Send OTP via SMS (Twilio / MSG91 / Fast2SMS)
 * In dev mode: just logs to console
 */
async function sendOTPSMS(phone, otp) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📱 [OTP Dev] Phone: ${phone} | OTP: ${otp}`);
    return { sent: true, dev: true };
  }

  // ── MSG91 Integration ──────────────────────────────────
  if (process.env.MSG91_AUTHKEY) {
    try {
      const response = await fetch('https://api.msg91.com/api/v5/otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', authkey: process.env.MSG91_AUTHKEY },
        body: JSON.stringify({
          template_id: process.env.MSG91_TEMPLATE_ID,
          mobile:      phone.replace('+', '').replace(/\s/g, ''),
          otp,
        }),
      });
      const data = await response.json();
      if (data.type === 'success') return { sent: true };
    } catch (err) {
      console.error('MSG91 SMS error:', err.message);
    }
  }

  // ── Twilio Fallback ────────────────────────────────────
  if (process.env.TWILIO_SID && process.env.TWILIO_AUTH) {
    try {
      const body = new URLSearchParams({
        To:   phone,
        From: process.env.TWILIO_FROM,
        Body: `Your S.S. Jewellers OTP is ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
      });
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`,
        {
          method:  'POST',
          headers: {
            'Content-Type':  'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.TWILIO_SID}:${process.env.TWILIO_AUTH}`).toString('base64'),
          },
          body: body.toString(),
        }
      );
      return { sent: true };
    } catch (err) {
      console.error('Twilio SMS error:', err.message);
    }
  }

  console.warn('[OTP] No SMS provider configured. OTP:', otp);
  return { sent: false, message: 'SMS provider not configured' };
}

/**
 * High-level: generate OTP + send SMS + return result
 */
async function requestOTP(phone) {
  const result = createOTP(phone);
  if (!result.success) return result;

  const smsSent = await sendOTPSMS(phone, result.otp);
  return {
    success:  smsSent.sent,
    message:  smsSent.sent ? 'OTP sent successfully.' : 'Failed to send OTP. Please try again.',
    dev:      smsSent.dev || false,
    // Only expose OTP in dev mode
    ...(smsSent.dev && { otp: result.otp }),
  };
}

module.exports = { createOTP, verifyOTP, sendOTPSMS, requestOTP };
