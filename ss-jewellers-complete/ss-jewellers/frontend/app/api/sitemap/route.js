import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ssjewellers.in';

const STATIC_PAGES = [
  { url: '/',             priority: '1.0',  changefreq: 'daily'   },
  { url: '/catalog',      priority: '0.9',  changefreq: 'daily'   },
  { url: '/bridal',       priority: '0.9',  changefreq: 'weekly'  },
  { url: '/ai-stylist',   priority: '0.8',  changefreq: 'weekly'  },
  { url: '/stores',       priority: '0.7',  changefreq: 'monthly' },
  { url: '/appointment',  priority: '0.8',  changefreq: 'monthly' },
  { url: '/login',        priority: '0.5',  changefreq: 'monthly' },
  { url: '/catalog/rings',     priority: '0.85', changefreq: 'weekly' },
  { url: '/catalog/earrings',  priority: '0.85', changefreq: 'weekly' },
  { url: '/catalog/necklaces', priority: '0.85', changefreq: 'weekly' },
  { url: '/catalog/bangles',   priority: '0.85', changefreq: 'weekly' },
  { url: '/catalog/chains',    priority: '0.80', changefreq: 'weekly' },
  { url: '/catalog/bridal',    priority: '0.90', changefreq: 'weekly' },
  { url: '/catalog/men',       priority: '0.80', changefreq: 'weekly' },
];

export async function GET() {
  const today = new Date().toISOString().split('T')[0];

  // Fetch dynamic product URLs
  let productUrls = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=500&fields=slug`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      productUrls = (data.data?.products || []).map((p) => ({
        url: `/product/${p.slug || p._id}`,
        priority: '0.75',
        changefreq: 'weekly',
      }));
    }
  } catch {
    // Products unavailable — still return static sitemap
  }

  const allPages = [...STATIC_PAGES, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
