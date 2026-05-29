// ============================================================
// app/buyback-policy/page.jsx
// ============================================================
export const metadata = { title: 'Buy-Back Policy | S.S. Jewellers' };

export default function BuyBackPage() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Customer Assurance</div>
          <h1 className="font-display text-5xl text-cream mb-3">Buy-Back Policy</h1>
          <p className="font-serif text-[17px] italic text-fog">Your gold is always valuable — we guarantee it.</p>
        </div>
        <div className="space-y-5">
          {[
            {
              icon: '💰',
              title: 'Buy-Back Rates',
              content: `We offer market-linked buy-back rates for all jewellery purchased from S.S. Jewellers:

• 22K & 24K Gold jewellery: 95% of the day's gold rate
• 18K Gold jewellery: 92% of the day's gold rate
• Diamond jewellery: Gold value at 95% + diamond value assessed by our certified gemologist
• Gemstone pieces: Gold value + independent stone valuation

The buy-back amount is settled by account transfer (NEFT/RTGS) within 3 working days.`,
            },
            {
              icon: '📋',
              title: 'Eligibility',
              content: `To avail buy-back:

1. Present the original S.S. Jewellers purchase invoice
2. BIS hallmark must be intact and legible
3. Jewellery must not have been structurally altered, damaged, or repaired by a third party
4. Government-issued photo ID of the seller is required

Jewellery not meeting these criteria may still be accepted at a reduced rate, subject to assessment.`,
            },
            {
              icon: '🏛',
              title: 'Process',
              content: `Walk into any S.S. Jewellers showroom with the jewellery and invoice. Our team will:

Step 1: Verify the invoice and BIS hallmark
Step 2: Weigh the jewellery on our certified scales (in front of you)
Step 3: Provide a written valuation estimate
Step 4: On acceptance, process payment within 3 working days

For large-value buy-backs (above ₹5 lakhs), prior appointment is recommended.`,
            },
            {
              icon: '🔄',
              title: 'Exchange vs Buy-Back',
              content: `Exchange (to another S.S. Jewellers piece): You receive 100% of gold value as exchange credit, with only re-making charges applicable.

Buy-Back (cash): You receive 95% of gold value in cash. If the market rate has increased since your purchase, you may receive more than you paid.

We recommend exchange over buy-back as it maximises the value you receive.`,
            },
          ].map((s) => (
            <div key={s.title} className="bg-charcoal border border-gold/12 p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{s.icon}</span>
                <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold">{s.title}</h2>
              </div>
              <div className="font-serif text-[14px] text-fog leading-[1.9] whitespace-pre-line">
                {s.content.split('\n').map((line, i) => {
                  if (line.startsWith('•') || /^Step \d|^\d\./.test(line)) {
                    return (
                      <div key={i} className="flex items-start gap-2 ml-2 mb-1">
                        <span className="text-gold flex-shrink-0 mt-1 text-xs">›</span>
                        <span>{line.replace(/^[•\d\.Step\s]+/, '').trim()}</span>
                      </div>
                    );
                  }
                  return line.trim() ? <p key={i} className="mb-2">{line}</p> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
