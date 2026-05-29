# S.S. Jewellers — Premium Gold Jewellery Ecommerce Platform

<div align="center">
  <h3>🏅 Est. 2016 · Berhampur · India's Premier Luxury Gold Jewellery Brand</h3>
  <p>A full-stack, production-ready ecommerce platform built with Next.js, Express.js, MongoDB, and Razorpay</p>

  ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
</div>

---

## ✨ Features

### 🛍 Ecommerce
- Full product catalog with filters, sorting, pagination
- Category browsing (Rings, Earrings, Necklaces, Bangles, Chains, Bridal, Men)
- Product detail page with image gallery, zoom, reviews
- Shopping cart with making charges + GST calculation
- Wishlist with local persistence
- Razorpay payment gateway integration
- Coupon / discount code system
- Order placement, tracking, and cancellation
- Invoice download

### 🤖 AI Features
- **AI Jewellery Stylist** powered by Claude (Anthropic API)
- Personalised recommendations based on occasion, budget, style, purity
- Styling tips and ensemble storytelling

### 👤 Authentication
- JWT + Refresh Token authentication
- User registration, login, logout
- Forgot password / reset password via email
- Profile management with saved addresses
- Order history with tracking timeline

### 🏛 Admin Dashboard
- Real-time analytics (revenue, orders, customers)
- Product management with Cloudinary image upload
- Order management with status updates
- Customer management with VIP tagging
- Coupon & offer management
- Sales by category breakdown
- Top performing products

### 📱 UX / Design
- Black & gold luxury theme
- Framer Motion animations
- Responsive (mobile, tablet, desktop)
- Glassmorphism cards & premium hover effects
- Live gold price ticker
- WhatsApp float button
- Scroll-to-top
- Custom 404 page
- SEO sitemap + robots.txt

### 📍 Other Pages
- Bridal collections showcase with style selector
- Store locator (12 showrooms across South India)
- Multi-step appointment booking wizard
- Gold care guide, exchange policy pages

---

## 🗂 Project Structure

```
ss-jewellers/
├── frontend/                    # Next.js 14 App Router
│   ├── app/
│   │   ├── page.jsx             # Homepage
│   │   ├── layout.jsx           # Root layout
│   │   ├── not-found.jsx        # 404
│   │   ├── global-error.jsx     # Error boundary
│   │   ├── catalog/[[...category]]/page.jsx
│   │   ├── product/[id]/page.jsx
│   │   ├── bridal/page.jsx
│   │   ├── ai-stylist/page.jsx
│   │   ├── stores/page.jsx
│   │   ├── appointment/page.jsx
│   │   ├── wishlist/page.jsx
│   │   ├── checkout/page.jsx
│   │   ├── login/page.jsx
│   │   ├── forgot-password/page.jsx
│   │   ├── reset-password/page.jsx
│   │   ├── profile/
│   │   │   ├── page.jsx
│   │   │   └── orders/[id]/page.jsx
│   │   ├── admin/page.jsx
│   │   └── api/
│   │       ├── sitemap/route.js
│   │       └── robots/route.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── CartDrawer.jsx
│   │   ├── product/
│   │   │   └── ProductCard.jsx
│   │   └── ui/
│   │       ├── GoldTicker.jsx
│   │       ├── WhatsAppFloat.jsx
│   │       └── ScrollTop.jsx
│   ├── lib/
│   │   ├── store.js             # Zustand (cart, wishlist, auth, UI)
│   │   └── api.js               # Axios client + all API calls
│   ├── styles/globals.css
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vercel.json
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── server.js            # Entry point
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   ├── models/index.js      # User, Product, Order, Review, Wishlist, Coupon, Appointment
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── admin.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── order.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── misc.routes.js   # category, review, wishlist, appointment
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── upload.middleware.js
│   │   └── utils/
│   │       ├── jwt.js
│   │       ├── email.js
│   │       └── seed.js
│   ├── package.json
│   ├── render.yaml
│   └── .env.example
│
├── index.html                   # Standalone demo (no build required)
├── ARCHITECTURE.md
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Razorpay account (test/live keys)
- Cloudinary account
- Gmail account (for SMTP)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in your .env values

# Frontend
cd ../frontend
npm install
cp .env.example .env.local
# Fill in your .env.local values
```

### 2. Seed Database

```bash
cd backend
NODE_ENV=development node src/utils/seed.js
```

This creates:
- Admin user: `admin@ssjewellers.in` / `Admin@123456`
- 7 categories
- 13 products
- 4 coupons (GOLD10, BRIDE15, FIRST5, FLAT2000)

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev       # Starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev       # Starts on http://localhost:3000
```

### 4. View Demo (No Build Required)

Open `index.html` directly in a browser for a full interactive demo with:
- Live AI jewellery recommendations (requires Anthropic API key)
- All pages: Home, Catalog, Product Modal, Cart, Admin, Wisthlist, AI Stylist, Stores, Appointment
- Full dark/light gold theme with animations

---

## 🌐 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel --prod
```

Set environment variables in Vercel dashboard:
| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com/api` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxx` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `your_name` |

### Backend → Render

1. Push `backend/` to GitHub
2. Connect repo in [Render Dashboard](https://render.com)
3. Use `render.yaml` for automatic config
4. Set secret environment variables in Render dashboard:
   - `MONGODB_URI`
   - `RAZORPAY_KEY_SECRET`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `SMTP_USER` / `SMTP_PASS`

### Database → MongoDB Atlas

1. Create cluster in [MongoDB Atlas](https://cloud.mongodb.com)
2. Choose region: `ap-south-1` (Mumbai)
3. Create database user
4. Allow IPs: `0.0.0.0/0` (or Render IPs)
5. Get connection string → set as `MONGODB_URI`

---

## 🔑 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Sign out |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |
| GET  | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List with filters & pagination |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:id` | Product detail |
| GET | `/api/products/:id/related` | Related products |
| POST | `/api/products` | Create (admin) |
| PUT | `/api/products/:id` | Update (admin) |
| DELETE | `/api/products/:id` | Delete (admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | My orders |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| GET | `/api/orders` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |
| POST | `/api/payments/validate-coupon` | Validate coupon code |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/analytics` | Dashboard analytics |
| GET | `/api/admin/users` | All customers |
| GET | `/api/admin/coupons` | All coupons |
| POST | `/api/admin/coupons` | Create coupon |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--gold` | `#C9A84C` | Primary brand colour |
| `--gold-light` | `#E8CC7A` | Hover states, prices |
| `--gold-dark` | `#8B6914` | Gradients start |
| `--obsidian` | `#0A0A0A` | Page background |
| `--charcoal` | `#141414` | Card background |
| `--cream` | `#FAF6EE` | Primary text |
| `--fog` | `#888888` | Secondary text |
| Font Display | Cinzel | Headings, logo |
| Font Serif | Cormorant Garamond | Body, descriptions |
| Font Sans | Raleway | Labels, buttons, UI |

---

## 💎 Coupon Codes (Demo)

| Code | Discount | Min. Order |
|---|---|---|
| `GOLD10` | 10% off | ₹50,000 |
| `BRIDE15` | 15% off | Bridal only |
| `FIRST5` | 5% off | Any order |
| `FLAT2000` | ₹2,000 off | ₹30,000 |

---

## 📞 Support

- **WhatsApp**: [+91 40 2345 6789](https://wa.me/914023456789)
- **Email**: hello@ssjewellers.in
- **Showrooms**: 12 locations across South India

---

## 📄 License

© 2024 S.S. Jewellers Pvt. Ltd. · All rights reserved.

Built with ❤️ in Hyderabad, India.
