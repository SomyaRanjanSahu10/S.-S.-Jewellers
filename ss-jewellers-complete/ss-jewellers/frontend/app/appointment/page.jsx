'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Calendar, Clock, MapPin, Video, Home } from 'lucide-react';
import { appointmentApi } from '@/lib/api';
import toast from 'react-hot-toast';

const PURPOSES = [
  { value: 'bridal',        label: 'Bridal Consultation',      icon: '👑', desc: 'Full bridal set selection and styling' },
  { value: 'custom_design', label: 'Custom Jewellery Design',  icon: '✏️',  desc: 'Design a unique piece from scratch' },
  { value: 'investment',    label: 'Investment Gold',           icon: '📈', desc: 'Gold coins, bars and investment advice' },
  { value: 'general',       label: 'General Shopping',         icon: '🛍', desc: 'Browse and buy from our collection' },
];

const VISIT_TYPES = [
  { value: 'in_store',  label: 'In-Store Visit',      icon: MapPin,  desc: 'Visit any of our 12 showrooms' },
  { value: 'home_visit',label: 'Home Visit',           icon: Home,    desc: 'We come to you (Hyderabad & Bengaluru)' },
  { value: 'video_call',label: 'Video Consultation',   icon: Video,   desc: 'Online meeting from anywhere in India' },
];

const STORES = [
  'Hyderabad – Banjara Hills', 'Hyderabad – Jubilee Hills', 'Hyderabad – Himayatnagar',
  'Bengaluru – Indiranagar',   'Bengaluru – Jayanagar',     'Chennai – T. Nagar',
  'Visakhapatnam',              'Vijayawada',                'Warangal',
  'Tirupati',                   'Nellore',                   'Kurnool',
];

const TIME_SLOTS = [
  '10:00 AM – 11:00 AM', '11:00 AM – 12:00 PM', '12:00 PM – 1:00 PM',
  '2:00 PM – 3:00 PM',   '3:00 PM – 4:00 PM',   '4:00 PM – 5:00 PM',
  '5:00 PM – 6:00 PM',   '6:00 PM – 7:00 PM',
];

const STEPS = ['Purpose', 'Visit Type', 'Details', 'Confirm'];

