'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { productApi } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { useDebounce } from '@/lib/hooks';

const SUGGESTIONS = [
  'Bridal necklace set', 'Gold jhumka', '22K ring', 'Temple jewellery',
  'Solitaire diamond', 'Kundan choker', 'Gold bangles', 'Men\'s kada',
  'Polki haaram', 'Pearl earrings', 'Rose gold chain', 'Wedding set',
];

const QUICK_CATS = [
  { label: '💍 Rings',       href: '/catalog/rings'     },
  { label: '✨ Earrings',    href: '/catalog/earrings'  },
  { label: '📿 Necklaces',   href: '/catalog/necklaces' },
  { label: '🔆 Bangles',     href: '/catalog/bangles'   },
  { label: '👑 Bridal Sets', href: '/catalog/bridal'    },
  { label: '🏅 Men\'s',      href: '/catalog/men'       },
];

export default function SearchPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const initialQ     = searchParams.get('q') || '';

  const [query,    setQuery]    = useState(initialQ);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [total,    setTotal]    = useState(0);
  const [sortBy,   setSortBy]   = useState('createdAt:desc');
  const inputRef   = useRef(null);

  const debounced = useDebounce(query, 400);

  // Search on debounce
  useEffect(() => {
    if (!debounced.trim()) { setProducts([]); setTotal(0); return; }

    const [field, order] = sortBy.split(':');
    setLoading(true);

    productApi.getAll({ search: debounced.trim(), limit: 24, sortBy: field, order })
      .then(({ data }) => {
        setProducts(data.data.products);
        setTotal(data.data.pagination.total);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

    // Update URL
    router.replace(`/search?q=${encodeURIComponent(debounced.trim())}`, { scroll: false });
  }, [debounced, sortBy]);

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  const clearSearch = () => { setQuery(''); setProducts([]); setTotal(0); inputRef.current?.focus(); };

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

        {/* Search bar */}
        <div className="mb-10">
          <div className="flex items-center border-2 border-gold/30 focus-within:border-gold bg-white/3 transition-all px-6 py-5 gap-4">
            <Search size={22} className="text-gold flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jewellery, collections, occasions…"
              className="flex-1 bg-transparent outline-none text-cream font-serif text-[20px] placeholder:text-fog/40"
            />
            {query && (
              <button onClick={clearSearch} className="text-fog hover:text-gold transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
          {/* Character count hint */}
          {query.length > 0 && query.length < 3 && (
            <p className="font-sans text-[11px] text-fog mt-2 ml-1">Type at least 3 characters to search…</p>
          )}
        </div>

        {/* Empty state — suggestions */}
        {!query && (
          <div className="space-y-10">
            <div>
              <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-5">Browse Categories</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {QUICK_CATS.map((cat) => (
                  <a key={cat.label} href={cat.href}
                    className="flex items-center justify-center gap-2 p-4 bg-charcoal border border-gold/12 hover:border-gold/40 font-sans text-[11px] text-cream hover:text-gold transition-all text-center">
                    {cat.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-5">Popular Searches</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="font-sans text-[11px] text-fog border border-gold/15 px-4 py-2 hover:text-gold hover:border-gold/40 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div>
            <div className="h-4 bg-charcoal rounded w-40 mb-6 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-charcoal border border-gold/10 animate-pulse">
                  <div className="aspect-[3/4] bg-carbon" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-carbon rounded w-3/4" />
                    <div className="h-3 bg-carbon rounded w-1/2" />
                    <div className="h-4 bg-carbon rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && query.trim().length >= 3 && (
          <>
            {/* Result header */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl text-cream">
                  {total > 0 ? (
                    <><span className="text-gold">{total}</span> results for <span className="italic">"{debounced}"</span></>
                  ) : (
                    <>No results for <span className="italic">"{debounced}"</span></>
                  )}
                </h2>
                {total > 0 && <p className="font-sans text-[11px] text-fog mt-1">Showing {Math.min(products.length, 24)} of {total} products</p>}
              </div>
              {total > 0 && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-charcoal border border-gold/20 focus:border-gold text-cream font-sans text-[11px] px-4 py-2.5 outline-none cursor-pointer"
                >
                  <option value="createdAt:desc">Newest First</option>
                  <option value="price:asc">Price: Low → High</option>
                  <option value="price:desc">Price: High → Low</option>
                  <option value="rating.average:desc">Top Rated</option>
                </select>
              )}
            </div>

            {/* No results */}
            {total === 0 && (
              <div className="text-center py-16">
                <div className="text-7xl mb-6 opacity-15">🔍</div>
                <h3 className="font-display text-3xl text-cream mb-3">No jewellery found</h3>
                <p className="font-serif text-[16px] italic text-fog mb-8 max-w-md mx-auto">
                  We couldn't find any jewellery matching "{debounced}". Try different keywords or browse our collections.
                </p>
                <div className="space-y-4">
                  <div className="font-sans text-[10px] tracking-[3px] uppercase text-gold mb-3">Try searching for</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.slice(0, 6).map((s) => (
                      <button key={s} onClick={() => setQuery(s)}
                        className="font-sans text-[11px] text-gold border border-gold/25 px-4 py-2 hover:bg-gold/10 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6">
                    <a href="/catalog" className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase text-fog hover:text-gold transition-colors">
                      Browse All Collections <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Products grid */}
            {total > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </motion.div>
            )}

            {/* Load more */}
            {total > products.length && (
              <div className="text-center mt-10">
                <a href={`/catalog?search=${encodeURIComponent(debounced)}`}
                  className="inline-flex items-center gap-2 border border-gold text-gold font-sans text-[11px] font-semibold tracking-[2px] uppercase px-10 py-4 hover:bg-gold/10 hover:-translate-y-0.5 transition-all">
                  View All {total} Results <ArrowRight size={14} />
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
