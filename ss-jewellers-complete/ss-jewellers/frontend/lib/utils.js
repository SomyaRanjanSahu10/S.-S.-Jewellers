// ============================================================
// lib/utils.js  –  Frontend utility helpers
// ============================================================

// ── Currency formatting ───────────────────────────────────
export const fmt = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN');

export const fmtCompact = (n) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(1)}K`;
  return fmt(n);
};

// ── Date formatting ───────────────────────────────────────
export const fmtDate = (date, opts = {}) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
    ...opts,
  });

export const fmtDateShort = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

export const fmtDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60)     return 'just now';
  if (seconds < 3600)   return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)  return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return fmtDateShort(date);
};

// ── Jewellery price calculator ────────────────────────────
export function calcPrice(weight, pricePerGram, makingPct = 12) {
  const goldValue   = Math.round(pricePerGram * weight);
  const making      = Math.round(goldValue * makingPct / 100);
  const gst         = Math.round((goldValue + making) * 0.03);
  const total       = goldValue + making + gst;
  return { goldValue, making, gst, total };
}

export function discountedPrice(price, discountPercent) {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

// ── String helpers ────────────────────────────────────────
export const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

export const titleCase = (s) =>
  s ? s.split(' ').map(capitalize).join(' ') : '';

export const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const truncate = (s, maxLen = 100) =>
  s && s.length > maxLen ? s.slice(0, maxLen).trim() + '…' : s;

export const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() || '').join('');

// ── Validation helpers ────────────────────────────────────
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) =>
  /^\+?[0-9\s\-]{7,20}$/.test(phone);

export const isValidPincode = (pin) =>
  /^[1-9][0-9]{5}$/.test(pin);

// ── Class name helper (cn) ────────────────────────────────
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ── Array helpers ─────────────────────────────────────────
export const groupBy = (arr, key) =>
  arr.reduce((groups, item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    (groups[k] = groups[k] || []).push(item);
    return groups;
  }, {});

export const unique = (arr, key) => {
  if (!key) return [...new Set(arr)];
  const seen = new Set();
  return arr.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export const sortBy = (arr, key, order = 'asc') =>
  [...arr].sort((a, b) => {
    const va = a[key], vb = b[key];
    if (va < vb) return order === 'asc' ? -1 : 1;
    if (va > vb) return order === 'asc' ? 1 : -1;
    return 0;
  });

// ── Product utilities ─────────────────────────────────────
export const getMainImage = (product) =>
  product?.images?.find((img) => img.isMain)?.url ||
  product?.images?.[0]?.url ||
  null;

export const getRating = (product) =>
  product?.rating?.average ?? 4.5;

export const getRatingCount = (product) =>
  product?.rating?.count ?? 0;

export const isInWishlist = (wishlist, productId) =>
  wishlist?.some((item) => (item._id || item) === productId) ?? false;

// ── Share utilities ───────────────────────────────────────
export const shareProduct = async (product) => {
  const url  = `${window.location.origin}/product/${product.slug || product._id}`;
  const text = `Check out this beautiful ${product.name} from S.S. Jewellers! ${fmt(product.price)}`;

  if (navigator.share) {
    await navigator.share({ title: product.name, text, url });
    return true;
  }

  // Fallback: copy to clipboard
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    return 'copied';
  }

  return false;
};

export const whatsappProductLink = (product) => {
  const price = discountedPrice(product.price, product.discountPercent);
  const msg   = encodeURIComponent(
    `Hi! I'm interested in *${product.name}* — ${product.purity} Gold, ${product.weight}g. Price: ${fmt(price)}`
  );
  return `https://wa.me/914023456789?text=${msg}`;
};

// ── Storage helpers ───────────────────────────────────────
export const storage = {
  get:    (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set:    (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove: (key) => {
    try { localStorage.removeItem(key); return true; }
    catch { return false; }
  },
};

// ── Razorpay helper ───────────────────────────────────────
export function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script     = document.createElement('script');
    script.src       = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload    = () => resolve(true);
    script.onerror   = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── SEO metadata generator ────────────────────────────────
export function generateProductMeta(product) {
  const price = discountedPrice(product.price, product.discountPercent);
  return {
    title:       `${product.name} – ${product.purity} Gold | S.S. Jewellers`,
    description: truncate(product.description, 155),
    openGraph: {
      title:       product.name,
      description: `${product.purity} Gold · ${product.weight}g · ${fmt(price)}`,
      images:      getMainImage(product) ? [{ url: getMainImage(product) }] : [],
    },
    other: {
      'product:price:amount':   price,
      'product:price:currency': 'INR',
    },
  };
}
