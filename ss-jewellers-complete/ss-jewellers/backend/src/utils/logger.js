const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, colorize, printf, json, errors } = format;

// ── Console format (development) ─────────────────────────
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n  ${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}] ${stack || message}${metaStr}`;
  })
);

// ── JSON format (production) ─────────────────────────────
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// ── Create logger ─────────────────────────────────────────
const logger = createLogger({
  level:  process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  defaultMeta: { service: 'ss-jewellers-api' },
  transports: [
    new transports.Console(),
    // In production, also log to files
    ...(process.env.NODE_ENV === 'production' ? [
      new transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
        maxsize:  10 * 1024 * 1024,  // 10 MB
        maxFiles: 5,
      }),
      new transports.File({
        filename: path.join(process.cwd(), 'logs', 'combined.log'),
        maxsize:  20 * 1024 * 1024,
        maxFiles: 10,
      }),
    ] : []),
  ],
  // Don't exit on handled exceptions
  exitOnError: false,
});

// ── Unhandled rejections/exceptions ──────────────────────
if (process.env.NODE_ENV === 'production') {
  logger.exceptions.handle(
    new transports.File({ filename: path.join(process.cwd(), 'logs', 'exceptions.log') })
  );
  logger.rejections.handle(
    new transports.File({ filename: path.join(process.cwd(), 'logs', 'rejections.log') })
  );
}

// ── Convenience helpers ───────────────────────────────────
logger.request  = (req, extra = {}) =>
  logger.info(`${req.method} ${req.originalUrl}`, { ip: req.ip, ...extra });

logger.dbQuery  = (operation, collection, filter = {}) =>
  logger.debug(`DB ${operation}`, { collection, filter });

logger.payment  = (event, data = {}) =>
  logger.info(`PAYMENT:${event}`, data);

module.exports = logger;
