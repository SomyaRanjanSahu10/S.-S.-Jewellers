/**
 * S.S. Jewellers — Database Seeder
 * Run: node src/utils/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { User, Category, Product, Coupon } = require('../models');

const CATEGORIES = [
  { name: 'Rings',     slug: 'rings',     icon: '💍', sortOrder: 1 },
  { name: 'Earrings',  slug: 'earrings',  icon: '✨', sortOrder: 2 },
  { name: 'Necklaces', slug: 'necklaces', icon: '📿', sortOrder: 3 },
  { name: 'Bangles',   slug: 'bangles',   icon: '🔆', sortOrder: 4 },
  { name: 'Chains',    slug: 'chains',    icon: '⛓', sortOrder: 5 },
  { name: 'Bridal',    slug: 'bridal',    icon: '👑', sortOrder: 6 },
  { name: 'Men',       slug: 'men',       icon: '🏅', sortOrder: 7 },
];

const COUPONS = [
  { code: 'GOLD10',  type: 'percent', value: 10, minOrderValue: 50000,  usageLimit: 5000,  validUntil: new Date(Date.now() + 90*24*60*60*1000), isActive: true },
  { code: 'BRIDE15', type: 'percent', value: 15, minOrderValue: 0,       usageLimit: 1000,  validUntil: new Date(Date.now() + 90*24*60*60*1000), isActive: true, isBridalOnly: true },
  { code: 'FIRST5',  type: 'percent', value: 5,  minOrderValue: 0,       usageLimit: 10000, validUntil: new Date(Date.now() + 365*24*60*60*1000),isActive: true },
  { code: 'FLAT2000',type: 'flat',    value: 2000,minOrderValue: 30000,  usageLimit: 500,   validUntil: new Date(Date.now() + 30*24*60*60*1000), isActive: true },
];

const ADMIN_USER = {
  name:       'Admin User',
  email:      'admin@ssjewellers.in',
  password:   'Admin@123456',
  phone:      '+91 40 2345 6789',
  role:       'admin',
  isVerified: true,
};

async function getProducts(categories) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c._id]));

  return [
    // ── NECKLACES ────────────────────────────────────────
    {
      name: 'Royal Temple Necklace', slug: 'royal-temple-necklace',
      category: bySlug.necklaces, price: 124500, weight: 28.4, purity: '22K',
      metal: 'gold', makingChargePercent: 12, stock: 8,
      description: 'Handcrafted temple necklace inspired by South Indian heritage. Features intricate goddess motifs, polki work and natural ruby accents. Comes with matching stud earrings.',
      shortDesc: 'The perfect blend of tradition and grandeur.',
      badge: 'bestseller', isFeatured: true, rating: { average: 4.9, count: 234 },
      occasion: ['festive', 'wedding', 'bridal'], gender: 'women',
      tags: ['temple', 'necklace', '22k', 'polki', 'south-indian'],
    },
    {
      name: 'Polki Haaram Set', slug: 'polki-haaram-set',
      category: bySlug.bridal, price: 520000, weight: 105.2, purity: '22K',
      metal: 'gold', makingChargePercent: 14, stock: 3,
      description: 'Grand haaram set featuring uncut polki diamonds, natural emeralds, rubies and pearls set in 22K gold with enamel work on the reverse. An heirloom piece crafted by master artisans.',
      badge: 'trending', isBridal: true, isFeatured: true, rating: { average: 5.0, count: 42 },
      occasion: ['bridal', 'wedding'], gender: 'women',
      tags: ['polki', 'haaram', 'bridal', 'kundan', 'heavy'],
    },
    {
      name: 'Kundan Choker Bridal Set', slug: 'kundan-choker-bridal-set',
      category: bySlug.bridal, price: 385000, weight: 72.8, purity: '22K',
      metal: 'gold', makingChargePercent: 13, stock: 5, discountPercent: 9,
      description: 'Opulent Kundan choker set with matching maangtika, long earrings and pair of kadas. Features intricate kundan setting with meenakari on reverse, natural pearls and red stones.',
      badge: 'trending', isBridal: true, isFeatured: true, rating: { average: 5.0, count: 89 },
      occasion: ['bridal', 'wedding'], gender: 'women',
      tags: ['kundan', 'choker', 'bridal', 'meenakari', 'set'],
    },
    // ── RINGS ────────────────────────────────────────────
    {
      name: 'Solitaire Diamond Ring', slug: 'solitaire-diamond-ring',
      category: bySlug.rings, price: 85000, weight: 4.2, purity: '18K',
      metal: 'gold', stone: 'Diamond', stoneWeight: 0.5, makingChargePercent: 18, stock: 12,
      description: 'Classic solitaire ring featuring a GIA-certified brilliant-cut 0.50 ct diamond set in 18K white gold four-prong setting. Comes with GIA certificate and S.S. Jewellers certificate.',
      badge: 'new', isFeatured: true, rating: { average: 4.8, count: 187 },
      occasion: ['wedding', 'anniversary', 'engagement'], gender: 'women',
      tags: ['solitaire', 'diamond', '18k', 'ring', 'engagement'],
    },
    {
      name: 'Antique Vanki Ring', slug: 'antique-vanki-ring',
      category: bySlug.rings, price: 32000, weight: 9.2, purity: '22K',
      metal: 'gold', makingChargePercent: 12, stock: 18, discountPercent: 12,
      description: 'Traditional vanki (arm ring) reimagined as a finger ring. Features Lakshmi motifs with antique finish and red stone accents. Popular for temple visits and festive occasions.',
      badge: 'sale', rating: { average: 4.7, count: 203 },
      occasion: ['festive', 'daily', 'puja'], gender: 'women',
      tags: ['vanki', 'traditional', 'antique', '22k', 'ring'],
    },
    // ── EARRINGS ─────────────────────────────────────────
    {
      name: 'Gold Jhumka Earrings', slug: 'gold-jhumka-earrings',
      category: bySlug.earrings, price: 28500, weight: 8.6, purity: '22K',
      metal: 'gold', makingChargePercent: 14, stock: 25, discountPercent: 11,
      description: 'Traditional jhumka earrings with intricate filigree work and hanging south sea pearl drops. Lightweight yet impactful — perfect for daily wear and festive occasions alike.',
      badge: 'sale', isFeatured: true, rating: { average: 4.7, count: 412 },
      occasion: ['daily', 'festive', 'office'], gender: 'women',
      tags: ['jhumka', 'earrings', 'traditional', 'pearl', 'filigree'],
    },
    {
      name: 'Pearl Drop Chandbali', slug: 'pearl-drop-chandbali',
      category: bySlug.earrings, price: 18500, weight: 5.8, purity: '22K',
      metal: 'gold', makingChargePercent: 15, stock: 32,
      description: 'Elegant chandbali earrings in 22K gold with crescent moon design and south sea pearl drops. Perfect for office wear and special occasions. Lightweight and comfortable for all-day wear.',
      badge: 'new', rating: { average: 4.6, count: 341 },
      occasion: ['office', 'daily', 'party'], gender: 'women',
      tags: ['chandbali', 'pearl', 'earrings', 'lightweight', '22k'],
    },
    // ── BANGLES ──────────────────────────────────────────
    {
      name: 'Diamond Tennis Bracelet', slug: 'diamond-tennis-bracelet',
      category: bySlug.bangles, price: 192000, weight: 12.3, purity: '18K',
      metal: 'gold', stone: 'Diamond', stoneWeight: 2.0, makingChargePercent: 20, stock: 6,
      description: 'Elegant tennis bracelet set with 36 round brilliant-cut diamonds (total 2.0 ct) in a sleek 18K white gold channel setting. Classic design that pairs with anything.',
      badge: 'new', isFeatured: true, rating: { average: 4.9, count: 67 },
      occasion: ['party', 'wedding', 'anniversary'], gender: 'women',
      tags: ['tennis', 'diamond', 'bracelet', '18k', 'contemporary'],
    },
    {
      name: 'Floral Bangle Set', slug: 'floral-bangle-set',
      category: bySlug.bangles, price: 92000, weight: 42.6, purity: '22K',
      metal: 'gold', makingChargePercent: 12, stock: 10, discountPercent: 12,
      description: 'Set of 6 matching bangles with intricate floral patterns and meenakari enamel work in green and red. Sold as a complete set. The gold weight shown is for the full set.',
      badge: 'sale', rating: { average: 4.8, count: 178 },
      occasion: ['festive', 'wedding', 'bridal'], gender: 'women',
      tags: ['bangles', 'floral', 'meenakari', 'set', 'festive'],
    },
    // ── CHAINS ───────────────────────────────────────────
    {
      name: 'Gold Rope Chain 24"', slug: 'gold-rope-chain-24',
      category: bySlug.chains, price: 42800, weight: 10.5, purity: '22K',
      metal: 'gold', makingChargePercent: 10, stock: 20, discountPercent: 11,
      description: 'Classic twisted rope chain in 22K gold, 24 inches long. Perfect for layering or wearing with a pendant. BIS hallmarked. Available in 18", 20", 22" and 24" lengths.',
      badge: 'bestseller', rating: { average: 4.6, count: 298 },
      occasion: ['daily', 'office', 'casual'], gender: 'women',
      tags: ['chain', 'rope', '22k', 'gold', 'daily-wear'],
    },
    {
      name: 'Rose Gold Herringbone Chain', slug: 'rose-gold-herringbone-chain',
      category: bySlug.chains, price: 31000, weight: 8.2, purity: '18K',
      metal: 'gold', makingChargePercent: 16, stock: 15,
      description: 'Delicate herringbone chain in 18K rose gold. Lies flat against the skin for a modern, sleek look. The serpentine pattern catches light beautifully.',
      badge: 'new', rating: { average: 4.5, count: 221 },
      occasion: ['daily', 'office', 'party'], gender: 'women',
      tags: ['rose-gold', 'herringbone', '18k', 'chain', 'modern'],
    },
    // ── MEN ──────────────────────────────────────────────
    {
      name: "Men's Gold Kada", slug: 'mens-gold-kada',
      category: bySlug.men, price: 68000, weight: 35.0, purity: '22K',
      metal: 'gold', makingChargePercent: 10, stock: 14,
      description: 'Bold and masculine gold kada in 22K gold with traditional geometric engravings. A statement piece for the modern man that honours tradition. Adjustable size.',
      badge: 'bestseller', isFeatured: true, rating: { average: 4.8, count: 156 },
      occasion: ['wedding', 'festive', 'daily'], gender: 'men',
      tags: ['kada', 'men', '22k', 'bold', 'traditional'],
    },
    {
      name: "Men's Gold Chain 24\"", slug: 'mens-gold-chain-24',
      category: bySlug.men, price: 56500, weight: 14.0, purity: '22K',
      metal: 'gold', makingChargePercent: 10, stock: 18,
      description: 'Heavy Cuban link chain in 22K gold. 24 inches with secure lobster clasp. A timeless piece that pairs with both traditional and modern attire.',
      badge: 'new', rating: { average: 4.7, count: 88 },
      occasion: ['daily', 'festive', 'wedding'], gender: 'men',
      tags: ['chain', 'men', 'cuban', '22k', 'heavy'],
    },
  ];
}

async function seed() {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seeder...\n');

    // Clear existing data (only in development!)
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Clearing existing data...');
      await Promise.all([
        User.deleteMany({ email: { $ne: '' } }),
        Category.deleteMany({}),
        Product.deleteMany({}),
        Coupon.deleteMany({}),
      ]);
      console.log('✅ Collections cleared.\n');
    }

    // 1. Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create(ADMIN_USER);
    console.log(`   ✅ Admin: ${admin.email} (password: Admin@123456)\n`);

    // 2. Create categories
    console.log('📂 Creating categories...');
    const categories = await Category.insertMany(CATEGORIES);
    console.log(`   ✅ ${categories.length} categories created.\n`);

    // 3. Create products
    console.log('💎 Creating products...');
    const productData = await getProducts(categories);
    const products    = await Product.insertMany(productData);
    console.log(`   ✅ ${products.length} products created.\n`);

    // 4. Create coupons
    console.log('🏷  Creating coupons...');
    const coupons = await Coupon.insertMany(COUPONS);
    console.log(`   ✅ ${coupons.length} coupons created.\n`);

    console.log('🎉 Seeding complete!\n');
    console.log('─'.repeat(50));
    console.log('Admin login:');
    console.log(`  Email:    ${ADMIN_USER.email}`);
    console.log(`  Password: ${ADMIN_USER.password}`);
    console.log('─'.repeat(50));
    console.log('\nCoupon codes:');
    COUPONS.forEach((c) => console.log(`  ${c.code} — ${c.value}${c.type === 'percent' ? '%' : '₹'} off`));
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

seed();
