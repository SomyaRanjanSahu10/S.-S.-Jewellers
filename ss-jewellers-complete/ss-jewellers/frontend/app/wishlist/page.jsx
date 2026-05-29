'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export default function WishlistPage() {
  const { items, toggle }  = useWishlistStore();
  const addItem            = useCartStore((s) => s.addItem);

  const handleMoveToCart = (product) => {
    addItem(product);
    toggle(product);   // remove from wishlist
    toast.success(`Moved to cart: ${product.name.split(' ').slice(0, 3).join(' ')}`, { icon: '🛒' });
  };

  const handleRemove = (product) => {
    toggle(product);
    toast.success('Removed from wishlist', { icon: '🤍' });
  };

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`Added to cart: ${product.name.split(' ').slice(0, 3).join(' ')}`, { icon: '🛒' });
  };

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-2">Saved</div>
            <h1 className="font-display text-4xl text-cream">
              My Wishlist
              {items.length > 0 && (
                <span className="font-sans text-[16px] text-fog ml-3 font-normal">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              )}
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => {
                items.forEach((p) => addItem(p));
                toast.success(`Added all ${items.length} items to cart! 🛒`);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all"
            >
              <ShoppingBag size={14} /> Add All to Cart
            </button>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="relative mb-8">
              <div className="text-8xl opacity-10">🤍</div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart size={48} className="text-gold opacity-20" />
              </motion.div>
            </div>
            <h2 className="font-display text-3xl text-cream mb-3">Your Wishlist is Empty</h2>
            <p className="font-serif text-[16px] italic text-fog mb-8 max-w-md">
              Start saving your favourite pieces. When the moment is right, they'll be waiting for you.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all"
            >
              Explore Collections <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Wishlist grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {items.map((product, i) => {
                  const discPrice = product.discountPercent > 0
                    ? Math.round(product.price * (1 - product.discountPercent / 100))
                    : product.price;

                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, x: 20 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="group bg-charcoal border border-gold/12 hover:border-gold/40 transition-all hover:-translate-y-2 hover:shadow-dark-lg"
                    >
                      {/* Image */}
                      <Link href={`/product/${product.slug || product._id}`}>
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-[#1a1500] to-[#0d0900] flex items-center justify-center overflow-hidden">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="relative">
                              <div
                                className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full"
                                style={{ background: 'conic-gradient(from 0deg, transparent, rgba(201,168,76,0.1), transparent)', animation: 'spin 8s linear infinite' }}
                              />
                              <span className="text-7xl relative z-10 filter drop-shadow-[0_0_20px_rgba(201,168,76,0.4)] group-hover:scale-110 transition-transform duration-400 inline-block">
                                {product.icon || '💍'}
                              </span>
                            </div>
                          )}
                          {product.badge && (
                            <div className={`absolute top-3 left-3 font-sans text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-1 ${
                              product.badge === 'sale' ? 'bg-ruby text-white' : 'bg-gold text-obsidian'
                            }`}>
                              {product.badge}
                            </div>
                          )}
                          {/* Remove from wishlist */}
                          <button
                            onClick={(e) => { e.preventDefault(); handleRemove(product); }}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ruby/80 border border-ruby flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ruby"
                          >
                            <Heart size={14} fill="currentColor" />
                          </button>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-4">
                        <Link href={`/product/${product.slug || product._id}`}>
                          <h3 className="font-serif text-[15px] text-cream leading-snug mb-2 group-hover:text-gold-light transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex gap-3 mb-3">
                          <span className="font-sans text-[9px] tracking-[1px] uppercase text-fog">
                            <strong className="text-gold">{product.purity}</strong> Gold
                          </span>
                          <span className="font-sans text-[9px] tracking-[1px] uppercase text-fog">
                            <strong className="text-cream">{product.weight}g</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="font-display text-[16px] text-gold-light">{fmt(discPrice)}</span>
                          {product.discountPercent > 0 && (
                            <span className="font-sans text-[11px] text-fog line-through">{fmt(product.price)}</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <button
                            onClick={() => handleMoveToCart(product)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[10px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all"
                          >
                            <ShoppingBag size={12} /> Move to Cart
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 py-2.5 border border-gold/25 text-gold font-sans text-[9px] tracking-[1px] uppercase hover:bg-gold/10 transition-colors"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleRemove(product)}
                              className="w-10 flex items-center justify-center border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Recommendations strip */}
            <div className="mt-16 pt-12 border-t border-gold/10 text-center">
              <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-2">You Might Also Love</div>
              <h2 className="font-display text-3xl text-cream mb-6">Explore More</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'New Arrivals',  href: '/catalog?badge=new'        },
                  { label: 'Bestsellers',   href: '/catalog?badge=bestseller' },
                  { label: 'Bridal Sets',   href: '/catalog/bridal'           },
                  { label: 'Trending Now',  href: '/catalog?badge=trending'   },
                  { label: 'AI Stylist',    href: '/ai-stylist'               },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="font-sans text-[10px] tracking-[2px] uppercase text-gold border border-gold/25 px-5 py-2.5 hover:bg-gold/10 transition-colors"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
