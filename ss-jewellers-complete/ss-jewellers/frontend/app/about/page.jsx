'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
}

const MILESTONES = [
  { year: '1987', title: 'Founded in Hyderabad', desc: 'Sri Suresh Jewellers opened its first showroom in Himayatnagar, Hyderabad, with a single display case and a commitment to purity.' },
  { year: '1995', title: 'First BIS Certification', desc: 'We became one of Hyderabad\'s first jewellers to receive BIS hallmarking certification, setting a new standard for transparency.' },
  { year: '2003', title: 'Banjara Hills Flagship', desc: 'Opened our landmark flagship store on Road No. 12, Banjara Hills — three floors of gold, diamonds, and heirlooms.' },
  { year: '2010', title: 'South India Expansion', desc: 'Expanded to Bengaluru, Chennai, Vijayawada and Visakhapatnam. A decade of growth, one family at a time.' },
  { year: '2018', title: 'Bridal Studio Launch', desc: 'Dedicated bridal studios opened in Hyderabad and Bengaluru — private consultation rooms for the modern bride.' },
  { year: '2022', title: 'Digital Transformation', desc: 'Launched our ecommerce platform and AI jewellery stylist, bringing the S.S. Jewellers experience to every Indian home.' },
  { year: '2024', title: '37 Years & 50,000 Families', desc: 'Three generations, twelve showrooms, and 50,000+ families — our legacy is written in gold.' },
];

