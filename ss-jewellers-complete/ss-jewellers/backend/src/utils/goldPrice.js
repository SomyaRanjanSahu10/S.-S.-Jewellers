/**
 * Gold Price Utility
 * Fetches live gold prices from GoldAPI.io
 * Fallback: indicative prices from MCX/IBJA
 */

let cache = { prices: null, fetchedAt: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const FALLBACK = {
  gold22K:  { price: 62450, unit: '10g', change: 0.8 },
  gold24K:  { price: 68200, unit: '10g', change: 1.1 },
  gold18K:  { price: 46850, unit: '10g', change: 0.8 },
  silver:   { price: 84500, unit: '1kg', change: -0.3 },
  platinum: { price: 32800, unit: '10g', change: 0.5 },
};

/**
 * Get current gold prices
 * @returns {Promise<Object>} price data
 */
async function getGoldPrices() {
  const now = Date.now();
  if (cache.prices && now - cache.fetchedAt < CACHE_TTL) {
    return cache.prices;
  }

  try {
    const apiKey = process.env.GOLD_API_KEY;
    if (!apiKey) throw new Error('GOLD_API_KEY not set');

    const response = await fetch('https://www.goldapi.io/api/XAU/INR', {
      headers: {
        'x-access-token': apiKey,
        'Content-Type':   'application/json',
      },
    });

    if (!response.ok) throw new Error(`GoldAPI responded with ${response.status}`);

    const data = await response.json();
    // Convert troy ounce → gram → 10 gram price
    const perGram = data.price / 31.1035;

    const prices = {
      gold22K:  { price: Math.round(perGram * 0.9167 * 10), unit: '10g', change: data.ch || 0 },
      gold24K:  { price: Math.round(perGram * 10),           unit: '10g', change: data.ch || 0 },
      gold18K:  { price: Math.round(perGram * 0.75 * 10),    unit: '10g', change: data.ch || 0 },
      silver:   FALLBACK.silver,
      platinum: FALLBACK.platinum,
      updatedAt: new Date().toISOString(),
      isLive: true,
    };

    cache = { prices, fetchedAt: now };
    return prices;

  } catch (err) {
    console.warn('Gold price fetch failed, using fallback:', err.message);
    const fallback = { ...FALLBACK, updatedAt: new Date().toISOString(), isLive: false };
    cache = { prices: fallback, fetchedAt: now };
    return fallback;
  }
}

/**
 * Calculate total jewellery price
 * @param {number} weightGrams  - weight in grams
 * @param {string} purity       - '18K' | '22K' | '24K'
 * @param {number} makingPct    - making charge percentage (default 12)
 * @returns {Promise<Object>}
 */
async function calculateJewelleryPrice(weightGrams, purity = '22K', makingPct = 12) {
  const prices = await getGoldPrices();
  const priceKey = `gold${purity}`;
  const pricePerTenGrams = prices[priceKey]?.price || FALLBACK[priceKey]?.price || 62450;
  const pricePerGram = pricePerTenGrams / 10;

  const goldValue    = Math.round(pricePerGram * weightGrams);
  const makingCharge = Math.round(goldValue * makingPct / 100);
  const gst          = Math.round((goldValue + makingCharge) * 0.03);
  const total        = goldValue + makingCharge + gst;

  return {
    weightGrams,
    purity,
    pricePerGram,
    goldValue,
    makingCharge,
    makingPct,
    gst,
    total,
    breakdown: {
      goldValue:    `₹${goldValue.toLocaleString('en-IN')}`,
      makingCharge: `₹${makingCharge.toLocaleString('en-IN')} (${makingPct}%)`,
      gst:          `₹${gst.toLocaleString('en-IN')} (3%)`,
      total:        `₹${total.toLocaleString('en-IN')}`,
    },
  };
}

module.exports = { getGoldPrices, calculateJewelleryPrice };
