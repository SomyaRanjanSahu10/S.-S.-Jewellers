const express = require('express');
const router  = express.Router();
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { Review, Order }         = require('../models');
const mongoose                  = require('mongoose');

// GET /api/reviews/product/:productId — public
router.get('/product/:productId', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const sortMap = {
      newest:  { createdAt: -1 },
      highest: { rating: -1 },
      lowest:  { rating:  1 },
      helpful: { helpfulCount: -1 },
    };

    const filter = { product: req.params.productId, isApproved: true };
    const [reviews, total, distribution] = await Promise.all([
      Review.find(filter)
        .populate('user', 'name avatar')
        .sort(sortMap[sort] || sortMap.newest)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(req.params.productId), isApproved: true } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        total,
        distribution,
        pagination: {
          page:  Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) { next(err); }
});

// POST /api/reviews — protected
router.post('/', protect, async (req, res, next) => {
  try {
    const { product: productId, rating, title, body, order: orderId } = req.body;

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id:              orderId,
        user:             req.user._id,
        'items.product':  productId,
        status:           'delivered',
      });
      isVerifiedPurchase = !!order;
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating, title, body,
      isVerifiedPurchase,
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted! It will appear after moderation.',
      data: { review },
    });
  } catch (err) { next(err); }
});

// PUT /api/reviews/:id/helpful — optional auth
router.put('/:id/helpful', optionalAuth, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, data: { helpfulCount: review.helpfulCount } });
  } catch (err) { next(err); }
});

// DELETE /api/reviews/:id — owner or admin
router.delete('/:id', protect, async (req, res, next) => {
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

module.exports = router;
