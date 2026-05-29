// app/hallmarking/page.jsx
export const metadata = { title: 'BIS Hallmarking | S.S. Jewellers' };

export default function HallmarkingPage() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <div className="mb-12 text-center">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Quality Assurance</div>
          <h1 className="font-display text-5xl text-cream mb-3">BIS Hallmarking</h1>
          <p className="font-serif text-[17px] italic text-fog max-w-xl mx-auto">
            Understanding the gold purity certification that protects you
          </p>
        </div>

        {/* What is hallmarking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-charcoal border border-gold/15 p-7">
            <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-4">What is BIS Hallmarking?</h2>
            <p className="font-serif text-[14px] text-fog leading-[1.9]">
              BIS (Bureau of Indian Standards) Hallmarking is the official certification of gold purity in India, governed by the BIS Act 2016. It guarantees that the jewellery contains exactly the stated proportion of pure gold — no more, no less.
            </p>
            <p className="font-serif text-[14px] text-fog leading-[1.9] mt-3">
              Since July 2021, hallmarking is mandatory for all gold jewellery sold in India. S.S. Jewellers has been BIS certified since 1995 — long before it became mandatory.
            </p>
          </div>
          <div className="bg-charcoal border border-gold/15 p-7">
            <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-4">The HUID Number</h2>
            <p className="font-serif text-[14px] text-fog leading-[1.9]">
              Since 2021, every hallmarked piece carries a unique 6-character alphanumeric <strong className="text-cream">HUID (Hallmark Unique ID)</strong>. This HUID is registered on the BIS Care app and portal — giving you complete transparency.
            </p>
            <p className="font-serif text-[14px] text-fog leading-[1.9] mt-3">
              You can verify any piece's purity by entering its HUID at <a href="https://bis.gov.in" className="text-gold hover:underline" target="_blank" rel="noreferrer">bis.gov.in</a> or in the BIS Care mobile app.
            </p>
          </div>
        </div>

        {/* Purity marks */}
        <div className="bg-charcoal border border-gold/15 p-7 mb-6">
          <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-6">Gold Purity Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gold/20">
                  {['Purity Mark', 'Purity', 'Millesimal Fineness', 'Best For', 'Typical Price (10g)'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-sans text-[9px] tracking-[2px] uppercase text-gold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { mark: '24K / 999', purity: '99.9% pure gold', fine: '999', use: 'Coins, bars, investment', price: '₹68,200' },
                  { mark: '22K / 916', purity: '91.6% pure gold', fine: '916', use: 'Traditional jewellery, bridal', price: '₹62,450' },
                  { mark: '18K / 750', purity: '75% pure gold',   fine: '750', use: 'Diamond jewellery, modern designs', price: '₹46,850' },
                  { mark: '14K / 585', purity: '58.5% pure gold', fine: '585', use: 'Western-style fashion jewellery', price: '₹36,500' },
                ].map((row, i) => (
                  <tr key={row.mark} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                    <td className="py-3.5 px-4 font-display text-[14px] text-gold-light">{row.mark}</td>
                    <td className="py-3.5 px-4 font-serif text-[14px] text-cream">{row.purity}</td>
                    <td className="py-3.5 px-4 font-sans text-[12px] text-fog">{row.fine}</td>
                    <td className="py-3.5 px-4 font-serif text-[13px] text-fog">{row.use}</td>
                    <td className="py-3.5 px-4 font-display text-[13px] text-gold-light">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-sans text-[10px] text-fog mt-3">* Prices are indicative and updated daily. Final price confirmed at point of sale.</p>
        </div>

        {/* Reading a hallmark */}
        <div className="bg-charcoal border border-gold/15 p-7 mb-6">
          <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-4">Reading a Hallmark</h2>
          <p className="font-serif text-[14px] text-fog leading-relaxed mb-4">
            A complete BIS hallmark on Indian gold jewellery consists of:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { symbol: 'BIS Logo', desc: 'Triangle logo with BIS — confirms government certification' },
              { symbol: 'Purity Mark', desc: '999 / 916 / 750 — indicates gold fineness' },
              { symbol: 'AHC Code', desc: 'Assaying & Hallmarking Centre where the piece was tested' },
              { symbol: 'HUID', desc: '6-character unique ID — verifiable on BIS Care app' },
            ].map((item) => (
              <div key={item.symbol} className="bg-white/3 border border-gold/10 p-4 text-center">
                <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">{item.symbol}</div>
                <p className="font-serif text-[12px] text-fog">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-gradient-to-r from-gold-dark/15 via-gold/8 to-gold-dark/15 border border-gold/20">
          <h2 className="font-display text-2xl text-cream mb-3">Verify Your Jewellery</h2>
          <p className="font-serif text-[15px] italic text-fog mb-5">All S.S. Jewellers pieces are BIS hallmarked. Verify any piece using its HUID.</p>
          <a href="https://bis.gov.in" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all">
            Verify on BIS Portal →
          </a>
        </div>
      </div>
    </div>
  );
}
