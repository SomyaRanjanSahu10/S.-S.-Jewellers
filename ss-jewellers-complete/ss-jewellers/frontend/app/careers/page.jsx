'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const OPENINGS = [
  {
    id: 1,
    title: 'Senior Jewellery Designer',
    dept: 'Design & Craftsmanship',
    location: 'Hyderabad (Banjara Hills)',
    type: 'Full-time',
    experience: '5–10 years',
    desc: 'Lead the creation of original jewellery designs for our 22K and 24K gold collections. Work with master craftsmen to bring concepts to life.',
    responsibilities: [
      'Design seasonal collections aligned with S.S. Jewellers brand identity',
      'Create detailed technical drawings and CAD models for production',
      'Collaborate with craftsmen on execution and quality control',
      'Research global jewellery trends and adapt for Indian market',
      'Manage design team of 3–5 junior designers',
    ],
    requirements: [
      'Degree in Jewellery Design from NIFT, JD Institute, or equivalent',
      'Minimum 5 years in gold jewellery design',
      'Proficiency in Rhino 3D or Matrix CAD software',
      'Deep understanding of Indian jewellery traditions (temple, kundan, polki)',
      'Portfolio of published collections required',
    ],
  },
  {
    id: 2,
    title: 'Showroom Manager',
    dept: 'Retail Operations',
    location: 'Bengaluru (Indiranagar)',
    type: 'Full-time',
    experience: '4–7 years',
    desc: 'Lead the Indiranagar showroom team to deliver exceptional customer experiences and achieve monthly sales targets.',
    responsibilities: [
      'Manage a team of 10–15 sales advisors and support staff',
      'Drive showroom revenue and meet monthly/quarterly targets',
      'Ensure premium customer experience standards are maintained',
      'Handle high-value bridal consultations personally',
      'Manage inventory, visual merchandising, and daily operations',
    ],
    requirements: [
      'MBA or equivalent in retail/sales management',
      'Minimum 4 years in luxury retail or premium jewellery',
      'Proven track record of managing high-performing sales teams',
      'Fluency in English, Hindi, and Kannada',
      'Experience with bridal jewellery sales preferred',
    ],
  },
  {
    id: 3,
    title: 'Full-Stack Developer',
    dept: 'Technology',
    location: 'Hyderabad (Remote-friendly)',
    type: 'Full-time',
    experience: '3–6 years',
    desc: 'Build and maintain the S.S. Jewellers digital platform — ecommerce, admin dashboard, AI features, and mobile apps.',
    responsibilities: [
      'Develop features for Next.js frontend and Express.js backend',
      'Integrate Razorpay, Cloudinary, and other third-party APIs',
      'Build and maintain admin dashboard and analytics features',
      'Optimise for performance, SEO, and mobile responsiveness',
      'Collaborate with design team on UI/UX implementation',
    ],
    requirements: [
      'Strong proficiency in React, Next.js, Node.js',
      'Experience with MongoDB, REST APIs, and JWT auth',
      'Familiarity with Tailwind CSS and Framer Motion',
      'Understanding of ecommerce flows (cart, checkout, payments)',
      'Experience with cloud deployment (Vercel, Render, AWS)',
    ],
  },
  {
    id: 4,
    title: 'Gold Appraiser & Quality Manager',
    dept: 'Quality Assurance',
    location: 'Hyderabad (Himayatnagar)',
    type: 'Full-time',
    experience: '5–12 years',
    desc: 'Ensure the purity and quality of all jewellery purchased and sold. Lead BIS hallmarking operations.',
    responsibilities: [
      'Test and certify gold purity for all incoming and outgoing jewellery',
      'Manage relationships with BIS-certified assaying centres',
      'Train staff on quality standards and hallmarking requirements',
      'Handle customer disputes related to jewellery quality',
      'Maintain quality control documentation and audit trails',
    ],
    requirements: [
      'Certification from Gem & Jewellery Skill Council of India (GJSCI)',
      'Minimum 5 years in gold testing and quality management',
      'Proficiency with XRF analysers and fire assay techniques',
      'Deep knowledge of BIS hallmarking regulations',
      'Experience with international gold quality standards (ISO)',
    ],
  },
  {
    id: 5,
    title: 'Digital Marketing Manager',
    dept: 'Marketing',
    location: 'Hyderabad (Hybrid)',
    type: 'Full-time',
    experience: '3–6 years',
    desc: 'Lead S.S. Jewellers\' digital presence across search, social, and email. Drive qualified traffic and online conversions.',
    responsibilities: [
      'Develop and execute integrated digital marketing campaigns',
      'Manage SEO/SEM, social media (Instagram, Facebook, Pinterest)',
      'Run performance marketing campaigns on Meta and Google',
      'Manage email marketing and WhatsApp broadcast campaigns',
      'Track analytics and report on ROAS and conversion metrics',
    ],
    requirements: [
      'Degree in Marketing, Communications, or equivalent',
      'Minimum 3 years in digital marketing, preferably luxury/lifestyle brands',
      'Hands-on experience with Meta Ads, Google Ads, and Analytics 4',
      'Strong visual sensibility — experience with Canva or Adobe Creative Suite',
      'Understanding of the Indian luxury consumer market',
    ],
  },
  {
    id: 6,
    title: 'Bridal Jewellery Consultant',
    dept: 'Sales & Customer Experience',
    location: 'Multiple Locations',
    type: 'Full-time',
    experience: '2–5 years',
    desc: 'Guide brides-to-be through their jewellery journey with personalised consultations, home visits, and styling advice.',
    responsibilities: [
      'Conduct in-store and home visit consultations for bridal customers',
      'Understand customer requirements and curate jewellery recommendations',
      'Build long-term relationships with customers and their families',
      'Achieve monthly bridal sales targets',
      'Coordinate custom design requests with the design team',
    ],
    requirements: [
      'Graduate degree in any discipline',
      'Minimum 2 years in luxury retail or bridal industry',
      'Excellent interpersonal and communication skills',
      'Fluency in Telugu/Hindi/English (location dependent)',
      'Passion for jewellery, fashion, and bridal styling',
    ],
  },
];

