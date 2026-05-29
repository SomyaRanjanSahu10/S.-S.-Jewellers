'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, ZoomIn, ChevronLeft, ChevronRight,
  Star, MessageCircle, Share2, Shield, RefreshCw, Truck, Award
} from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { productApi, reviewApi } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import toast from 'react-hot-toast';
import Link from 'next/link';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const SPECS_ICONS = {
  purity:  '⚗️', weight: '⚖️', metal: '🏅', stone: '💎',
  occasion:'🎉', gender: '👤',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router  = useRouter();
  const [product,     setProduct]     = useState(null);
  const [related,     setRelated]     = useState([]);
  const [reviews,     setReviews]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeImg,   setActiveImg]   = useState(0);
  const [zoomed,      setZoomed]      = useState(false);
  const [activeTab,   setActiveTab]   = useState('details');
  const [qty,         setQty]         = useState(1);
  const [reviewForm,  setReviewForm]  = useState({ rating: 5, title: '', body: '' });
  const [submitting,  setSubmitting]  = useState(false);

  const addItem      = useCartStore((s) => s.addItem);
  const toggleWl     = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?._id));

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      productApi.getById(id),
      productApi.getRelated(id).catch(() => ({ data: { data: { products: [] } } })),
      reviewApi.getForProduct(id).catch(() => ({ data: { data: { reviews: [] } } })),
    ]).then(([p, r, rv]) => {
      setProduct(p.data.data.product);
      setRelated(r.data.data.products);
      setReviews(rv.data.data.reviews);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      router.push('/catalog');
    });
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : [{ url: null, _id: 'placeholder' }];

  const discPrice = product.discountPercent > 0
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : product.price;

  const makingCharge  = Math.round(discPrice * ((product.makingChargePercent || 12) / 100));
  const gst           = Math.round((discPrice + makingCharge) * 0.03);
  const totalPerPiece = discPrice + makingCharge + gst;

  const handleAddToCart = () => {
    addItem({ ...product, price: discPrice }, qty);
    toast.success(`Added ${qty} × ${product.name.split(' ').slice(0, 3).join(' ')} to cart`, { icon: '🛒' });
  };

  const handleBuyNow = () => {
    addItem({ ...product, price: discPrice }, qty);
    router.push('/checkout');
  };

  const handleWishlist = () => {
    const added = toggleWl(product);
    toast.success(added ? 'Saved to wishlist ❤️' : 'Removed from wishlist');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewApi.create({ product: product._id, ...reviewForm });
      toast.success('Review submitted! It will appear after approval.');
      setReviewForm({ rating: 5, title: '', body: '' });
    } catch {
      toast.error('Please log in to leave a review.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase text-fog mb-10">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-ash">›</span>
          <Link href="/catalog" className="hover:text-gold transition-colors">Collections</Link>
          <span className="text-ash">›</span>
          <span className="text-cream">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

          {/* ── Gallery ──────────────────────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative aspect-square bg-gradient-to-br from-[#1a1500] via-[#2d2200] to-[#0d0900] overflow-hidden border border-gold/10 cursor-zoom-in group"
              onClick={() => setZoomed(true)}
            >
              {images[activeImg]?.url ? (
                <img
                  src={images[activeImg].url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border border-gold/20 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-0 w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full border border-gold/15 animate-[spin_15s_linear_infinite_reverse]" />
                    <span className="text-[120px] drop-shadow-[0_0_40px_rgba(201,168,76,0.6)] relative z-10">
                      {product.icon || '💍'}
                    </span>
                  </div>
                </div>
              )}
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={16} className="text-gold" />
              </div>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImg((a) => (a - 1 + images.length) % images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border border-gold/25 flex items-center justify-center text-cream hover:text-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImg((a) => (a + 1) % images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border border-gold/25 flex items-center justify-center text-cream hover:text-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img._id || i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-all ${
                      i === activeImg ? 'border-gold' : 'border-gold/15 hover:border-gold/40'
                    } bg-gradient-to-br from-[#1a1500] to-[#2d2200] flex items-center justify-center text-2xl`}
                  >
                    {img.url ? <img src={img.url} alt="" className="w-full h-full object-cover" /> : (product.icon || '💍')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ───────────────────────────────────── */}
          <div className="space-y-6">
            {/* Badge + category */}
            <div className="flex items-center gap-3">
              <span className="font-sans text-[9px] tracking-[3px] uppercase text-gold bg-gold/10 border border-gold/25 px-3 py-1.5">
                {product.purity} Gold · BIS Hallmarked
              </span>
              {product.badge && (
                <span className="font-sans text-[9px] tracking-[2px] uppercase bg-ruby text-white px-3 py-1.5">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-display text-4xl lg:text-5xl text-cream leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(product.rating?.average || 4.5) ? 'text-gold fill-gold' : 'text-ash'}
                  />
                ))}
              </div>
              <span className="font-sans text-[12px] text-fog">
                {product.rating?.average || 4.5} · {product.rating?.count || reviews.length} reviews
              </span>
            </div>

            {/* Price breakdown */}
            <div className="bg-charcoal border border-gold/15 p-5 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl text-gold-light">{fmt(discPrice)}</span>
                {product.discountPercent > 0 && (
                  <>
                    <span className="font-sans text-[16px] text-fog line-through">{fmt(product.price)}</span>
                    <span className="font-sans text-[12px] text-emerald-400 font-semibold">{product.discountPercent}% off</span>
                  </>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gold/10">
                {[
                  { label: 'Gold Price', value: fmt(discPrice) },
                  { label: 'Making (12%)', value: fmt(makingCharge) },
                  { label: 'GST (3%)', value: fmt(gst) },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display text-[14px] text-gold-light">{s.value}</div>
                    <div className="font-sans text-[9px] tracking-[1px] uppercase text-fog mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gold/10">
                <span className="font-sans text-[11px] tracking-[1px] uppercase text-fog">Total per piece</span>
                <span className="font-display text-[18px] text-cream">{fmt(totalPerPiece)}</span>
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Purity',   value: product.purity },
                { label: 'Weight',   value: `${product.weight}g` },
                { label: 'Metal',    value: product.metal || 'Gold' },
                { label: 'Gender',   value: product.gender || 'Women' },
                ...(product.stone ? [{ label: 'Stone', value: product.stone }] : []),
                ...(product.stoneWeight ? [{ label: 'Stone Wt', value: `${product.stoneWeight} ct` }] : []),
              ].map((s) => (
                <div key={s.label} className="bg-white/3 border border-gold/8 p-3">
                  <div className="font-sans text-[9px] tracking-[2px] uppercase text-gold mb-1">{s.label}</div>
                  <div className="font-serif text-[15px] text-cream capitalize">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Qty + CTA */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="font-sans text-[10px] tracking-[2px] uppercase text-gold">Quantity</label>
                <div className="flex items-center border border-gold/25">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-cream hover:text-gold hover:bg-gold/10 transition-colors font-bold text-lg">−</button>
                  <span className="w-12 text-center font-sans text-[14px] text-cream border-x border-gold/25 h-10 flex items-center justify-center">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center text-cream hover:text-gold hover:bg-gold/10 transition-colors font-bold text-lg">+</button>
                </div>
                <span className="font-sans text-[10px] text-fog">{product.stock} in stock</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-4 border border-gold text-gold font-sans text-[11px] font-bold tracking-[2px] uppercase hover:bg-gold/10 transition-all"
                >
                  <ShoppingBag size={15} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all"
                >
                  Buy Now →
                </button>
                <button
                  onClick={handleWishlist}
                  className={`w-14 flex items-center justify-center border transition-all ${
                    isWishlisted ? 'border-ruby bg-ruby/20 text-red-400' : 'border-gold/25 text-fog hover:text-gold hover:border-gold'
                  }`}
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
              {/* WhatsApp inquiry */}
              <a
                href={`https://wa.me/914023456789?text=Hi! I'm interested in *${encodeURIComponent(product.name)}* priced at ₹${discPrice.toLocaleString('en-IN')}. SKU: ${product.sku || id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-[#25D366]/30 text-[#25D366] font-sans text-[11px] tracking-[2px] uppercase hover:bg-[#25D366]/10 transition-colors"
              >
                <MessageCircle size={14} /> Enquire on WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: <Shield size={16} />, label: 'BIS Hallmarked', sub: 'Certified purity' },
                { icon: <RefreshCw size={16} />, label: 'Lifetime Exchange', sub: 'Buy-back guarantee' },
                { icon: <Truck size={16} />, label: 'Free Shipping', sub: 'Insured delivery' },
                { icon: <Award size={16} />, label: '37 Years Trust', sub: 'Est. 1987' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-3 bg-white/2 border border-gold/8 p-3">
                  <span className="text-gold">{b.icon}</span>
                  <div>
                    <div className="font-sans text-[11px] font-semibold text-cream">{b.label}</div>
                    <div className="font-sans text-[10px] text-fog">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description | Specs | Reviews ────────── */}
        <div className="mb-20">
          <div className="flex border-b border-gold/15 mb-8 overflow-x-auto">
            {['details', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-sans text-[11px] tracking-[2px] uppercase border-b-2 -mb-px whitespace-nowrap transition-all ${
                  activeTab === tab ? 'border-gold text-gold' : 'border-transparent text-fog hover:text-cream'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="max-w-3xl">
                  <p className="font-serif text-[17px] text-cream/80 leading-[1.9] mb-6">{product.description}</p>
                  {product.shortDesc && (
                    <p className="font-serif text-[15px] font-style-italic text-fog leading-[1.8]">{product.shortDesc}</p>
                  )}
                  {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {product.tags.map((t) => (
                        <span key={t} className="font-sans text-[10px] tracking-[1px] uppercase text-gold bg-gold/8 border border-gold/20 px-3 py-1.5">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'specifications' && (
              <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="max-w-2xl space-y-0">
                  {[
                    ['Product Name',   product.name],
                    ['Gold Purity',    product.purity],
                    ['Net Weight',     `${product.weight} grams`],
                    ['Metal',          (product.metal || 'Gold').toUpperCase()],
                    ['Making Charges', `${product.makingChargePercent || 12}%`],
                    ['Stone',          product.stone || 'None'],
                    ['Stone Weight',   product.stoneWeight ? `${product.stoneWeight} carats` : 'N/A'],
                    ['Occasion',       product.occasion?.join(', ') || 'All Occasions'],
                    ['Gender',         (product.gender || 'Women').charAt(0).toUpperCase() + (product.gender || 'women').slice(1)],
                    ['SKU',            product.sku || 'N/A'],
                    ['Certification',  'BIS Hallmarked'],
                    ['Warranty',       'Lifetime Exchange Guarantee'],
                  ].map(([key, val], i) => (
                    <div key={key} className={`flex py-3.5 px-4 ${i % 2 === 0 ? 'bg-white/2' : ''} border-b border-gold/8`}>
                      <span className="font-sans text-[11px] tracking-[1px] uppercase text-fog w-44 flex-shrink-0">{key}</span>
                      <span className="font-serif text-[15px] text-cream">{val || '—'}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                  {/* Review list */}
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <p className="font-serif text-[16px] italic text-fog">Be the first to review this product.</p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r._id} className="bg-charcoal border border-gold/12 p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center font-display text-obsidian font-bold">
                                {r.user?.name?.[0] || '?'}
                              </div>
                              <div>
                                <div className="font-sans text-[13px] font-semibold text-cream">{r.user?.name || 'Customer'}</div>
                                {r.isVerifiedPurchase && (
                                  <div className="font-sans text-[9px] tracking-[1px] uppercase text-emerald-400">✓ Verified Purchase</div>
                                )}
                              </div>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} className={i < r.rating ? 'text-gold fill-gold' : 'text-ash'} />
                              ))}
                            </div>
                          </div>
                          <h4 className="font-serif text-[16px] text-cream mb-2">{r.title}</h4>
                          <p className="font-serif text-[14px] text-fog leading-relaxed">{r.body}</p>
                          <p className="font-sans text-[10px] text-ash mt-3">
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Write review */}
                  <div className="bg-charcoal border border-gold/15 p-6 h-fit">
                    <h3 className="font-display text-[18px] text-cream mb-5">Write a Review</h3>
                    <form onSubmit={handleReview} className="space-y-4">
                      <div>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm((f) => ({ ...f, rating: star }))}
                              className="transition-transform hover:scale-125"
                            >
                              <Star size={24} className={star <= reviewForm.rating ? 'text-gold fill-gold' : 'text-ash'} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Title</label>
                        <input
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                          placeholder="Summarise your experience"
                          required
                          className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Review</label>
                        <textarea
                          value={reviewForm.body}
                          onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
                          placeholder="Tell others about your experience with this product..."
                          rows={4}
                          required
                          className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase disabled:opacity-60"
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Related Products ────────────────────────────── */}
        {related.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-2">You May Also Like</div>
              <h2 className="font-display text-4xl text-cream">Related Pieces</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Zoom Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <button className="absolute top-6 right-6 text-fog hover:text-gold transition-colors">✕</button>
            <div className="max-w-2xl w-full max-h-[90vh]">
              {images[activeImg]?.url ? (
                <img src={images[activeImg].url} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <span className="text-[150px] drop-shadow-[0_0_50px_rgba(201,168,76,0.6)]">{product.icon || '💍'}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <div className="aspect-square bg-charcoal animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="w-20 h-20 bg-charcoal animate-pulse" />)}
            </div>
          </div>
          <div className="space-y-5">
            {[60, 40, 20, 80, 60, 40, 100, 60].map((w, i) => (
              <div key={i} className={`h-5 bg-charcoal animate-pulse rounded`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
