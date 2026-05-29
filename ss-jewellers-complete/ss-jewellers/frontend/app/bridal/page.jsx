'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { productApi } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';

const BRIDAL_COLLECTIONS = [
  {
    title: 'Kundan & Polki',
    desc: 'Opulent uncut diamond jewellery with meenakari work — the crown jewel of Indian bridal traditions.',
    icon: '👑', bg: 'from-[#1a0808] to-[#3d1010]',
    pieces: ['Choker Set', 'Haaram', 'Maangtika', 'Jhumkas', 'Bangles'],
  },
  {
    title: 'Temple Jewellery',
    desc: 'Inspired by ancient South Indian temple architecture, featuring goddess motifs in 22K gold.',
    icon: '🏛', bg: 'from-[#1a1200] to-[#3d2d00]',
    pieces: ['Long Necklace', 'Vanki', 'Earrings', 'Hair Ornaments'],
  },
  {
    title: 'Diamond Bridal',
    desc: 'Contemporary bridal sets featuring brilliant-cut diamonds in 18K gold — for the modern bride.',
    icon: '💎', bg: 'from-[#0a0a1a] to-[#15153d]',
    pieces: ['Necklace', 'Earrings', 'Ring', 'Bracelet'],
  },
  {
    title: 'Heritage Gold',
    desc: 'Heavy 22K gold sets with intricate jadau work and enamel — heirloom pieces for generations.',
    icon: '🌟', bg: 'from-[#0a1a10] to-[#1a3d25]',
    pieces: ['Haaram Set', 'Choker', 'Ear Chains', 'Nath'],
  },
];

const BRIDAL_SERVICES = [
  { icon: '👗', title: 'Bridal Styling Session', desc: 'One-on-one consultation to match jewellery with your outfit and wedding theme' },
  { icon: '✏',  title: 'Custom Design',          desc: 'Work with our master craftsmen to create your dream bespoke bridal set' },
  { icon: '🏠', title: 'Home Trial',              desc: 'We bring curated collections to your home in Hyderabad & Bengaluru' },
  { icon: '📸', title: 'Photo Shoot Assistance',  desc: 'Expert advice on jewellery for your pre-wedding photoshoot' },
  { icon: '🎁', title: 'Gift Packaging',           desc: 'Luxury gift boxes and bags with personal message cards' },
  { icon: '🔄', title: 'Lifetime Exchange',        desc: 'Exchange your bridal jewellery anytime at full gold value' },
];

