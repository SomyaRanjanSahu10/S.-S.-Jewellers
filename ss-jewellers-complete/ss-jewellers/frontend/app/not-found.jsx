// app/not-found.jsx — Custom 404 page
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        {/* Decorative */}
        <div className="relative w-40 h-40 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border border-gold/20 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 rounded-full border border-gold/15 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-6xl text-gold-dark opacity-60">404</span>
          </div>
        </div>

        <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Page Not Found</div>
        <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">
          This Gem Has<br />Gone Missing
        </h1>
        <p className="font-serif text-[16px] italic text-fog mb-10 leading-relaxed">
          The page you're looking for may have been moved, renamed, or doesn't exist. Let's get you back to our sparkling collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all"
          >
            ← Back to Home
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold text-gold font-sans text-[11px] font-bold tracking-[2px] uppercase hover:bg-gold/10 transition-all"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
