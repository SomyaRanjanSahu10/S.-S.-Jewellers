// ============================================================
// models/User.js
// ============================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label:    { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
  phone:    { type: String, required: true },
  isDefault:{ type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, required: true, select: false, minlength: 8 },
  phone:        { type: String, trim: true },
  role:         { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:       { type: String, default: '' },
  addresses:    [addressSchema],
  refreshToken: { type: String, select: false },
  resetToken:   { type: String, select: false },
  resetTokenExpiry: Date,
  isVerified:   { type: Boolean, default: false },
  lastLogin:    Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.resetToken;
  return obj;
};

const User = mongoose.model('User', userSchema);

// ============================================================
// models/Category.js
// ============================================================
const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  description: String,
  icon:        String,
  image:       { url: String, publicId: String },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// ============================================================
// models/Product.js
// ============================================================
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true, lowercase: true },
  sku:         { type: String },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price:       { type: Number, required: true },           // base gold price
  makingChargePercent: { type: Number, default: 12 },      // making charge %
  weight:      { type: Number, required: true },            // grams
  purity:      { type: String, enum: ['18K', '22K', '24K', 'PT950'], required: true },
  metal:       { type: String, enum: ['gold', 'silver', 'platinum', 'diamond'], default: 'gold' },
  images:      [{ url: String, publicId: String, isMain: { type: Boolean, default: false } }],
  description: { type: String, required: true },
  shortDesc:   String,
  stone:       { type: String },                            // diamond, ruby, emerald etc.
  stoneWeight: Number,                                      // carats
  occasion:    [String],                                    // ['bridal','wedding','daily']
  gender:      { type: String, enum: ['women', 'men', 'unisex'], default: 'women' },
  isBridal:    { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },
  badge:       { type: String, enum: ['new', 'sale', 'trending', 'bestseller', ''] },
  discountPercent: { type: Number, default: 0 },
  stock:       { type: Number, required: true, default: 10 },
  rating:      { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  tags:        [String],
  seoTitle:    String,
  seoDesc:     String,
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// Compute discounted price
productSchema.virtual('finalPrice').get(function () {
  return this.discountPercent > 0
    ? Math.round(this.price * (1 - this.discountPercent / 100))
    : this.price;
});

// Auto-generate slug & SKU
productSchema.pre('save', function (next) {
  if (!this.slug) this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (!this.sku)  this.sku  = 'SSJ-' + Date.now().toString(36).toUpperCase();
  next();
});

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);

// ============================================================
// models/Order.js
// ============================================================
const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     String,
  image:    String,
  purity:   String,
  weight:   Number,
  qty:      { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true },
  makingCharge: Number,
});

const trackingSchema = new mongoose.Schema({
  status:    String,
  message:   String,
  location:  String,
  timestamp: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber:     { type: String, unique: true },
  items:           [orderItemSchema],
  subtotal:        { type: Number, required: true },
  makingCharges:   { type: Number, default: 0 },
  gst:             { type: Number, default: 0 },       // 3% on gold jewellery
  discount:        { type: Number, default: 0 },
  couponCode:      String,
  shippingCharge:  { type: Number, default: 0 },
  total:           { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentMethod:   { type: String, enum: ['razorpay', 'cod', 'bank_transfer'] },
  paymentStatus:   { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  shippingAddress: {
    fullName: String, street: String, city: String,
    state: String, pincode: String, phone: String,
  },
  courier:         String,
  trackingId:      String,
  trackingHistory: [trackingSchema],
  notes:           String,
  deliveredAt:     Date,
  cancelledAt:     Date,
  cancelReason:    String,
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'SSJ' + Date.now().toString().slice(-8);
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

// ============================================================
// models/Review.js
// ============================================================
const reviewSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  title:     { type: String, required: true, maxlength: 100 },
  body:      { type: String, required: true, maxlength: 1000 },
  images:    [{ url: String, publicId: String }],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Update product rating after review save/delete
reviewSchema.post('save', async function () {
  const result = await this.constructor.aggregate([
    { $match: { product: this.product, isApproved: true } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (result.length) {
    await Product.findByIdAndUpdate(this.product, {
      'rating.average': Math.round(result[0].avg * 10) / 10,
      'rating.count': result[0].count,
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

// ============================================================
// models/Wishlist.js
// ============================================================
const wishlistSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// ============================================================
// models/Coupon.js
// ============================================================
const couponSchema = new mongoose.Schema({
  code:           { type: String, required: true, unique: true, uppercase: true },
  type:           { type: String, enum: ['percent', 'flat'], default: 'percent' },
  value:          { type: Number, required: true },
  minOrderValue:  { type: Number, default: 0 },
  maxDiscount:    Number,
  category:       { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  usageLimit:     { type: Number, default: 1000 },
  usedCount:      { type: Number, default: 0 },
  validFrom:      Date,
  validUntil:     Date,
  isActive:       { type: Boolean, default: true },
  isBridalOnly:   { type: Boolean, default: false },
}, { timestamps: true });

const Coupon = mongoose.model('Coupon', couponSchema);

// ============================================================
// models/Appointment.js
// ============================================================
const appointmentSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  email:     String,
  type:      { type: String, enum: ['in_store', 'home_visit', 'video_call'], required: true },
  purpose:   { type: String, enum: ['bridal', 'custom_design', 'investment', 'general'], required: true },
  store:     String,
  date:      { type: Date, required: true },
  timeSlot:  { type: String, required: true },
  notes:     String,
  status:    { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { User, Category, Product, Order, Review, Wishlist, Coupon, Appointment };
