// ============================================================
// routes/category.routes.js
// ============================================================
const express = require('express');
const router  = express.Router();
const cat     = require('../controllers/review.controller'); // reusing file exports
const catCtrl = {
  getCategories:     require('../controllers/review.controller').getCategories     || null,
};

// Import directly from the controller file
const {
  getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory,
} = (() => {
  try { return require('../controllers/category.controller'); }
  catch { return {}; }
})();

const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload, uploadToCloud } = require('../middleware/upload.middleware');
const { Category } = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: { categories: cats } });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
});

router.post('/', protect, adminOnly, upload.single('image'), uploadToCloud('ss-jewellers/categories'),
  async (req, res, next) => {
    try {
      const data = { ...req.body };
      if (req.cloudinaryImages?.[0]) data.image = req.cloudinaryImages[0];
      const cat = await Category.create(data);
      res.status(201).json({ success: true, data: { category: cat } });
    } catch (err) { next(err); }
  }
);

router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: { category: cat } });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Category deactivated.' });
  } catch (err) { next(err); }
});

module.exports = router;
