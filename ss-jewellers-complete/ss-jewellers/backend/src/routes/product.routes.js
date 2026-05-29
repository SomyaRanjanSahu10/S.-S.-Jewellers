const express  = require('express');
const router   = express.Router();
const product  = require('../controllers/product.controller');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth.middleware');
const { upload, uploadToCloud }            = require('../middleware/upload.middleware');

// Public
router.get ('/',                    optionalAuth, product.getProducts);
router.get ('/featured',            product.getFeaturedProducts);
router.get ('/:id',                 product.getProductById);
router.get ('/:id/related',         product.getRelatedProducts);

// Admin
router.post('/',                    protect, adminOnly, upload.array('images', 8), uploadToCloud('ss-jewellers/products'), product.createProduct);
router.put ('/:id',                 protect, adminOnly, upload.array('images', 8), uploadToCloud('ss-jewellers/products'), product.updateProduct);
router.delete('/:id',               protect, adminOnly, product.deleteProduct);
router.delete('/:id/images/:publicId', protect, adminOnly, product.deleteProductImage);

module.exports = router;
