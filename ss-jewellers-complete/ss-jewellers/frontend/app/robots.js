// app/robots.js  —  Next.js native Metadata API robots
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ssjewellers.in';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/profile/',
          '/checkout/',
          '/admin/',
          '/wishlist/',
          '/_next/',
          '/reset-password',
        ],
      },
      {
        // Prevent AI training scrapers
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap:   `${BASE_URL}/sitemap.xml`,
    host:       BASE_URL,
  };
}
