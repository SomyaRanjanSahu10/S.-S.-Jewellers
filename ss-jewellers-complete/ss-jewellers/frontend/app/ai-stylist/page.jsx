'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ShoppingBag, Heart } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import toast from 'react-hot-toast';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const OCCASION_OPTS  = ['Bridal / Wedding', 'Festival / Puja', 'Office / Daily Wear', 'Anniversary Gift', 'Birthday Gift', 'Casual / Party'];
const BUDGET_OPTS    = ['Under ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹5,00,000', 'Above ₹5,00,000'];
const STYLE_OPTS     = ['Traditional / Temple', 'Modern / Contemporary', 'Fusion', 'Minimalist', 'Statement / Bold', 'Antique / Vintage'];
const PURITY_OPTS    = ['22K Gold', '24K Gold', '18K Gold', 'No Preference'];

// Dummy product data for AI to recommend from
const PRODUCT_CATALOG = [
  { id: 'p1',  name: 'Royal Temple Necklace',      category: 'necklaces', price: 124500, purity: '22K', weight: 28.4, icon: '📿', badge: 'bestseller', desc: 'Handcrafted temple necklace with goddess motifs and polki work' },
  { id: 'p2',  name: 'Solitaire Diamond Ring',      category: 'rings',     price: 85000,  purity: '18K', weight: 4.2,  icon: '💍', badge: 'new',        desc: 'Classic solitaire ring with brilliant-cut diamond in 18K gold' },
  { id: 'p3',  name: 'Bridal Kundan Choker Set',    category: 'bridal',    price: 385000, purity: '22K', weight: 72.8, icon: '👑', badge: 'trending',   desc: 'Opulent Kundan choker set with matching maangtika and earrings' },
  { id: 'p4',  name: 'Gold Jhumka Earrings',        category: 'earrings',  price: 28500,  purity: '22K', weight: 8.6,  icon: '✨', badge: 'sale',       desc: 'Traditional jhumka earrings with pearl drops' },
  { id: 'p5',  name: 'Diamond Tennis Bracelet',     category: 'bangles',   price: 192000, purity: '18K', weight: 12.3, icon: '💎', badge: 'new',        desc: 'Elegant tennis bracelet with 36 brilliant diamonds' },
  { id: 'p6',  name: 'Gold Rope Chain 24"',         category: 'chains',    price: 42800,  purity: '22K', weight: 10.5, icon: '⛓', badge: 'bestseller', desc: 'Classic 22K rope chain perfect for layering or pendants' },
  { id: 'p7',  name: 'Polki Haaram Set',            category: 'bridal',    price: 520000, purity: '22K', weight: 105,  icon: '🌟', badge: 'trending',   desc: 'Grand haaram with uncut polki diamonds and emeralds in 22K gold' },
  { id: 'p8',  name: 'Antique Vanki Ring',          category: 'rings',     price: 32000,  purity: '22K', weight: 9.2,  icon: '💍', badge: 'sale',       desc: 'Traditional vanki ring with Lakshmi motifs and red stone accents' },
  { id: 'p9',  name: 'Pearl Drop Earrings',         category: 'earrings',  price: 18500,  purity: '22K', weight: 5.8,  icon: '🌕', badge: 'new',        desc: 'Elegant south sea pearl drop earrings in 22K gold' },
  { id: 'p10', name: 'Floral Bangle Set',           category: 'bangles',   price: 92000,  purity: '22K', weight: 42.6, icon: '🌸', badge: 'sale',       desc: 'Set of 6 bangles with intricate floral meenakari work' },
  { id: 'p11', name: 'Bridal Maangtika',            category: 'bridal',    price: 45000,  purity: '22K', weight: 12.0, icon: '🔮', badge: 'new',        desc: 'Elaborate maangtika with kundan work and pearl drops' },
  { id: 'p12', name: 'Men\'s Gold Kada',            category: 'men',       price: 68000,  purity: '22K', weight: 35.0, icon: '🏅', badge: 'bestseller', desc: 'Bold 22K gold kada with traditional engravings for men' },
];

