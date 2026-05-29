import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * POST /api/webhooks/razorpay
 * Handles Razorpay payment webhooks for server-side order confirmation.
 * Razorpay Dashboard → Settings → Webhooks → Add this URL
 */
export async function POST(request) {
  try {
    const body      = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret    = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error('[Webhook] RAZORPAY_WEBHOOK_SECRET not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // ── Verify signature ────────────────────────────────
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expected !== signature) {
      console.warn('[Webhook] Invalid signature — possible spoofing attempt');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event   = JSON.parse(body);
    const payload = event.payload?.payment?.entity || event.payload?.order?.entity || {};

    console.log(`[Webhook] Event: ${event.event} | Amount: ₹${(payload.amount || 0) / 100}`);

    // ── Handle events ───────────────────────────────────
    switch (event.event) {

      case 'payment.captured': {
        // Payment successfully captured — update order in backend
        const { order_id, id: payment_id } = payload;
        if (order_id && payment_id) {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/webhook-capture`, {
              method:  'POST',
              headers: { 'Content-Type': 'application/json', 'x-webhook-secret': secret },
              body:    JSON.stringify({ razorpay_order_id: order_id, razorpay_payment_id: payment_id }),
            });
          } catch (apiErr) {
            console.error('[Webhook] Backend notification failed:', apiErr.message);
          }
        }
        break;
      }

      case 'payment.failed': {
        const { order_id, error_description } = payload;
        console.warn(`[Webhook] Payment failed for order ${order_id}: ${error_description}`);
        break;
      }

      case 'refund.processed': {
        const { payment_id, amount } = payload;
        console.log(`[Webhook] Refund processed: ₹${amount / 100} for payment ${payment_id}`);
        break;
      }

      case 'order.paid': {
        console.log(`[Webhook] Order paid: ${payload.id}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${event.event}`);
    }

    return NextResponse.json({ received: true, event: event.event });

  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Razorpay sends POST only — reject other methods
export async function GET() {
  return NextResponse.json({ message: 'Razorpay webhook endpoint' }, { status: 200 });
}
