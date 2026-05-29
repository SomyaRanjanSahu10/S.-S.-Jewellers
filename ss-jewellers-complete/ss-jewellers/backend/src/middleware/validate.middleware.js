const Joi = require('joi');

/**
 * Middleware factory — validates req.body against a Joi schema.
 * Returns 400 with all validation messages if invalid.
 * Strips unknown fields and coerces types.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly:   false,
    stripUnknown: true,
    convert:      true,
  });

  if (error) {
    const messages = error.details
      .map((d) => d.message.replace(/"/g, "'"))
      .join('; ');
    return res.status(400).json({ success: false, message: messages });
  }

  req.body = value;
  return next();
};

// ── Shared field definitions ──────────────────────────────
const objectId   = Joi.string().hex().length(24);
const phoneRegex = /^\+?[0-9\s\-]{7,20}$/;
const pinRegex   = /^[1-9][0-9]{5}$/;

// ── Schemas ───────────────────────────────────────────────
const schemas = {

  // Auth
  register: Joi.object({
    name:     Joi.string().trim().min(2).max(60).required()
                 .messages({ 'string.min': 'Name must be at least 2 characters' }),
    email:    Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).max(72).required()
                 .messages({ 'string.min': 'Password must be at least 8 characters' }),
    phone:    Joi.string().pattern(phoneRegex).optional().allow(''),
  }),

  login: Joi.object({
    email:    Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
  }),

  resetPassword: Joi.object({
    token:    Joi.string().required(),
    password: Joi.string().min(8).max(72).required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword:     Joi.string().min(8).max(72).required(),
  }),

  // Products
  createProduct: Joi.object({
    name:                Joi.string().trim().min(3).max(200).required(),
    category:            objectId.required(),
    price:               Joi.number().positive().required(),
    weight:              Joi.number().positive().required(),
    purity:              Joi.string().valid('18K', '22K', '24K', 'PT950').required(),
    metal:               Joi.string().valid('gold', 'silver', 'platinum', 'diamond').default('gold'),
    makingChargePercent: Joi.number().min(0).max(50).default(12),
    description:         Joi.string().trim().min(20).required(),
    shortDesc:           Joi.string().trim().max(200).optional().allow(''),
    stock:               Joi.number().integer().min(0).required(),
    discountPercent:     Joi.number().min(0).max(90).default(0),
    badge:               Joi.string().valid('new', 'sale', 'trending', 'bestseller', '').optional(),
    isBridal:            Joi.boolean().default(false),
    isFeatured:          Joi.boolean().default(false),
    gender:              Joi.string().valid('women', 'men', 'unisex').default('women'),
    occasion:            Joi.array().items(Joi.string()).optional(),
    tags:                Joi.array().items(Joi.string()).optional(),
    stone:               Joi.string().optional().allow(''),
    stoneWeight:         Joi.number().optional(),
    seoTitle:            Joi.string().max(100).optional().allow(''),
    seoDesc:             Joi.string().max(200).optional().allow(''),
  }),

  updateProduct: Joi.object({
    name:                Joi.string().trim().min(3).max(200).optional(),
    price:               Joi.number().positive().optional(),
    weight:              Joi.number().positive().optional(),
    purity:              Joi.string().valid('18K', '22K', '24K', 'PT950').optional(),
    makingChargePercent: Joi.number().min(0).max(50).optional(),
    description:         Joi.string().trim().min(20).optional(),
    stock:               Joi.number().integer().min(0).optional(),
    discountPercent:     Joi.number().min(0).max(90).optional(),
    badge:               Joi.string().valid('new', 'sale', 'trending', 'bestseller', '').optional(),
    isBridal:            Joi.boolean().optional(),
    isFeatured:          Joi.boolean().optional(),
    isActive:            Joi.boolean().optional(),
  }),

  // Orders
  placeOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: objectId.required(),
        qty:       Joi.number().integer().min(1).max(99).required(),
      })
    ).min(1).required().messages({ 'array.min': 'Cart is empty' }),

    shippingAddress: Joi.object({
      fullName: Joi.string().trim().min(2).required(),
      phone:    Joi.string().pattern(phoneRegex).required(),
      street:   Joi.string().trim().required(),
      city:     Joi.string().trim().required(),
      state:    Joi.string().trim().required(),
      pincode:  Joi.string().pattern(pinRegex).required().messages({ 'string.pattern.base': 'Invalid PIN code' }),
    }).required(),

    paymentMethod: Joi.string().valid('razorpay', 'cod', 'bank_transfer').required(),
    couponCode:    Joi.string().uppercase().optional().allow(''),
    notes:         Joi.string().max(500).optional().allow(''),
  }),

  // Reviews
  createReview: Joi.object({
    product: objectId.required(),
    rating:  Joi.number().integer().min(1).max(5).required(),
    title:   Joi.string().trim().min(3).max(100).required(),
    body:    Joi.string().trim().min(10).max(1000).required(),
    order:   objectId.optional(),
  }),

  // Appointments
  bookAppointment: Joi.object({
    name:     Joi.string().trim().min(2).required(),
    phone:    Joi.string().pattern(phoneRegex).required(),
    email:    Joi.string().email().optional().allow(''),
    type:     Joi.string().valid('in_store', 'home_visit', 'video_call').required(),
    purpose:  Joi.string().valid('bridal', 'custom_design', 'investment', 'general').required(),
    date:     Joi.date().min('now').required().messages({ 'date.min': 'Please select a future date' }),
    timeSlot: Joi.string().required(),
    store:    Joi.string().optional().allow(''),
    notes:    Joi.string().max(500).optional().allow(''),
  }),

  // Coupons
  createCoupon: Joi.object({
    code:          Joi.string().uppercase().min(3).max(20).required(),
    type:          Joi.string().valid('percent', 'flat').required(),
    value:         Joi.number().positive().required(),
    minOrderValue: Joi.number().min(0).default(0),
    maxDiscount:   Joi.number().positive().optional(),
    usageLimit:    Joi.number().integer().min(1).default(1000),
    validFrom:     Joi.date().optional(),
    validUntil:    Joi.date().min('now').optional(),
    isBridalOnly:  Joi.boolean().default(false),
  }),

  // Address
  addAddress: Joi.object({
    label:     Joi.string().valid('Home', 'Office', 'Other').default('Home'),
    fullName:  Joi.string().trim().min(2).required(),
    street:    Joi.string().trim().required(),
    city:      Joi.string().trim().required(),
    state:     Joi.string().trim().required(),
    pincode:   Joi.string().pattern(pinRegex).required(),
    phone:     Joi.string().pattern(phoneRegex).required(),
    isDefault: Joi.boolean().default(false),
  }),

  // Payment verify
  verifyPayment: Joi.object({
    razorpay_order_id:   Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature:  Joi.string().required(),
    orderId:             objectId.required(),
  }),
};

module.exports = { validate, schemas };
