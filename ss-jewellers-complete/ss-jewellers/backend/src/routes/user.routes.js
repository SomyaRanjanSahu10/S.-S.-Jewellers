// ============================================================
// routes/user.routes.js
// ============================================================
const express = require('express');
const router  = express.Router();
const user    = require('../controllers/user.controller');
const { protect }                  = require('../middleware/auth.middleware');
const { upload, uploadToCloud }    = require('../middleware/upload.middleware');

router.get   ('/profile',              protect, user.getProfile);
router.put   ('/profile',              protect, upload.single('avatar'), uploadToCloud('ss-jewellers/avatars'), user.updateProfile);
router.put   ('/password',             protect, user.changePassword);
router.post  ('/addresses',            protect, user.addAddress);
router.put   ('/addresses/:addressId', protect, user.updateAddress);
router.delete('/addresses/:addressId', protect, user.deleteAddress);

module.exports = router;
