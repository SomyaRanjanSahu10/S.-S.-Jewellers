// ============================================================
// app/terms-of-service/page.jsx
// ============================================================
export const metadata = { title: 'Terms of Service | S.S. Jewellers' };

const TERMS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing the S.S. Jewellers website (ssjewellers.in) or making a purchase in our stores, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.`,
  },
  {
    title: '2. Products & Pricing',
    body: `All prices displayed on our website are inclusive of making charges and exclusive of GST (3%). Final invoice amount includes applicable GST as per Indian tax law.

Gold prices are updated daily. Online prices are valid for 4 hours from the time of placing the order. If gold rates change significantly before payment confirmation, we reserve the right to revise the price and notify you before processing.

We reserve the right to correct pricing errors. In the event of a pricing discrepancy, you will be offered the option to proceed at the correct price or cancel the order with a full refund.`,
  },
  {
    title: '3. Orders & Payment',
    body: `By placing an order, you confirm that you are legally eligible to enter into a binding contract under Indian law (18 years of age or older).

All payments are processed securely via Razorpay. By completing a purchase, you agree to Razorpay's terms and conditions in addition to ours.

Orders are confirmed only upon successful payment verification. We reserve the right to cancel any order in cases of suspected fraud or pricing errors.`,
  },
  {
    title: '4. Shipping & Delivery',
    body: `We ship exclusively within India via insured courier. Standard delivery: 5–7 business days. Express delivery available at additional cost.

All jewellery shipments are fully insured. In the event of loss or damage during transit, we will replace the item or provide a full refund within 14 business days of the claim being verified.

Delivery timelines are estimates and not guarantees. Force majeure events (natural disasters, strikes, etc.) may affect delivery schedules.`,
  },
  {
    title: '5. Returns & Cancellations',
    body: `Orders may be cancelled within 2 hours of placement for a full refund. After 2 hours, orders in "processing" or later stages cannot be cancelled.

Custom or personalised jewellery (engraved pieces, made-to-order items) cannot be returned or exchanged unless defective.

For non-custom pieces, we accept exchanges within 30 days of delivery. Pieces must be in original, unaltered condition with original invoice. Refunds are not provided — exchanges or store credit only.`,
  },
  {
    title: '6. Intellectual Property',
    body: `All content on this website — including product photographs, descriptions, brand assets, and the S.S. Jewellers logo — is the proprietary property of S.S. Jewellers Pvt. Ltd. and is protected by Indian copyright law.

You may not reproduce, distribute, or use our content for commercial purposes without express written permission.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `S.S. Jewellers shall not be liable for indirect, incidental, or consequential damages arising from the use of our products or services. Our maximum liability in any dispute shall not exceed the value of the order in question.`,
  },
  {
    title: '8. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.`,
  },
  {
    title: '9. Contact',
    body: `For any queries regarding these Terms, contact us at:
legal@ssjewellers.in | +91 40 2345 6789
S.S. Jewellers Pvt. Ltd., Road No. 12, Banjara Hills, Hyderabad – 500034`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Legal</div>
          <h1 className="font-display text-5xl text-cream mb-3">Terms of Service</h1>
          <p className="font-sans text-[11px] text-fog tracking-wide">Last updated: 1 January 2025</p>
        </div>
        <div className="space-y-5">
          {TERMS.map((section) => (
            <div key={section.title} className="bg-charcoal border border-gold/12 p-7">
              <h2 className="font-sans text-[12px] tracking-[2px] uppercase text-gold mb-4">{section.title}</h2>
              <div className="font-serif text-[14px] text-fog leading-[1.9] whitespace-pre-line">{section.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
