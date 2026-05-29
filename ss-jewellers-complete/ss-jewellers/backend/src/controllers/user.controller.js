const { User }  = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// ── GET /api/users/profile ────────────────────────────────
exports.getProfile = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

// ── PUT /api/users/profile ────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const update = {};
    if (name)  update.name  = name.trim();
    if (phone) update.phone = phone.trim();

    // Avatar upload
    if (req.cloudinaryImages?.length) {
      // Delete old avatar
      if (req.user.avatar && req.user.avatar.includes('cloudinary')) {
        const parts = req.user.avatar.split('/');
        const pid   = parts.slice(-2).join('/').split('.')[0];
        deleteFromCloudinary(pid).catch(console.error);
      }
      update.avatar = req.cloudinaryImages[0].url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated.', data: { user } });
  } catch (err) { next(err); }
};

// ── PUT /api/users/password ───────────────────────────────
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) { next(err); }
};

// ── POST /api/users/addresses ─────────────────────────────
exports.addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }
    // If first address, make it default
    if (user.addresses.length === 0) req.body.isDefault = true;
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, message: 'Address added.', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

// ── PUT /api/users/addresses/:addressId ───────────────────
exports.updateAddress = async (req, res, next) => {
  try {
    const user    = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });
    if (req.body.isDefault) user.addresses.forEach((a) => { a.isDefault = false; });
    Object.assign(address, req.body);
    await user.save();
    res.json({ success: true, message: 'Address updated.', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

// ── DELETE /api/users/addresses/:addressId ────────────────
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, message: 'Address deleted.', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};
