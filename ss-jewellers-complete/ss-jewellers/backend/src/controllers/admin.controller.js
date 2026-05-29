const { User, Product, Order, Review, Appointment, Coupon } = require('../models');

// ── GET /api/admin/analytics ──────────────────────────────
exports.getAnalytics = async (req, res, next) => {
  try {
    const today     = new Date(); today.setHours(0,0,0,0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const [
      todayRevenue, todayOrders,
      monthRevenue, monthOrders,
      lastMonthRevenue, lastMonthOrders,
      totalUsers, totalProducts,
      pendingOrders, lowStockProducts,
    ] = await Promise.all([
      // Today
      Order.aggregate([{ $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ createdAt: { $gte: today } }),
      // This month
      Order.aggregate([{ $match: { createdAt: { $gte: thisMonth }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      // Last month
      Order.aggregate([{ $match: { createdAt: { $gte: lastMonth, $lt: thisMonth }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ createdAt: { $gte: lastMonth, $lt: thisMonth } }),
      // Totals
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
      Product.countDocuments({ stock: { $lte: 5, $gt: 0 }, isActive: true }),
    ]);

    // Revenue by category
    const categoryRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thisMonth } } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'prod' } },
      { $unwind: '$prod' },
      { $lookup: { from: 'categories', localField: 'prod.category', foreignField: '_id', as: 'cat' } },
      { $unwind: '$cat' },
      { $group: { _id: '$cat.name', revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } }, count: { $sum: '$items.qty' } } },
      { $sort: { revenue: -1 } },
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: thisMonth } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, units: { $sum: '$items.qty' }, revenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: {
        today:           { revenue: todayRevenue[0]?.total || 0, orders: todayOrders },
        thisMonth:       { revenue: monthRevenue[0]?.total || 0, orders: monthOrders },
        growth: {
          revenue: lastMonthRevenue[0]?.total ? (((monthRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1) : 0,
          orders:  lastMonthOrders ? (((monthOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1) : 0,
        },
        totals:          { users: totalUsers, products: totalProducts, pendingOrders, lowStockProducts },
        categoryRevenue,
        topProducts,
      },
    });
  } catch (err) { next(err); }
};

// ── GET /api/admin/users ──────────────────────────────────
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role = 'user' } = req.query;
    const filter = { role };
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, data: { users, total } });
  } catch (err) { next(err); }
};

// ── PUT /api/admin/users/:id ──────────────────────────────
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isVerified } = req.body;
    const update = {};
    if (role !== undefined)       update.role       = role;
    if (isVerified !== undefined) update.isVerified = isVerified;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User updated.', data: { user } });
  } catch (err) { next(err); }
};

// ── DELETE /api/admin/users/:id ───────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) { next(err); }
};

// ── GET /api/admin/reviews ────────────────────────────────
exports.getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('user', 'name email')
      .populate('product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { reviews } });
  } catch (err) { next(err); }
};

// ── PUT /api/admin/reviews/:id/approve ───────────────────
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, message: 'Review approved.', data: { review } });
  } catch (err) { next(err); }
};

// ── GET /api/admin/appointments ───────────────────────────
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const appts = await Appointment.find(filter)
      .populate('user', 'name email phone')
      .sort({ date: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({ success: true, data: { appointments: appts } });
  } catch (err) { next(err); }
};

// ── PUT /api/admin/appointments/:id ──────────────────────
exports.updateAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.json({ success: true, data: { appointment: appt } });
  } catch (err) { next(err); }
};

// ── Coupons ───────────────────────────────────────────────
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: { coupons } });
  } catch (err) { next(err); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created.', data: { coupon } });
  } catch (err) { next(err); }
};

exports.toggleCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}.`, data: { coupon } });
  } catch (err) { next(err); }
};