const BENEFITS = [
  { icon: '💰', title: 'Competitive CTC',     desc: 'Market-leading salaries with performance bonuses and annual increments' },
  { icon: '🏥', title: 'Health Insurance',    desc: 'Comprehensive medical coverage for you and your family' },
  { icon: '💍', title: 'Staff Discount',      desc: '20–30% discount on all S.S. Jewellers purchases for employees' },
  { icon: '📚', title: 'Learning & Dev',      desc: 'Annual training budget, GIA courses, and leadership development programmes' },
  { icon: '🎯', title: 'Growth Path',         desc: 'Clear career progression with internal promotions and cross-department moves' },
  { icon: '🏖', title: 'Leave Policy',        desc: '24 days paid leave + 12 public holidays + 6 sick days annually' },
];

function JobCard({ job }) {
  const [open, setOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', cover: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return toast.error('Please fill all required fields');
    setApplying(true);
    await new Promise((r) => setTimeout(r, 1200)); // demo
    setSubmitted(true);
    setApplying(false);
    toast.success(`Application submitted for ${job.title}! We'll review and respond within 7 days.`);
  };

  return (
    <div className="bg-charcoal border border-gold/12 hover:border-gold/30 transition-all">
      {/* Header */}
      <div
        className="p-6 cursor-pointer flex items-start justify-between gap-4"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="font-sans text-[9px] tracking-[2px] uppercase text-gold bg-gold/8 border border-gold/20 px-2.5 py-1">
              {job.dept}
            </span>
            <span className="font-sans text-[9px] tracking-[1px] uppercase text-fog">{job.type}</span>
          </div>
          <h3 className="font-display text-xl text-cream mb-2">{job.title}</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 font-sans text-[11px] text-fog">
              <MapPin size={12} className="text-gold" /> {job.location}
            </div>
            <div className="flex items-center gap-1.5 font-sans text-[11px] text-fog">
              <Clock size={12} className="text-gold" /> {job.experience}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 mt-1 text-fog">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-7 border-t border-gold/10 pt-5 space-y-5">
              <p className="font-serif text-[15px] text-fog leading-relaxed">{job.desc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold mb-3">Responsibilities</div>
                  <ul className="space-y-2">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gold flex-shrink-0 mt-1 text-xs">✦</span>
                        <span className="font-serif text-[13px] text-fog leading-snug">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold mb-3">Requirements</div>
                  <ul className="space-y-2">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gold flex-shrink-0 mt-1 text-xs">✦</span>
                        <span className="font-serif text-[13px] text-fog leading-snug">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Application form */}
              {!submitted ? (
                <div className="pt-5 border-t border-gold/10">
                  <div className="font-sans text-[11px] tracking-[3px] uppercase text-gold mb-4">Apply for This Role</div>
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-1.5">Full Name *</label>
                        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[12px] px-3 py-2.5 outline-none placeholder:text-ash transition-colors" />
                      </div>
                      <div>
                        <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-1.5">Email *</label>
                        <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@email.com" className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[12px] px-3 py-2.5 outline-none placeholder:text-ash transition-colors" />
                      </div>
                      <div>
                        <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-1.5">Phone *</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[12px] px-3 py-2.5 outline-none placeholder:text-ash transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-1.5">Years of Experience</label>
                      <input value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="e.g. 4 years in luxury retail" className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[12px] px-3 py-2.5 outline-none placeholder:text-ash transition-colors" />
                    </div>
                    <div>
                      <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-1.5">Cover Note</label>
                      <textarea value={form.cover} onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))} placeholder="Tell us why you'd be a great fit for S.S. Jewellers…" rows={3} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[12px] px-3 py-2.5 outline-none resize-none placeholder:text-ash transition-colors" />
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="submit" disabled={applying} className="px-7 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all">
                        {applying ? 'Submitting…' : 'Submit Application →'}
                      </button>
                      <p className="font-sans text-[10px] text-fog">Or email your CV to <a href="mailto:careers@ssjewellers.in" className="text-gold">careers@ssjewellers.in</a></p>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="pt-5 border-t border-gold/10 flex items-center gap-4 p-5 bg-emerald-500/8 border-emerald-500/25">
                  <span className="text-3xl">✅</span>
                  <div>
                    <div className="font-sans text-[12px] font-semibold text-emerald-400">Application Submitted!</div>
                    <div className="font-serif text-[13px] text-fog mt-0.5">We'll review your application and reach out within 7 working days.</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CareersPage() {
  const [filter, setFilter] = useState('All');
  const depts = ['All', ...new Set(OPENINGS.map((j) => j.dept))];
  const filtered = filter === 'All' ? OPENINGS : OPENINGS.filter((j) => j.dept === filter);

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">

      {/* Hero */}
      <section className="relative py-16 mb-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d0800, #1a1200, #0d0500)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 70% at 60% 50%, rgba(201,168,76,0.06), transparent)' }} />
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Join Our Team</div>
          <h1 className="font-display text-5xl lg:text-6xl text-cream mb-4">Build Your Career<br />in Gold</h1>
          <p className="font-serif text-[17px] italic text-fog max-w-xl mx-auto leading-relaxed mb-8">
            Join one of South India's most trusted jewellery brands. Work with passionate people who take pride in every piece of gold they touch.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { num: '200+', label: 'Employees' },
              { num: '37', label: 'Years Old' },
              { num: '12', label: 'Showrooms' },
              { num: '4.8⭐', label: 'Glassdoor Rating' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl text-gold-light">{s.num}</div>
                <div className="font-sans text-[9px] tracking-[2px] uppercase text-fog mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6">

        {/* Benefits */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-2">Why Join Us</div>
            <h2 className="font-display text-4xl text-cream">Benefits & Perks</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-charcoal border border-gold/12 hover:border-gold/35 p-5 transition-all">
                <div className="text-3xl mb-3">{b.icon}</div>
                <div className="font-sans text-[11px] tracking-[2px] uppercase text-gold mb-2">{b.title}</div>
                <p className="font-serif text-[13px] text-fog leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job listings */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-1">Open Positions</div>
              <h2 className="font-display text-3xl text-cream">{OPENINGS.length} Roles Available</h2>
            </div>
            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {depts.map((d) => (
                <button key={d} onClick={() => setFilter(d)}
                  className={`font-sans text-[9px] tracking-[1px] uppercase px-4 py-2 border transition-all ${filter === d ? 'bg-gold text-obsidian border-gold font-bold' : 'border-gold/20 text-fog hover:text-cream hover:border-gold/40'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {/* General application */}
          <div className="mt-10 text-center p-10 bg-gradient-to-r from-gold-dark/12 via-gold/6 to-gold-dark/12 border border-gold/18">
            <div className="text-3xl mb-3">📩</div>
            <h3 className="font-display text-2xl text-cream mb-2">Don't See Your Role?</h3>
            <p className="font-serif text-[15px] italic text-fog mb-5 max-w-md mx-auto">
              We're always looking for exceptional talent. Send your CV and we'll reach out when the right opportunity arises.
            </p>
            <a href="mailto:careers@ssjewellers.in"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
              Send Your CV <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
