# S.S. Jewellers – Production Architecture

## Tech Stack
- **Frontend**: Next.js 14 · React 18 · Tailwind CSS · Framer Motion
- **Backend**: Node.js · Express.js
- **Database**: MongoDB Atlas (via Mongoose)
- **Auth**: JWT + Refresh Tokens + bcrypt
- **Payments**: Razorpay
- **Media**: Cloudinary
- **Deploy**: Vercel (frontend) · Render (backend) · MongoDB Atlas

---

## Folder Structure

```
ss-jewellers/
├── frontend/                         # Next.js App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Homepage
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── catalog/
│   │   │   ├── page.tsx              # All products
│   │   │   └── [category]/page.tsx
│   │   ├── product/
│   │   │   └── [id]/page.tsx         # Product detail
│   │   ├── bridal/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── orders/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── ai-stylist/page.tsx
│   │   ├── stores/page.tsx
│   │   ├── appointment/page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx              # Dashboard
│   │       ├── products/page.tsx
│   │       ├── orders/page.tsx
│   │       ├── users/page.tsx
│   │       └── offers/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── CartDrawer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── ShimmerText.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Modal.tsx
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── GoldTicker.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── FeaturedCollections.tsx
│   │   │   ├── BridalSection.tsx
│   │   │   ├── OffersBanner.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   └── RelatedProducts.tsx
│   │   └── admin/
│   │       ├── AnalyticsCard.tsx
│   │       ├── OrdersTable.tsx
│   │       └── ProductForm.tsx
│   ├── context/
│   │   ├── CartContext.tsx
│   │   ├── WishlistContext.tsx
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   ├── useAuth.ts
│   │   └── useProducts.ts
│   ├── lib/
│   │   ├── api.ts                    # Axios instance
│   │   ├── razorpay.ts
│   │   └── cloudinary.ts
│   ├── styles/
│   │   └── globals.css
│   ├── public/
│   │   ├── images/
│   │   └── fonts/
│   ├── tailwind.config.js
│   └── next.config.js
│
└── backend/                          # Express API
    ├── src/
    │   ├── server.js
    │   ├── config/
    │   │   ├── db.js                 # MongoDB connection
    │   │   └── cloudinary.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Product.js
    │   │   ├── Order.js
    │   │   ├── Category.js
    │   │   ├── Wishlist.js
    │   │   └── Review.js
    │   ├── routes/
    │   │   ├── auth.routes.js
    │   │   ├── product.routes.js
    │   │   ├── order.routes.js
    │   │   ├── user.routes.js
    │   │   ├── payment.routes.js
    │   │   └── admin.routes.js
    │   ├── controllers/
    │   │   ├── auth.controller.js
    │   │   ├── product.controller.js
    │   │   ├── order.controller.js
    │   │   ├── payment.controller.js
    │   │   └── admin.controller.js
    │   ├── middleware/
    │   │   ├── auth.middleware.js     # JWT verification
    │   │   ├── admin.middleware.js
    │   │   └── upload.middleware.js   # Cloudinary multer
    │   └── utils/
    │       ├── jwt.js
    │       ├── email.js
    │       └── goldPrice.js          # Live gold price API
    └── package.json
```

---

## MongoDB Schemas

### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String (bcrypt hashed),
  phone: String,
  role: { type: String, enum: ['user','admin'], default: 'user' },
  address: [{ label, street, city, state, pin, isDefault }],
  refreshToken: String,
  createdAt: Date
}
```

### Product
```js
{
  name: String,
  category: { type: ObjectId, ref: 'Category' },
  price: Number,
  makingChargePercent: Number,
  weight: Number,
  purity: { type: String, enum: ['18K','22K','24K'] },
  metal: { type: String, enum: ['gold','silver','platinum'] },
  images: [{ url: String, publicId: String }],
  description: String,
  stock: Number,
  rating: { average: Number, count: Number },
  badge: String,
  isFeatured: Boolean,
  isBridal: Boolean,
  tags: [String],
  createdAt: Date
}
```

### Order
```js
{
  user: { type: ObjectId, ref: 'User' },
  items: [{ product: ObjectId, qty: Number, price: Number, weight: Number }],
  subtotal: Number,
  makingCharges: Number,
  gst: Number,
  discount: Number,
  couponCode: String,
  total: Number,
  status: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'] },
  paymentId: String,
  paymentStatus: String,
  shippingAddress: Object,
  tracking: { courier: String, trackingId: String },
  createdAt: Date
}
```

### Review
```js
{
  user: { type: ObjectId, ref: 'User' },
  product: { type: ObjectId, ref: 'Product' },
  rating: { type: Number, min: 1, max: 5 },
  title: String,
  body: String,
  images: [String],
  verified: Boolean,
  createdAt: Date
}
```

---

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

### Products
- GET /api/products (filter, sort, paginate)
- GET /api/products/:id
- GET /api/products/category/:cat
- GET /api/products/featured
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)

### Orders
- POST /api/orders
- GET /api/orders/my
- GET /api/orders/:id
- GET /api/orders (admin)
- PUT /api/orders/:id/status (admin)

### Payments
- POST /api/payment/create-order (Razorpay)
- POST /api/payment/verify

### Admin
- GET /api/admin/analytics
- GET /api/admin/users
- PUT /api/admin/users/:id

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```
Env vars: NEXT_PUBLIC_API_URL, NEXT_PUBLIC_RAZORPAY_KEY

### Backend (Render)
```bash
cd backend
# Deploy via Render dashboard (connect GitHub repo)
```
Env vars: MONGODB_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### MongoDB Atlas
- Cluster: M10+ (production)
- Region: ap-south-1 (Mumbai)
- Enable Atlas Search for product search
