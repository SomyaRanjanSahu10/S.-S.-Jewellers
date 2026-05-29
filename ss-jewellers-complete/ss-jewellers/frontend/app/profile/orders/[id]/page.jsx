'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle, Clock, Package, Truck, Home, XCircle,
  Download, MessageCircle, ArrowLeft, Star
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { orderApi } from '@/lib/api';
import toast from 'react-hot-toast';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const STATUS_STEPS = [
  { key: 'pending',          label: 'Order Placed',      icon: Package      },
  { key: 'confirmed',        label: 'Confirmed',          icon: CheckCircle  },
  { key: 'processing',       label: 'Being Crafted',      icon: Clock        },
  { key: 'shipped',          label: 'Shipped',            icon: Truck        },
  { key: 'out_for_delivery', label: 'Out for Delivery',   icon: Truck        },
  { key: 'delivered',        label: 'Delivered',          icon: Home         },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

/* Demo order for when API is not connected */
const DEMO_ORDER = {
  _id: 'demo',
  orderNumber: 'SSJ10284',
  status: 'shipped',
  paymentStatus: 'paid',
  paymentMethod: 'razorpay',
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  items: [
    { _id: 'i1', name: 'Royal Temple Necklace', purity: '22K', weight: 28.4, qty: 1, price: 124500, icon: '📿' },
    { _id: 'i2', name: 'Gold Jhumka Earrings',   purity: '22K', weight: 8.6,  qty: 1, price: 28500,  icon: '✨' },
  ],
  subtotal:     153000,
  makingCharges: 18360,
  gst:            5141,
  discount:       5000,
  total:         171501,
  couponCode:    'GOLD10',
  shippingAddress: { fullName: 'Priya Reddy', phone: '+91 98765 43210', street: 'Road No. 12, Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034' },
  courier:     'Blue Dart Express',
  trackingId:  'BD123456789IN',
  trackingHistory: [
    { status: 'pending',    message: 'Order placed successfully.',           timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { status: 'confirmed',  message: 'Payment received. Order confirmed.',   timestamp: new Date(Date.now() - 3*24*60*60*1000 + 3600000).toISOString() },
    { status: 'processing', message: 'Jewellery being crafted by our artisans.', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { status: 'shipped',    message: 'Shipped via Blue Dart Express. AWB: BD123456789IN', timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
  ],
};

export default function OrderDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const { user, isLoggedIn } = useAuthStore();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login?redirect=/profile/orders'); return; }
    orderApi.getById(id)
      .then(({ data }) => { setOrder(data.data.order); setLoading(false); })
      .catch(() => { setOrder(DEMO_ORDER); setLoading(false); });
  }, [id, isLoggedIn]);

  if (loading) return <OrderSkeleton />;
  if (!order)  return <div className="min-h-screen bg-obsidian pt-36 flex items-center justify-center"><p className="font-serif text-fog italic">Order not found.</p></div>;

  const currentStep  = STATUS_ORDER.indexOf(order.status);
  const isCancelled  = order.status === 'cancelled';
  const isDelivered  = order.status === 'delivered';

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.cancel(order._id, 'Customer requested cancellation');
      toast.success('Order cancelled successfully.');
      setOrder((o) => ({ ...o, status: 'cancelled' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order.');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

        {/* Back + breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/profile" className="flex items-center gap-2 font-sans text-[10px] tracking-[2px] uppercase text-fog hover:text-gold transition-colors">
            <ArrowLeft size={13} /> My Orders
          </Link>
          <span className="text-ash">›</span>
          <span className="font-sans text-[10px] tracking-[2px] uppercase text-cream">#{order.orderNumber}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl text-cream">Order #{order.orderNumber}</h1>
            <p className="font-sans text-[11px] text-fog mt-1 tracking-wide">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Invoice download (demo) */}
            <button
              onClick={() => toast.success('Invoice download started (demo)')}
              className="flex items-center gap-2 border border-gold/25 text-gold font-sans text-[10px] tracking-[2px] uppercase px-4 py-2.5 hover:bg-gold/10 transition-colors"
            >
              <Download size={12} /> Invoice
            </button>
            {/* WhatsApp support */}
            <a
              href={`https://wa.me/914023456789?text=Hi!%20I%20need%20help%20with%20order%20%23${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#25D366]/30 text-[#25D366] font-sans text-[10px] tracking-[2px] uppercase px-4 py-2.5 hover:bg-[#25D366]/10 transition-colors"
            >
              <MessageCircle size={12} /> Support
            </a>
            {/* Cancel */}
            {['pending', 'confirmed', 'processing'].includes(order.status) && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 border border-red-500/30 text-red-400 font-sans text-[10px] tracking-[2px] uppercase px-4 py-2.5 hover:bg-red-500/10 transition-colors"
              >
                <XCircle size={12} /> Cancel Order
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left column */}
          <div className="space-y-6">

            {/* Tracking timeline */}
            <div className="bg-charcoal border border-gold/15 p-7">
              <h2 className="font-display text-[18px] text-cream mb-7">Order Tracking</h2>

              {isCancelled ? (
                <div className="flex items-center gap-4 p-5 bg-red-500/8 border border-red-500/25">
                  <XCircle size={28} className="text-red-400 flex-shrink-0" />
                  <div>
                    <div className="font-sans text-[12px] font-semibold text-red-400 tracking-wide">Order Cancelled</div>
                    <div className="font-sans text-[11px] text-fog mt-1">{order.cancelReason || 'Customer requested cancellation'}</div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step progress bar */}
                  <div className="flex items-center mb-8 overflow-x-auto pb-2">
                    {STATUS_STEPS.map((step, i) => {
                      const done    = i <= currentStep;
                      const current = i === currentStep;
                      const Icon    = step.icon;
                      return (
                        <div key={step.key} className="flex items-center flex-shrink-0">
                          <div className="flex flex-col items-center gap-2">
                            <motion.div
                              initial={false}
                              animate={{ scale: current ? 1.1 : 1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                done
                                  ? 'bg-gold border-gold text-obsidian'
                                  : 'border-ash text-ash bg-transparent'
                              } ${current ? 'shadow-gold' : ''}`}
                            >
                              <Icon size={16} />
                            </motion.div>
                            <span className={`font-sans text-[9px] tracking-[1px] uppercase text-center whitespace-nowrap ${done ? 'text-gold' : 'text-ash'}`}>
                              {step.label}
                            </span>
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`h-0.5 w-12 mx-1 flex-shrink-0 transition-all ${i < currentStep ? 'bg-gold' : 'bg-ash/30'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Courier info */}
                  {order.courier && order.trackingId && (
                    <div className="flex items-center gap-3 bg-white/3 border border-gold/10 px-5 py-3.5 mb-6">
                      <Truck size={16} className="text-gold flex-shrink-0" />
                      <div>
                        <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold">Courier Details</div>
                        <div className="font-sans text-[12px] text-cream mt-0.5">{order.courier} · AWB: <span className="text-gold">{order.trackingId}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Timeline events */}
                  <div className="space-y-0">
                    {[...(order.trackingHistory || [])].reverse().map((event, i) => (
                      <div key={i} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 ${i === 0 ? 'bg-gold' : 'bg-ash'}`} />
                          {i < (order.trackingHistory.length - 1) && <div className="w-px flex-1 bg-ash/20 min-h-[24px]" />}
                        </div>
                        <div className="pb-2">
                          <div className={`font-sans text-[11px] tracking-[1px] uppercase font-semibold ${i === 0 ? 'text-gold' : 'text-fog'}`}>
                            {event.status?.replace(/_/g, ' ')}
                          </div>
                          <div className="font-serif text-[14px] text-cream/80 mt-0.5">{event.message}</div>
                          {event.location && <div className="font-sans text-[10px] text-fog mt-0.5">{event.location}</div>}
                          <div className="font-sans text-[10px] text-ash mt-1">
                            {new Date(event.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Order items */}
            <div className="bg-charcoal border border-gold/15 p-7">
              <h2 className="font-display text-[18px] text-cream mb-5">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1a1500] to-[#2d2200] flex items-center justify-center text-3xl flex-shrink-0 border border-gold/10">
                      {item.icon || item.product?.icon || '💍'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[15px] text-cream">{item.name}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="font-sans text-[10px] text-fog">{item.purity} Gold</span>
                        <span className="font-sans text-[10px] text-fog">{item.weight}g</span>
                        <span className="font-sans text-[10px] text-fog">Qty: {item.qty}</span>
                      </div>
                      {item.makingCharge > 0 && (
                        <div className="font-sans text-[10px] text-fog mt-1">Making: {fmt(item.makingCharge)}</div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-[16px] text-gold-light">{fmt(item.price * item.qty)}</div>
                      <div className="font-sans text-[10px] text-fog mt-0.5">{fmt(item.price)} each</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review prompt (if delivered) */}
              {isDelivered && (
                <div className="mt-5 p-4 bg-gold/5 border border-gold/20 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-sans text-[11px] tracking-[1px] uppercase text-gold mb-1">Share Your Experience</div>
                    <div className="font-serif text-[13px] text-fog">How was your jewellery? Your review helps other customers.</div>
                  </div>
                  <Link
                    href={`/product/${order.items?.[0]?.product?._id || order.items?.[0]?.product || '#'}#reviews`}
                    className="flex items-center gap-2 border border-gold/30 text-gold font-sans text-[10px] tracking-[1px] uppercase px-4 py-2.5 hover:bg-gold/10 transition-colors flex-shrink-0"
                  >
                    <Star size={11} /> Write Review
                  </Link>
                </div>
              )}
            </div>

            {/* Shipping address */}
            <div className="bg-charcoal border border-gold/15 p-7">
              <h2 className="font-display text-[18px] text-cream mb-4">Delivery Address</h2>
              {order.shippingAddress && (
                <div className="font-sans text-[13px] text-fog leading-[2]">
                  <span className="text-cream font-semibold">{order.shippingAddress.fullName}</span><br />
                  {order.shippingAddress.street},<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}<br />
                  <span className="text-cream">📞 {order.shippingAddress.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right column — price summary */}
          <div className="space-y-5">
            {/* Payment summary */}
            <div className="bg-charcoal border border-gold/15 p-6">
              <h2 className="font-display text-[18px] text-cream mb-5">Price Details</h2>
              <div className="space-y-3 text-[12px] font-sans">
                <div className="flex justify-between text-fog"><span>Gold Value</span><span>{fmt(order.subtotal)}</span></div>
                <div className="flex justify-between text-fog"><span>Making Charges</span><span>{fmt(order.makingCharges || 0)}</span></div>
                <div className="flex justify-between text-fog"><span>GST (3%)</span><span>{fmt(order.gst || 0)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon {order.couponCode && `(${order.couponCode})`}</span>
                    <span>−{fmt(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-fog"><span>Shipping</span><span className="text-emerald-400">FREE</span></div>
                <div className="flex justify-between pt-4 border-t border-white/8">
                  <span className="font-display text-[17px] text-cream">Total Paid</span>
                  <span className="font-display text-[17px] text-gold-light">{fmt(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment status */}
            <div className="bg-charcoal border border-gold/15 p-6">
              <h2 className="font-display text-[18px] text-cream mb-4">Payment</h2>
              <div className="space-y-2.5">
                <div className="flex justify-between font-sans text-[12px]">
                  <span className="text-fog">Method</span>
                  <span className="text-cream capitalize">{order.paymentMethod?.replace('_', ' ') || 'Razorpay'}</span>
                </div>
                <div className="flex justify-between font-sans text-[12px]">
                  <span className="text-fog">Status</span>
                  <span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {order.paymentStatus === 'paid' ? '✓ ' : ''}
                    {order.paymentStatus || 'Paid'}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between font-sans text-[11px]">
                    <span className="text-fog">Transaction ID</span>
                    <span className="text-cream font-mono text-[10px]">{order.razorpayPaymentId.slice(0, 16)}...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-charcoal border border-gold/15 p-6 space-y-3">
              {[
                { icon: '🔒', text: '100% Secure Transaction' },
                { icon: '✅', text: 'BIS Hallmarked Gold' },
                { icon: '🔄', text: 'Lifetime Exchange Policy' },
                { icon: '📦', text: 'Insured Shipping' },
              ].map((g) => (
                <div key={g.text} className="flex items-center gap-3 font-sans text-[11px] text-fog">
                  <span>{g.icon}</span> {g.text}
                </div>
              ))}
            </div>

            {/* Need help */}
            <div className="bg-charcoal border border-gold/15 p-6 text-center">
              <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Need Help?</div>
              <p className="font-serif text-[13px] italic text-fog mb-4">Our team is available 7 days a week</p>
              <a
                href="https://wa.me/914023456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-[#25D366]/30 text-[#25D366] font-sans text-[11px] tracking-[1px] uppercase hover:bg-[#25D366]/10 transition-colors"
              >
                💬 Chat on WhatsApp
              </a>
              <a
                href="tel:+914023456789"
                className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 font-sans text-[11px] tracking-[1px] uppercase text-fog hover:text-gold transition-colors"
              >
                📞 +91 40 2345 6789
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 animate-pulse">
        <div className="h-4 bg-charcoal w-48 mb-8 rounded" />
        <div className="h-10 bg-charcoal w-72 mb-10 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            {[320, 240, 160].map((h, i) => <div key={i} className="bg-charcoal border border-gold/10 rounded" style={{ height: h }} />)}
          </div>
          <div className="space-y-5">
            {[200, 160, 140].map((h, i) => <div key={i} className="bg-charcoal border border-gold/10 rounded" style={{ height: h }} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
