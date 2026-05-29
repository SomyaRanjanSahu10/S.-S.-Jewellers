const crypto = require('crypto');
const { User } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { sendEmail } = require('../utils/email');

// ── Register ──────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const user = await User.create({ name, email, password, phone });
    const accessToken  = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Welcome email (fire and forget)
    sendEmail({
      to: email,
      subject: 'Welcome to S.S. Jewellers ✨',
      html: `<h2>Welcome, ${name}!</h2><p>Your account has been created successfully. Start exploring our exquisite gold jewellery collections.</p>`,
    }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: user.toPublicJSON(), accessToken, refreshToken },
    });
  } catch (err) { next(err); }
};

// ── Login ─────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const accessToken  = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      data: { user: user.toPublicJSON(), accessToken, refreshToken },
    });
  } catch (err) { next(err); }
};

// ── Refresh Token ─────────────────────────────────────────
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required.' });
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }
    const newAccessToken  = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch (err) { next(err); }
};

// ── Logout ────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) { next(err); }
};

// ── Forgot Password ───────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Always return OK to prevent email enumeration
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: 'S.S. Jewellers – Password Reset',
      html: `<h2>Reset your password</h2><p>Click <a href="${resetURL}">here</a> to reset your password. Link expires in 30 minutes.</p>`,
    });
    res.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (err) { next(err); }
};

// ── Reset Password ────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Token invalid or expired.' });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful. Please log in.' });
  } catch (err) { next(err); }
};

// ── Get Current User ──────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};
