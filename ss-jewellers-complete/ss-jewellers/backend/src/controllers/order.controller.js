const { Order, Product, Coupon } = require('../models');
const { sendEmail } = require('../utils/email');

// ── POST /api/orders ──────────────────────────────────────
exports.placeOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    // Validate products & calculate totals
    let subtotal = 0;
    let makingCharges = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
      if (product.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }
      const itemPrice   = product.finalPrice;
      const makingCharge = Math.round(itemPrice * (product.makingChargePercent / 100));
      subtotal      += itemPrice * item.qty;
      makingCharges += makingCharge * item.qty;
      orderItems.push({
        product:     product._id,
        name:        product.name,
        image:       product.images?.[0]?.url || '',
        purity:      product.purity,
        weight:      product.weight,
        qty:         item.qty,
        price:       itemPrice,
        makingCharge,
      });
    }

    // Coupon
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.usedCount < coupon.usageLimit) {
        discount = coupon.type === 'percent'
          ? Math.round(subtotal * coupon.value / 100)
          : coupon.value;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const gst   = Math.round((subtotal + makingCharges - discount) * 0.03);
    const total = subtotal + makingCharges - discount + gst;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      makingCharges,
      gst,
      discount,
      couponCode,
      total,
      paymentMethod,
      shippingAddress,
      notes,
      trackingHistory: [{ status: 'pending', message: 'Order placed successfully.' }],
    });

    // Decrement stock
    await Promise.all(
      items.map((item) =>
        Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } })
      )
    );

    // Confirmation email
    sendEmail({
      to: req.user.email,
      subject: `S.S. Jewellers – Order #${order.orderNumber} Confirmed 🏅`,
      html: `<h2>Order Confirmed!</h2><p>Your order <strong>#${order.orderNumber}</strong> has been placed. Total: ₹${total.toLocaleString('en-IN')}</p>`,
    }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: { order },
    });
  } catch (err) { next(err); }
};

// ── GET /api/orders/my ────────────────────────────────────
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .populate('items.product', 'name images slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments({ user: req.user._id }),
    ]);
    res.json({ success: true, data: { orders, total } });
  } catch (err) { next(err); }
};

// ── GET /api/orders/:id ───────────────────────────────────
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images purity weight')
      .populate('user', 'name email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    // Only owner or admin can view
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    res.json({ success: true, data: { order } });
  } catch (err) { next(err); }
};

// ── PUT /api/orders/:id/cancel ────────────────────────────
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    if (['shipped', 'out_for_delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel after dispatch.' });
    }
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Customer requested cancellation';
    order.trackingHistory.push({ status: 'cancelled', message: 'Order cancelled by customer.' });
    await order.save();
    // Restore stock
    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } })
      )
    );
    res.json({ success: true, message: 'Order cancelled.', data: { order } });
  } catch (err) { next(err); }
};

// ── PUT /api/orders/:id/status (admin) ───────────────────
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, courier, trackingId, message } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    order.status = status;
    if (courier)    order.courier    = courier;
    if (trackingId) order.trackingId = trackingId;
    if (status === 'delivered') order.deliveredAt = new Date();
    order.trackingHistory.push({
      status,
      message: message || `Order ${status}`,
      ...(courier && { location: courier }),
    });
    await order.save();
    res.json({ success: true, message: 'Order status updated.', data: { order } });
  } catch (err) { next(err); }
};

// ── GET /api/orders (admin) ───────────────────────────────
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.orderNumber = { $regex: search, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ success: true, data: { orders, total } });
  } catch (err) { next(err); }
};
