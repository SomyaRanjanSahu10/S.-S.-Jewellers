'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/lib/store';

/* ── Live Gold Ticker ────────────────────────────────── */
const GOLD_DATA = [
  { label: '22K Gold (10g)',  price: '₹62,450', change: '+0.8%', up: true  },
  { label: '24K Gold (10g)',  price: '₹68,200', change: '+1.1%', up: true  },
  { label: 'Silver (1kg)',    price: '₹84,500', change: '-0.3%', up: false },
  { label: 'Platinum (10g)', price: '₹32,800', change: '+0.5%', up: true  },
];

export function GoldTicker() {
  const items = [...GOLD_DATA, ...GOLD_DATA]; // duplicate for seamless loop
  return (
    <div
      className="overflow-hidden py-3"
      style={{ background: 'linear-gradient(135deg, #8B6914, #C9A84C, #E8CC7A, #C9A84C, #8B6914)' }}
    >
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: 'ticker 28s linear infinite' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 font-sans text-[11px] font-semibold text-obsidian flex-shrink-0"
          >
            <span className="text-base">🟡</span>
            <strong className="text-[13px]">{item.label}</strong>
            <span>{item.price}</span>
            <span className={item.up ? 'text-[#1a4a2a]' : 'text-[#5a1a1a]'}>
              {item.change} {item.up ? '▲' : '▼'}
            </span>
            <span className="opacity-25 text-[18px]">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Search Modal ────────────────────────────────────── */
const QUICK_LINKS = [
  { label: 'Bridal Sets',      href: '/catalog/bridal'           },
  { label: 'Gold Necklaces',   href: '/catalog/necklaces'        },
  { label: 'Diamond Rings',    href: '/catalog/rings'            },
  { label: 'Gold Earrings',    href: '/catalog/earrings'         },
  { label: 'Men\'s Jewellery', href: '/catalog/men'              },
  { label: 'New Arrivals',     href: '/catalog?badge=new'        },
];

const TRENDING = [
  'Kundan necklace',
  'Bridal set 22K',
  'Solitaire ring',
  'Gold jhumka',
  'Diamond bracelet',
];

export function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState([]);

  // Close on escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeSearch(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeSearch]);

  // Reset on close
  useEffect(() => { if (!searchOpen) { setQuery(''); setResults([]); } }, [searchOpen]);

  const handleSearch = (q) => {
    if (q) window.location.href = `/catalog?search=${encodeURIComponent(q)}`;
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={closeSearch}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 right-0 z-50 bg-charcoal border-b border-gold/20 p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="max-w-[760px] mx-auto">
              {/* Search input */}
              <div className="flex items-center gap-3 border border-gold/30 focus-within:border-gold bg-white/4 transition-colors px-5 py-4 mb-6">
                <Search size={20} className="text-gold flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder="Search for jewellery, collections, occasions..."
                  className="flex-1 bg-transparent outline-none text-cream font-sans text-[15px] placeholder:text-fog/60"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-fog hover:text-gold transition-colors">
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleSearch(query)}
                  className="px-4 py-2 bg-gold text-obsidian font-sans text-[10px] font-bold tracking-[2px] uppercase hover:bg-gold-light transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Trending searches */}
              <div className="mb-6">
                <div className="flex items-center gap-2 font-sans text-[9px] tracking-[3px] uppercase text-gold mb-3">
                  <TrendingUp size={11} /> Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleSearch(t)}
                      className="font-sans text-[11px] text-fog border border-gold/15 px-3 py-1.5 hover:text-gold hover:border-gold/40 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div>
                <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-3">Quick Links</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={closeSearch}
                      className="flex items-center justify-between p-3 border border-gold/10 hover:border-gold/35 hover:bg-white/3 transition-all group"
                    >
                      <span className="font-sans text-[12px] text-cream group-hover:text-gold transition-colors">{link.label}</span>
                      <ArrowRight size={12} className="text-fog group-hover:text-gold transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default GoldTicker;
