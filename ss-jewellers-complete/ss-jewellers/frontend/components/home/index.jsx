'use client';
// ============================================================
// components/home/HeroBanner.jsx
// ============================================================
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vy: -(Math.random() * 0.3 + 0.1),
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
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-obsidian overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/4 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
        <div>
          <motion.div initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}
            className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-gold" />
            <span className="font-sans text-[10px] tracking-[6px] uppercase text-gold">Since 2016 · Berhampur</span>
          </motion.div>
          <motion.h1 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }}
            className="font-display text-[clamp(48px,7vw,92px)] leading-[1.02] text-cream mb-6">
            Crafted in<br />Pure <span className="font-serif italic text-transparent" style={{ WebkitTextStroke:'1px #C9A84C' }}>Gold</span>
          </motion.h1>
          <motion.p initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }}
            className="font-serif text-[18px] font-light italic text-fog leading-relaxed mb-10 max-w-md">
            Where tradition meets timeless elegance — jewellery that tells your story, crafted for generations.
          </motion.p>
          <motion.div initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.65 }}
            className="flex flex-wrap gap-4">
            <Link href="/catalog" className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold hover:-translate-y-0.5 transition-all">
              Explore Collections <ArrowRight size={14} />
            </Link>
            <Link href="/bridal" className="inline-flex items-center gap-3 px-9 py-4 border border-gold text-gold font-sans text-[11px] font-bold tracking-[2px] uppercase hover:bg-gold/10 hover:-translate-y-0.5 transition-all">
              Bridal Gallery
            </Link>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
            className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-gold/15">
            {['BIS Hallmarked','22K & 24K Gold','Lifetime Exchange','12 Showrooms'].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="text-gold text-xs">✦</span>
                <span className="font-sans text-[10px] tracking-[1.5px] uppercase text-fog">{t}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-[420px] h-[420px]">
            {[0,20,60].map((inset,i) => (
              <div key={i} className="absolute rounded-full border border-gold/25"
                style={{ inset, animation:`spin ${20+i*10}s linear infinite ${i%2?'reverse':''}` }} />
            ))}
            <div className="absolute inset-[100px] rounded-full border border-gold/40 flex items-center justify-center"
              style={{ background:'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)' }}>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-gold-dark via-gold to-gold-light rotate-45"
                  style={{ animation:'pulseGlow 3s ease-in-out infinite' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-obsidian text-[11px] tracking-[3px] font-bold -rotate-45">S.S.</span>
                </div>
              </div>
            </div>
            {[
              { top:'8%',  left:'50%', icon:'💍', delay:0    },
              { top:'50%', left:'92%', icon:'✨', delay:0.5  },
              { top:'85%', left:'50%', icon:'📿', delay:1    },
              { top:'50%', left:'5%',  icon:'👑', delay:1.5  },
            ].map((gem,i) => (
              <motion.div key={i}
                initial={{ opacity:0,scale:0 }}
                animate={{ opacity:1,scale:1, y:[0,-6,0] }}
                transition={{ delay:0.8+gem.delay,type:'spring',y:{ duration:3,repeat:Infinity,ease:'easeInOut' } }}
                style={{ position:'absolute',top:gem.top,left:gem.left,transform:'translate(-50%,-50%)' }}
                className="text-2xl filter drop-shadow-[0_0_10px_rgba(201,168,76,0.6)]">
                {gem.icon}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// components/home/CategoryGrid.jsx
// ============================================================
import { motion as m2 } from 'framer-motion';

const CATEGORIES = [
  { slug:'rings',     label:'Rings',       icon:'💍', desc:'Solitaires & Traditional' },
  { slug:'earrings',  label:'Earrings',    icon:'✨', desc:'Jhumkas & Studs' },
  { slug:'necklaces', label:'Necklaces',   icon:'📿', desc:'Temple & Haaram' },
  { slug:'bangles',   label:'Bangles',     icon:'🔆', desc:'Kadas & Bracelets' },
  { slug:'chains',    label:'Chains',      icon:'⛓', desc:'Rope & Box' },
  { slug:'bridal',    label:'Bridal Sets', icon:'👑', desc:'Complete Sets' },
  { slug:'men',       label:'For Him',     icon:'🏅', desc:'Bold Gold Pieces' },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
      {CATEGORIES.map((cat, i) => (
        <m2.div key={cat.slug}
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ delay:i*0.06 }}>
          <a href={`/catalog/${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-5 aspect-square justify-center text-center bg-white/2 border border-gold/10 hover:border-gold/50 hover:bg-white/5 hover:-translate-y-2 transition-all duration-400 relative overflow-hidden block">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-4xl md:text-5xl transition-transform duration-400 group-hover:scale-110 group-hover:rotate-3 relative z-10">
              {cat.icon}
            </span>
            <div className="relative z-10">
              <div className="font-sans text-[9px] md:text-[10px] font-semibold tracking-[2px] uppercase text-cream group-hover:text-gold transition-colors">{cat.label}</div>
              <div className="font-sans text-[8px] tracking-[1px] text-fog mt-0.5 hidden md:block">{cat.desc}</div>
            </div>
          </a>
        </m2.div>
      ))}
    </div>
  );
}

// ============================================================
// components/home/TestimonialsSlider.jsx
// ============================================================
import { useState as us2, useEffect as ue2 } from 'react';
import { motion as m3, AnimatePresence as AP2 } from 'framer-motion';
import { ChevronLeft as CL, ChevronRight as CR } from 'lucide-react';

const TESTIMONIALS = [
  { name:'Priya Reddy',    loc:'Hyderabad',  initial:'P', stars:5, text:'I bought my bridal set from S.S. Jewellers and the craftsmanship is simply exquisite. The staff helped me pick the perfect ensemble — I felt like royalty on my wedding day.' },
  { name:'Sunita Sharma',  loc:'Bengaluru',  initial:'S', stars:5, text:'Outstanding quality and complete transparency in pricing. I could verify the gold purity right there. The 22K necklace still looks brand new after 5 years!' },
  { name:'Ananya Patel',   loc:'Mumbai',     initial:'A', stars:5, text:'The AI jewellery recommendation feature is brilliant! It suggested the perfect ring set. Fast delivery and luxurious packaging. Thoroughly impressed.' },
  { name:'Kavya Menon',    loc:'Chennai',    initial:'K', stars:5, text:'Three generations of my family have shopped here. The hallmark certification gives complete peace of mind. Their bridal collection is unmatched.' },
  { name:'Deepa Krishnan', loc:'Hyderabad',  initial:'D', stars:5, text:'The home visit service was exceptional — they brought 20+ pieces to choose from. Bought my daughter\'s bridal jewellery without leaving home.' },
];

export function TestimonialsSlider() {
  const [idx, setIdx] = us2(0);
  useEffect = ue2;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i+1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setIdx((i) => (i-1+TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx((i) => (i+1) % TESTIMONIALS.length);

  return (
    <div className="relative max-w-3xl mx-auto">
      <AP2 mode="wait">
        <m3.div key={idx}
          initial={{ opacity:0, x:20 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-20 }}
          transition={{ duration:0.4 }}
          className="bg-charcoal border border-gold/12 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-4 left-6 font-display text-[80px] leading-none text-gold/10 select-none">"</div>
          <div className="text-gold text-[14px] tracking-widest mb-5">{'★'.repeat(TESTIMONIALS[idx].stars)}</div>
          <p className="font-serif text-[17px] italic text-cream/85 leading-[1.9] mb-7 relative z-10">
            {TESTIMONIALS[idx].text}
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center font-display text-obsidian font-bold text-lg border-2 border-gold/30">
              {TESTIMONIALS[idx].initial}
            </div>
            <div>
              <div className="font-sans text-[13px] font-semibold text-cream">{TESTIMONIALS[idx].name}</div>
              <div className="font-sans text-[11px] text-fog mt-0.5">{TESTIMONIALS[idx].loc}</div>
            </div>
          </div>
        </m3.div>
      </AP2>
      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button onClick={prev} className="w-10 h-10 border border-gold/20 flex items-center justify-center text-fog hover:text-gold hover:border-gold transition-all">
          <CL size={16} />
        </button>
        {TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`transition-all ${i === idx ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-fog/30 hover:bg-fog rounded-full'}`} />
        ))}
        <button onClick={next} className="w-10 h-10 border border-gold/20 flex items-center justify-center text-fog hover:text-gold hover:border-gold transition-all">
          <CR size={16} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// components/home/FeaturedCollections.jsx
// ============================================================
import { motion as m4 } from 'framer-motion';

const FEATURED = [
  { title:'The Maharani\nBridal Edit', label:'New Season · 2024', icon:'👑', href:'/catalog/bridal',    bg:'from-[#1a0808] via-[#3d1515] to-[#2a0d0d]', large:true  },
  { title:'Temple\nNecklaces',          label:'Bestseller',         icon:'📿', href:'/catalog/necklaces', bg:'from-[#1a1200] via-[#3d2d00] to-[#2a1f00]', large:false },
  { title:'Solitaire\nRings',           label:'New Arrivals',       icon:'💍', href:'/catalog/rings',     bg:'from-[#0a0a1a] via-[#15153d] to-[#0d0d2a]', large:false },
];

export function FeaturedCollections() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-auto md:h-[620px]">
      <m4.div initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}>
        <a href={FEATURED[0].href}
          className={`group relative overflow-hidden flex items-end h-[340px] md:h-full bg-gradient-to-br ${FEATURED[0].bg} block`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-15 text-[160px]">{FEATURED[0].icon}</div>
          <div className="relative z-10 p-8 w-full">
            <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-2">{FEATURED[0].label}</div>
            <div className="font-display text-3xl md:text-4xl text-white leading-tight mb-4 whitespace-pre-line">{FEATURED[0].title}</div>
            <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase text-gold border-b border-gold pb-0.5 group-hover:gap-4 transition-all">
              Explore Collection <ArrowRight size={12} />
            </span>
          </div>
        </a>
      </m4.div>
      <div className="grid grid-rows-2 gap-5">
        {FEATURED.slice(1).map((f, i) => (
          <m4.div key={f.title} initial={{ opacity:0,x:20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ delay:0.15*(i+1) }}>
            <a href={f.href}
              className={`group relative overflow-hidden flex items-end h-[160px] md:h-full bg-gradient-to-br ${f.bg} block`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[90px]">{f.icon}</div>
              <div className="relative z-10 p-6">
                <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-1">{f.label}</div>
                <div className="font-display text-2xl text-white leading-snug mb-3 whitespace-pre-line">{f.title}</div>
                <span className="inline-flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase text-gold border-b border-gold pb-0.5 group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight size={11} />
                </span>
              </div>
            </a>
          </m4.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// components/home/OffersBanner.jsx
// ============================================================
import { useCopyToClipboard } from '@/lib/hooks';
import toast from 'react-hot-toast';

const OFFERS = [
  { code:'GOLD10',  label:'10% off on orders above ₹50,000'  },
  { code:'BRIDE15', label:'15% off on all Bridal Sets'         },
  { code:'FIRST5',  label:'5% off on your First Order'         },
];

export function OffersBanner() {
  const { copy } = useCopyToClipboard();

  const handleCopy = async (code) => {
    const ok = await copy(code);
    if (ok) toast.success(`Coupon "${code}" copied! 🎁`);
  };

  return (
    <div className="py-16 relative overflow-hidden"
      style={{ background:'linear-gradient(135deg, #8B6914, #C9A84C, #E8CC7A, #C9A84C, #8B6914)' }}>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }} />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center relative z-10">
        <div className="font-sans text-[10px] tracking-[5px] uppercase text-obsidian/60 mb-3">Limited Time</div>
        <h2 className="font-display text-4xl md:text-5xl text-obsidian font-bold mb-3">Exclusive Savings</h2>
        <p className="font-serif text-[18px] italic text-obsidian/60 mb-8">Celebrate every milestone with our special offers</p>
        <div className="flex flex-wrap justify-center gap-4">
          {OFFERS.map((o) => (
            <button key={o.code} onClick={() => handleCopy(o.code)}
              className="group relative px-8 py-5 border-2 border-dashed border-obsidian/30 hover:border-obsidian/60 bg-white/20 hover:bg-white/30 transition-all hover:-translate-y-1">
              <div className="font-display text-2xl text-obsidian font-bold tracking-[3px]">{o.code}</div>
              <div className="font-sans text-[10px] tracking-[1px] text-obsidian/70 mt-1">{o.label}</div>
              <div className="font-sans text-[9px] tracking-[2px] uppercase text-obsidian/50 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to copy ✓
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
