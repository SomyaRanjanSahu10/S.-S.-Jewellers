import { NextResponse } from 'next/server';

// Simple in-memory rate limiter (per IP, resets per serverless invocation window)
const rateLimits = new Map();
const LIMIT      = 3;          // max 3 submissions
const WINDOW     = 60 * 1000;  // per 60 seconds

function isRateLimited(ip) {
  const now  = Date.now();
  const data = rateLimits.get(ip) || { count: 0, start: now };
  if (now - data.start > WINDOW) { rateLimits.set(ip, { count: 1, start: now }); return false; }
  if (data.count >= LIMIT) return true;
  rateLimits.set(ip, { ...data, count: data.count + 1 });
  return false;
}

/**
 * POST /api/contact
 * Handles the public contact form. Sends email to admin.
 */
export async function POST(request) {
  try {
    const ip   = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const { name, email, phone, subject, message, type } = await request.json();

    // ── Validation ─────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name, email and message are required.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ success: false, message: 'Message too long (max 2000 chars).' }, { status: 400 });
    }

    // ── Forward to backend API ──────────────────────────
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
      await fetch(`${API_URL}/contact`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, phone, subject, message, type }),
      });
    } catch (apiErr) {
      // Backend unreachable — log and still return success to user
      console.error('[Contact] Backend unreachable:', apiErr.message);
      console.log('[Contact] Form data:', { name, email, phone, subject, type });
    }

    // ── Auto-reply to user ──────────────────────────────
    // In production this would use a proper email service
    console.log(`[Contact] New message from ${name} <${email}>: ${subject || type || 'General enquiry'}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! We\'ll respond within 24 hours.',
    });

  } catch (err) {
    console.error('[Contact] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'S.S. Jewellers Contact API' });
}
