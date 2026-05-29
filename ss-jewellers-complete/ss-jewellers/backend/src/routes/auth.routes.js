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
router.get ('/me',              protect, auth.getMe);

module.exports = router;
