'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CONTACT_TYPES = [
  { value: 'general',     label: 'General Enquiry'     },
  { value: 'order',       label: 'Order Support'        },
  { value: 'product',     label: 'Product Information'  },
  { value: 'bridal',      label: 'Bridal Consultation'  },
  { value: 'custom',      label: 'Custom Design'        },
  { value: 'feedback',    label: 'Feedback'             },
  { value: 'exchange',    label: 'Exchange / Buy-Back'  },
  { value: 'other',       label: 'Other'                },
];

const FAQ_ITEMS = [
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 5–7 business days anywhere in India. Express delivery (2–3 days) is available in Hyderabad and Bengaluru for an additional charge.',
  },
  {
    q: 'Is the jewellery BIS hallmarked?',
    a: 'Yes, every piece sold by S.S. Jewellers is BIS hallmarked with a unique HUID number. You can verify purity on the BIS Care app or at bis.gov.in.',
  },
  {
    q: 'What is your exchange policy?',
    a: 'We offer a lifetime exchange guarantee on all jewellery. Exchange within 30 days: full making charge waiver. After 30 days: standard re-making charges apply.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. Visit ssjewellers.in/track-order or check your profile under "My Orders" for real-time delivery status.',
  },
  {
    q: 'Do you offer EMI?',
    a: 'Yes, EMI is available on all major credit cards (HDFC, SBI, ICICI, Axis, Kotak) for purchases above ₹5,000. No-cost EMI is available for 3 months on select cards for purchases above ₹25,000.',
  },
  {
    q: 'Can you design custom jewellery?',
    a: 'Absolutely. Book a consultation (in-store, home visit, or video call) to discuss your custom design. Our master craftsmen will bring your vision to life.',
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gold/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-serif text-[16px] text-cream leading-snug">{item.q}</span>
        <span className={`text-gold flex-shrink-0 text-xl transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-4"
        >
          <p className="font-serif text-[14px] text-fog leading-relaxed">{item.a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', type: 'general', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill name, email and message');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        toast.success('Message sent! We\'ll respond within 24 hours.');
      } else {
        toast.error(data.message || 'Failed to send. Please try again.');
      }
    } catch {
      toast.error('Network error. Please try WhatsApp or phone instead.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Get in Touch</div>
          <h1 className="font-display text-5xl text-cream mb-3">Contact Us</h1>
          <p className="font-serif text-[17px] italic text-fog max-w-lg mx-auto">
            Our team is available 7 days a week to answer your questions and help you find your perfect jewellery.
          </p>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            {
              icon:  <Phone size={22} className="text-gold" />,
              title: 'Call Us',
              lines: ['+91 40 2345 6789', '+91 80 2345 6789'],
              sub:   'Mon–Sun: 10 AM – 9 PM',
              href:  'tel:+914023456789',
            },
            {
              icon:  <MessageCircle size={22} className="text-gold" />,
              title: 'WhatsApp',
              lines: ['+91 40 2345 6789'],
              sub:   'Instant replies · 24/7',
              href:  'https://wa.me/914023456789?text=Hello%20S.S.%20Jewellers!',
            },
            {
              icon:  <Mail size={22} className="text-gold" />,
              title: 'Email',
              lines: ['hello@ssjewellers.in', 'support@ssjewellers.in'],
              sub:   'Response within 24 hours',
              href:  'mailto:hello@ssjewellers.in',
            },
            {
              icon:  <MapPin size={22} className="text-gold" />,
              title: 'Head Office',
              lines: ['Road No. 12, Banjara Hills', 'Hyderabad – 500034'],
              sub:   '12 showrooms pan South India',
              href:  '/stores',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="group bg-charcoal border border-gold/12 hover:border-gold/40 p-6 transition-all hover:-translate-y-1"
            >
              <div className="mb-4">{card.icon}</div>
              <div className="font-sans text-[10px] tracking-[3px] uppercase text-gold mb-3">{card.title}</div>
              {card.lines.map((l) => (
                <div key={l} className="font-sans text-[13px] text-cream font-medium">{l}</div>
              ))}
              <div className="font-sans text-[11px] text-fog mt-2">{card.sub}</div>
            </a>
          ))}
        </div>

        {/* Form + FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12">

          {/* Contact form */}
          <div>
            <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-2">Send a Message</div>
            <h2 className="font-display text-3xl text-cream mb-7">How Can We Help?</h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/8 border border-emerald-500/30 p-10 text-center"
              >
                <div className="text-5xl mb-5">✅</div>
                <h3 className="font-display text-2xl text-cream mb-3">Message Sent!</h3>
                <p className="font-serif text-[16px] italic text-fog mb-2">
                  Thank you, <strong className="text-cream">{form.name}</strong>. We've received your message.
                </p>
                <p className="font-sans text-[12px] text-fog">
                  You'll hear from us at <strong className="text-cream">{form.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name:'',email:'',phone:'',type:'general',subject:'',message:'' }); }}
                  className="mt-6 font-sans text-[11px] tracking-[2px] uppercase text-gold border border-gold/30 px-6 py-2.5 hover:bg-gold/10 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Full Name *</label>
                    <input
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      placeholder="Priya Reddy"
                      required
                      className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Enquiry Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => set('type', e.target.value)}
                      className="w-full bg-charcoal border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none cursor-pointer"
                    >
                      {CONTACT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Subject</label>
                  <input
                    value={form.subject}
                    onChange={(e) => set('subject', e.target.value)}
                    placeholder="Brief subject of your enquiry"
                    className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Please describe your enquiry in detail. For order issues, include your order number."
                    rows={5}
                    required
                    className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none resize-none placeholder:text-ash transition-colors"
                  />
                  <div className="text-right font-sans text-[10px] text-fog mt-1">{form.message.length}/2000</div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all"
                >
                  {loading ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <Send size={14} />
                  )}
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ sidebar */}
          <div>
            <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-2">Quick Answers</div>
            <h2 className="font-display text-3xl text-cream mb-7">FAQs</h2>
            <div className="space-y-0">
              {FAQ_ITEMS.map((item, i) => (
                <FAQItem key={i} item={item} index={i} />
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8 p-6 bg-charcoal border border-[#25D366]/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💬</span>
                <div className="font-sans text-[11px] tracking-[2px] uppercase text-[#25D366]">Fastest Response</div>
              </div>
              <p className="font-serif text-[14px] text-fog mb-4">
                For instant answers, WhatsApp us. Our team responds within minutes during business hours.
              </p>
              <a
                href="https://wa.me/914023456789?text=Hello%20S.S.%20Jewellers!%20I%20have%20a%20query."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#25D366]/40 text-[#25D366] font-sans text-[11px] font-semibold tracking-[2px] uppercase hover:bg-[#25D366]/10 transition-colors"
              >
                <MessageCircle size={14} /> Chat on WhatsApp
              </a>
            </div>

            {/* Hours */}
            <div className="mt-4 p-6 bg-charcoal border border-gold/12">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={16} className="text-gold" />
                <div className="font-sans text-[10px] tracking-[3px] uppercase text-gold">Working Hours</div>
              </div>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Friday',  hours: '10:00 AM – 9:00 PM' },
                  { day: 'Saturday',         hours: '10:00 AM – 9:00 PM' },
                  { day: 'Sunday',           hours: '10:00 AM – 8:00 PM' },
                  { day: 'Public Holidays',  hours: '11:00 AM – 7:00 PM' },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between font-sans text-[12px]">
                    <span className="text-fog">{h.day}</span>
                    <span className="text-cream">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
