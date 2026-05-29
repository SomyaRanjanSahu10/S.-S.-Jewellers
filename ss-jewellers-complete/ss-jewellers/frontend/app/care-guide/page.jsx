// ============================================================
// app/care-guide/page.jsx
// ============================================================
export const metadata = {
  title: 'Gold Jewellery Care Guide | S.S. Jewellers',
  description: 'How to clean, store and maintain your gold jewellery for generations. Expert tips from S.S. Jewellers.',
};

const CARE_TIPS = [
  {
    icon: '✨', title: 'Daily Care',
    tips: [
      'Remove jewellery before showering, swimming, or exercising — water and sweat can dull gold over time.',
      'Apply perfume, hairspray, and lotions before wearing jewellery, not after.',
      'Gold is soft — avoid wearing rings when doing heavy manual work or lifting.',
      'Remove jewellery before sleeping to prevent accidental bending or tangling.',
    ],
  },
  {
    icon: '🧹', title: 'Cleaning at Home',
    tips: [
      'Mix a few drops of mild dish soap in warm water. Soak for 15 minutes, then gently scrub with a soft-bristle toothbrush.',
      'Rinse thoroughly under warm running water and pat dry with a lint-free cloth.',
      'Never use harsh chemicals, bleach, chlorine, or abrasive cleaners on gold.',
      'For ultrasonic cleaning, visit our showroom — we offer complimentary cleaning for S.S. Jewellers purchases.',
    ],
  },
  {
    icon: '📦', title: 'Storage',
    tips: [
      'Store each piece separately in a soft fabric pouch or lined jewellery box to prevent scratches.',
      'Keep away from direct sunlight and heat — this can cause discolouration over time.',
      'Use anti-tarnish strips in your jewellery box to absorb moisture.',
      'Chains should be stored with clasps fastened to prevent tangling.',
    ],
  },
  {
    icon: '💎', title: 'Gemstone Care',
    tips: [
      'Diamonds are hard but can still chip — avoid knocking set pieces against hard surfaces.',
      'Remove rings before handling chemicals, even household cleaners.',
      'Natural gemstones (rubies, emeralds, sapphires) should be cleaned gently — no ultrasonic cleaning.',
      'Pearls are porous — wipe with a soft damp cloth only, never soak.',
    ],
  },
  {
    icon: '🏛', title: 'Professional Servicing',
    tips: [
      'Visit a S.S. Jewellers showroom once a year for professional cleaning and polishing.',
      'Get prong settings checked annually — prongs wear over time and gemstones can become loose.',
      'Our craftsmen offer rhodium plating for white gold pieces to restore their bright finish.',
      'All servicing by S.S. Jewellers certified craftsmen comes with a quality guarantee.',
    ],
  },
  {
    icon: '🔒', title: 'Insurance & Safety',
    tips: [
      'Keep your original S.S. Jewellers invoice and BIS certificate in a safe place.',
      'Consider insuring high-value pieces — ask us for tie-up insurer recommendations.',
      'Photograph your jewellery collection periodically for insurance records.',
      'Store high-value pieces in a home safe or bank locker when not in use.',
    ],
  },
];

export default function CareGuidePage() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Expert Advice</div>
          <h1 className="font-display text-5xl text-cream mb-4">Gold Jewellery Care Guide</h1>
          <p className="font-serif text-[17px] italic text-fog max-w-xl mx-auto">
            Gold is timeless — but it needs love. Follow these expert tips from our master craftsmen to keep your jewellery radiant for generations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARE_TIPS.map((section) => (
            <div key={section.title} className="bg-charcoal border border-gold/12 hover:border-gold/35 p-6 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gold flex-shrink-0 mt-1 text-xs">✦</span>
                    <span className="font-serif text-[13px] text-fog leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Free cleaning CTA */}
        <div className="mt-12 text-center p-10 bg-gradient-to-r from-gold-dark/15 via-gold/8 to-gold-dark/15 border border-gold/20">
          <div className="text-4xl mb-4">🏛</div>
          <h2 className="font-display text-3xl text-cream mb-3">Free Jewellery Cleaning</h2>
          <p className="font-serif text-[16px] italic text-fog mb-6 max-w-md mx-auto">
            All S.S. Jewellers customers receive complimentary ultrasonic cleaning and polishing at any of our showrooms — for the life of the piece.
          </p>
          <a href="/stores" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
            Find a Showroom
          </a>
        </div>
      </div>
    </div>
  );
}
