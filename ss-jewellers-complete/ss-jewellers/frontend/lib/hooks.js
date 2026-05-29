'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { productApi } from './api';

// ── useGoldPrice ──────────────────────────────────────────
/**
 * Fetches live gold prices and auto-refreshes every 5 minutes.
 */
export function useGoldPrice() {
  const [prices, setPrices]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res  = await fetch('/api/gold-price');
      const data = await res.json();
      if (data.success) setPrices(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5 * 60 * 1000); // 5 min
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}

// ── useProducts ───────────────────────────────────────────
/**
 * Fetch products with filters, pagination and debounced search.
 */
export function useProducts(initialFilters = {}) {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters,    setFilters]    = useState({ page: 1, limit: 12, ...initialFilters });
  const debounceRef = useRef(null);

  const fetchProducts = useCallback(async (params) => {
    setLoading(true);
    try {
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
      );
      const { data } = await productApi.getAll(clean);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error('useProducts error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchProducts(filters), 300);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchProducts]);

  const setFilter   = useCallback((key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 })), []);
  const setPage     = useCallback((page) => setFilters((f) => ({ ...f, page })), []);
  const resetFilters= useCallback(() => setFilters({ page: 1, limit: 12, ...initialFilters }), [initialFilters]);

  return { products, loading, pagination, filters, setFilter, setPage, resetFilters, refetch: () => fetchProducts(filters) };
}

// ── useScrollPosition ─────────────────────────────────────
/**
 * Returns current scroll position. Throttled to 100ms.
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollY;
}

// ── useLocalStorage ───────────────────────────────────────
/**
 * Persist state to localStorage. SSR-safe.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (err) {
      console.error('useLocalStorage error:', err);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// ── useDebounce ───────────────────────────────────────────
/**
 * Debounces a value by `delay` milliseconds.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ── useIntersectionObserver ───────────────────────────────
/**
 * Returns a ref and boolean indicating if element is in viewport.
 */
export function useInView(options = {}) {
  const ref        = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1, ...options }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

// ── useMediaQuery ─────────────────────────────────────────
/**
 * Returns true if the media query matches.
 * useMediaQuery('(max-width: 768px)')
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// ── usePriceCalculator ────────────────────────────────────
/**
 * Calculate jewellery price breakdown from weight, purity and making charge %.
 */
export function usePriceCalculator(weight, purity = '22K', makingPct = 12) {
  const { prices } = useGoldPrice();

  return useMemo(() => {
    if (!prices || !weight) return null;

    const priceKey    = `gold${purity}`;
    const per10g      = prices[priceKey]?.price ?? 62450;
    const perGram     = per10g / 10;
    const goldValue   = Math.round(perGram * weight);
    const making      = Math.round(goldValue * makingPct / 100);
    const gst         = Math.round((goldValue + making) * 0.03);
    const total       = goldValue + making + gst;

    return {
      perGram:     Math.round(perGram),
      goldValue,
      making,
      makingPct,
      gst,
      total,
      weight,
      purity,
    };
  }, [prices, weight, purity, makingPct]);
}

// ── useCopyToClipboard ────────────────────────────────────
/**
 * Copy text to clipboard. Returns { copy, copied }.
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch {
      return false;
    }
  }, [resetDelay]);

  return { copy, copied };
}

// ── useImageZoom ──────────────────────────────────────────
/**
 * Mouse/touch zoom for product images.
 */
export function useImageZoom() {
  const ref       = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = useCallback((e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width)  * 100;
    const y = ((e.clientY - top)  / height) * 100;
    setStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2.2)' });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setStyle({ transform: 'scale(1)', transformOrigin: 'center' });
  }, []);

  return { ref, style, handleMouseMove, handleMouseLeave };
}

// ── useWindowSize ─────────────────────────────────────────
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

// ── useLockBodyScroll ─────────────────────────────────────
/**
 * Lock body scroll when modal/drawer is open.
 */
export function useLockBodyScroll(locked = false) {
  useEffect(() => {
    if (locked) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [locked]);
}
