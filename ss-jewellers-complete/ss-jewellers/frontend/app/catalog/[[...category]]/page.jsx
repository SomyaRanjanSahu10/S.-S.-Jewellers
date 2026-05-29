'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { productApi } from '@/lib/api';
import { ProductGrid } from '@/components/product/ProductCard';

const CATEGORIES = [
  { slug: 'rings',     label: '💍 Rings' },
  { slug: 'earrings',  label: '✨ Earrings' },
  { slug: 'necklaces', label: '📿 Necklaces' },
  { slug: 'bangles',   label: '🔆 Bangles' },
  { slug: 'chains',    label: '⛓ Chains' },
  { slug: 'bridal',    label: '👑 Bridal Sets' },
  { slug: 'men',       label: '🏅 Men\'s' },
];
const PURITIES  = ['18K', '22K', '24K'];
const SORT_OPTS = [
  { value: 'createdAt:desc',        label: 'Newest First' },
  { value: 'price:asc',             label: 'Price: Low → High' },
  { value: 'price:desc',            label: 'Price: High → Low' },
  { value: 'rating.average:desc',   label: 'Top Rated' },
  { value: 'isFeatured:desc',       label: 'Featured' },
];
const PRICE_RANGES = [
  { label: 'Under ₹25,000',       min: 0,       max: 25000 },
  { label: '₹25,000 – ₹50,000',   min: 25000,   max: 50000 },
  { label: '₹50,000 – ₹1,00,000', min: 50000,   max: 100000 },
  { label: '₹1L – ₹5L',           min: 100000,  max: 500000 },
  { label: 'Above ₹5L',           min: 500000,  max: 99999999 },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gold/10 pb-5 mb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full font-sans text-[10px] tracking-[3px] uppercase text-gold mb-3"
      >
        {title}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CatalogPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const categorySlug = params?.category || searchParams.get('category') || 'all';

  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [pagination,   setPagination]   = useState({ page: 1, pages: 1, total: 0 });
  const [filterOpen,   setFilterOpen]   = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    category:  categorySlug === 'all' ? '' : categorySlug,
    purity:    searchParams.get('purity') || '',
    minPrice:  '',
    maxPrice:  '',
    isBridal:  searchParams.get('isBridal') || '',
    isFeatured:searchParams.get('featured') || '',
    badge:     searchParams.get('badge') || '',
    search:    searchParams.get('search') || '',
    sortBy:    'createdAt',
    order:     'desc',
    page:      1,
  });

  const CATEGORY_TITLES = {
    all:      { title: 'All Collections',     sub: 'Discover our complete gold jewellery range' },
    rings:    { title: 'Gold Rings',          sub: 'Solitaires, traditional & contemporary designs' },
    earrings: { title: 'Gold Earrings',       sub: 'Jhumkas, studs, chandbalis & drops' },
    necklaces:{ title: 'Gold Necklaces',      sub: 'Temple, haaram, choker & layered necklaces' },
    bangles:  { title: 'Bangles & Kadas',     sub: 'Gold bangles, kadas & bracelets' },
    chains:   { title: 'Gold Chains',         sub: 'Rope, box, Cuban & designer chains' },
    bridal:   { title: 'Bridal Collections',  sub: 'Complete sets for your most special day' },
    men:      { title: 'Men\'s Jewellery',    sub: 'Bold gold jewellery crafted for him' },
  };
  const pageInfo = CATEGORY_TITLES[categorySlug] || CATEGORY_TITLES.all;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        limit: 12,
        ...(filters.sortBy && { sortBy: filters.sortBy, order: filters.order }),
      };
      // Remove empty values
      Object.keys(params).forEach((k) => { if (params[k] === '' || params[k] === null) delete params[k]; });
      const { data } = await productApi.getAll(params);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const setPriceRange = (range) => {
    setFilters((f) => ({ ...f, minPrice: range.min || '', maxPrice: range.max === 99999999 ? '' : range.max || '', page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: '', purity: '', minPrice: '', maxPrice: '', isBridal: '', isFeatured: '', badge: '', search: '', sortBy: 'createdAt', order: 'desc', page: 1 });
  };

  const handleSort = (val) => {
    const [sortBy, order] = val.split(':');
    setFilters((f) => ({ ...f, sortBy, order, page: 1 }));
  };

  const activeFiltersCount = [filters.purity, filters.minPrice, filters.badge, filters.isBridal].filter(Boolean).length;

  const FilterSidebar = () => (
    <aside className="w-full lg:w-56 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <span className="font-display text-[16px] text-cream">Filters</span>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="font-sans text-[9px] tracking-[1px] uppercase text-gold hover:text-gold-light transition-colors">
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      <FilterSection title="Category">
        <div className="space-y-1">
          <button
            onClick={() => setFilter('category', '')}
            className={`w-full text-left font-sans text-[12px] py-1.5 px-2 transition-colors ${!filters.category ? 'text-gold bg-gold/8' : 'text-fog hover:text-cream'}`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setFilter('category', cat.slug)}
              className={`w-full text-left font-sans text-[12px] py-1.5 px-2 transition-colors ${filters.category === cat.slug ? 'text-gold bg-gold/8' : 'text-fog hover:text-cream'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gold Purity">
        <div className="space-y-2">
          {PURITIES.map((p) => (
            <label key={p} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.purity === p}
                onChange={() => setFilter('purity', filters.purity === p ? '' : p)}
                className="accent-gold w-3.5 h-3.5"
              />
              <span className={`font-sans text-[12px] transition-colors ${filters.purity === p ? 'text-gold' : 'text-fog group-hover:text-cream'}`}>
                {p} Gold
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => setPriceRange(range)}
              className={`w-full text-left font-sans text-[11px] py-1.5 px-2 transition-colors ${
                filters.minPrice === String(range.min) ? 'text-gold bg-gold/8' : 'text-fog hover:text-cream'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Occasion" defaultOpen={false}>
        <div className="space-y-1">
          {['Bridal', 'Wedding', 'Daily Wear', 'Festive', 'Office'].map((occ) => (
            <button
              key={occ}
              className="w-full text-left font-sans text-[12px] py-1.5 px-2 text-fog hover:text-cream transition-colors"
            >
              {occ}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Special" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { key: 'isBridal', label: 'Bridal Collection' },
            { key: 'isFeatured', label: 'Featured Items' },
          ].map((f) => (
            <label key={f.key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!filters[f.key]}
                onChange={() => setFilter(f.key, filters[f.key] ? '' : 'true')}
                className="accent-gold w-3.5 h-3.5"
              />
              <span className="font-sans text-[12px] text-fog group-hover:text-cream transition-colors">{f.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">

      {/* Page Header */}
      <div className="bg-charcoal border-b border-gold/15 py-12 mb-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <nav className="flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase text-fog mb-4">
            <button onClick={() => router.push('/')} className="hover:text-gold transition-colors">Home</button>
            <span>›</span>
            <span className="text-cream">{pageInfo.title}</span>
          </nav>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display text-4xl lg:text-5xl text-cream mb-2">{pageInfo.title}</h1>
              <p className="font-serif text-[16px] italic text-fog">{pageInfo.sub}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gold/25 text-gold font-sans text-[11px] tracking-[1px] uppercase"
              >
                <SlidersHorizontal size={14} />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
              {/* Sort */}
              <select
                value={`${filters.sortBy}:${filters.order}`}
                onChange={(e) => handleSort(e.target.value)}
                className="bg-charcoal border border-gold/20 focus:border-gold text-cream font-sans text-[11px] tracking-wide px-4 py-2.5 outline-none cursor-pointer"
              >
                {SORT_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="font-sans text-[11px] text-fog hidden sm:block">
                {pagination.total} products
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex gap-10">
          {/* Desktop filter sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.purity && (
                  <span className="flex items-center gap-1.5 bg-gold/10 border border-gold/25 text-gold font-sans text-[10px] tracking-[1px] uppercase px-3 py-1.5">
                    {filters.purity} <button onClick={() => setFilter('purity', '')}><X size={10} /></button>
                  </span>
                )}
                {filters.badge && (
                  <span className="flex items-center gap-1.5 bg-gold/10 border border-gold/25 text-gold font-sans text-[10px] tracking-[1px] uppercase px-3 py-1.5">
                    {filters.badge} <button onClick={() => setFilter('badge', '')}><X size={10} /></button>
                  </span>
                )}
                {filters.minPrice && (
                  <span className="flex items-center gap-1.5 bg-gold/10 border border-gold/25 text-gold font-sans text-[10px] tracking-[1px] uppercase px-3 py-1.5">
                    Price filter <button onClick={() => { setFilter('minPrice', ''); setFilter('maxPrice', ''); }}><X size={10} /></button>
                  </span>
                )}
              </div>
            )}

            <ProductGrid products={products} loading={loading} cols={3} />

            {/* Pagination */}
            {!loading && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, f.page - 1) }))}
                  disabled={filters.page === 1}
                  className="w-10 h-10 border border-gold/20 text-fog hover:text-gold hover:border-gold disabled:opacity-30 flex items-center justify-center transition-all"
                >
                  ‹
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters((f) => ({ ...f, page: p }))}
                    className={`w-10 h-10 font-sans text-[12px] border transition-all ${
                      p === filters.page
                        ? 'bg-gold text-obsidian border-gold font-bold'
                        : 'border-gold/20 text-fog hover:text-gold hover:border-gold'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setFilters((f) => ({ ...f, page: Math.min(pagination.pages, f.page + 1) }))}
                  disabled={filters.page === pagination.pages}
                  className="w-10 h-10 border border-gold/20 text-fog hover:text-gold hover:border-gold disabled:opacity-30 flex items-center justify-center transition-all"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="fixed top-0 left-0 w-80 h-full bg-charcoal border-r border-gold/20 z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-[18px] text-cream">Filters</span>
                <button onClick={() => setFilterOpen(false)} className="text-fog hover:text-gold"><X size={18} /></button>
              </div>
              <FilterSidebar />
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-3.5 mt-4 bg-gold text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
