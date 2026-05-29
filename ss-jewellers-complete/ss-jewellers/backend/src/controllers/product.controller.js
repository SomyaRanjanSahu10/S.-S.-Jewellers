const { Product, Category } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// ── GET /api/products ─────────────────────────────────────
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, category, purity, minPrice, maxPrice,
      minWeight, maxWeight, isBridal, isFeatured, badge, gender,
      sortBy = 'createdAt', order = 'desc', search, metal,
    } = req.query;

    const filter = { isActive: true };

    // Category filter (by slug or ID)
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
      else filter.category = category; // treat as ObjectId
    }
    if (purity)     filter.purity = { $in: purity.split(',') };
    if (metal)      filter.metal  = metal;
    if (isBridal)   filter.isBridal   = isBridal === 'true';
    if (isFeatured) filter.isFeatured = isFeatured === 'true';
    if (badge)      filter.badge = badge;
    if (gender)     filter.gender = gender;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minWeight || maxWeight) {
      filter.weight = {};
      if (minWeight) filter.weight.$gte = Number(minWeight);
      if (maxWeight) filter.weight.$lte = Number(maxWeight);
    }

    // Full-text search
    if (search) filter.$text = { $search: search };

    const sort = {};
    if (search) sort.score = { $meta: 'textScore' };
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug icon')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (err) { next(err); }
};

// ── GET /api/products/:id ─────────────────────────────────
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true,
    }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: { product } });
  } catch (err) { next(err); }
};

// ── GET /api/products/featured ────────────────────────────
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8).lean();
    res.json({ success: true, data: { products } });
  } catch (err) { next(err); }
};

// ── GET /api/products/related/:id ─────────────────────────
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4).lean();
    res.json({ success: true, data: { products: related } });
  } catch (err) { next(err); }
};

// ── POST /api/products (admin) ────────────────────────────
exports.createProduct = async (req, res, next) => {
  try {
    const images = req.cloudinaryImages || [];
    if (images.length) images[0].isMain = true;

    const product = await Product.create({ ...req.body, images });
    res.status(201).json({ success: true, message: 'Product created.', data: { product } });
  } catch (err) { next(err); }
};

// ── PUT /api/products/:id (admin) ─────────────────────────
exports.updateProduct = async (req, res, next) => {
  try {
    const update = { ...req.body };
    if (req.cloudinaryImages?.length) {
      update.$push = { images: { $each: req.cloudinaryImages } };
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true, runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated.', data: { product } });
  } catch (err) { next(err); }
};

// ── DELETE /api/products/:id (admin) ──────────────────────
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    // Delete images from Cloudinary
    await Promise.all(product.images.map((img) => deleteFromCloudinary(img.publicId)));
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) { next(err); }
};

// ── DELETE /api/products/:id/images/:publicId (admin) ─────
exports.deleteProductImage = async (req, res, next) => {
  try {
    await deleteFromCloudinary(req.params.publicId);
    await Product.findByIdAndUpdate(req.params.id, {
      $pull: { images: { publicId: req.params.publicId } },
    });
    res.json({ success: true, message: 'Image deleted.' });
  } catch (err) { next(err); }
};