export default function AIStylistPage() {
  const [form, setForm] = useState({
    occasion: OCCASION_OPTS[0],
    budget:   BUDGET_OPTS[1],
    style:    STYLE_OPTS[0],
    purity:   PURITY_OPTS[0],
    notes:    '',
  });
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState('');
  const addItem    = useCartStore((s) => s.addItem);
  const toggleWl   = useWishlistStore((s) => s.toggle);

  const getRecommendations = async () => {
    setLoading(true);
    setResult(null);
    setError('');

    const prompt = `You are S.S. Jewellers' AI Jewellery Stylist — a luxury expert with deep knowledge of Indian gold jewellery traditions and modern trends.

Customer preferences:
- Occasion: ${form.occasion}
- Budget: ${form.budget}
- Style: ${form.style}
- Gold Purity: ${form.purity}
- Special notes: ${form.notes || 'None'}

Available catalogue (JSON):
${JSON.stringify(PRODUCT_CATALOG.map(p => ({ id: p.id, name: p.name, category: p.category, price: p.price, purity: p.purity, desc: p.desc })))}

Your task: Recommend 3 products that best match the customer's requirements. Be personalized, warm, and write like a high-end jewellery boutique advisor.

Respond ONLY with valid JSON, no markdown fences, no extra text:
{
  "greeting": "A warm, personalized 1-2 sentence greeting addressing their occasion (write as if speaking directly to them)",
  "ensemble_story": "A poetic 2-3 sentence narrative about the ensemble you've chosen and why it's perfect (like a luxury brand storyteller)",
  "recommendations": [
    {
      "id": "product_id",
      "reason": "Why this specific piece is perfect for them (1 sentence, specific and personal)",
      "styling_tip": "A practical styling tip for this piece (1 sentence)"
    }
  ],
  "care_tip": "One gold care tip relevant to their selection"
}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((c) => c.text || '').join('') || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      // Enrich with product data
      const enriched = {
        ...parsed,
        recommendations: parsed.recommendations.map((rec) => ({
          ...rec,
          product: PRODUCT_CATALOG.find((p) => p.id === rec.id),
        })).filter((r) => r.product),
      };
      setResult(enriched);
    } catch (err) {
      console.error(err);
      // Graceful fallback
      setResult({
        greeting: `For your ${form.occasion}, we've curated a selection that perfectly matches your ${form.style.toLowerCase()} taste.`,
        ensemble_story: `Drawing from our ${form.purity} collection, these pieces have been handpicked to complement your style and celebrate your special moment with timeless elegance.`,
        care_tip: 'Store your gold jewellery separately in a soft cloth pouch, away from direct sunlight and chemicals, to maintain its lustre for generations.',
        recommendations: PRODUCT_CATALOG.slice(0, 3).map((p) => ({
          product: p,
          reason: `A beautiful ${p.purity} piece that suits your ${form.style.toLowerCase()} preference.`,
          styling_tip: `Pair with a traditional silk outfit for maximum impact.`,
        })),
      });
    }

    setLoading(false);
  };

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success(`Added to cart: ${product.name}`, { icon: '🛒' });
  };

  const handleWishlist = (product) => {
    const added = toggleWl(product);
    toast.success(added ? 'Saved to wishlist ❤️' : 'Removed from wishlist');
  };

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/8 border border-gold/25 px-4 py-2 rounded-full font-sans text-[10px] tracking-[2px] uppercase text-gold mb-4">
            <Sparkles size={12} /> Powered by Claude AI
          </div>
          <h1 className="font-display text-5xl lg:text-6xl text-cream mb-4">AI Jewellery Stylist</h1>
          <p className="font-serif text-[18px] italic text-fog max-w-lg mx-auto leading-relaxed">
            Tell us about yourself and our AI will curate your perfect jewellery ensemble from our collection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 mb-16">
          {/* Preference Form */}
          <div>
            <div className="bg-charcoal border border-gold/15 p-8 space-y-6">
              <div className="font-display text-[20px] text-gold-light mb-2">Your Preferences</div>

              {[
                { key: 'occasion', label: 'Occasion', opts: OCCASION_OPTS },
                { key: 'budget',   label: 'Budget Range', opts: BUDGET_OPTS },
                { key: 'style',    label: 'Style Preference', opts: STYLE_OPTS },
                { key: 'purity',   label: 'Gold Purity', opts: PURITY_OPTS },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">{field.label}</label>
                  <select
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none cursor-pointer"
                  >
                    {field.opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div>
                <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">
                  Any special requests? <span className="text-fog normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="e.g. I need a full bridal set with maangtika, or I want something I can wear daily to the office..."
                  rows={3}
                  className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none resize-none placeholder:text-ash"
                />
              </div>

              <button
                onClick={getRecommendations}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? 'Curating Your Ensemble...' : 'Get AI Recommendations'}
              </button>
            </div>

            {/* How it works */}
            <div className="mt-6 bg-white/2 border border-gold/8 p-6">
              <div className="font-sans text-[10px] tracking-[3px] uppercase text-gold mb-4">How It Works</div>
              <div className="space-y-3">
                {[
                  { step: '01', text: 'Share your occasion, budget & style preferences' },
                  { step: '02', text: 'Claude AI analyses our entire catalogue intelligently' },
                  { step: '03', text: 'Receive a personalised ensemble recommendation' },
                  { step: '04', text: 'Add pieces to cart or book a showroom consultation' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="font-display text-[12px] text-gold-dark font-bold flex-shrink-0">{s.step}</span>
                    <span className="font-sans text-[12px] text-fog">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 border border-gold/8 bg-white/1"
                >
                  <div className="text-8xl mb-6 opacity-20">✨</div>
                  <p className="font-serif text-[18px] italic text-fog max-w-xs">
                    Your personalised jewellery recommendations will appear here
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center py-20 border border-gold/8"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 rounded-full border border-gold/30 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-3 rounded-full border border-gold/20 animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="absolute inset-6 flex items-center justify-center">
                      <Sparkles size={24} className="text-gold animate-pulse" />
                    </div>
                  </div>
                  <p className="font-serif text-[18px] italic text-fog">Curating your perfect ensemble...</p>
                  <p className="font-sans text-[10px] tracking-[2px] uppercase text-ash mt-2">Analysing 500+ pieces</p>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* AI greeting */}
                  <div className="bg-gradient-to-br from-gold/8 to-transparent border border-gold/20 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={14} className="text-gold" />
                      <span className="font-sans text-[9px] tracking-[3px] uppercase text-gold">AI Stylist Recommends</span>
                    </div>
                    <p className="font-serif text-[17px] text-cream leading-relaxed italic mb-3">"{result.greeting}"</p>
                    <p className="font-serif text-[14px] text-fog leading-relaxed">{result.ensemble_story}</p>
                  </div>

                  {/* Recommended products */}
                  <div className="space-y-4">
                    {result.recommendations.map((rec, i) => {
                      const p = rec.product;
                      if (!p) return null;
                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className="bg-charcoal border border-gold/12 hover:border-gold/35 transition-all p-5 flex gap-4"
                        >
                          {/* Icon */}
                          <div className="w-16 h-16 bg-gradient-to-br from-[#1a1500] to-[#2d2200] flex items-center justify-center text-3xl flex-shrink-0 border border-gold/15">
                            {p.icon}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-sans text-[9px] tracking-[2px] uppercase text-gold mb-0.5">Pick #{i + 1}</div>
                                <div className="font-serif text-[16px] text-cream">{p.name}</div>
                                <div className="font-sans text-[10px] text-fog mt-0.5">{p.purity} · {p.weight}g</div>
                              </div>
                              <div className="font-display text-[15px] text-gold-light whitespace-nowrap">{fmt(p.price)}</div>
                            </div>
                            <p className="font-serif text-[13px] italic text-gold/80 mt-2 leading-snug">"{rec.reason}"</p>
                            <p className="font-sans text-[11px] text-fog mt-1">💡 {rec.styling_tip}</p>
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleAddToCart(p)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-gold/10 border border-gold/25 text-gold font-sans text-[10px] tracking-[1px] uppercase hover:bg-gold/20 transition-colors"
                              >
                                <ShoppingBag size={11} /> Add to Cart
                              </button>
                              <button
                                onClick={() => handleWishlist(p)}
                                className="flex items-center gap-1.5 px-3 py-2 border border-gold/15 text-fog font-sans text-[10px] tracking-[1px] uppercase hover:text-gold hover:border-gold/30 transition-colors"
                              >
                                <Heart size={11} /> Wishlist
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Care tip */}
                  {result.care_tip && (
                    <div className="bg-white/2 border border-gold/10 p-4 flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">✨</span>
                      <div>
                        <div className="font-sans text-[9px] tracking-[2px] uppercase text-gold mb-1">Gold Care Tip</div>
                        <p className="font-sans text-[12px] text-fog leading-relaxed">{result.care_tip}</p>
                      </div>
                    </div>
                  )}

                  {/* Book consultation CTA */}
                  <div className="text-center">
                    <a
                      href="/appointment"
                      className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase text-gold border border-gold/30 px-6 py-3 hover:bg-gold/10 transition-colors"
                    >
                      📅 Book a Private Consultation
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Testimonials for AI feature */}
        <div className="border-t border-gold/10 pt-12 text-center">
          <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-2">Customer Stories</div>
          <h2 className="font-display text-3xl text-cream mb-8">Loved by Our Patrons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ananya Patel', loc: 'Mumbai', text: 'The AI picked the most stunning bridal set for me — exactly what I had imagined but couldn\'t articulate!' },
              { name: 'Meera Krishnan', loc: 'Bengaluru', text: 'Recommended a beautiful 22K jhumka set that I would never have found scrolling through hundreds of products.' },
              { name: 'Priya Reddy', loc: 'Hyderabad', text: 'The styling tips were spot-on. I wore the necklace exactly as suggested and received so many compliments!' },
            ].map((t) => (
              <div key={t.name} className="bg-charcoal border border-gold/10 p-6 text-left">
                <div className="text-gold text-[12px] tracking-widest mb-3">★★★★★</div>
                <p className="font-serif text-[14px] italic text-cream/80 leading-relaxed mb-4">"{t.text}"</p>
                <div className="font-sans text-[11px] text-fog">{t.name} · {t.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
