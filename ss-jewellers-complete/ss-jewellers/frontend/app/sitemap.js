// app/sitemap.js  —  Next.js native Metadata API sitemap
// This runs at build time (or on-demand with ISR)

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ssjewellers.in';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: '/',                  priority: 1.0,  changeFrequency: 'daily'   },
    { url: '/catalog',           priority: 0.9,  changeFrequency: 'daily'   },
    { url: '/bridal',            priority: 0.9,  changeFrequency: 'weekly'  },
    { url: '/ai-stylist',        priority: 0.8,  changeFrequency: 'weekly'  },
    { url: '/stores',            priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/appointment',       priority: 0.8,  changeFrequency: 'monthly' },
    { url: '/about',             priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/search',            priority: 0.6,  changeFrequency: 'daily'   },
    { url: '/track-order',       priority: 0.5,  changeFrequency: 'monthly' },
    { url: '/catalog/rings',     priority: 0.85, changeFrequency: 'weekly'  },
    { url: '/catalog/earrings',  priority: 0.85, changeFrequency: 'weekly'  },
    { url: '/catalog/necklaces', priority: 0.85, changeFrequency: 'weekly'  },
    { url: '/catalog/bangles',   priority: 0.85, changeFrequency: 'weekly'  },
    { url: '/catalog/chains',    priority: 0.80, changeFrequency: 'weekly'  },
    { url: '/catalog/bridal',    priority: 0.90, changeFrequency: 'weekly'  },
    { url: '/catalog/men',       priority: 0.80, changeFrequency: 'weekly'  },
    { url: '/care-guide',        priority: 0.60, changeFrequency: 'monthly' },
    { url: '/hallmarking',       priority: 0.60, changeFrequency: 'monthly' },
    { url: '/emi',               priority: 0.60, changeFrequency: 'monthly' },
    { url: '/exchange-policy',   priority: 0.55, changeFrequency: 'monthly' },
    { url: '/buyback-policy',    priority: 0.55, changeFrequency: 'monthly' },
    { url: '/careers',           priority: 0.65, changeFrequency: 'weekly'  },
  ].map((page) => ({
    url:              `${BASE_URL}${page.url}`,
    lastModified:     new Date(),
    changeFrequency:  page.changeFrequency,
    priority:         page.priority,
  }));

  // Dynamic product pages
  let productPages = [];
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${API}/products?limit=500&fields=slug,updatedAt`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      productPages = (data.data?.products || []).map((p) => ({
        url:             `${BASE_URL}/product/${p.slug || p._id}`,
        lastModified:    new Date(p.updatedAt || Date.now()),
        changeFrequency: 'weekly',
        priority:        0.75,
      }));
    }
  } catch {
    // Products API unavailable — return static sitemap only
  }

  return [...staticPages, ...productPages];
}
