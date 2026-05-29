const express = require('express');
const router  = express.Router();
const { protect }  = require('../middleware/auth.middleware');
const { Wishlist }  = require('../models');

// GET /api/wishlist
router.get('/', protect, async (req, res, next) => {
  try {
    const wl = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name images price purity weight badge rating discountPercent slug makingChargePercent');
    res.json({ success: true, data: { products: wl?.products || [], count: wl?.products?.length || 0 } });
  } catch (err) { next(err); }
});

// POST /api/wishlist/toggle/:productId
router.post('/toggle/:productId', protect, async (req, res, next) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user._id });
    if (!wl) wl = new Wishlist({ user: req.user._id, products: [] });

    const idx = wl.products.findIndex((p) => p.toString() === req.params.productId);
    const action = idx > -1 ? 'removed' : 'added';
    if (idx > -1) wl.products.splice(idx, 1);
    else          wl.products.unshift(req.params.productId);

    await wl.save();
    res.json({
      success: true,
      message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist.`,
      data: { action, count: wl.products.length },
    });
  } catch (err) { next(err); }
});

// DELETE /api/wishlist/clear
router.delete('/clear', protect, async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] }, { upsert: true });
    res.json({ success: true, message: 'Wishlist cleared.' });
  } catch (err) { next(err); }
});

module.exports = router;
