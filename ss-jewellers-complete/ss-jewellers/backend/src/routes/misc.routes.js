// ============================================================
// routes/category.routes.js
// ============================================================
const express  = require('express');
const catRouter = express.Router();
const { Category } = require('../models');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload, uploadToCloud } = require('../middleware/upload.middleware');

catRouter.get('/', async (req, res, next) => {
  try {
    const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: { categories: cats } });
  } catch (err) { next(err); }
});

catRouter.post('/', protect, adminOnly, upload.single('image'), uploadToCloud('ss-jewellers/categories'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.cloudinaryImages?.[0]) data.image = req.cloudinaryImages[0];
    const cat = await Category.create(data);
    res.status(201).json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
});

catRouter.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
});

catRouter.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deactivated.' });
  } catch (err) { next(err); }
});

// ============================================================
// routes/review.routes.js
// ============================================================
const reviewRouter = express.Router();
const { Review, Product } = require('../models');
const { protect: _protect, optionalAuth } = require('../middleware/auth.middleware');

reviewRouter.get('/product/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ success: true, data: { reviews } });
  } catch (err) { next(err); }
});

reviewRouter.post('/', _protect, async (req, res, next) => {
  try {
    const existing = await Review.findOne({ user: req.user._id, product: req.body.product });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    const review = await Review.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, message: 'Review submitted for approval.', data: { review } });
  } catch (err) { next(err); }
});

reviewRouter.put('/:id/helpful', optionalAuth, async (req, res, next) => {
  try {
    await Review.findByIdAndUpdate(req.params.id, { $inc: { helpfulCount: 1 } });
    res.json({ success: true, message: 'Marked as helpful.' });
  } catch (err) { next(err); }
});

reviewRouter.delete('/:id', _protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { next(err); }
});

// ============================================================
// routes/wishlist.routes.js
// ============================================================
const wishlistRouter = express.Router();
const { Wishlist } = require('../models');

wishlistRouter.get('/', _protect, async (req, res, next) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name images price purity weight badge rating discountPercent slug');
    res.json({ success: true, data: { products: wl?.products || [] } });
  } catch (err) { next(err); }
});

wishlistRouter.post('/toggle/:productId', _protect, async (req, res, next) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user._id });
    if (!wl) wl = new Wishlist({ user: req.user._id, products: [] });
    const idx = wl.products.findIndex((p) => p.toString() === req.params.productId);
    let action;
    if (idx > -1) { wl.products.splice(idx, 1); action = 'removed'; }
    else           { wl.products.unshift(req.params.productId); action = 'added'; }
    await wl.save();
    res.json({ success: true, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist.`, action });
  } catch (err) { next(err); }
});

wishlistRouter.delete('/clear', _protect, async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] });
    res.json({ success: true, message: 'Wishlist cleared.' });
  } catch (err) { next(err); }
});

// ============================================================
// routes/appointment.routes.js
// ============================================================
const apptRouter = express.Router();
const { Appointment } = require('../models');
const { optionalAuth: oa, protect: ap } = require('../middleware/auth.middleware');

apptRouter.post('/', oa, async (req, res, next) => {
  try {
    const appt = await Appointment.create({
      ...req.body,
      user: req.user?._id,
    });
    res.status(201).json({
      success: true,
      message: 'Appointment booked! We will confirm within 24 hours.',
      data: { appointment: appt },
    });
  } catch (err) { next(err); }
});

apptRouter.get('/my', ap, async (req, res, next) => {
  try {
    const appts = await Appointment.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ success: true, data: { appointments: appts } });
  } catch (err) { next(err); }
});

// Export all routers
module.exports = {
  categoryRouter:    catRouter,
  reviewRouter,
  wishlistRouter,
  appointmentRouter: apptRouter,
};
