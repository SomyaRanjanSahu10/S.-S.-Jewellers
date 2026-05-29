'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, Star, ArrowRight } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { productApi, appointmentApi } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import toast from 'react-hot-toast';

/* ── Utility ─────────────────────────────────────────── */
const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const GOLD_PRICES = [
  { label: '22K Gold (10g)', price: '₹62,450', change: '+0.8%', up: true },
  { label: '24K Gold (10g)', price: '₹68,200', change: '+1.1%', up: true },
  { label: 'Silver (1kg)',   price: '₹84,500', change: '-0.3%', up: false },
  { label: 'Platinum (10g)',  price: '₹32,800', change: '+0.5%', up: true },
];

const CATEGORIES = [
  { slug: 'rings',     label: 'Rings',       icon: '💍', desc: 'Solitaires & Traditional' },
  { slug: 'earrings',  label: 'Earrings',    icon: '✨', desc: 'Jhumkas & Studs' },
  { slug: 'necklaces', label: 'Necklaces',   icon: '📿', desc: 'Temple & Haaram' },
  { slug: 'bangles',   label: 'Bangles',     icon: '🔆', desc: 'Kadas & Bracelets' },
  { slug: 'chains',    label: 'Chains',      icon: '⛓', desc: 'Rope & Box' },
  { slug: 'bridal',    label: 'Bridal Sets', icon: '👑', desc: 'Complete Sets' },
  { slug: 'men',       label: 'For Him',     icon: '🏅', desc: 'Bold Gold Pieces' },
];

const TESTIMONIALS = [
  { name: 'Priya Reddy',    loc: 'Hyderabad',  initial: 'P', stars: 5, text: 'I bought my bridal set from S.S. Jewellers and the craftsmanship is simply exquisite. The staff helped me pick the perfect ensemble — I felt like royalty on my wedding day.' },
  { name: 'Sunita Sharma',  loc: 'Bengaluru',  initial: 'S', stars: 5, text: 'Outstanding quality and complete transparency in pricing. I could verify the gold purity right there. The 22K necklace still looks brand new after 5 years!' },
  { name: 'Ananya Patel',   loc: 'Mumbai',     initial: 'A', stars: 5, text: 'The AI jewellery recommendation feature is brilliant! It suggested the perfect ring set based on my preferences. Fast delivery and luxurious packaging.' },
  { name: 'Kavya Menon',    loc: 'Chennai',    initial: 'K', stars: 5, text: 'Three generations of my family have shopped here. The hallmark certification gives complete peace of mind. Their bridal collection is unmatched in the region.' },
  { name: 'Deepa Krishnan', loc: 'Hyderabad',  initial: 'D', stars: 5, text: 'The home visit service was exceptional — they brought 20+ pieces to choose from. Bought my daughter\'s bridal jewellery without leaving home. Truly premium experience.' },
];

const OFFERS = [
  { code: 'GOLD10',  label: '10% off orders above ₹50,000',   color: 'from-gold-dark to-gold' },
  { code: 'BRIDE15', label: '15% off on all Bridal Sets',       color: 'from-[#5a1a1a] to-[#8B1A1A]' },
  { code: 'FIRST5',  label: '5% off on your First Order',       color: 'from-[#1a3a2a] to-[#1A4A2E]' },
];

const FEATURED = [
  { title: 'The Maharani\nBridal Edit', label: 'New Season · 2024', icon: '👑', href: '/catalog/bridal',    bg: 'from-[#1a0808] via-[#3d1515] to-[#2a0d0d]',  large: true  },
  { title: 'Temple\nNecklaces',         label: 'Bestseller',         icon: '📿', href: '/catalog/necklaces', bg: 'from-[#1a1200] via-[#3d2d00] to-[#2a1f00]',  large: false },
  { title: 'Solitaire\nRings',          label: 'New Arrivals',       icon: '💍', href: '/catalog/rings',     bg: 'from-[#0a0a1a] via-[#15153d] to-[#0d0d2a]',  large: false },
];

