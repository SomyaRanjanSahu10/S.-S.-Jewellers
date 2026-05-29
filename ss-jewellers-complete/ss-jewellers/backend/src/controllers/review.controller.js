// ============================================================
// controllers/review.controller.js
// ============================================================
const { Review, Product, Order } = require('../models');

// GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const sortMap = {
      newest:   { createdAt: -1 },
      oldest:   { createdAt:  1 },
      highest:  { rating: -1 },
      lowest:   { rating:  1 },
      helpful:  { helpfulCount: -1 },
    };
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort(sortMap[sort] || sortMap.newest)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Review.countDocuments({ product: req.params.productId, isApproved: true });

    // Aggregate rating distribution
    const distribution = await Review.aggregate([
      { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(req.params.productId), isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        total,
        distribution,
        pagination: { page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
      },
    });
  } catch (err) { next(err); }
};

// POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { product: productId, rating, title, body, order: orderId } = req.body;

    // Check duplicate
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    // Check verified purchase
    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        'items.product': productId,
        status: 'delivered',
      });
      isVerifiedPurchase = !!order;
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      title,
      body,
      isVerifiedPurchase,
      isApproved: false, // requires admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted! It will appear after moderation (usually within 24 hours).',
      data: { review },
    });
  } catch (err) { next(err); }
};

// PUT /api/reviews/:id/helpful
exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, data: { helpfulCount: review.helpfulCount } });
  } catch (err) { next(err); }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { next(err); }
};

// ============================================================
// controllers/category.controller.js
// ============================================================
const { Category: Cat } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

exports.getCategories = async (req, res, next) => {
  try {
    const cats = await Cat.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: { categories: cats } });
  } catch (err) { next(err); }
};

exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const cat = await Cat.findOne({ slug: req.params.slug, isActive: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.cloudinaryImages?.[0]) data.image = req.cloudinaryImages[0];
    const cat = await Cat.create(data);
    res.status(201).json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.cloudinaryImages?.[0]) update.image = req.cloudinaryImages[0];
    const cat = await Cat.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const cat = await Cat.findById(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    if (cat.image?.publicId) await deleteFromCloudinary(cat.image.publicId);
    await Cat.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deactivated.' });
  } catch (err) { next(err); }
};

// ============================================================
// controllers/appointment.controller.js
// ============================================================
const { Appointment } = require('../models');
const { sendEmail } = require('../utils/email');

exports.createAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.create({ ...req.body, user: req.user?._id });

    // Confirmation email
    if (req.body.email) {
      sendEmail({
        to: req.body.email,
        subject: 'S.S. Jewellers – Appointment Confirmed ✨',
        html: `
          <h2>Appointment Confirmed!</h2>
          <p>Dear ${req.body.name},</p>
          <p>Your appointment has been received. Our team will call you at <strong>${req.body.phone}</strong> within 24 hours to confirm.</p>
          <h3>Details</h3>
          <ul>
            <li>Purpose: ${req.body.purpose}</li>
            <li>Type: ${req.body.type}</li>
            <li>Date: ${new Date(req.body.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
            <li>Time: ${req.body.timeSlot}</li>
          </ul>
          <p>Thank you for choosing S.S. Jewellers.</p>
        `,
      }).catch(console.error);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked! We will confirm within 24 hours.',
      data: { appointment: appt },
    });
  } catch (err) { next(err); }
};

exports.getMyAppointments = async (req, res, next) => {
  try {
    const appts = await Appointment.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, data: { appointments: appts } });
  } catch (err) { next(err); }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    if (appt.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    appt.status = 'cancelled';
    await appt.save();
    res.json({ success: true, message: 'Appointment cancelled.' });
  } catch (err) { next(err); }
};

// ============================================================
// controllers/wishlist.controller.js
// ============================================================
const { Wishlist } = require('../models');

exports.getWishlist = async (req, res, next) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name images price purity weight badge rating discountPercent slug makingChargePercent');
    res.json({ success: true, data: { products: wl?.products || [], count: wl?.products?.length || 0 } });
  } catch (err) { next(err); }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user._id });
    if (!wl) wl = new Wishlist({ user: req.user._id, products: [] });
    const idx = wl.products.findIndex((p) => p.toString() === req.params.productId);
    let action;
    if (idx > -1) { wl.products.splice(idx, 1); action = 'removed'; }
    else           { wl.products.unshift(req.params.productId); action = 'added'; }
    await wl.save();
    res.json({
      success: true,
      message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist.`,
      data: { action, count: wl.products.length },
    });
  } catch (err) { next(err); }
};

exports.clearWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] }, { upsert: true });
    res.json({ success: true, message: 'Wishlist cleared.' });
  } catch (err) { next(err); }
};
