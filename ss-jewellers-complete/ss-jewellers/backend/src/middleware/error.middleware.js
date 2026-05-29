// ============================================================
// middleware/error.middleware.js  –  Global error handler
// ============================================================
const AppError = require('../utils/error');
const logger   = require('../utils/logger');

// ── Handle specific Mongoose/JWT errors ───────────────────
function handleCastError(err) {
  return new AppError(`Invalid ${err.path}: ${err.value}.`, 400);
}

function handleDuplicateKey(err) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`The ${field} "${value}" is already registered. Please use a different value.`, 409);
}

function handleValidationError(err) {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation error: ${messages.join('. ')}`, 400);
}

function handleJWTError() {
  return new AppError('Invalid authentication token. Please log in again.', 401);
}

function handleJWTExpiry() {
  return new AppError('Your session has expired. Please log in again.', 401);
}

// ── Development error response ────────────────────────────
function sendDevError(err, res) {
  res.status(err.statusCode).json({
    success:   false,
    status:    err.status,
    message:   err.message,
    stack:     err.stack,
    error:     err,
  });
}

// ── Production error response ─────────────────────────────
function sendProdError(err, res) {
  if (err.isOperational) {
    // Operational errors: send message to client
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Programming errors: don't leak details
    logger.error('UNHANDLED ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
}

// ── Main error handler ────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status     = err.status     || 'error';

  logger.error(`${err.statusCode} - ${err.message}`, {
    url:    req.originalUrl,
    method: req.method,
    ip:     req.ip,
    stack:  err.stack,
  });

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError')             error = handleCastError(err);
    if (err.code === 11000)                   error = handleDuplicateKey(err);
    if (err.name === 'ValidationError')       error = handleValidationError(err);
    if (err.name === 'JsonWebTokenError')     error = handleJWTError();
    if (err.name === 'TokenExpiredError')     error = handleJWTExpiry();

    sendProdError(error, res);
  }
};

module.exports = errorHandler;


// ============================================================
// middleware/validate.middleware.js  –  Joi request validation
// ============================================================
const Joi = require('joi');

/**
 * Creates an Express middleware that validates req.body against a Joi schema.
 * @param {Joi.Schema} schema
 * @returns Express middleware
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly:   false,
    stripUnknown: true,
    convert:      true,
  });

  if (error) {
    const messages = error.details.map((d) => d.message.replace(/"/g, "'")).join('; ');
    return res.status(400).json({ success: false, message: messages });
  }

  req.body = value;
  return next();
};

// ── Validation schemas ────────────────────────────────────
const schemas = {
  register: Joi.object({
    name:     Joi.string().trim().min(2).max(60).required(),
    email:    Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(8).max(72).required(),
    phone:    Joi.string().pattern(/^\+?[0-9\s\-]{7,20}$/).optional(),
  }),

  login: Joi.object({
    email:    Joi.string().email().lowercase().trim().required(),
    password: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
  }),

  resetPassword: Joi.object({
    token:    Joi.string().required(),
    password: Joi.string().min(8).max(72).required(),
  }),

  createProduct: Joi.object({
    name:               Joi.string().trim().min(3).max(200).required(),
    category:           Joi.string().hex().length(24).required(),
    price:              Joi.number().positive().required(),
    weight:             Joi.number().positive().required(),
    purity:             Joi.string().valid('18K', '22K', '24K', 'PT950').required(),
    metal:              Joi.string().valid('gold', 'silver', 'platinum', 'diamond').default('gold'),
    makingChargePercent:Joi.number().min(0).max(50).default(12),
    description:        Joi.string().trim().min(20).required(),
    stock:              Joi.number().integer().min(0).required(),
    discountPercent:    Joi.number().min(0).max(90).default(0),
    badge:              Joi.string().valid('new', 'sale', 'trending', 'bestseller', '').optional(),
    isBridal:           Joi.boolean().default(false),
    isFeatured:         Joi.boolean().default(false),
    gender:             Joi.string().valid('women', 'men', 'unisex').default('women'),
    occasion:           Joi.array().items(Joi.string()).optional(),
    tags:               Joi.array().items(Joi.string()).optional(),
  }),

  placeOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        qty:       Joi.number().integer().min(1).max(99).required(),
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().trim().required(),
      phone:    Joi.string().required(),
      street:   Joi.string().trim().required(),
      city:     Joi.string().trim().required(),
      state:    Joi.string().trim().required(),
      pincode:  Joi.string().pattern(/^[1-9][0-9]{5}$/).required(),
    }).required(),
    paymentMethod: Joi.string().valid('razorpay', 'cod', 'bank_transfer').required(),
    couponCode:    Joi.string().uppercase().optional().allow(''),
    notes:         Joi.string().max(500).optional(),
  }),

  createReview: Joi.object({
    product: Joi.string().hex().length(24).required(),
    rating:  Joi.number().integer().min(1).max(5).required(),
    title:   Joi.string().trim().min(3).max(100).required(),
    body:    Joi.string().trim().min(10).max(1000).required(),
    order:   Joi.string().hex().length(24).optional(),
  }),

  bookAppointment: Joi.object({
    name:     Joi.string().trim().required(),
    phone:    Joi.string().required(),
    email:    Joi.string().email().optional().allow(''),
    type:     Joi.string().valid('in_store', 'home_visit', 'video_call').required(),
    purpose:  Joi.string().valid('bridal', 'custom_design', 'investment', 'general').required(),
    date:     Joi.date().min('now').required(),
    timeSlot: Joi.string().required(),
    store:    Joi.string().optional(),
    notes:    Joi.string().max(500).optional(),
  }),
};

module.exports = { validate, schemas };
