// ============================================================
// routes/payment.routes.js
// ============================================================
const express  = require('express');
const router   = express.Router();
const payment  = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create-order',     protect, payment.createRazorpayOrder);
router.post('/verify',           protect, payment.verifyPayment);
router.post('/validate-coupon',  protect, payment.validateCoupon);

module.exports = router;
