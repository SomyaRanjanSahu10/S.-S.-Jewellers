'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Lock, Tag, MapPin, CreditCard, Truck } from 'lucide-react';
import { useCartStore, useAuthStore } from '@/lib/store';
import { orderApi, paymentApi } from '@/lib/api';
import toast from 'react-hot-toast';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const STEPS = ['Address', 'Review', 'Payment'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, makingCharges, gst, total, clearCart } = useCartStore();
  const { user, isLoggedIn } = useAuthStore();
  const [step,     setStep]     = useState(0);
  const [loading,  setLoading]  = useState(false);
  const [coupon,   setCoupon]   = useState('');
  const [discount, setDiscount] = useState(0);
  const [address,  setAddress]  = useState({
    fullName: user?.name || '',
    phone:    user?.phone || '',
    street:   '',
    city:     '',
    state:    '',
    pincode:  '',
  });

  useEffect(() => {
    if (!isLoggedIn) router.push('/login?redirect=/checkout');
    if (items.length === 0) router.push('/catalog');
  }, [isLoggedIn, items.length]);

  const applyDiscount = async () => {
    if (!coupon) return;
    try {
      const { data } = await paymentApi.validateCoupon({ code: coupon, cartTotal: subtotal });
      setDiscount(data.data.discount);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const grandTotal = total - discount;

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      // 1. Place order in our DB
      const orderPayload = {
        items: items.map((i) => ({ productId: i._id, qty: i.qty })),
        shippingAddress: address,
        paymentMethod: 'razorpay',
        couponCode: coupon || undefined,
      };
      const { data: orderData } = await orderApi.place(orderPayload);
      const dbOrder = orderData.data.order;

      // 2. Create Razorpay order
      const { data: rzpData } = await paymentApi.createOrder(dbOrder._id);

      // 3. Open Razorpay checkout
      const options = {
        key:      rzpData.data.key,
        amount:   rzpData.data.amount,
        currency: rzpData.data.currency,
        name:     'S.S. Jewellers',
        description: `Order #${dbOrder.orderNumber}`,
        order_id: rzpData.data.rzpOrderId,
        prefill:  rzpData.data.prefill,
        theme:    { color: '#C9A84C' },
        handler: async (response) => {
          try {
            // 4. Verify payment
            await paymentApi.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              orderId:             dbOrder._id,
            });
            clearCart();
            toast.success('Order confirmed! 🎉');
            router.push(`/profile/orders/${dbOrder._id}?success=true`);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => { setLoading(false); toast('Payment cancelled.', { icon: '⚠️' }); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="min-h-screen bg-obsidian pt-36 pb-20">
        <div className="container max-w-[1200px] mx-auto px-6">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-2">Secure Checkout</div>
            <h1 className="font-display text-4xl text-cream">Complete Your Order</h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-0 mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 font-sans text-[11px] tracking-[2px] uppercase transition-colors ${i === step ? 'text-gold' : i < step ? 'text-fog' : 'text-ash'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all ${i === step ? 'bg-gold text-obsidian border-gold' : i < step ? 'bg-gold/30 text-gold border-gold/40' : 'border-ash text-ash'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {s}
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={14} className="text-ash" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

            {/* Left – Steps */}
            <div>
              {/* Step 0: Address */}
              {step === 0 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-charcoal border border-gold/15 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin size={18} className="text-gold" />
                    <h2 className="font-display text-xl text-cream">Shipping Address</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'fullName', label: 'Full Name', placeholder: 'Priya Reddy', span: 1 },
                      { key: 'phone',    label: 'Phone Number', placeholder: '+91 98765 43210', span: 1 },
                      { key: 'street',   label: 'Street Address', placeholder: '45, MG Road', span: 2 },
                      { key: 'city',     label: 'City', placeholder: 'Hyderabad', span: 1 },
                      { key: 'state',    label: 'State', placeholder: 'Telangana', span: 1 },
                      { key: 'pincode',  label: 'PIN Code', placeholder: '500034', span: 1 },
                    ].map((f) => (
                      <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">{f.label}</label>
                        <input
                          value={address[f.key]}
                          onChange={(e) => setAddress((a) => ({ ...a, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none transition-colors placeholder:text-ash"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode) {
                        toast.error('Please fill all address fields');
                        return;
                      }
                      setStep(1);
                    }}
                    className="mt-6 w-full py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all"
                  >
                    Continue to Review →
                  </button>
                </motion.div>
              )}

              {/* Step 1: Review */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-charcoal border border-gold/15 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck size={18} className="text-gold" />
                    <h2 className="font-display text-xl text-cream">Review Your Order</h2>
                  </div>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 py-4 border-b border-white/5">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#1a1500] to-[#2d2200] flex items-center justify-center text-2xl flex-shrink-0">
                          {item.icon || '💍'}
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-[14px] text-cream">{item.name}</p>
                          <p className="font-sans text-[10px] text-fog mt-0.5">{item.purity} · {item.weight}g · Qty: {item.qty}</p>
                        </div>
                        <p className="font-display text-[15px] text-gold-light">{fmt(item.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>
                  {/* Delivery address summary */}
                  <div className="bg-white/3 border border-gold/10 p-4 mb-6">
                    <div className="font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">Delivering to</div>
                    <p className="font-sans text-[12px] text-cream">{address.fullName} · {address.phone}</p>
                    <p className="font-sans text-[12px] text-fog mt-0.5">{address.street}, {address.city}, {address.state} – {address.pincode}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="flex-1 py-3 border border-gold/30 text-gold font-sans text-[11px] tracking-[2px] uppercase hover:bg-gold/8 transition-colors">← Back</button>
                    <button onClick={() => setStep(2)} className="flex-2 flex-1 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase">Continue to Payment →</button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-charcoal border border-gold/15 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={18} className="text-gold" />
                    <h2 className="font-display text-xl text-cream">Payment</h2>
                  </div>
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'razorpay', label: 'Pay Online', sub: 'UPI, Cards, Net Banking, Wallets via Razorpay', icon: '💳' },
                      { id: 'cod',      label: 'Cash on Delivery', sub: 'Pay when your jewellery arrives', icon: '💵' },
                    ].map((method) => (
                      <label key={method.id} className="flex items-center gap-4 p-4 border border-gold/15 hover:border-gold/35 cursor-pointer transition-all">
                        <input type="radio" name="payment" value={method.id} defaultChecked={method.id === 'razorpay'} className="accent-gold" />
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <div className="font-sans text-[13px] text-cream font-semibold">{method.label}</div>
                          <div className="font-sans text-[11px] text-fog">{method.sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-6 p-3 bg-emerald/10 border border-emerald/30">
                    <Lock size={14} className="text-emerald-400" />
                    <p className="font-sans text-[11px] text-emerald-400">Your payment info is secured with 256-bit SSL encryption</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gold/30 text-gold font-sans text-[11px] tracking-[2px] uppercase hover:bg-gold/8 transition-colors">← Back</button>
                    <button
                      onClick={handleRazorpay}
                      disabled={loading}
                      className="flex-1 py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60"
                    >
                      {loading ? 'Processing...' : `Pay ${fmt(grandTotal)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right – Order Summary */}
            <div className="space-y-4">
              <div className="bg-charcoal border border-gold/15 p-6">
                <h3 className="font-display text-[18px] text-cream mb-4">Order Summary</h3>
                <div className="space-y-3 text-[12px] font-sans">
                  <div className="flex justify-between text-fog"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                  <div className="flex justify-between text-fog"><span>Making Charges</span><span>{fmt(makingCharges)}</span></div>
                  <div className="flex justify-between text-fog"><span>GST (3%)</span><span>{fmt(gst)}</span></div>
                  <div className="flex justify-between text-fog"><span>Shipping</span><span className="text-emerald-400">FREE</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400"><span>Coupon Discount</span><span>−{fmt(discount)}</span></div>
                  )}
                  <div className="flex justify-between pt-4 border-t border-white/8">
                    <span className="font-display text-[17px] text-cream">Total</span>
                    <span className="font-display text-[17px] text-gold-light">{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="bg-charcoal border border-gold/15 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={14} className="text-gold" />
                  <span className="font-sans text-[11px] tracking-[2px] uppercase text-gold">Have a coupon?</span>
                </div>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[12px] px-3 py-2.5 outline-none"
                  />
                  <button onClick={applyDiscount} className="px-4 bg-gold/10 border border-gold/25 text-gold font-sans text-[10px] tracking-[1px] uppercase hover:bg-gold/20 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-charcoal border border-gold/15 p-6 space-y-3">
                {[
                  { icon: '🔒', text: '100% Secure Payments' },
                  { icon: '✅', text: 'BIS Hallmarked Gold' },
                  { icon: '🔄', text: 'Lifetime Exchange Policy' },
                  { icon: '🚚', text: 'Free Insured Shipping' },
                ].map((g) => (
                  <div key={g.text} className="flex items-center gap-3 font-sans text-[11px] text-fog">
                    <span>{g.icon}</span> {g.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
