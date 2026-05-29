const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');
const mongoSan    = require('express-mongo-sanitize');
const compression = require('compression');
require('dotenv').config();

const connectDB               = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const logger                  = require('./utils/logger');
const errorHandler            = require('./middleware/error.middleware');

// Route imports
const authRoutes        = require('./routes/auth.routes');
const productRoutes     = require('./routes/product.routes');
const orderRoutes       = require('./routes/order.routes');
const userRoutes        = require('./routes/user.routes');
const paymentRoutes     = require('./routes/payment.routes');
const adminRoutes       = require('./routes/admin.routes');
const categoryRoutes    = require('./routes/category.routes');
const reviewRoutes      = require('./routes/review.routes');
const wishlistRoutes    = require('./routes/wishlist.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const { contactRouter, goldRouter } = require('./routes/contact.routes');

const app = express();

// Connect DB & Cloudinary
connectDB();
configureCloudinary();

// Security & Perf Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(mongoSan());

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://ssjewellers.in',
  'https://www.ssjewellers.in',
  'https://ssjewellers.vercel.app',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    logger.warn('CORS blocked: ' + origin);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 200,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
});
app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.set('trust proxy', 1);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok', service: 'S.S. Jewellers API', version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's',
  });
});

// API Routes
app.use('/api/auth',         authRoutes);
app.use('/api/products',     productRoutes);
app.use('/api/orders',       orderRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/payments',     paymentRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/categories',   categoryRoutes);
app.use('/api/reviews',      reviewRoutes);
app.use('/api/wishlist',     wishlistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contact',      contactRouter);
app.use('/api/gold-price',   goldRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route ' + req.method + ' ' + req.originalUrl + ' not found' });
});

// Global error handler
// app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info('S.S. Jewellers API running on port ' + PORT);
    logger.info('Health: http://localhost:' + PORT + '/health');
  });
}

process.on('SIGTERM', () => { logger.info('SIGTERM - shutting down'); process.exit(0); });
process.on('unhandledRejection', (err) => { logger.error('UnhandledRejection:', err); process.exit(1); });

module.exports = app;
