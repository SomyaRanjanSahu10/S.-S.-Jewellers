// ============================================================
// app/privacy-policy/page.jsx
// ============================================================
export const metadata = {
  title: 'Privacy Policy | S.S. Jewellers',
};

const SECTIONS = [
  {
    title: 'Information We Collect',
    content: `When you use our website or visit our stores, we may collect:

**Account Information:** Name, email address, phone number, password (hashed), and delivery addresses when you create an account.

**Order Information:** Products purchased, payment method, transaction IDs, and delivery details necessary to fulfil your orders.

**Usage Data:** Pages visited, search queries, device type, IP address, and browser type — collected automatically to improve our service.

**Communications:** If you contact us via email or WhatsApp, we retain those communications to assist you.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use your information to:

• Process and fulfil your orders
• Send order confirmations and delivery updates via email/SMS
• Respond to your queries and complaints
• Send promotional offers (only with your consent — you can opt out anytime)
• Improve our website, products, and services
• Prevent fraud and ensure platform security
• Comply with legal obligations

We do NOT sell, rent, or share your personal information with third parties for their own marketing purposes.`,
  },
  {
    title: 'Payment Security',
    content: `All payments are processed through Razorpay, a PCI DSS compliant payment gateway. S.S. Jewellers does not store your card details — all sensitive payment information is handled entirely by Razorpay's secure servers.

Transactions are encrypted with 256-bit SSL technology. For UPI and net banking payments, you are redirected to your bank's secure interface.`,
  },
  {
    title: 'Cookies',
    content: `We use cookies to:

• Keep you logged in during your session
• Remember your cart contents
• Analyse website traffic via Google Analytics (anonymised)
• Personalise your experience

You may disable cookies in your browser settings, though this may affect some website functionality. We do not use third-party advertising cookies.`,
  },
  {
    title: 'Data Retention',
    content: `We retain your account information for as long as your account is active. Order records are retained for 7 years for accounting and legal purposes (as required by Indian tax law). You may request deletion of your account and associated data by emailing privacy@ssjewellers.in.`,
  },
  {
    title: 'Your Rights',
    content: `Under applicable Indian data protection law, you have the right to:

• Access the personal information we hold about you
• Correct inaccurate information
• Request deletion of your account and data
• Opt out of marketing communications at any time
• Lodge a complaint with the relevant authority

To exercise these rights, email: privacy@ssjewellers.in`,
  },
  {
    title: 'Contact',
    content: `For privacy-related queries:

**Data Controller:** S.S. Jewellers Pvt. Ltd.
**Address:** Road No. 12, Banjara Hills, Hyderabad – 500034
**Email:** privacy@ssjewellers.in
**Phone:** +91 40 2345 6789

This policy was last updated on 1 January 2025.`,
  },
];

function PolicyPage({ title, subtitle, sections }) {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Legal</div>
          <h1 className="font-display text-5xl text-cream mb-3">{title}</h1>
          {subtitle && <p className="font-serif text-[16px] italic text-fog">{subtitle}</p>}
        </div>
        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-charcoal border border-gold/12 p-7">
              <h2 className="font-sans text-[11px] tracking-[3px] uppercase text-gold mb-4">{s.title}</h2>
              <div className="font-serif text-[14px] text-fog leading-[1.9] space-y-3">
                {s.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-semibold text-cream not-italic">{line.replace(/\*\*/g,'')}</p>;
                  }
                  const boldFormatted = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-cream">$1</strong>');
                  if (line.startsWith('•')) {
                    return <div key={i} className="flex items-start gap-2 ml-4"><span className="text-gold mt-1 text-xs">•</span><span dangerouslySetInnerHTML={{ __html: boldFormatted.slice(1).trim() }} /></div>;
                  }
                  return line.trim() ? <p key={i} dangerouslySetInnerHTML={{ __html: boldFormatted }} /> : <br key={i} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information"
      sections={SECTIONS}
    />
  );
}