const VALUES = [
  { icon: '✅', title: 'Purity',     desc: 'Every piece is BIS hallmarked. We never compromise on the quality of gold or the craftsmanship of our artisans.' },
  { icon: '🤝', title: 'Trust',      desc: '37 years of honest pricing. Our making charges are transparent and published — no hidden costs, ever.' },
  { icon: '❤', title: 'Heritage',    desc: 'We honour centuries of Indian jewellery traditions while embracing modern aesthetics for the contemporary woman.' },
  { icon: '♻', title: 'Lifetime',    desc: 'We stand behind every piece we sell with a lifetime exchange guarantee at full gold value.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-obsidian">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end pb-16 overflow-hidden"
        style={{ paddingTop: '132px', background: 'linear-gradient(135deg, #0d0800, #1a1200, #0d0500)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 70% at 60% 40%, rgba(201,168,76,0.07), transparent)' }} />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}
            className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gold" />
            <span className="font-sans text-[10px] tracking-[5px] uppercase text-gold">Our Story</span>
          </motion.div>
          <motion.h1 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }}
            className="font-display text-5xl lg:text-7xl text-cream leading-[1.02] mb-6 max-w-3xl">
            Crafting Trust<br />Since <span className="font-serif italic text-gold">1987</span>
          </motion.h1>
          <motion.p initial={{ opacity:0,y:15 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }}
            className="font-serif text-[18px] italic text-fog max-w-xl leading-relaxed">
            Three generations of the Suresh family have dedicated their lives to one purpose: bringing you pure gold, transparently priced, beautifully crafted.
          </motion.p>
        </div>
      </section>

      {/* ── FOUNDER STORY ─────────────────────────────── */}
      <section className="py-24 bg-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <FadeUp>
              <div className="h-96 bg-gradient-to-br from-[#1a1200] to-[#0d0900] border border-gold/20 flex items-center justify-center relative overflow-hidden">
                <div className="text-[120px] filter drop-shadow-[0_0_40px_rgba(201,168,76,0.4)]">🏛</div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="font-sans text-[10px] tracking-[3px] uppercase text-gold mb-1">Himayatnagar, 1987</div>
                  <div className="font-serif text-[15px] italic text-cream/80">Where it all began</div>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-4">The Founder</div>
              <h2 className="font-display text-4xl text-cream mb-6">Sri Suresh Reddy</h2>
              <div className="space-y-4 font-serif text-[16px] text-fog leading-[1.9]">
                <p>In 1987, Sri Suresh Reddy opened a small jewellery shop in Himayatnagar, Hyderabad, with ₹50,000 in savings and an unwavering belief: <em className="text-cream">every customer deserves to know exactly what they're paying for.</em></p>
                <p>At a time when jewellery pricing was opaque and making charges were hidden, Sri Suresh hung a board outside his shop showing the day's gold rate and making charge percentage. Customers came from across the city — not just for the jewellery, but for the honesty.</p>
                <p>That philosophy — <em className="text-cream">transparency is the finest jewel</em> — has guided every decision made by the Suresh family for 37 years and three generations.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-gold/15">
                <div className="font-display text-2xl italic text-gold">"Pure gold, honest price, happy family."</div>
                <div className="font-sans text-[11px] tracking-[1px] text-fog mt-2">— Sri Suresh Reddy, Founder</div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────── */}
      <section className="py-24 bg-obsidian">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="text-center mb-16">
              <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">37 Years</div>
              <h2 className="font-display text-5xl text-cream mb-3">Our Journey</h2>
              <p className="font-serif text-[16px] italic text-fog">From one display case to 12 showrooms across South India</p>
            </div>
          </FadeUp>
          <div className="relative">
            {/* Central line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden lg:block" />
            <div className="space-y-8 lg:space-y-0">
              {MILESTONES.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.07}>
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${i % 2 === 0 ? '' : 'lg:direction-rtl'}`}>
                    {/* Content */}
                    <div className={`p-6 bg-charcoal border border-gold/12 hover:border-gold/35 transition-all ${i % 2 === 0 ? 'lg:text-right' : 'lg:order-2'}`}>
                      <div className="font-display text-3xl text-gold-light mb-2">{m.year}</div>
                      <h3 className="font-sans text-[12px] tracking-[2px] uppercase text-cream mb-2">{m.title}</h3>
                      <p className="font-serif text-[14px] text-fog leading-relaxed">{m.desc}</p>
                    </div>
                    {/* Dot */}
                    <div className="hidden lg:flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-gold border-4 border-obsidian shadow-gold" />
                    </div>
                    {/* Spacer for alternating */}
                    {i % 2 !== 0 && <div className="hidden lg:block lg:order-1" />}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ────────────────────────────────── */}
      <section className="py-24 bg-carbon">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <FadeUp>
            <div className="text-center mb-14">
              <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">What We Stand For</div>
              <h2 className="font-display text-5xl text-cream">Our Values</h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.1}>
                <div className="group bg-charcoal border border-gold/12 hover:border-gold/40 p-7 transition-all hover:-translate-y-1 h-full">
                  <div className="text-4xl mb-5">{v.icon}</div>
                  <div className="font-sans text-[11px] tracking-[3px] uppercase text-gold mb-3">{v.title}</div>
                  <p className="font-serif text-[14px] text-fog leading-relaxed">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUMBERS ───────────────────────────────────── */}
      <section className="py-20 bg-charcoal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { num: '37', label: 'Years of Legacy', suffix: '+' },
              { num: '50,000', label: 'Families Served', suffix: '+' },
              { num: '12', label: 'Showrooms', suffix: '' },
              { num: '99.9', label: 'Gold Purity', suffix: '%' },
            ].map((stat, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className={`text-center py-10 ${i < 3 ? 'border-r border-gold/10' : ''}`}>
                  <div className="font-display text-4xl md:text-5xl shimmer-text">{stat.num}{stat.suffix}</div>
                  <div className="font-sans text-[10px] tracking-[2px] uppercase text-fog mt-2">{stat.label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-20 bg-obsidian text-center">
        <FadeUp>
          <div className="max-w-lg mx-auto px-6">
            <h2 className="font-display text-4xl text-cream mb-4">Experience the Legacy</h2>
            <p className="font-serif text-[16px] italic text-fog mb-10">Visit any of our 12 showrooms or shop online with the same trusted service.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/stores" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
                Find a Store <ArrowRight size={14} />
              </Link>
              <Link href="/catalog" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold text-gold font-sans text-[11px] font-bold tracking-[2px] uppercase hover:bg-gold/10 transition-all">
                Shop Online
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
