'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus, Trash2, Tag } from 'lucide-react';
import { useCartStore, useUIStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { paymentApi } from '@/lib/api';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQty, subtotal, makingCharges, gst, total, clearCart } = useCartStore();
  const [coupon, setCoupon]     = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleCoupon = async () => {
    if (!coupon) return;
    try {
      const { data } = await paymentApi.validateCoupon({ code: coupon, cartTotal: subtotal });
      setDiscount(data.data.discount);
      setCouponApplied(data.data.coupon.code);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const grandTotal = total - discount;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.aside
        initial={false}
        animate={{ x: cartOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 right-0 h-full w-full max-w-[440px] bg-charcoal border-l border-gold/20 z-50 flex flex-col shadow-dark-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gold/15">
          <div>
            <h2 className="font-display text-[20px] text-cream">Your Cart</h2>
            <p className="font-sans text-[10px] tracking-[2px] uppercase text-fog mt-0.5">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button onClick={closeCart} className="w-9 h-9 border border-gold/20 flex items-center justify-center text-fog hover:text-gold hover:border-gold transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-6xl opacity-20">🛒</div>
              <p className="font-serif text-[18px] italic text-fog">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="btn-outline text-[11px] tracking-[2px] uppercase px-8 py-3 border border-gold text-gold hover:bg-gold/10 transition-colors font-sans"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-0">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex gap-4 py-5 border-b border-white/5"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1a1500] to-[#2d2200] flex items-center justify-center flex-shrink-0 text-3xl">
                      {item.icon || '💍'}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[14px] text-cream leading-snug truncate">{item.name}</p>
                      <p className="font-sans text-[10px] text-fog tracking-wide mt-0.5">{item.purity} · {item.weight}g</p>
                      <p className="font-display text-[15px] text-gold-light mt-1">{fmt(item.price)}</p>
                      {/* Qty + Delete */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gold/20">
                          <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-cream hover:bg-gold/10 hover:text-gold transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-sans text-[13px] text-cream">{item.qty}</span>
                          <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-cream hover:bg-gold/10 hover:text-gold transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item._id)} className="text-fog hover:text-red-400 transition-colors ml-auto">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-5 border-t border-gold/15 space-y-4">
            {/* Coupon */}
            {!couponApplied ? (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center border border-gold/20 focus-within:border-gold px-3 gap-2 transition-colors">
                  <Tag size={12} className="text-gold" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="bg-transparent flex-1 outline-none font-sans text-[12px] text-cream placeholder:text-fog/50 py-2.5"
                  />
                </div>
                <button onClick={handleCoupon} className="px-4 bg-gold/10 border border-gold/25 text-gold font-sans text-[10px] tracking-[1.5px] uppercase hover:bg-gold/20 transition-colors">
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gold/8 border border-gold/20 px-3 py-2.5">
                <span className="font-sans text-[11px] text-gold tracking-wide">🏷 {couponApplied} applied</span>
                <button onClick={() => { setDiscount(0); setCouponApplied(''); setCoupon(''); }} className="text-fog hover:text-red-400 text-xs">✕ Remove</button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between font-sans text-[11px] text-fog tracking-wide">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between font-sans text-[11px] text-fog tracking-wide">
                <span>Making Charges</span><span>{fmt(makingCharges)}</span>
              </div>
              <div className="flex justify-between font-sans text-[11px] text-fog tracking-wide">
                <span>GST (3%)</span><span>{fmt(gst)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-sans text-[11px] text-emerald-400 tracking-wide">
                  <span>Coupon Discount</span><span>−{fmt(discount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-white/8">
                <span className="font-display text-[17px] text-cream">Total</span>
                <span className="font-display text-[17px] text-gold-light">{fmt(grandTotal)}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase hover:shadow-gold transition-all"
            >
              Proceed to Checkout →
            </Link>
            <button onClick={closeCart} className="w-full text-center font-sans text-[10px] tracking-[2px] uppercase text-fog hover:text-gold transition-colors py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
