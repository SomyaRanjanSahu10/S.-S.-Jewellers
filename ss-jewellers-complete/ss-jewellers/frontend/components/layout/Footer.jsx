'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Youtube, Facebook, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

const FOOTER_LINKS = {
  Collections: [
    { label: 'Gold Rings',        href: '/catalog/rings'     },
    { label: 'Gold Earrings',     href: '/catalog/earrings'  },
    { label: 'Gold Necklaces',    href: '/catalog/necklaces' },
    { label: 'Bangles & Kadas',   href: '/catalog/bangles'   },
    { label: 'Bridal Sets',       href: '/bridal'            },
    { label: "Men's Jewellery",   href: '/catalog/men'       },
  ],
  'Customer Care': [
    { label: 'Track Your Order',  href: '/profile/orders'    },
    { label: 'Exchange Policy',   href: '/exchange-policy'   },
    { label: 'Buy-Back Policy',   href: '/buyback-policy'    },
    { label: 'Gold Care Guide',   href: '/care-guide'        },
    { label: 'Hallmarking Info',  href: '/hallmarking'       },
    { label: 'EMI Options',       href: '/emi'               },
  ],
  Company: [
    { label: 'About Us',          href: '/about'             },
    { label: 'Store Locator',     href: '/stores'            },
    { label: 'Book Appointment',  href: '/#appointment'      },
    { label: 'AI Stylist',        href: '/ai-stylist'        },
    { label: 'Careers',           href: '/careers'           },
    { label: 'Press & Media',     href: '/press'             },
  ],
};

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com/ssjewellers',  label: 'Instagram' },
  { icon: Facebook,  href: 'https://facebook.com/ssjewellers',   label: 'Facebook'  },
  { icon: Youtube,   href: 'https://youtube.com/@ssjewellers',   label: 'YouTube'   },
  { icon: Twitter,   href: 'https://twitter.com/ssjewellers',    label: 'Twitter'   },
];

const CERTIFICATIONS = ['BIS', 'ISO', 'GIA', 'GJEPC'];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing! Exclusive offers coming your way. ✨');
    setEmail('');
  };

  return (
    <footer className="bg-obsidian border-t border-gold/15">

      {/* Top bar – Newsletter */}
      <div className="border-b border-gold/10 py-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-display text-[22px] text-cream">Stay in the loop ✨</div>
            <p className="font-serif text-[14px] italic text-fog mt-1">Exclusive offers, new arrivals & gold price alerts — straight to your inbox.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[12px] px-5 py-3.5 outline-none placeholder:text-ash transition-colors"
            />
            <button
              type="submit"
              className="px-6 bg-gradient-to-r from-gold-dark to-gold text-obsidian font-sans text-[10px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

          {/* Brand col */}
          <div>
            <div className="font-display text-[26px] text-gold-light tracking-[3px] mb-1">S.S. JEWELLERS</div>
            <div className="font-sans text-[8px] tracking-[5px] uppercase text-gold mb-5">Est. 1987 · Hyderabad</div>
            <p className="font-serif text-[14px] text-fog leading-[1.9] mb-6 max-w-[280px]">
              Three generations of trust, crafting heirloom jewellery that becomes part of your family's story.
              Every piece is BIS hallmarked with a lifetime buy-back guarantee.
            </p>
            {/* Social */}
            <div className="flex gap-3 mb-6">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-gold/20 flex items-center justify-center text-fog hover:text-gold hover:border-gold hover:bg-gold/8 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
              <a
                href="https://wa.me/914023456789"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 border border-[#25D366]/25 flex items-center justify-center text-fog hover:text-[#25D366] hover:border-[#25D366] transition-all"
              >
                💬
              </a>
            </div>
            {/* Certifications */}
            <div className="flex items-center gap-3 flex-wrap">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert} className="border border-gold/20 px-3 py-1.5 font-sans text-[9px] tracking-[2px] uppercase text-fog">
                  {cert}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-5">{heading}</div>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans text-[12px] text-fog hover:text-gold-light hover:pl-1.5 transition-all inline-flex items-center gap-2 group"
                    >
                      <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">›</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="mt-12 pt-8 border-t border-white/6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📞', label: 'Phone',   value: '+91 40 2345 6789', href: 'tel:+914023456789'          },
            { icon: '✉',  label: 'Email',   value: 'hello@ssjewellers.in', href: 'mailto:hello@ssjewellers.in' },
            { icon: '🕐', label: 'Hours',   value: 'Mon–Sun: 10 AM – 9 PM', href: null                    },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-sans text-[9px] tracking-[2px] uppercase text-gold mb-0.5">{item.label}</div>
                {item.href ? (
                  <a href={item.href} className="font-sans text-[13px] text-cream hover:text-gold transition-colors">{item.value}</a>
                ) : (
                  <span className="font-sans text-[13px] text-cream">{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[10px] text-ash tracking-wide">
            © {new Date().getFullYear()} S.S. Jewellers Pvt. Ltd. · All rights reserved · BIS Licence No. BIS/J/HYD/2024
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((l) => (
              <Link key={l} href={`/${l.toLowerCase().replace(/ /g, '-')}`} className="font-sans text-[10px] text-ash hover:text-gold transition-colors tracking-wide">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
