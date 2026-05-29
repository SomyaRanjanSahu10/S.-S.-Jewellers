'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '@/lib/store';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  {
    label: 'Collections',
    mega: [
      { heading: 'By Category', links: [
        { label: '💍 Rings', href: '/catalog/rings' },
        { label: '✨ Earrings', href: '/catalog/earrings' },
        { label: '📿 Necklaces', href: '/catalog/necklaces' },
        { label: '🔆 Bangles', href: '/catalog/bangles' },
        { label: '⛓ Chains', href: '/catalog/chains' },
      ]},
      { heading: 'By Occasion', links: [
        { label: 'Bridal Sets', href: '/catalog/bridal' },
        { label: 'Wedding', href: '/catalog?occasion=wedding' },
        { label: 'Daily Wear', href: '/catalog?occasion=daily' },
        { label: 'Festive', href: '/catalog?occasion=festive' },
        { label: 'Office Wear', href: '/catalog?occasion=office' },
      ]},
      { heading: 'For Him', links: [
        { label: 'Gold Chains', href: '/catalog/men?type=chains' },
        { label: 'Kadas', href: '/catalog/men?type=kadas' },
        { label: 'Rings', href: '/catalog/men?type=rings' },
        { label: 'Pendants', href: '/catalog/men?type=pendants' },
      ]},
      { heading: 'By Purity', links: [
        { label: '22K Gold', href: '/catalog?purity=22K' },
        { label: '24K Gold', href: '/catalog?purity=24K' },
        { label: '18K Gold', href: '/catalog?purity=18K' },
        { label: 'Rose Gold', href: '/catalog?metal=rose' },
        { label: 'Platinum', href: '/catalog?metal=platinum' },
      ]},
      { heading: 'What\'s New', links: [
        { label: '🆕 New Arrivals', href: '/catalog?badge=new' },
        { label: '🏆 Bestsellers', href: '/catalog?badge=bestseller' },
        { label: '🔥 Trending', href: '/catalog?badge=trending' },
        { label: '🌟 Featured', href: '/catalog?featured=true' },
      ]},
    ],
  },
  { label: 'Bridal', href: '/bridal' },
  { label: 'AI Stylist', href: '/ai-stylist' },
  { label: 'Stores', href: '/stores' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [megaOpen,    setMegaOpen]    = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleCart }  = useUIStore();
  const { toggleMenu, menuOpen, openSearch, searchOpen, closeSearch } = useUIStore();
  const cartCount = useCartStore((s) => s.items.reduce((t, i) => t + i.qty, 0));
  const wlCount   = useWishlistStore((s) => s.items.length);
  const { isLoggedIn } = useAuthStore();
  const searchRef = useRef(null);
  const pathname  = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mega on route change
  useEffect(() => { setMegaOpen(null); }, [pathname]);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gold text-obsidian text-center py-2 text-[10px] font-sans font-semibold tracking-[2px] uppercase z-50 relative">
        ✦ FREE HALLMARKING ON ORDERS ABOVE ₹25,000 &nbsp;·&nbsp; BIS CERTIFIED GOLD &nbsp;·&nbsp; EMI AVAILABLE ✦
      </div>

      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-400 ${
          scrolled ? 'bg-obsidian/95 backdrop-blur-xl border-b border-gold/20 shadow-dark' : 'bg-transparent'
        }`}
        style={{ top: '36px' }}
      >
        <div className="flex items-center px-10 py-4 gap-8 max-w-[1600px] mx-auto">

          {/* Hamburger */}
          <button className="lg:hidden text-cream" onClick={toggleMenu} aria-label="Menu">
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex flex-col items-center mr-auto group">
            <span className="font-display text-[22px] font-bold tracking-[3px] text-gold-light leading-none group-hover:text-gold transition-colors">
              S.S. JEWELLERS
            </span>
            <span className="font-sans text-[8px] tracking-[5px] uppercase text-gold mt-0.5">
              Est. 2016 · Berhampur
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" onMouseLeave={() => setMegaOpen(null)}>
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative" onMouseEnter={() => setMegaOpen(link.label)}>
                {link.href ? (
                  <Link
                    href={link.href}
                    className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-cream hover:text-gold transition-colors flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-cream hover:text-gold transition-colors flex items-center gap-1">
                    {link.label} <ChevronDown size={12} />
                  </button>
                )}

                {/* Mega menu */}
                <AnimatePresence>
                  {link.mega && megaOpen === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="fixed left-0 right-0 bg-obsidian/98 backdrop-blur-2xl border-y border-gold/20 shadow-dark-lg"
                      style={{ top: 'calc(100% + 0px)' }}
                    >
                      <div className="max-w-[1400px] mx-auto px-16 py-10 grid grid-cols-5 gap-10">
                        {link.mega.map((col) => (
                          <div key={col.heading}>
                            <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-4 pb-3 border-b border-gold/15">
                              {col.heading}
                            </div>
                            <ul className="space-y-2.5">
                              {col.links.map((l) => (
                                <li key={l.label}>
                                  <Link href={l.href} className="font-serif text-[14px] text-fog hover:text-gold-light hover:pl-1 transition-all block">
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Search bar */}
          <div className="hidden lg:flex items-center bg-white/5 border border-gold/20 focus-within:border-gold px-4 py-2 gap-2.5 transition-all min-w-[200px]">
            <Search size={13} className="text-gold" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchQuery && (window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`)}
              className="bg-transparent outline-none text-cream font-sans text-[12px] tracking-wide w-full placeholder:text-fog/60"
            />
          </div>

          {/* Icon group */}
          <div className="flex items-center gap-5">
            <Link href="/wishlist" className="relative text-cream hover:text-gold transition-colors group">
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              {wlCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-obsidian rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold font-sans">
                  {wlCount}
                </span>
              )}
            </Link>
            <button onClick={toggleCart} className="relative text-cream hover:text-gold transition-colors group">
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-obsidian rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold font-sans">
                  {cartCount}
                </span>
              )}
            </button>
            <Link href={isLoggedIn ? '/profile' : '/login'} className="text-cream hover:text-gold transition-colors">
              <User size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={toggleMenu}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="fixed top-0 left-0 w-80 h-full bg-charcoal border-r border-gold/15 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <span className="font-display text-xl text-gold-light tracking-widest">S.S. JEWELLERS</span>
                <button onClick={toggleMenu} className="text-fog hover:text-gold"><X size={20} /></button>
              </div>
              <nav className="p-6 space-y-0">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'All Collections', href: '/catalog' },
                  { label: 'Rings', href: '/catalog/rings' },
                  { label: 'Necklaces', href: '/catalog/necklaces' },
                  { label: 'Earrings', href: '/catalog/earrings' },
                  { label: 'Bangles', href: '/catalog/bangles' },
                  { label: 'Bridal Sets', href: '/bridal' },
                  { label: 'Men\'s Jewellery', href: '/catalog/men' },
                  { label: 'AI Stylist', href: '/ai-stylist' },
                  { label: 'Our Stores', href: '/stores' },
                  { label: isLoggedIn ? 'My Account' : 'Sign In', href: isLoggedIn ? '/profile' : '/login' },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={toggleMenu}
                    className="flex items-center justify-between py-4 font-sans text-[12px] tracking-[2px] uppercase text-cream hover:text-gold border-b border-gold/10 transition-colors"
                  >
                    {l.label}
                    <span className="text-gold opacity-40">›</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-gold/10 mt-4">
                <div className="font-sans text-[9px] tracking-[3px] uppercase text-gold mb-3">Contact</div>
                <a href="tel:+914023456789" className="font-sans text-[13px] text-cream">📞 +91 40 2345 6789</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
