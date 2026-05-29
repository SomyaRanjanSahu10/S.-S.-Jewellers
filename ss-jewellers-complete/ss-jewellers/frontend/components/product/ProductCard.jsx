'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import toast from 'react-hot-toast';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const BADGE_STYLES = {
  new:        'bg-gold text-obsidian',
  sale:       'bg-ruby text-white',
  trending:   'bg-emerald text-white',
  bestseller: 'bg-gold/90 text-obsidian',
};
const BADGE_LABELS = {
  new: 'New', sale: 'Sale', trending: 'Trending', bestseller: 'Best Seller',
};

// ── Single Product Card ───────────────────────────────────
export function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const addItem      = useCartStore((s) => s.addItem);
  const toggleWl     = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product._id));

  const handleCart = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`Added to cart: ${product.name.split(' ').slice(0, 3).join(' ')}`, {
      icon: '🛒',
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    const added = toggleWl(product);
    toast.success(added ? `Saved to wishlist` : `Removed from wishlist`, {
      icon: added ? '❤️' : '🤍',
    });
  };

  const discountedPrice = product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-charcoal border border-gold/10 hover:border-gold/40 transition-all duration-400 hover:-translate-y-2 hover:shadow-dark-lg"
    >
      <Link href={`/product/${product.slug || product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#1a1500] to-[#0d0900]">
          {/* Placeholder / actual image */}
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, rgba(201,168,76,0.15) 60deg, transparent 120deg)',
                  animation: 'spin 8s linear infinite',
                }}
              />
              <span className="text-7xl relative z-10 drop-shadow-[0_0_20px_rgba(201,168,76,0.4)] transition-transform duration-400 group-hover:scale-110">
                {product.icon || '💍'}
              </span>
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-3 left-3 px-2.5 py-1 font-sans text-[9px] font-bold tracking-[2px] uppercase ${BADGE_STYLES[product.badge] || BADGE_STYLES.new}`}>
              {BADGE_LABELS[product.badge] || product.badge}
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
              isWishlisted
                ? 'bg-ruby/80 border-ruby text-white'
                : 'bg-black/50 border-gold/30 text-cream hover:bg-gold/20 hover:border-gold'
            }`}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Hover overlay with actions */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex gap-2 w-full">
              <button
                onClick={handleCart}
                className="flex-1 flex items-center justify-center gap-2 bg-gold text-obsidian py-2.5 font-sans text-[10px] font-bold tracking-[1.5px] uppercase hover:bg-gold-light transition-colors"
              >
                <ShoppingBag size={12} /> Add to Cart
              </button>
              <div className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center text-cream hover:bg-white/20 transition-colors">
                <Eye size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-serif text-[15px] text-cream leading-snug mb-2 group-hover:text-gold-light transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex gap-3 mb-2.5">
            <span className="font-sans text-[9px] tracking-[1px] uppercase text-fog">
              <strong className="text-gold">{product.purity}</strong> Gold
            </span>
            <span className="font-sans text-[9px] tracking-[1px] uppercase text-fog">
              <strong className="text-cream">{product.weight}g</strong>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[16px] text-gold-light">{fmt(discountedPrice)}</span>
            {product.discountPercent > 0 && (
              <span className="font-sans text-[12px] text-fog line-through">{fmt(product.price)}</span>
            )}
            {/* Rating */}
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-gold text-[10px] tracking-wide">{'★'.repeat(Math.round(product.rating?.average || 4.5))}</span>
              <span className="font-sans text-[10px] text-fog">({product.rating?.count || 0})</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Product Grid ──────────────────────────────────────────
export function ProductGrid({ products = [], loading = false, cols = 4 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[cols] || gridCols[4]} gap-5`}>
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
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 opacity-20">💎</div>
        <p className="font-serif text-lg italic text-fog">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[cols] || gridCols[4]} gap-5`}>
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} index={i} />
      ))}
    </div>
  );
}
