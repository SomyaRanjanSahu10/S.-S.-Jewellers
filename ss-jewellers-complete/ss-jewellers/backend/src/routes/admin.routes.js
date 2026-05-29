const express = require('express');
const router  = express.Router();
const admin   = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get ('/analytics',              admin.getAnalytics);
router.get ('/users',                  admin.getUsers);
router.put ('/users/:id',              admin.updateUser);
router.delete('/users/:id',            admin.deleteUser);
router.get ('/reviews/pending',        admin.getPendingReviews);
router.put ('/reviews/:id/approve',    admin.approveReview);
router.get ('/appointments',           admin.getAppointments);
router.put ('/appointments/:id',       admin.updateAppointment);
router.get ('/coupons',                admin.getCoupons);
router.post('/coupons',                admin.createCoupon);
router.patch('/coupons/:id/toggle',   admin.toggleCoupon);

module.exports = router;
