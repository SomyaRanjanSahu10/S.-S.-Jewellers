// frontend/app/api/gold-price/route.js
// Next.js Route Handler — proxies gold price to client
import { NextResponse } from 'next/server';

// Cache gold prices for 5 minutes
let cache = { data: null, fetchedAt: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Fallback prices if the external API is unavailable
const FALLBACK_PRICES = {
  gold22K:   { price: 62450, change: 0.8,  changeAmt: 490,  unit: '10g' },
  gold24K:   { price: 68200, change: 1.1,  changeAmt: 740,  unit: '10g' },
  gold18K:   { price: 46850, change: 0.8,  changeAmt: 368,  unit: '10g' },
  silver:    { price: 84500, change: -0.3, changeAmt: -255, unit: '1kg' },
  platinum:  { price: 32800, change: 0.5,  changeAmt: 163,  unit: '10g' },
  updatedAt: new Date().toISOString(),
  source: 'S.S. Jewellers reference price',
  disclaimer: 'Prices are indicative. Final transaction price confirmed at point of sale.',
};

export async function GET() {
  try {
    const now = Date.now();

    // Serve from cache if fresh
    if (cache.data && now - cache.fetchedAt < CACHE_TTL) {
      return NextResponse.json({ success: true, data: cache.data, cached: true });
    }

    // Try to fetch from gold price API
    // In production, sign up at https://goldapi.io or https://metals-api.com
    // and set GOLD_API_KEY in your environment variables
    const apiKey = process.env.GOLD_API_KEY;

    if (apiKey) {
      try {
        const res = await fetch('https://www.goldapi.io/api/XAU/INR', {
          headers: { 'x-access-token': apiKey, 'Content-Type': 'application/json' },
          next: { revalidate: 300 }, // ISR: revalidate every 5 min
        });

        if (res.ok) {
          const raw = await res.json();
          // GoldAPI returns price per troy ounce; convert to per gram
          const pricePerGram = raw.price / 31.1035;

          const prices = {
            gold22K:  { price: Math.round(pricePerGram * 0.9167 * 10), change: raw.ch || 0, changeAmt: Math.round(raw.chp || 0), unit: '10g' },
            gold24K:  { price: Math.round(pricePerGram * 10),          change: raw.ch || 0, changeAmt: Math.round(raw.chp || 0), unit: '10g' },
            gold18K:  { price: Math.round(pricePerGram * 0.75 * 10),   change: raw.ch || 0, changeAmt: Math.round(raw.chp || 0), unit: '10g' },
            silver:   FALLBACK_PRICES.silver,
            platinum: FALLBACK_PRICES.platinum,
            updatedAt: new Date().toISOString(),
            source:   'Live market data',
            disclaimer: FALLBACK_PRICES.disclaimer,
          };

          cache = { data: prices, fetchedAt: now };
          return NextResponse.json({ success: true, data: prices, cached: false });
        }
      } catch (apiErr) {
        console.error('Gold API error:', apiErr.message);
      }
    }

    // Return fallback with timestamp
    const fallback = { ...FALLBACK_PRICES, updatedAt: new Date().toISOString() };
    cache = { data: fallback, fetchedAt: now };
    return NextResponse.json({ success: true, data: fallback, cached: false });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Could not fetch gold prices', data: FALLBACK_PRICES },
      { status: 500 }
    );
  }
}
