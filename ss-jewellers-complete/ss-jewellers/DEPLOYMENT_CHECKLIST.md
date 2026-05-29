# S.S. Jewellers — Production Deployment Checklist

> Complete this checklist before going live. Check each item ✅ when done.

---

## 1. Pre-Deployment Setup

### MongoDB Atlas
- [ ] Create M10+ cluster (Mumbai: `ap-south-1`)
- [ ] Create database user with read/write on `ssjewellers` DB
- [ ] Whitelist Render's IPs (or use `0.0.0.0/0` for dynamic IPs)
- [ ] Enable Atlas Search index on `products` collection
- [ ] Enable backup (continuous backup recommended)
- [ ] Copy connection string → set as `MONGODB_URI` in Render

### Cloudinary
- [ ] Create account at cloudinary.com
- [ ] Create upload preset: `ss-jewellers-products` (unsigned)
- [ ] Note Cloud Name, API Key, API Secret
- [ ] Set transformation: auto quality + auto format on upload

### Razorpay
- [ ] Create account at razorpay.com
- [ ] Complete KYC for live mode
- [ ] Generate live API keys (Key ID + Key Secret)
- [ ] Set webhook URL: `https://api.ssjewellers.in/api/payments/webhook`
- [ ] Set webhook events: `payment.captured`, `payment.failed`, `refund.processed`
- [ ] Copy Webhook Secret → set as `RAZORPAY_WEBHOOK_SECRET`

### Email (Gmail SMTP)
- [ ] Enable 2FA on Gmail account
- [ ] Generate App Password (16-char)
- [ ] Set `SMTP_USER` and `SMTP_PASS` in Render environment

### Gold Price API (Optional)
- [ ] Sign up at goldapi.io (free tier: 100 req/day)
- [ ] Copy API key → set as `GOLD_API_KEY` in Render

---

## 2. Backend Deployment (Render)

### Setup
- [ ] Push `backend/` folder to GitHub repository
- [ ] Connect GitHub repo in [Render Dashboard](https://dashboard.render.com)
- [ ] Select **Web Service** → **Node.js**
- [ ] Set **Build Command**: `npm install`
- [ ] Set **Start Command**: `node src/server.js`
- [ ] Set **Region**: Singapore (closest to India)
- [ ] Set **Plan**: Starter ($7/mo) minimum for production

### Environment Variables (Render Dashboard → Environment)
```
NODE_ENV                  = production
PORT                      = 5000
MONGODB_URI               = mongodb+srv://...
JWT_SECRET                = [generate: openssl rand -base64 64]
JWT_REFRESH_SECRET        = [generate: openssl rand -base64 64]
JWT_EXPIRES_IN            = 15m
RAZORPAY_KEY_ID           = rzp_live_xxx
RAZORPAY_KEY_SECRET       = [your secret]
RAZORPAY_WEBHOOK_SECRET   = [your webhook secret]
CLOUDINARY_CLOUD_NAME     = [your cloud name]
CLOUDINARY_API_KEY        = [your key]
CLOUDINARY_API_SECRET     = [your secret]
SMTP_HOST                 = smtp.gmail.com
SMTP_PORT                 = 587
SMTP_USER                 = your@gmail.com
SMTP_PASS                 = [16-char app password]
ADMIN_EMAIL               = admin@ssjewellers.in
FRONTEND_URL              = https://ssjewellers.in
GOLD_API_KEY              = [optional]
LOG_LEVEL                 = info
```

### Post-Deploy
- [ ] Visit `https://your-api.onrender.com/health` → should return `{ status: "ok" }`
- [ ] Run seed: `node src/utils/seed.js` (one-time only)
- [ ] Test auth endpoints with Postman/Insomnia
- [ ] Verify Razorpay webhook is receiving events

---

## 3. Frontend Deployment (Vercel)

### Setup
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] From `frontend/` directory: `vercel`
- [ ] Follow prompts → link to project

### Environment Variables (Vercel Dashboard → Settings → Environment)
```
NEXT_PUBLIC_API_URL                = https://your-api.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID        = rzp_live_xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  = your_cloud_name
NEXT_PUBLIC_SITE_URL               = https://ssjewellers.in
NEXT_PUBLIC_GA_ID                  = G-XXXXXXXXXX  (optional)
NEXT_PUBLIC_WHATSAPP_NUM           = +914023456789
RAZORPAY_WEBHOOK_SECRET            = [same as backend]
GOLD_API_KEY                       = [optional]
```