const TESTIMONIALS = [
  { name: 'Swetha Rajan',   wedding: 'December 2024', text: 'S.S. Jewellers made my wedding unforgettable. The bridal set was everything I dreamed of and more — pure artistry.' },
  { name: 'Pooja Sharma',   wedding: 'November 2024', text: 'The consultation was exceptional. They understood my vision perfectly and the Kundan set they created was breathtaking.' },
  { name: 'Riya Malhotra',  wedding: 'October 2024',  text: 'My family has trusted S.S. Jewellers for three generations. My bridal jewellery is now a family heirloom.' },
];

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function BridalPage() {
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [activeCollection, setActiveCollection] = useState(0);

  useEffect(() => {
    productApi.getAll({ isBridal: 'true', limit: 8 })
      .then(({ data }) => { setProducts(data.data.products); setLoading(false); })
      .catch(() => {
        // Fallback demo products
        setProducts([
          { _id:'b1', name:'Bridal Kundan Choker Set',   icon:'👑', price:385000, purity:'22K', weight:72.8, badge:'trending',   rating:{average:5.0,count:89},  discountPercent:9 },
          { _id:'b2', name:'Polki Haaram Set',            icon:'🌟', price:520000, purity:'22K', weight:105,  badge:'bestseller', rating:{average:5.0,count:42},  discountPercent:10},
          { _id:'b3', name:'Bridal Maangtika',            icon:'🔮', price:45000,  purity:'22K', weight:12.0, badge:'new',        rating:{average:4.8,count:67},  discountPercent:0 },
          { _id:'b4', name:'Temple Bridal Necklace',      icon:'📿', price:165000, purity:'22K', weight:42.0, badge:'trending',   rating:{average:4.9,count:134}, discountPercent:8 },
          { _id:'b5', name:'Jadau Bangle Set',            icon:'🌸', price:228000, purity:'22K', weight:88.4, badge:'new',        rating:{average:4.9,count:55},  discountPercent:0 },
          { _id:'b6', name:'Diamond Bridal Choker',       icon:'💎', price:420000, purity:'18K', weight:35.2, badge:'trending',   rating:{average:5.0,count:28},  discountPercent:5 },
          { _id:'b7', name:'Ear Chain Jhumka Set',        icon:'✨', price:72000,  purity:'22K', weight:18.6, badge:'bestseller', rating:{average:4.8,count:198}, discountPercent:0 },
          { _id:'b8', name:'Nath (Bridal Nose Ring)',     icon:'🌺', price:38000,  purity:'22K', weight:10.2, badge:'new',        rating:{average:4.7,count:89},  discountPercent:0 },
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-obsidian">

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" style={{ paddingTop: '132px', background: 'linear-gradient(135deg, #0d0800, #1a1200, #0d0500)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 70% 50%, rgba(201,168,76,0.07), transparent)' }} />
          {/* Decorative rings */}
          {[200, 320, 440].map((size, i) => (
            <div key={i} className="absolute top-1/2 right-[20%] -translate-y-1/2 rounded-full border border-gold/15"
              style={{ width: size, height: size, marginLeft: -size/2, marginTop: -size/2, animation: `spin ${20 + i*8}s linear infinite ${i%2?'reverse':''}` }} />
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full py-16">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
              className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-gold" />
              <span className="font-sans text-[10px] tracking-[5px] uppercase text-gold">For the Bride</span>
            </motion.div>
            <motion.h1 initial={{ opacity:0,y:25 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }}
              className="font-display text-5xl lg:text-7xl text-cream leading-[1.02] mb-6">
              Begin Your<br />Forever in<br /><span className="font-serif italic text-gold">Pure Gold</span>
            </motion.h1>
            <motion.p initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }}
              className="font-serif text-[17px] font-light italic text-fog leading-relaxed mb-10 max-w-lg">
              Three decades of adorning Indian brides with timeless jewellery crafted for the most cherished chapter of life.
            </motion.p>
            <motion.div initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.55 }} className="flex flex-wrap gap-4">
              <a href="#collections" className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold hover:-translate-y-0.5 transition-all">
                View Collections <ArrowRight size={14} />
              </a>
              <Link href="/#appointment" className="inline-flex items-center gap-3 px-9 py-4 border border-gold text-gold font-sans text-[11px] font-bold tracking-[2px] uppercase hover:bg-gold/10 transition-all">
                Book Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BRIDAL CATEGORIES ─────────────────────────── */}
      <section id="collections" className="py-24 bg-obsidian">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Choose Your Style</div>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-3">Bridal Collections</h2>
            <p className="font-serif text-[16px] italic text-fog">Every tradition, every dream — we have the perfect set</p>
          </div>
          {/* Tabs */}
          <div className="flex overflow-x-auto gap-0 border border-gold/15 mb-10">
            {BRIDAL_COLLECTIONS.map((col, i) => (
              <button key={col.title} onClick={() => setActiveCollection(i)}
                className={`flex-1 min-w-[140px] px-5 py-4 font-sans text-[10px] tracking-[2px] uppercase transition-all whitespace-nowrap ${activeCollection === i ? 'bg-gold text-obsidian font-bold' : 'text-fog hover:text-cream hover:bg-white/4'}`}>
                {col.icon} {col.title}
              </button>
            ))}
          </div>
          {/* Active collection detail */}
          <motion.div key={activeCollection} initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className={`h-72 bg-gradient-to-br ${BRIDAL_COLLECTIONS[activeCollection].bg} flex items-center justify-center border border-gold/20`}>
              <span className="text-[120px] filter drop-shadow-[0_0_40px_rgba(201,168,76,0.5)]">{BRIDAL_COLLECTIONS[activeCollection].icon}</span>
            </div>
            <div>
              <h3 className="font-display text-3xl text-cream mb-4">{BRIDAL_COLLECTIONS[activeCollection].title}</h3>
              <p className="font-serif text-[16px] text-fog leading-relaxed mb-6">{BRIDAL_COLLECTIONS[activeCollection].desc}</p>
              <div className="mb-8">
                <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold mb-3">Included Pieces</div>
                <div className="flex flex-wrap gap-2">
                  {BRIDAL_COLLECTIONS[activeCollection].pieces.map((piece) => (
                    <span key={piece} className="font-sans text-[11px] tracking-[1px] text-cream bg-white/4 border border-gold/15 px-3 py-1.5">{piece}</span>
                  ))}
                </div>
              </div>
              <Link href="/catalog/bridal" className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
                Shop {BRIDAL_COLLECTIONS[activeCollection].title} <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BRIDAL PRODUCTS ───────────────────────────── */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Our Bestsellers</div>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-3">Bridal Jewellery</h2>
            <p className="font-serif text-[16px] italic text-fog">Handpicked by our bridal experts for your perfect day</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {Array.from({length:8}).map((_,i) => (
                <div key={i} className="bg-carbon border border-gold/10 animate-pulse"><div className="aspect-[3/4] bg-charcoal" /><div className="p-4 space-y-2"><div className="h-4 bg-charcoal rounded w-3/4" /><div className="h-3 bg-charcoal rounded w-1/2" /></div></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/catalog/bridal" className="inline-flex items-center gap-3 border border-gold text-gold font-sans text-[11px] font-semibold tracking-[2px] uppercase px-10 py-4 hover:bg-gold/10 hover:-translate-y-0.5 transition-all">
              View Full Bridal Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRIDAL SERVICES ───────────────────────────── */}
      <section className="py-24 bg-obsidian">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Exclusive Services</div>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-3">The Bridal Experience</h2>
            <p className="font-serif text-[16px] italic text-fog">White-glove service for the most important purchase of your life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BRIDAL_SERVICES.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}
                className="group bg-charcoal border border-gold/12 hover:border-gold/35 p-7 transition-all hover:-translate-y-1">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-2">{s.title}</h3>
                <p className="font-serif text-[14px] text-fog leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────── */}
      <section className="py-24 bg-carbon">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Simple Process</div>
            <h2 className="font-display text-4xl text-cream">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            {[
              { step:'01', title:'Book Consultation', desc:'Schedule a free session with our bridal specialist — in-store, home or video.' },
              { step:'02', title:'Choose Your Style', desc:'Browse curated collections and discuss customisation options with our expert.' },
              { step:'03', title:'Design & Craft',    desc:'Watch our master craftsmen bring your dream jewellery to life in pure gold.' },
              { step:'04', title:'Cherish Forever',   desc:'Receive your hallmarked jewellery in luxury packaging with lifetime guarantee.' },
            ].map((step, i) => (
              <div key={step.step} className="flex flex-col items-center text-center p-6">
                <div className="w-24 h-24 rounded-full border border-gold/30 flex items-center justify-center mb-5 relative z-10"
                  style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08), transparent)' }}>
                  <span className="font-display text-3xl text-gold-light">{step.step}</span>
                </div>
                <h3 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-2">{step.title}</h3>
                <p className="font-serif text-[13px] text-fog leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/#appointment" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
              Book My Free Consultation ✦
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Happy Brides</div>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-3">Stories of Love</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity:0,y:25 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="bg-obsidian border border-gold/12 hover:border-gold/30 p-7 transition-all">
                <div className="text-gold text-[12px] tracking-widest mb-4">★★★★★</div>
                <p className="font-serif text-[15px] italic text-cream/80 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center font-display text-obsidian font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-sans text-[12px] font-semibold text-cream">{t.name}</div>
                    <div className="font-sans text-[10px] text-gold">Wedding · {t.wedding}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICE GUIDE ───────────────────────────────── */}
      <section className="py-20" style={{ background:'linear-gradient(135deg, #8B6914, #C9A84C, #8B6914)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-obsidian font-bold mb-3">Bridal Budget Guide</h2>
          <p className="font-serif text-[16px] italic text-obsidian/60 mb-10">Curated sets for every budget, no compromises on quality</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { range:'₹2L – ₹5L',    label:'Classic Bridal',  pieces:'Necklace + Earrings + Bangles + Ring',       purity:'22K' },
              { range:'₹5L – ₹15L',   label:'Grand Bridal',    pieces:'Choker Set + Haaram + Maangtika + Nath + Bangles', purity:'22K' },
              { range:'₹15L+',        label:'Royal Bridal',    pieces:'Polki/Kundan Grand Set + All Accessories',    purity:'22K + Diamond' },
            ].map((b) => (
              <div key={b.range} className="bg-black/15 border border-black/20 p-6 text-left">
                <div className="font-display text-[26px] text-obsidian font-bold">{b.range}</div>
                <div className="font-sans text-[10px] tracking-[2px] uppercase text-obsidian/60 mb-3">{b.label}</div>
                <div className="font-serif text-[14px] text-obsidian/80 mb-4 leading-relaxed">{b.pieces}</div>
                <div className="font-sans text-[11px] tracking-[1px] text-obsidian/60">Purity: {b.purity}</div>
                <Link href="/catalog/bridal" className="inline-block mt-4 font-sans text-[10px] tracking-[2px] uppercase text-obsidian border-b border-obsidian/40 hover:border-obsidian pb-0.5">
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
