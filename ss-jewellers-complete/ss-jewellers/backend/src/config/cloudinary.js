const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('☁️  Cloudinary configured');
};

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} folder  e.g. 'ss-jewellers/products'
 * @returns {{ url: string, publicId: string }}
 */
const uploadToCloudinary = (fileBuffer, folder = 'ss-jewellers/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary by its publicId
 */
const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { configureCloudinary, uploadToCloudinary, deleteFromCloudinary };