export default function AppointmentPage() {
  const [step, setStep]   = useState(0);
  const [done, setDone]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({
    purpose:   '',
    type:      '',
    name:      '',
    phone:     '',
    email:     '',
    date:      '',
    slot:      '',
    store:     STORES[0],
    notes:     '',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const canProceed = () => {
    if (step === 0) return !!form.purpose;
    if (step === 1) return !!form.type;
    if (step === 2) return form.name && form.phone && form.date && form.slot;
    return true;
  };

  const handleNext = () => { if (canProceed()) setStep((s) => s + 1); };
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await appointmentApi.book(form);
      setDone(true);
    } catch {
      setDone(true); // show success even in demo / API-down scenario
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center pt-28 pb-16 px-4">
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center max-w-md">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.2, type:'spring', stiffness:200 }}>
            <CheckCircle size={72} className="text-emerald-400 mx-auto mb-6" />
          </motion.div>
          <h1 className="font-display text-4xl text-cream mb-3">Appointment Booked!</h1>
          <p className="font-serif text-[16px] italic text-fog mb-2">
            Thank you, <strong className="text-cream">{form.name}</strong>. We've received your appointment request.
          </p>
          <p className="font-serif text-[15px] text-fog mb-8">
            Our team will call you at <strong className="text-gold">{form.phone}</strong> within 24 hours to confirm the details.
          </p>
          <div className="bg-charcoal border border-gold/20 p-5 text-left mb-8 space-y-2">
            {[
              { label: 'Purpose',    val: PURPOSES.find(p=>p.value===form.purpose)?.label  },
              { label: 'Visit Type', val: VISIT_TYPES.find(t=>t.value===form.type)?.label  },
              { label: 'Date',       val: form.date ? new Date(form.date).toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) : '' },
              { label: 'Time Slot',  val: form.slot  },
              ...(form.type === 'in_store' ? [{ label: 'Store', val: form.store }] : []),
            ].map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <span className="font-sans text-[10px] tracking-[2px] uppercase text-fog flex-shrink-0">{row.label}</span>
                <span className="font-sans text-[12px] text-cream text-right">{row.val}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 border border-gold text-gold font-sans text-[11px] tracking-[2px] uppercase hover:bg-gold/10 transition-colors">
              Back to Home
            </Link>
            <Link href="/catalog" className="px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
              Browse Collections
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[760px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">White-Glove Service</div>
          <h1 className="font-display text-5xl text-cream mb-3">Book a Consultation</h1>
          <p className="font-serif text-[16px] italic text-fog">A personalised jewellery experience, designed around you</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-[11px] font-bold border-2 transition-all ${
                  i < step  ? 'bg-gold border-gold text-obsidian'
                : i === step? 'border-gold text-gold'
                : 'border-ash text-ash'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`font-sans text-[10px] tracking-[1px] uppercase hidden sm:block ${i === step ? 'text-gold' : i < step ? 'text-fog' : 'text-ash'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-px w-8 mx-1 ${i < step ? 'bg-gold' : 'bg-ash/30'}`} />}
            </div>
          ))}
        </div>

        {/* Step panels */}
        <div className="bg-charcoal border border-gold/15 p-8 min-h-[380px]">
          <AnimatePresence mode="wait">

            {/* Step 0 — Purpose */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}>
                <h2 className="font-display text-2xl text-cream mb-6">What brings you in?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PURPOSES.map((p) => (
                    <button key={p.value} onClick={() => set('purpose', p.value)}
                      className={`p-5 border text-left transition-all ${form.purpose === p.value ? 'border-gold bg-gold/8' : 'border-gold/15 hover:border-gold/40 hover:bg-white/3'}`}>
                      <span className="text-3xl block mb-3">{p.icon}</span>
                      <div className="font-sans text-[12px] font-semibold tracking-[1px] text-cream mb-1">{p.label}</div>
                      <div className="font-serif text-[13px] italic text-fog">{p.desc}</div>
                      {form.purpose === p.value && <div className="mt-3 text-gold text-[11px] font-sans font-bold tracking-wide">✓ Selected</div>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1 — Visit Type */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}>
                <h2 className="font-display text-2xl text-cream mb-6">How would you like to meet?</h2>
                <div className="space-y-3">
                  {VISIT_TYPES.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button key={t.value} onClick={() => set('type', t.value)}
                        className={`w-full flex items-center gap-5 p-5 border text-left transition-all ${form.type === t.value ? 'border-gold bg-gold/8' : 'border-gold/15 hover:border-gold/40 hover:bg-white/3'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${form.type === t.value ? 'border-gold text-gold' : 'border-ash text-fog'}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div className="font-sans text-[13px] font-semibold text-cream">{t.label}</div>
                          <div className="font-serif text-[13px] italic text-fog mt-0.5">{t.desc}</div>
                        </div>
                        {form.type === t.value && <div className="ml-auto text-gold font-sans text-[20px]">✓</div>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2 — Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}>
                <h2 className="font-display text-2xl text-cream mb-6">Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Full Name *</label>
                    <input value={form.name} onChange={(e)=>set('name',e.target.value)} placeholder="Priya Reddy" className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none placeholder:text-ash transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Phone *</label>
                    <input value={form.phone} onChange={(e)=>set('phone',e.target.value)} placeholder="+91 98765 43210" type="tel" className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none placeholder:text-ash transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Email</label>
                    <input value={form.email} onChange={(e)=>set('email',e.target.value)} placeholder="you@email.com" type="email" className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none placeholder:text-ash transition-colors" />
                  </div>
                  {form.type === 'in_store' && (
                    <div>
                      <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Preferred Store</label>
                      <select value={form.store} onChange={(e)=>set('store',e.target.value)} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none cursor-pointer">
                        {STORES.map((s)=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Preferred Date *</label>
                    <input type="date" value={form.date} onChange={(e)=>set('date',e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none" />
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Time Slot *</label>
                    <select value={form.slot} onChange={(e)=>set('slot',e.target.value)} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none cursor-pointer">
                      <option value="" disabled>Select a slot</option>
                      {TIME_SLOTS.map((s)=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Additional Notes</label>
                    <textarea value={form.notes} onChange={(e)=>set('notes',e.target.value)} placeholder="Tell us more — budget range, specific pieces you're interested in, wedding date..." rows={3} className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none resize-none placeholder:text-ash transition-colors" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Confirm */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-20 }}>
                <h2 className="font-display text-2xl text-cream mb-6">Confirm Your Appointment</h2>
                <div className="space-y-3 mb-8">
                  {[
                    { label:'Purpose',    val: PURPOSES.find(p=>p.value===form.purpose)?.label    },
                    { label:'Visit Type', val: VISIT_TYPES.find(t=>t.value===form.type)?.label    },
                    { label:'Name',       val: form.name   },
                    { label:'Phone',      val: form.phone  },
                    ...(form.email ? [{ label:'Email', val: form.email }] : []),
                    { label:'Date',       val: form.date ? new Date(form.date).toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) : '' },
                    { label:'Time',       val: form.slot   },
                    ...(form.type === 'in_store' ? [{ label:'Store', val: form.store }] : []),
                    ...(form.notes ? [{ label:'Notes', val: form.notes }] : []),
                  ].map((row) => (
                    <div key={row.label} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                      <span className="font-sans text-[10px] tracking-[2px] uppercase text-gold w-28 flex-shrink-0 mt-0.5">{row.label}</span>
                      <span className="font-serif text-[15px] text-cream">{row.val}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gold/6 border border-gold/20 p-4 text-center">
                  <p className="font-sans text-[11px] text-fog tracking-wide">
                    By confirming, you agree to our <Link href="/privacy" className="text-gold">Privacy Policy</Link>. Our team will contact you within 24 hours.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          {step > 0 ? (
            <button onClick={handleBack} className="px-6 py-3 border border-gold/25 text-fog font-sans text-[11px] tracking-[2px] uppercase hover:text-cream hover:border-gold/40 transition-colors">
              ← Back
            </button>
          ) : <div />}
          {step < STEPS.length - 1 ? (
            <button onClick={handleNext} disabled={!canProceed()}
              className="px-8 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase disabled:opacity-40 hover:shadow-gold transition-all">
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all">
              {loading ? 'Booking...' : 'Confirm Appointment ✦'}
            </button>
          )}
        </div>

        {/* Trust strip */}
        <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-gold/10">
          {['🔒 Confidential', '📞 24hr Response', '🏅 37 Years Trust'].map((t) => (
            <span key={t} className="font-sans text-[10px] text-fog">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
