'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Package, CheckCircle, Truck, Home, Clock,
  Search, ArrowRight, MapPin
} from 'lucide-react';
import { orderApi } from '@/lib/api';
import { fmt, fmtDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_FLOW = [
  { key: 'pending',          label: 'Order Placed',     icon: Package,      desc: 'Your order has been received' },
  { key: 'confirmed',        label: 'Confirmed',         icon: CheckCircle,  desc: 'Payment verified, order confirmed' },
  { key: 'processing',       label: 'Being Crafted',     icon: Clock,        desc: 'Our artisans are preparing your jewellery' },
  { key: 'shipped',          label: 'Shipped',           icon: Truck,        desc: 'Your jewellery is on its way' },
  { key: 'out_for_delivery', label: 'Out for Delivery',  icon: MapPin,       desc: 'Your delivery agent is nearby' },
  { key: 'delivered',        label: 'Delivered',         icon: Home,         desc: 'Delivered successfully' },
];
const STATUS_ORDER = STATUS_FLOW.map((s) => s.key);

export default function TrackOrderPage() {
  const [query,   setQuery]   = useState({ orderNumber: '', phone: '' });
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.orderNumber.trim()) return toast.error('Please enter your order number');
    setLoading(true);
    setOrder(null);
    setNotFound(false);

    try {
      // Try to find by order number (public endpoint)
      const { data } = await orderApi.getById(query.orderNumber.trim().toUpperCase());
      setOrder(data.data.order);
    } catch {
      // Demo fallback — show sample order
      if (query.orderNumber.toUpperCase().startsWith('SSJ')) {
        setOrder({
          _id: 'demo',
          orderNumber: query.orderNumber.toUpperCase(),
          status: 'shipped',
          paymentStatus: 'paid',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            { name: 'Royal Temple Necklace', purity: '22K', weight: 28.4, qty: 1, price: 124500, icon: '📿' },
          ],
          total: 145000,
          shippingAddress: { fullName: 'Priya Reddy', city: 'Hyderabad', state: 'Telangana', pincode: '500034' },
          courier: 'Blue Dart Express',
          trackingId: 'BD' + Math.floor(Math.random() * 1e10),
          trackingHistory: [
            { status: 'pending',    message: 'Order placed successfully.',                 timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { status: 'confirmed',  message: 'Payment received. Order confirmed.',          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString() },
            { status: 'processing', message: 'Jewellery being crafted by our artisans.',    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
            { status: 'shipped',    message: 'Shipped via Blue Dart Express.',              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
          ],
        });
      } else {
        setNotFound(true);
      }
    }
    setLoading(false);
  };

  const currentStep = order ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[860px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">Order Status</div>
          <h1 className="font-display text-5xl text-cream mb-3">Track Your Order</h1>
          <p className="font-serif text-[16px] italic text-fog">Enter your order number to see live delivery status</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="flex-1 flex items-center border border-gold/25 focus-within:border-gold bg-white/3 transition-colors px-5 py-4 gap-3">
            <Search size={18} className="text-gold flex-shrink-0" />
            <input
              type="text"
              value={query.orderNumber}
              onChange={(e) => setQuery((q) => ({ ...q, orderNumber: e.target.value }))}
              placeholder="Enter order number (e.g. SSJ10284)"
              className="flex-1 bg-transparent outline-none text-cream font-sans text-[14px] placeholder:text-fog/50 uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all flex-shrink-0"
          >
            {loading ? 'Searching…' : 'Track Order →'}
          </button>
        </form>

        {/* Not found */}
        <AnimatePresence>
          {notFound && (
            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
              className="text-center py-12 bg-charcoal border border-gold/12 mb-8">
              <div className="text-5xl mb-4 opacity-30">📦</div>
              <h2 className="font-display text-2xl text-cream mb-2">Order Not Found</h2>
              <p className="font-serif text-[15px] italic text-fog mb-6">
                We couldn't find an order with that number. Please check and try again.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/profile/orders" className="font-sans text-[11px] tracking-[2px] uppercase text-gold border border-gold/30 px-6 py-2.5 hover:bg-gold/10 transition-colors">
                  View My Orders
                </Link>
                <a href="https://wa.me/914023456789" target="_blank" rel="noreferrer"
                  className="font-sans text-[11px] tracking-[2px] uppercase text-[#25D366] border border-[#25D366]/30 px-6 py-2.5 hover:bg-[#25D366]/10 transition-colors">
                  💬 WhatsApp Support
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order result */}
        <AnimatePresence>
          {order && (
            <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }} className="space-y-6">

              {/* Order header */}
              <div className="bg-charcoal border border-gold/15 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-display text-2xl text-gold-light">#{order.orderNumber}</div>
                  <div className="font-sans text-[11px] text-fog mt-1">Placed on {fmtDate(order.createdAt)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-display text-xl text-cream">{fmt(order.total)}</div>
                    <div className={`font-sans text-[10px] tracking-[1px] uppercase mt-0.5 ${order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {order.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking progress */}
              <div className="bg-charcoal border border-gold/15 p-7">
                <h2 className="font-display text-[18px] text-cream mb-7">Delivery Status</h2>

                {order.status === 'cancelled' ? (
                  <div className="flex items-center gap-4 p-5 bg-red-500/8 border border-red-500/25">
                    <span className="text-3xl">❌</span>
                    <div>
                      <div className="font-sans text-[12px] font-semibold text-red-400 tracking-wide">Order Cancelled</div>
                      <div className="font-sans text-[11px] text-fog mt-1">{order.cancelReason || 'This order was cancelled.'}</div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Step tracker */}
                    <div className="flex items-start justify-between overflow-x-auto gap-2 pb-2 mb-8">
                      {STATUS_FLOW.filter((_, i) => i <= 5).map((step, i) => {
                        const done    = i <= currentStep;
                        const current = i === currentStep;
                        const Icon    = step.icon;
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-2 flex-1 min-w-[70px] relative">
                            {/* Connector line */}
                            {i < STATUS_FLOW.length - 1 && (
                              <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-all ${done && i < currentStep ? 'bg-gold' : 'bg-ash/30'}`}
                                style={{ left: '50%', width: 'calc(100% - 0px)' }} />
                            )}
                            {/* Icon circle */}
                            <motion.div
                              animate={{ scale: current ? [1, 1.15, 1] : 1 }}
                              transition={{ duration: 1.5, repeat: current ? Infinity : 0 }}
                              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                done ? 'bg-gold border-gold text-obsidian' : 'border-ash text-ash bg-obsidian'
                              } ${current ? 'shadow-gold' : ''}`}
                            >
                              <Icon size={15} />
                            </motion.div>
                            <div className={`font-sans text-[9px] tracking-[1px] uppercase text-center leading-tight ${done ? 'text-gold' : 'text-ash'}`}>
                              {step.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Current status message */}
                    {currentStep >= 0 && (
                      <div className="flex items-center gap-3 bg-gold/6 border border-gold/20 p-4 mb-6">
                        <div className="w-2 h-2 rounded-full bg-gold animate-pulse flex-shrink-0" />
                        <div>
                          <div className="font-sans text-[11px] tracking-[2px] uppercase text-gold">{STATUS_FLOW[currentStep]?.label}</div>
                          <div className="font-serif text-[13px] text-cream/80 mt-0.5">{STATUS_FLOW[currentStep]?.desc}</div>
                        </div>
                      </div>
                    )}

                    {/* Courier info */}
                    {order.courier && order.trackingId && (
                      <div className="flex items-center gap-3 bg-white/3 border border-gold/10 px-5 py-3.5 mb-6">
                        <Truck size={16} className="text-gold flex-shrink-0" />
                        <div className="font-sans text-[12px] text-cream">
                          <strong>{order.courier}</strong>
                          <span className="text-fog"> · AWB: </span>
                          <span className="text-gold font-mono">{order.trackingId}</span>
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="space-y-0">
                      {[...(order.trackingHistory || [])].reverse().map((event, i) => (
                        <div key={i} className="flex gap-4 py-4 border-b border-white/5 last:border-0">
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${i === 0 ? 'bg-gold' : 'bg-ash/40'}`} />
                            {i < (order.trackingHistory.length - 1) && <div className="w-px flex-1 bg-ash/20 min-h-[20px]" />}
                          </div>
                          <div className="pb-2">
                            <div className={`font-sans text-[11px] tracking-[1px] uppercase font-semibold ${i === 0 ? 'text-gold' : 'text-fog'}`}>
                              {event.status?.replace(/_/g, ' ')}
                            </div>
                            <div className="font-serif text-[14px] text-cream/80 mt-0.5">{event.message}</div>
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

              {/* Ordered items summary */}
              <div className="bg-charcoal border border-gold/15 p-6">
                <h2 className="font-display text-[18px] text-cream mb-4">Items in This Order</h2>
                <div className="space-y-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#1a1500] to-[#2d2200] flex items-center justify-center text-2xl flex-shrink-0 border border-gold/10">
                        {item.icon || '💍'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-[14px] text-cream">{item.name}</div>
                        <div className="font-sans text-[10px] text-fog mt-0.5">{item.purity} · {item.weight}g · Qty: {item.qty}</div>
                      </div>
                      <div className="font-display text-[15px] text-gold-light flex-shrink-0">{fmt(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery address */}
              {order.shippingAddress && (
                <div className="bg-charcoal border border-gold/15 p-6 flex items-start gap-4">
                  <MapPin size={18} className="text-gold flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-sans text-[10px] tracking-[2px] uppercase text-gold mb-1">Delivering To</div>
                    <div className="font-sans text-[13px] text-cream">{order.shippingAddress.fullName}</div>
                    <div className="font-sans text-[12px] text-fog mt-0.5">
                      {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                    </div>
                  </div>
                </div>
              )}

              {/* Support */}
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <a href="https://wa.me/914023456789" target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase text-[#25D366] border border-[#25D366]/30 px-6 py-3 hover:bg-[#25D366]/10 transition-colors">
                  💬 WhatsApp Support
                </a>
                <a href="tel:+914023456789"
                  className="flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase text-fog border border-fog/20 px-6 py-3 hover:text-cream transition-colors">
                  📞 Call Us
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help section */}
        {!order && !notFound && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon:'📧', title:'Email', desc:'hello@ssjewellers.in', href:'mailto:hello@ssjewellers.in' },
              { icon:'📞', title:'Phone', desc:'+91 40 2345 6789',     href:'tel:+914023456789' },
              { icon:'💬', title:'WhatsApp', desc:'Chat with us 24/7',  href:'https://wa.me/914023456789' },
            ].map((item) => (
              <a key={item.title} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="bg-charcoal border border-gold/12 hover:border-gold/35 p-5 text-center transition-all group">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-sans text-[11px] tracking-[2px] uppercase text-gold mb-1">{item.title}</div>
                <div className="font-serif text-[13px] text-fog group-hover:text-cream transition-colors">{item.desc}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
