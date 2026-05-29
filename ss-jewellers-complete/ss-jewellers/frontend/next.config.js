/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Image optimisation ───────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [64, 128, 256, 384],
  },

  // ── Security headers ─────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://api.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
              "connect-src 'self' https://api.anthropic.com https://api.razorpay.com",
              "frame-src https://api.razorpay.com",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────
  async redirects() {
    return [
      { source: '/shop',       destination: '/catalog',        permanent: true },
      { source: '/jewellery',  destination: '/catalog',        permanent: true },
      { source: '/bridal-set', destination: '/bridal',         permanent: true },
      { source: '/account',    destination: '/profile',        permanent: true },
      { source: '/signin',     destination: '/login',          permanent: true },
      { source: '/signup',     destination: '/login',          permanent: true },
    ];
  },

  // ── Rewrites (API proxy in dev) ──────────────────────
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/backend/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/:path*`,
        },
      ];
    }
    return [];
  },

  // ── Bundle analyser (optional) ───────────────────────
  ...(process.env.ANALYZE === 'true' && {
    // npm i @next/bundle-analyzer
    // ANALYZE=true npm run build
  }),

  // ── Compiler options ─────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // ── Env variables exposed to client ──────────────────
  env: {
    NEXT_PUBLIC_SITE_NAME:    'S.S. Jewellers',
    NEXT_PUBLIC_SITE_URL:     process.env.NEXT_PUBLIC_SITE_URL || 'https://ssjewellers.in',
    NEXT_PUBLIC_WHATSAPP_NUM: '+914023456789',
  },

  // ── Output for Vercel ─────────────────────────────────
  output: 'standalone',

  // ── Experimental ──────────────────────────────────────
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

module.exports = nextConfig;
