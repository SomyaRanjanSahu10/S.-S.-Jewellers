// ============================================================
// routes/auth.routes.js
// ============================================================
const express = require('express');
const router  = express.Router();
const auth    = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register',        auth.register);
router.post('/login',           auth.login);
router.post('/refresh',         auth.refreshToken);
router.post('/logout',          protect, auth.logout);
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password',  auth.resetPassword);
router.get('/me',               protect, auth.getMe);

module.exports = router;

// ============================================================
// routes/product.routes.js
// ============================================================
// const express  = require('express');
// const router   = express.Router();
// const product  = require('../controllers/product.controller');
// const { protect, adminOnly } = require('../middleware/auth.middleware');
// const { upload, uploadToCloud } = require('../middleware/upload.middleware');
//
// router.get('/',                  product.getProducts);
// router.get('/featured',          product.getFeaturedProducts);
// router.get('/:id',               product.getProductById);
// router.get('/:id/related',       product.getRelatedProducts);
// router.post('/',  protect, adminOnly, upload.array('images', 8), uploadToCloud(), product.createProduct);
// router.put('/:id',protect, adminOnly, upload.array('images', 8), uploadToCloud(), product.updateProduct);
// router.delete('/:id',            protect, adminOnly, product.deleteProduct);
// router.delete('/:id/images/:publicId', protect, adminOnly, product.deleteProductImage);
// module.exports = router;

// ============================================================
// routes/order.routes.js
// ============================================================
// const express = require('express');
// const router  = express.Router();
// const order   = require('../controllers/order.controller');
// const { protect, adminOnly } = require('../middleware/auth.middleware');
//
// router.post('/',              protect, order.placeOrder);
// router.get('/my',             protect, order.getMyOrders);
// router.get('/:id',            protect, order.getOrderById);
// router.put('/:id/cancel',     protect, order.cancelOrder);
// router.put('/:id/status',     protect, adminOnly, order.updateOrderStatus);
// router.get('/',               protect, adminOnly, order.getAllOrders);
// module.exports = router;

// ============================================================
// routes/payment.routes.js
// ============================================================
// const express  = require('express');
// const router   = express.Router();
// const payment  = require('../controllers/payment.controller');
// const { protect } = require('../middleware/auth.middleware');
//
// router.post('/create-order',     protect, payment.createRazorpayOrder);
// router.post('/verify',           protect, payment.verifyPayment);
// router.post('/validate-coupon',  protect, payment.validateCoupon);
// module.exports = router;

// ============================================================
// routes/user.routes.js
// ============================================================
// const express = require('express');
// const router  = express.Router();
// const { protect } = require('../middleware/auth.middleware');
// const { User } = require('../models');
//
// router.get('/profile', protect, async (req, res) => {
//   res.json({ success: true, data: { user: req.user } });
// });
// router.put('/profile', protect, async (req, res, next) => {
//   try {
//     const { name, phone } = req.body;
//     const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true });
//     res.json({ success: true, data: { user } });
//   } catch(err) { next(err); }
// });
// router.post('/address', protect, async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
//     user.addresses.push(req.body);
//     await user.save();
//     res.json({ success: true, data: { addresses: user.addresses } });
//   } catch(err) { next(err); }
// });
// module.exports = router;

// ============================================================
// routes/wishlist.routes.js
// ============================================================
// const express   = require('express');
// const router    = express.Router();
// const { protect } = require('../middleware/auth.middleware');
// const { Wishlist } = require('../models');
//
// router.get('/', protect, async (req, res, next) => {
//   try {
//     const wl = await Wishlist.findOne({ user: req.user._id }).populate('products');
//     res.json({ success: true, data: { products: wl?.products || [] } });
//   } catch(err) { next(err); }
// });
// router.post('/toggle/:productId', protect, async (req, res, next) => {
//   try {
//     let wl = await Wishlist.findOne({ user: req.user._id });
//     if (!wl) wl = await Wishlist.create({ user: req.user._id, products: [] });
//     const idx = wl.products.indexOf(req.params.productId);
//     let action;
//     if (idx > -1) { wl.products.splice(idx, 1); action = 'removed'; }
//     else          { wl.products.push(req.params.productId); action = 'added'; }
//     await wl.save();
//     res.json({ success: true, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist.` });
//   } catch(err) { next(err); }
// });
// module.exports = router;