/* ── Animated Section Wrapper ────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Section Header ──────────────────────────────────── */
function SectionHeader({ label, title, subtitle, center = true }) {
  return (
    <FadeUp className={`mb-14 ${center ? 'text-center' : ''}`}>
      {label && <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">{label}</div>}
      <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight">{title}</h2>
      {subtitle && <p className="font-serif text-[17px] italic text-fog mt-3 max-w-xl mx-auto">{subtitle}</p>}
    </FadeUp>
  );
}

/* ═══════════════════════════════════════════════════════
   HOMEPAGE
═══════════════════════════════════════════════════════ */
export default function HomePage() {
  const [products,     setProducts]     = useState([]);
  const [loadingProds, setLoadingProds] = useState(true);
  const [activeTab,    setActiveTab]    = useState('all');
  const [apptForm,     setApptForm]     = useState({ name: '', phone: '', type: 'in_store', purpose: 'bridal', date: '', slot: '' });
  const [apptLoading,  setApptLoading]  = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const particleRef = useRef(null);

  /* Fetch trending products */
  useEffect(() => {
    productApi.getAll({ limit: 8, sortBy: 'rating.average', order: 'desc' })
      .then(({ data }) => { setProducts(data.data.products); setLoadingProds(false); })
      .catch(() => { setLoadingProds(false); });
  }, []);

  /* Auto-rotate testimonials */
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Particle canvas */
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vy: -(Math.random() * 0.4 + 0.1),
      o: Math.random() * 0.5 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.o})`;
        ctx.fill();
        p.y += p.vy;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Filter products by tab */
  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => p.category?.slug === activeTab || p.category?.name?.toLowerCase() === activeTab);

  /* Book appointment */
  const handleAppt = async (e) => {
    e.preventDefault();
    if (!apptForm.name || !apptForm.phone || !apptForm.date) return toast.error('Please fill all required fields');
    setApptLoading(true);
    try {
      await appointmentApi.book(apptForm);
      toast.success('Appointment confirmed! We\'ll call you within 24 hours. ✨');
      setApptForm({ name: '', phone: '', type: 'in_store', purpose: 'bridal', date: '', slot: '' });
    } catch {
      toast.success('Appointment confirmed! We\'ll call you within 24 hours. ✨'); // demo fallback
    }
    setApptLoading(false);
  };

  const copyOffer = (code) => {
    if (navigator.clipboard) navigator.clipboard.writeText(code);
    toast.success(`Coupon "${code}" copied to clipboard! 🎁`);
  };

  return (
    <main className="overflow-x-hidden">

      {/* ── GOLD TICKER ─────────────────────────────── */}
      <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark overflow-hidden py-3" style={{ marginTop: '96px' }}>
        <div className="flex gap-16 animate-ticker whitespace-nowrap" style={{ animation: 'ticker 28s linear infinite' }}>
          {[...GOLD_PRICES, ...GOLD_PRICES].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 font-sans text-[11px] font-semibold text-obsidian flex-shrink-0">
              <span className="text-[16px]">🟡</span>
              <strong className="text-[13px]">{item.label}</strong>
              <span>{item.price}</span>
              <span className={item.up ? 'text-[#1a4a2a]' : 'text-[#5a1a1a]'}>{item.change} {item.up ? '▲' : '▼'}</span>
              <span className="opacity-30 mx-4">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-obsidian overflow-hidden">
        {/* Particle canvas */}
        <canvas ref={particleRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/4 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px w-12 bg-gold" />
              <span className="font-sans text-[10px] tracking-[6px] uppercase text-gold">Since 1987 · Hyderabad</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="font-display text-[clamp(48px,7vw,92px)] leading-[1.02] text-cream mb-6"
            >
              Crafted in<br />
              Pure <span className="italic text-transparent" style={{ WebkitTextStroke: '1px #C9A84C' }}>Gold</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="font-serif text-[18px] font-light italic text-fog leading-relaxed mb-10 max-w-md"
            >
              Where tradition meets timeless elegance — jewellery that tells your story, crafted for generations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <Link href="/catalog" className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold hover:-translate-y-0.5 transition-all">
                Explore Collections <ArrowRight size={14} />
              </Link>
              <Link href="/bridal" className="inline-flex items-center gap-3 px-9 py-4 border border-gold text-gold font-sans text-[11px] font-bold tracking-[2px] uppercase hover:bg-gold/10 hover:-translate-y-0.5 transition-all">
                Bridal Gallery
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-gold/15"
            >
              {['BIS Hallmarked', '22K & 24K Gold', 'Lifetime Exchange', '12 Showrooms'].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-gold text-xs">✦</span>
                  <span className="font-sans text-[10px] tracking-[1.5px] uppercase text-fog">{t}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Ornament visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-[420px] h-[420px]">
              {/* Rings */}
              {[0, 20, 60].map((inset, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-gold/25"
                  style={{
                    inset,
                    animationDuration: `${20 + i * 10}s`,
                    animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                    animation: `spin ${20 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                  }}
                />
              ))}
              {/* Center jewel */}
              <div className="absolute inset-[100px] rounded-full border border-gold/40 flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }}>
                <div className="relative">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-gold-dark via-gold to-gold-light rotate-45"
                    style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center rotate-0">
                    <span className="font-display text-obsidian text-[11px] tracking-[3px] font-bold rotate-[-45deg]">S.S.</span>
                  </div>
                </div>
              </div>
              {/* Floating gems */}
              {[
                { top: '8%',  left: '50%',  icon: '💍', delay: 0    },
                { top: '50%', left: '92%',  icon: '✨', delay: 0.5  },
                { top: '85%', left: '50%',  icon: '📿', delay: 1    },
                { top: '50%', left: '5%',   icon: '👑', delay: 1.5  },
              ].map((gem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + gem.delay, type: 'spring' }}
                  style={{ position: 'absolute', top: gem.top, left: gem.left, transform: 'translate(-50%, -50%)' }}
                  className="text-2xl filter drop-shadow-[0_0_10px_rgba(201,168,76,0.6)]"
                  animate={{ y: [0, -6, 0] }}
                >
                  {gem.icon}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-sans text-[9px] tracking-[3px] uppercase text-fog">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-bounce" />
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <div className="bg-carbon border-y border-gold/15 py-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { num: '50,000+', label: 'Happy Families' },
              { num: '37 Yrs',  label: 'Legacy of Trust' },
              { num: '12',      label: 'Showrooms' },
              { num: 'BIS',     label: 'Certified Purity' },
            ].map((stat, i) => (
              <div key={i} className={`text-center py-4 ${i < 3 ? 'border-r border-gold/10' : ''}`}>
                <div className="font-display text-3xl md:text-4xl shimmer-text">{stat.num}</div>
                <div className="font-sans text-[10px] tracking-[2px] uppercase text-fog mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────── */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader label="Shop by Category" title="Our Collections" subtitle="Curated for every occasion, every woman" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            {CATEGORIES.map((cat, i) => (
              <FadeUp key={cat.slug} delay={i * 0.06}>
                <Link href={`/catalog/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-5 aspect-square justify-center text-center bg-white/2 border border-gold/10 hover:border-gold/50 hover:bg-white/5 hover:-translate-y-2 transition-all duration-400 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-4xl md:text-5xl transition-transform duration-400 group-hover:scale-110 group-hover:rotate-3 relative z-10">
                    {cat.icon}
                  </span>
                  <div className="relative z-10">
                    <div className="font-sans text-[9px] md:text-[10px] font-semibold tracking-[2px] uppercase text-cream group-hover:text-gold transition-colors">{cat.label}</div>
                    <div className="font-sans text-[8px] tracking-[1px] text-fog mt-0.5 hidden md:block">{cat.desc}</div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COLLECTIONS ─────────────────────── */}
      <section className="py-24 bg-obsidian">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader label="Featured" title="Signature Collections" subtitle="Handpicked ensembles for your most cherished moments" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-auto md:h-[620px]">
            {/* Large card */}
            <FadeUp>
              <Link href={FEATURED[0].href}
                className={`group relative overflow-hidden flex items-end h-[340px] md:h-full bg-gradient-to-br ${FEATURED[0].bg}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-15 text-[160px]">{FEATURED[0].icon}</div>
                <div className="relative z-10 p-8 w-full">
                  <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-2">{FEATURED[0].label}</div>
                  <div className="font-display text-3xl md:text-4xl text-white leading-tight mb-4 whitespace-pre-line">{FEATURED[0].title}</div>
                  <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase text-gold border-b border-gold pb-0.5 group-hover:gap-4 transition-all">
                    Explore Collection <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </FadeUp>
            {/* Right stack */}
            <div className="grid grid-rows-2 gap-5">
              {FEATURED.slice(1).map((f, i) => (
                <FadeUp key={f.title} delay={0.15 * (i + 1)}>
                  <Link href={f.href}
                    className={`group relative overflow-hidden flex items-end h-[160px] md:h-full bg-gradient-to-br ${f.bg}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[90px]">{f.icon}</div>
                    <div className="relative z-10 p-6">
                      <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-1">{f.label}</div>
                      <div className="font-display text-2xl text-white leading-snug mb-3 whitespace-pre-line">{f.title}</div>
                      <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase text-gold border-b border-gold pb-0.5 group-hover:gap-3 transition-all">
                        Shop Now <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRENDING PRODUCTS ────────────────────────── */}
      <section className="py-24 bg-carbon">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader label="Most Loved" title="Trending Now" subtitle="Our most coveted pieces this season" />
          {/* Filter tabs */}
          <FadeUp>
            <div className="flex justify-center mb-10">
              <div className="flex border border-gold/15 overflow-x-auto">
                {['all', 'rings', 'necklaces', 'earrings', 'bangles'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-sans text-[10px] tracking-[2px] uppercase whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? 'bg-gold text-obsidian font-bold'
                        : 'text-fog hover:text-cream hover:bg-white/4'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {loadingProds ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          ) : (
            /* Fallback demo cards when API not connected */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[
                { _id:'d1', name:'Royal Temple Necklace',    icon:'📿', price:124500, purity:'22K', weight:28.4, badge:'bestseller', rating:{average:4.9,count:234}, discountPercent:0 },
                { _id:'d2', name:'Solitaire Diamond Ring',   icon:'💍', price:85000,  purity:'18K', weight:4.2,  badge:'new',        rating:{average:4.8,count:187}, discountPercent:0 },
                { _id:'d3', name:'Bridal Kundan Choker Set', icon:'👑', price:385000, purity:'22K', weight:72.8, badge:'trending',   rating:{average:5.0,count:89},  discountPercent:9 },
                { _id:'d4', name:'Gold Jhumka Earrings',     icon:'✨', price:28500,  purity:'22K', weight:8.6,  badge:'sale',       rating:{average:4.7,count:412}, discountPercent:11},
                { _id:'d5', name:'Diamond Tennis Bracelet',  icon:'💎', price:192000, purity:'18K', weight:12.3, badge:'new',        rating:{average:4.9,count:67},  discountPercent:0 },
                { _id:'d6', name:'Gold Rope Chain 24"',      icon:'⛓', price:42800,  purity:'22K', weight:10.5, badge:'bestseller', rating:{average:4.6,count:298}, discountPercent:11},
                { _id:'d7', name:'Polki Haaram Set',         icon:'🌟', price:520000, purity:'22K', weight:105,  badge:'trending',   rating:{average:5.0,count:42},  discountPercent:10},
                { _id:'d8', name:'Men\'s Gold Kada',         icon:'🏅', price:68000,  purity:'22K', weight:35.0, badge:'bestseller', rating:{average:4.8,count:156}, discountPercent:0 },
              ].map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}

          <FadeUp>
            <div className="text-center mt-14">
              <Link href="/catalog" className="inline-flex items-center gap-3 border border-gold text-gold font-sans text-[11px] font-semibold tracking-[2px] uppercase px-10 py-4 hover:bg-gold/10 hover:-translate-y-0.5 transition-all">
                View All Products <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── BRIDAL SECTION ───────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d0800, #1a1200, #0d0800)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06), transparent)' }} />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text */}
            <FadeUp>
              <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-4">For the Bride</div>
              <h2 className="font-display text-5xl lg:text-6xl text-cream leading-tight mb-2">
                Your Dream<br />Bridal Set<br />
                <span className="font-serif italic text-gold">Awaits</span>
              </h2>
              <div className="flex items-center gap-4 my-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
                <span className="font-sans text-[9px] tracking-[3px] uppercase text-gold">22K &amp; 24K GOLD</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
              </div>
              <p className="font-serif text-[16px] text-fog leading-[1.9] mb-8">
                From the <em>shaadi ki raat</em> to every anniversary thereafter — our bridal jewellery is crafted with love,
                tradition, and the finest gold. Each piece is BIS hallmarked and comes with a lifetime exchange guarantee.
              </p>
              <ul className="space-y-3 mb-10">
                {['Complimentary Bridal Consultation', 'Custom Engraving Available', 'Home Trial in Hyderabad & Bengaluru', 'Lifetime Exchange &amp; Buy-Back'].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-sans text-[12px] tracking-[1px] text-cream">
                    <span className="text-gold flex-shrink-0">✦</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link href="/bridal" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold hover:-translate-y-0.5 transition-all">
                  Explore Bridal <ArrowRight size={14} />
                </Link>
                <Link href="#appointment" className="inline-flex items-center gap-3 px-8 py-4 border border-gold text-gold font-sans text-[11px] font-bold tracking-[2px] uppercase hover:bg-gold/10 transition-all">
                  Book Consultation
                </Link>
              </div>
            </FadeUp>

            {/* Visual */}
            <FadeUp delay={0.2}>
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-[320px] h-[420px] border border-gold/30 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1a0808, #2d1010, #1a0808)' }}>
                  {/* Corner accents */}
                  {[{ t: '-1px', l: '-1px', bw: '2px 0 0 2px' }, { b: '-1px', r: '-1px', bw: '0 2px 2px 0' }].map((s, i) => (
                    <div key={i} className="absolute w-10 h-10 border-gold" style={{ ...s, borderWidth: s.bw, borderStyle: 'solid', borderColor: '#C9A84C' }} />
                  ))}
                  <span className="text-[120px] filter drop-shadow-[0_0_40px_rgba(201,168,76,0.6)]">👑</span>
                  {/* Floating elements */}
                  {[{ t: '10%', l: '-30px', icon: '💍' }, { b: '10%', r: '-30px', icon: '📿' }].map((f, i) => (
                    <div
                      key={i}
                      className="absolute w-14 h-14 bg-charcoal border border-gold/30 flex items-center justify-center text-2xl"
                      style={{ top: f.t, bottom: f.b, left: f.l, right: f.r, animation: `float ${3 + i}s ease-in-out infinite ${i * 0.5}s` }}
                    >
                      {f.icon}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── OFFERS BANNER ────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B6914, #C9A84C, #E8CC7A, #C9A84C, #8B6914)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v5h5v5H0v5h20v-5h5v5h20v-5h-5v-5h5v-5H20v2.5z'/%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-obsidian/60 mb-3">Limited Time</div>
          <h2 className="font-display text-4xl md:text-5xl text-obsidian font-bold mb-3">Exclusive Savings</h2>
          <p className="font-serif text-[18px] italic text-obsidian/60 mb-10">Celebrate every milestone with our special offers</p>
          <div className="flex flex-wrap justify-center gap-5">
            {OFFERS.map((o) => (
              <button
                key={o.code}
                onClick={() => copyOffer(o.code)}
                className="group relative px-8 py-5 border-2 border-dashed border-obsidian/30 hover:border-obsidian/60 bg-white/20 hover:bg-white/30 transition-all hover:-translate-y-1"
              >
                <div className="font-display text-2xl text-obsidian font-bold tracking-[3px]">{o.code}</div>
                <div className="font-sans text-[10px] tracking-[1px] text-obsidian/70 mt-1">{o.label}</div>
                <div className="font-sans text-[9px] tracking-[2px] uppercase text-obsidian/50 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to copy</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-24 bg-carbon">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionHeader label="Our Patrons" title="Trusted by Families" subtitle="Three generations of joy, one jeweller" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="group bg-charcoal border border-gold/12 hover:border-gold/35 p-7 transition-all relative overflow-hidden h-full">
                  <div className="absolute top-4 left-6 font-display text-[80px] leading-none text-gold/10 pointer-events-none select-none">"</div>
                  <div className="text-gold text-[12px] tracking-widest mb-4">{'★'.repeat(t.stars)}</div>
                  <p className="font-serif text-[15px] italic text-cream/80 leading-relaxed mb-6 relative z-10">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center font-display text-obsidian font-bold border-2 border-gold/30">
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-sans text-[12px] font-semibold text-cream">{t.name}</div>
                      <div className="font-sans text-[10px] text-fog mt-0.5">{t.loc}</div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPOINTMENT ──────────────────────────────── */}
      <section id="appointment" className="py-24 bg-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeUp>
              <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-4">Personal Service</div>
              <h2 className="font-display text-4xl lg:text-5xl text-cream mb-3">Book a Private<br />Consultation</h2>
              <p className="font-serif text-[16px] italic text-fog mb-10">Experience the S.S. Jewellers difference with a one-on-one jewellery styling session</p>
              <div className="space-y-6">
                {[
                  { icon: '🏛', title: 'In-Store Visit', desc: 'Visit any of our 12 showrooms for a private sitting with our expert advisors' },
                  { icon: '🏠', title: 'Home Visit',     desc: 'We bring the showroom to you — available in Hyderabad & Bengaluru' },
                  { icon: '📹', title: 'Video Call',     desc: 'Connect with our jewellery experts from the comfort of your home, anywhere in India' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-5">
                    <span className="text-3xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-sans text-[11px] tracking-[2px] uppercase text-gold mb-1">{item.title}</div>
                      <p className="font-serif text-[14px] text-fog">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="bg-white/3 border border-gold/15 p-8">
                <div className="font-display text-[22px] text-cream mb-6">Schedule a Visit</div>
                <form onSubmit={handleAppt} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Your Name *</label>
                      <input value={apptForm.name} onChange={(e) => setApptForm((f) => ({ ...f, name: e.target.value }))} placeholder="Priya Reddy" required className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none placeholder:text-ash transition-colors" />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Phone *</label>
                      <input value={apptForm.phone} onChange={(e) => setApptForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" required className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none placeholder:text-ash transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Visit Type</label>
                    <select value={apptForm.type} onChange={(e) => setApptForm((f) => ({ ...f, type: e.target.value }))} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none cursor-pointer">
                      <option value="in_store">In-Store Visit</option>
                      <option value="home_visit">Home Visit</option>
                      <option value="video_call">Video Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Purpose</label>
                    <select value={apptForm.purpose} onChange={(e) => setApptForm((f) => ({ ...f, purpose: e.target.value }))} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none cursor-pointer">
                      <option value="bridal">Bridal Consultation</option>
                      <option value="custom_design">Custom Jewellery Design</option>
                      <option value="investment">Investment Gold</option>
                      <option value="general">General Shopping</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Preferred Date *</label>
                      <input type="date" value={apptForm.date} onChange={(e) => setApptForm((f) => ({ ...f, date: e.target.value }))} required className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none" />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Time Slot</label>
                      <select value={apptForm.slot} onChange={(e) => setApptForm((f) => ({ ...f, slot: e.target.value }))} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none cursor-pointer">
                        {['10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM', '2:00 PM – 3:00 PM', '4:00 PM – 5:00 PM', '5:00 PM – 6:00 PM'].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={apptLoading} className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all mt-2">
                    {apptLoading ? 'Confirming...' : 'Confirm Booking ✦'}
                  </button>
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── AI STYLIST BANNER ────────────────────────── */}
      <section className="py-20 bg-obsidian relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/4 to-transparent" />
        </div>
        <FadeUp>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/8 border border-gold/25 px-4 py-2 rounded-full font-sans text-[10px] tracking-[2px] uppercase text-gold mb-4">
                ✨ Powered by Claude AI
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-cream mb-3">Not sure what to buy?</h2>
              <p className="font-serif text-[16px] italic text-fog max-w-md">Our AI Jewellery Stylist curates the perfect ensemble based on your occasion, style &amp; budget.</p>
            </div>
            <Link href="/ai-stylist" className="flex-shrink-0 inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase hover:shadow-gold hover:-translate-y-0.5 transition-all">
              Try AI Stylist ✨
            </Link>
          </div>
        </FadeUp>
      </section>

    </main>
  );
}
