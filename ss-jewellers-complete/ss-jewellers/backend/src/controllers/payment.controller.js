const Razorpay = require('razorpay');
const crypto   = require('crypto');
const { Order, Coupon } = require('../models');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── POST /api/payments/create-order ──────────────────────
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const rzpOrder = await razorpay.orders.create({
      amount:   Math.round(order.total * 100), // paise
      currency: 'INR',
      receipt:  order.orderNumber,
      notes: {
        orderId:     order._id.toString(),
        customerName: req.user.name,
        customerEmail: req.user.email,
      },
    });

    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        rzpOrderId: rzpOrder.id,
        amount:     rzpOrder.amount,
        currency:   rzpOrder.currency,
        key:        process.env.RAZORPAY_KEY_ID,
        prefill: {
          name:    req.user.name,
          email:   req.user.email,
          contact: req.user.phone || '',
        },
      },
    });
  } catch (err) { next(err); }
};

// ── POST /api/payments/verify ─────────────────────────────
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Signature verification
    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Signature mismatch.' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.paymentStatus      = 'paid';
    order.status             = 'confirmed';
    order.razorpayPaymentId  = razorpay_payment_id;
    order.razorpaySignature  = razorpay_signature;
    order.trackingHistory.push({
      status:  'confirmed',
      message: 'Payment received. Order confirmed.',
    });
    await order.save();

    res.json({
      success: true,
      message: 'Payment verified. Order confirmed.',
      data: { order },
    });
  } catch (err) { next(err); }
};

// ── POST /api/payments/validate-coupon ───────────────────
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal, isBridal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });

    const now = new Date();
    if (coupon.validFrom && coupon.validFrom > now) {
      return res.status(400).json({ success: false, message: 'Coupon not yet valid.' });
    }
    if (coupon.validUntil && coupon.validUntil < now) {
      return res.status(400).json({ success: false, message: 'Coupon has expired.' });
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
    }
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value ₹${coupon.minOrderValue.toLocaleString('en-IN')} required.`,
      });
    }
    if (coupon.isBridalOnly && !isBridal) {
      return res.status(400).json({ success: false, message: 'This coupon is valid only for bridal jewellery.' });
    }

    let discount = coupon.type === 'percent'
      ? Math.round(cartTotal * coupon.value / 100)
      : coupon.value;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

    res.json({
      success: true,
      message: `Coupon applied! You save ₹${discount.toLocaleString('en-IN')}`,
      data: { discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } },
    });
  } catch (err) { next(err); }
};