// ============================================================
// routes/admin.routes.js
// ============================================================
// const express = require('express');
// const router  = express.Router();
// const { protect, adminOnly } = require('../middleware/auth.middleware');
// const { Order, User, Product } = require('../models');
//
// router.use(protect, adminOnly);
//
// router.get('/analytics', async (req, res, next) => {
//   try {
//     const [totalRevenue, totalOrders, totalUsers, totalProducts] = await Promise.all([
//       Order.aggregate([
//         { $match: { paymentStatus: 'paid' } },
//         { $group: { _id: null, total: { $sum: '$total' } } },
//       ]),
//       Order.countDocuments(),
//       User.countDocuments({ role: 'user' }),
//       Product.countDocuments({ isActive: true }),
//     ]);
//     res.json({
//       success: true,
//       data: {
//         revenue: totalRevenue[0]?.total || 0,
//         orders: totalOrders,
//         users: totalUsers,
//         products: totalProducts,
//       },
//     });
//   } catch(err) { next(err); }
// });
//
// router.get('/users', async (req, res, next) => {
//   try {
//     const users = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(100);
//     res.json({ success: true, data: { users } });
//   } catch(err) { next(err); }
// });
// module.exports = router;

// ============================================================
// routes/review.routes.js
// ============================================================
// const express = require('express');
// const router  = express.Router();
// const { protect, adminOnly } = require('../middleware/auth.middleware');
// const { Review } = require('../models');
//
// router.get('/product/:productId', async (req, res, next) => {
//   try {
//     const reviews = await Review.find({ product: req.params.productId, isApproved: true })
//       .populate('user', 'name avatar')
//       .sort({ createdAt: -1 });
//     res.json({ success: true, data: { reviews } });
//   } catch(err) { next(err); }
// });
// router.post('/', protect, async (req, res, next) => {
//   try {
//     const review = await Review.create({ ...req.body, user: req.user._id });
//     res.status(201).json({ success: true, data: { review } });
//   } catch(err) { next(err); }
// });
// router.put('/:id/approve', protect, adminOnly, async (req, res, next) => {
//   try {
//     const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
//     res.json({ success: true, data: { review } });
//   } catch(err) { next(err); }
// });
// module.exports = router;

// ============================================================
// routes/appointment.routes.js
// ============================================================
// const express = require('express');
// const router  = express.Router();
// const { protect, adminOnly, optionalAuth } = require('../middleware/auth.middleware');
// const { Appointment } = require('../models');
//
// router.post('/', optionalAuth, async (req, res, next) => {
//   try {
//     const appt = await Appointment.create({ ...req.body, user: req.user?._id });
//     res.status(201).json({ success: true, message: 'Appointment booked!', data: { appointment: appt } });
//   } catch(err) { next(err); }
// });
// router.get('/', protect, adminOnly, async (req, res, next) => {
//   try {
//     const appts = await Appointment.find().sort({ date: 1 }).populate('user', 'name email');
//     res.json({ success: true, data: { appointments: appts } });
//   } catch(err) { next(err); }
// });
// module.exports = router;

// ============================================================
// routes/category.routes.js
// ============================================================
// const express = require('express');
// const router  = express.Router();
// const { protect, adminOnly } = require('../middleware/auth.middleware');
// const { Category } = require('../models');
//
// router.get('/', async (req, res, next) => {
//   try {
//     const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
//     res.json({ success: true, data: { categories: cats } });
//   } catch(err) { next(err); }
// });
// router.post('/', protect, adminOnly, async (req, res, next) => {
//   try {
//     const cat = await Category.create(req.body);
//     res.status(201).json({ success: true, data: { category: cat } });
//   } catch(err) { next(err); }
// });
// module.exports = router;
