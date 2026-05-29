const multer = require('multer');
const { uploadToCloudinary } = require('../config/cloudinary');

// Store files in memory so we can stream to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only JPEG, PNG and WebP images are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * Middleware: upload files to Cloudinary after multer buffers them.
 * Adds `req.cloudinaryImages` = [{ url, publicId }]
 */
const uploadToCloud = (folder = 'ss-jewellers/products') => async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return next();
    const uploads = await Promise.all(
      req.files.map((f) => uploadToCloudinary(f.buffer, folder))
    );
    req.cloudinaryImages = uploads;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, uploadToCloud };
