// app/emi/page.jsx
export const metadata = { title: 'EMI Options | S.S. Jewellers' };

const EMI_BANKS = [
  { name: 'HDFC Bank',       tenure: '3, 6, 9, 12 months', rate: '14–18% p.a.',    minAmt: '₹5,000', logo: '🏦' },
  { name: 'SBI Card',        tenure: '3, 6, 9, 12 months', rate: '14–16% p.a.',    minAmt: '₹5,000', logo: '🏦' },
  { name: 'ICICI Bank',      tenure: '3, 6, 9, 12, 18 months', rate: '13–18% p.a.', minAmt: '₹5,000', logo: '🏦' },
  { name: 'Axis Bank',       tenure: '3, 6, 9, 12 months', rate: '14–18% p.a.',    minAmt: '₹5,000', logo: '🏦' },
  { name: 'Kotak Bank',      tenure: '3, 6, 9, 12 months', rate: '14–18% p.a.',    minAmt: '₹5,000', logo: '🏦' },
  { name: 'American Express', tenure: '3, 6, 12 months', rate: '15–20% p.a.',    minAmt: '₹5,000', logo: '🏦' },
];

const NO_COST_EMI = [
  { name: 'HDFC Bank',  tenure: '3 months', minAmt: '₹25,000' },
  { name: 'SBI Card',   tenure: '3 months', minAmt: '₹25,000' },
  { name: 'ICICI Bank', tenure: '3 months', minAmt: '₹25,000' },
];

export default function EMIPage() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        <div className="mb-12 text-center">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Flexible Payment</div>
          <h1 className="font-display text-5xl text-cream mb-3">EMI Options</h1>
          <p className="font-serif text-[17px] italic text-fog max-w-xl mx-auto">
            Bring home your dream jewellery today — pay in comfortable monthly instalments
          </p>
        </div>

        {/* No Cost EMI */}
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald/10 to-transparent border border-emerald/25">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎉</span>
            <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-emerald-400">No Cost EMI Available</h2>
          </div>
          <p className="font-serif text-[14px] text-fog mb-4">Zero interest on select credit cards for purchases above ₹25,000.</p>
          <div className="flex flex-wrap gap-3">
            {NO_COST_EMI.map((bank) => (
              <div key={bank.name} className="bg-charcoal border border-emerald/20 px-4 py-2.5">
                <div className="font-sans text-[11px] text-cream font-semibold">{bank.name}</div>
                <div className="font-sans text-[10px] text-fog">{bank.tenure} · Min {bank.minAmt}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank list */}
        <div className="bg-charcoal border border-gold/15 p-7 mb-8">
          <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-6">EMI Eligible Cards</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gold/20">
                  {['Bank / Card', 'Tenure Options', 'Interest Rate', 'Min. Amount'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-sans text-[9px] tracking-[2px] uppercase text-gold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EMI_BANKS.map((bank, i) => (
                  <tr key={bank.name} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span>{bank.logo}</span>
                        <span className="font-sans text-[13px] font-semibold text-cream">{bank.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-[12px] text-fog">{bank.tenure}</td>
                    <td className="py-3.5 px-4 font-sans text-[12px] text-fog">{bank.rate}</td>
                    <td className="py-3.5 px-4 font-sans text-[12px] text-gold">{bank.minAmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-charcoal border border-gold/15 p-7 mb-8">
          <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-5">How to Avail EMI</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Select Your Jewellery', desc: 'Browse our collection and add items to cart. EMI is available on all purchases above ₹5,000.' },
              { step: '02', title: 'Choose EMI at Checkout', desc: 'At checkout, select "EMI" as your payment option. Choose your preferred bank and tenure.' },
              { step: '03', title: 'Confirm with OTP',       desc: 'Enter your card details on Razorpay\'s secure page. Your bank may send an OTP for confirmation.' },
              { step: '04', title: 'Order Confirmed',        desc: 'Your order is placed immediately. Your card is debited the first instalment, with subsequent ones monthly.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08), transparent)' }}>
                  <span className="font-display text-[14px] text-gold">{item.step}</span>
                </div>
                <div className="pt-2">
                  <div className="font-sans text-[11px] tracking-[1px] uppercase text-cream font-semibold mb-1">{item.title}</div>
                  <p className="font-serif text-[13px] text-fog">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In-store Gold Scheme */}
        <div className="bg-gradient-to-r from-gold-dark/15 via-gold/8 to-gold-dark/15 border border-gold/20 p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏅</span>
            <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold">In-Store Gold Savings Scheme</h2>
          </div>
          <p className="font-serif text-[15px] text-fog leading-relaxed mb-4">
            Save monthly and buy at today's gold rate. Our Gold Savings Scheme lets you pay monthly instalments (₹2,000 to ₹1,00,000) for 11 months. In the 12th month, S.S. Jewellers contributes one instalment as a bonus, and you redeem the full amount against jewellery.
          </p>
          <a href="/stores" className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase text-gold border border-gold/30 px-6 py-3 hover:bg-gold/10 transition-colors">
            Enrol at Any Showroom →
          </a>
        </div>
      </div>
    </div>
  );
}
