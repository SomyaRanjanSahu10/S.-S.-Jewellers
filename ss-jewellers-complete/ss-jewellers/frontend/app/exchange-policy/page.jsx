// ============================================================
// app/exchange-policy/page.jsx
// ============================================================
export const metadata = {
  title: 'Exchange Policy | S.S. Jewellers',
  description: 'S.S. Jewellers exchange and buy-back policy. Lifetime exchange guarantee on all BIS hallmarked gold jewellery.',
};

export default function ExchangePolicyPage() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Customer Care</div>
          <h1 className="font-display text-5xl text-cream mb-4">Exchange & Buy-Back Policy</h1>
          <p className="font-serif text-[17px] italic text-fog">Your trust is our most precious asset — and we honour it for life.</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {[
            {
              title: 'Lifetime Exchange Guarantee',
              icon: '🔄',
              content: `All jewellery purchased from S.S. Jewellers carries a lifetime exchange guarantee. You may exchange any piece for another item of equal or higher value at any of our 12 showrooms across South India.

**Exchange value** is calculated at the prevailing gold rate on the day of exchange, minus a nominal re-making charge of 10–15% (depending on the piece). The original making charge paid is not deducted from the exchange value.`,
            },
            {
              title: 'Buy-Back Policy',
              icon: '💰',
              content: `We offer a competitive buy-back programme for all hallmarked jewellery purchased from us. The buy-back value is calculated at:

• **95%** of the prevailing gold rate for 22K & 24K gold
• **92%** of the prevailing gold rate for 18K gold
• Stone value (diamonds, rubies, emeralds) assessed separately by our gemologist

The buy-back amount is settled by cheque or NEFT within 3 working days.`,
            },
            {
              title: 'Conditions',
              icon: '📋',
              content: `To avail exchange or buy-back:

1. Original purchase invoice from S.S. Jewellers is required
2. BIS hallmarking should be intact and legible
3. Jewellery must not be structurally altered by a third party
4. Exchange within 30 days of purchase: full making charge waiver
5. Exchange after 30 days: standard re-making charges apply

**Exclusions:** Custom-made pieces, engraved items, and gemstone-studded pieces are eligible for exchange but may attract higher re-making charges.`,
            },
            {
              title: 'Process',
              icon: '📝',
              content: `**In-Store:** Walk into any of our showrooms with the jewellery and original invoice. Our team will assess the piece and provide a valuation on the spot.

**Online-Assisted:** Contact us on WhatsApp (+91 40 2345 6789) or email (hello@ssjewellers.in) to schedule an assessment. We offer home pickup for exchange/buy-back in Hyderabad and Bengaluru for purchases above ₹50,000.`,
            },
          ].map((section) => (
            <div key={section.title} className="bg-charcoal border border-gold/12 p-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="font-display text-2xl text-cream">{section.title}</h2>
              </div>
              <div className="font-serif text-[15px] text-fog leading-[1.9] whitespace-pre-line">
                {section.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-semibold text-cream not-italic">{line.replace(/\*\*/g, '')}</p>;
                  }
                  if (line.startsWith('•')) {
                    return <div key={i} className="flex items-start gap-2 ml-4"><span className="text-gold mt-1">•</span><span>{line.slice(1).trim()}</span></div>;
                  }
                  if (/^\d\./.test(line)) {
                    return <div key={i} className="flex items-start gap-3 ml-4"><span className="text-gold font-sans text-[11px] font-bold w-4 flex-shrink-0 mt-1">{line[0]}.</span><span>{line.slice(2).trim()}</span></div>;
                  }
                  return line.trim() ? <p key={i}>{line}</p> : <br key={i} />;
                })}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div className="bg-gradient-to-r from-gold-dark/20 to-gold/10 border border-gold/25 p-6 text-center">
            <h3 className="font-display text-xl text-cream mb-2">Questions?</h3>
            <p className="font-serif text-[14px] italic text-fog mb-4">Our customer care team is available 7 days a week.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+914023456789" className="font-sans text-[11px] tracking-[1px] text-gold border border-gold/30 px-5 py-2.5 hover:bg-gold/10 transition-colors">📞 +91 40 2345 6789</a>
              <a href="https://wa.me/914023456789" className="font-sans text-[11px] tracking-[1px] text-[#25D366] border border-[#25D366]/30 px-5 py-2.5 hover:bg-[#25D366]/10 transition-colors">💬 WhatsApp</a>
              <a href="mailto:hello@ssjewellers.in" className="font-sans text-[11px] tracking-[1px] text-fog border border-fog/20 px-5 py-2.5 hover:text-cream transition-colors">✉ Email Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
