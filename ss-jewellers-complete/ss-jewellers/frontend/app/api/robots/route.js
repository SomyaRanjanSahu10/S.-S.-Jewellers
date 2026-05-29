import { NextResponse } from 'next/server';

export function GET() {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ssjewellers.in';
  const content = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /profile/
Disallow: /checkout/
Disallow: /admin/
Disallow: /wishlist/

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay
Crawl-delay: 1
`;

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