### Custom Domain
- [ ] Go to Vercel Dashboard → Domains
- [ ] Add `ssjewellers.in`
- [ ] Update DNS: Add CNAME `cname.vercel-dns.com` for `www`
- [ ] Add A record for apex domain (`@`)
- [ ] Wait for SSL certificate (usually < 5 min)

### Post-Deploy
- [ ] Visit `https://ssjewellers.in` → homepage loads
- [ ] Test product catalog, filters, search
- [ ] Test cart → checkout → Razorpay payment (test mode first)
- [ ] Test AI Stylist feature
- [ ] Test admin dashboard at `/admin`
- [ ] Verify sitemap at `https://ssjewellers.in/sitemap.xml`
- [ ] Verify robots.txt at `https://ssjewellers.in/robots.txt`

---

## 4. Post-Deployment Testing

### Critical User Flows
- [ ] User registration → welcome email received
- [ ] User login → JWT cookie set
- [ ] Browse catalog → filters work
- [ ] Product detail page → gallery, zoom, WhatsApp button
- [ ] Add to cart → quantity updates
- [ ] Apply coupon code GOLD10 → discount applied
- [ ] Checkout → Razorpay test payment succeeds
- [ ] Order confirmation email received
- [ ] Order appears in profile → tracking works
- [ ] Track order page works with order number
- [ ] Wishlist → add/remove products
- [ ] AI Stylist → recommendations generated
- [ ] Appointment booking → confirmation email received
- [ ] Admin login → dashboard loads with analytics
- [ ] Admin: add product → appears in catalog
- [ ] Admin: update order status → customer notified

### SEO & Performance
- [ ] Run Lighthouse audit → score > 85 on Performance
- [ ] Run Lighthouse audit → score > 95 on SEO
- [ ] Verify Open Graph tags with [opengraph.xyz](https://opengraph.xyz)
- [ ] Check structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Submit sitemap to Google Search Console

### Security
- [ ] HTTPS enforced on all endpoints
- [ ] JWT expiry working (access token: 15m, refresh: 30d)
- [ ] Rate limiting active (10 auth attempts per 15 min)
- [ ] MongoDB injection sanitization active
- [ ] Razorpay signature verification working
- [ ] Admin routes protected (non-admins get 403)
- [ ] `.env` files never committed to git

---

## 5. Monitoring & Maintenance

### Uptime Monitoring
- [ ] Set up [UptimeRobot](https://uptimerobot.com) (free)
- [ ] Monitor: `https://api.ssjewellers.in/health`
- [ ] Monitor: `https://ssjewellers.in`
- [ ] Alert: email + WhatsApp on downtime

### Error Tracking (Recommended)
- [ ] Set up [Sentry](https://sentry.io) (free tier)
- [ ] Add Sentry DSN to both frontend and backend
- [ ] Configure source maps upload in CI/CD

### Backups
- [ ] MongoDB Atlas: enable continuous backup
- [ ] Cloudinary: enable backup (paid plan)
- [ ] Export DB weekly: `mongodump --uri=$MONGODB_URI`

### Weekly Maintenance
- [ ] Check error logs in Render dashboard
- [ ] Review failed payments in Razorpay dashboard
- [ ] Process pending reviews in admin dashboard
- [ ] Check low stock products
- [ ] Update gold prices in meta (if API not connected)

---

## 6. Go-Live Checklist

- [ ] All critical user flows tested in production
- [ ] Razorpay switched from test to **live** mode
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` updated to live key
- [ ] DNS propagated (check with `dig ssjewellers.in`)
- [ ] Analytics verified (Google Analytics / Clarity)
- [ ] Team notified of go-live
- [ ] Support team briefed on common issues
- [ ] Social media profiles updated with website link
- [ ] Google My Business listings updated

---

## 7. Quick Commands Reference

```bash
# Seed database (run once)
cd backend && node src/utils/seed.js

# Deploy frontend
cd frontend && vercel --prod

# Check backend health
curl https://api.ssjewellers.in/health

# View backend logs (Render CLI)
render logs --tail --service ss-jewellers-api

# Run backend tests
cd backend && npm test

# Build frontend locally
cd frontend && npm run build

# Docker local dev
docker-compose up --build

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## 8. Admin Credentials (Change After First Login!)

```
URL:      https://ssjewellers.in/admin
Email:    admin@ssjewellers.in
Password: Admin@123456  ← CHANGE IMMEDIATELY
```

---

*Checklist version 1.0 · S.S. Jewellers Pvt. Ltd. · May 2026*
