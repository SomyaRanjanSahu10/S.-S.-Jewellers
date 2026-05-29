'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, MapPin, User, LogOut, ChevronRight, Star, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { orderApi, authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

const STATUS_CONFIG = {
  pending:          { label: 'Pending',          icon: Clock,        color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25' },
  confirmed:        { label: 'Confirmed',         icon: CheckCircle,  color: 'text-blue-400 bg-blue-400/10 border-blue-400/25' },
  processing:       { label: 'Processing',        icon: Clock,        color: 'text-orange-400 bg-orange-400/10 border-orange-400/25' },
  shipped:          { label: 'Shipped',           icon: Truck,        color: 'text-purple-400 bg-purple-400/10 border-purple-400/25' },
  out_for_delivery: { label: 'Out for Delivery',  icon: Truck,        color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25' },
  delivered:        { label: 'Delivered',         icon: CheckCircle,  color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' },
  cancelled:        { label: 'Cancelled',         icon: XCircle,      color: 'text-red-400 bg-red-400/10 border-red-400/25' },
};

const TABS = [
  { id: 'orders',   label: 'My Orders',   icon: Package },
  { id: 'profile',  label: 'Profile',     icon: User },
  { id: 'address',  label: 'Addresses',   icon: MapPin },
];

export default function ProfilePage() {
  const router   = useRouter();
  const { user, isLoggedIn, logout, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login?redirect=/profile'); return; }
    if (activeTab === 'orders') fetchOrders();
  }, [isLoggedIn, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await orderApi.getMyOrders({ limit: 20 });
      setOrders(data.data.orders);
    } catch { setOrders([]); }
    setLoading(false);
  };

  const handleLogout = async () => {
    try { await authApi.logout(); } catch (_) {}
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.cancel(orderId, 'Customer requested cancellation');
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      // In real app: await userApi.updateProfile(profileForm)
      updateUser(profileForm);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    setSavingProfile(false);
  };

  return (
    <div className="min-h-screen bg-obsidian pt-36 pb-20">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="font-sans text-[10px] tracking-[4px] uppercase text-gold mb-1">Welcome back</div>
            <h1 className="font-display text-4xl text-cream">{user?.name || 'My Account'}</h1>
            <p className="font-serif text-[14px] italic text-fog mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-red-500/30 text-red-400 font-sans text-[11px] tracking-[2px] uppercase px-4 py-2.5 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-sans text-[11px] tracking-[2px] uppercase transition-all border-l-2 ${
                  activeTab === tab.id
                    ? 'border-gold text-gold bg-gold/6'
                    : 'border-transparent text-fog hover:text-cream hover:bg-white/3'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div>
            <AnimatePresence mode="wait">

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="font-display text-2xl text-cream mb-6">Order History</h2>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-charcoal animate-pulse border border-gold/10" />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-charcoal border border-gold/10">
                      <div className="text-5xl mb-4 opacity-20">📦</div>
                      <p className="font-serif text-[16px] italic text-fog mb-4">No orders yet.</p>
                      <Link href="/catalog" className="font-sans text-[11px] tracking-[2px] uppercase text-gold border border-gold/30 px-6 py-3 hover:bg-gold/10 transition-colors inline-block">
                        Start Shopping →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                        const StatusIcon = statusCfg.icon;
                        return (
                          <motion.div
                            key={order._id}
                            layout
                            className="bg-charcoal border border-gold/12 hover:border-gold/30 transition-all p-5 lg:p-6"
                          >
                            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                              <div>
                                <div className="font-display text-[16px] text-gold-light">#{order.orderNumber}</div>
                                <div className="font-sans text-[10px] tracking-[1px] text-fog mt-0.5">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-1.5 font-sans text-[10px] tracking-[1px] uppercase border px-3 py-1.5 ${statusCfg.color}`}>
                                  <StatusIcon size={11} /> {statusCfg.label}
                                </span>
                                <span className="font-display text-[18px] text-cream">{fmt(order.total)}</span>
                              </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-2 mb-4">
                              {order.items?.slice(0, 2).map((item) => (
                                <div key={item._id} className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-[#1a1500] to-[#2d2200] flex items-center justify-center text-lg flex-shrink-0">
                                    💍
                                  </div>
                                  <div>
                                    <div className="font-serif text-[13px] text-cream">{item.name}</div>
                                    <div className="font-sans text-[10px] text-fog">Qty: {item.qty} · {item.purity}</div>
                                  </div>
                                  <div className="ml-auto font-display text-[13px] text-gold-light">{fmt(item.price * item.qty)}</div>
                                </div>
                              ))}
                              {order.items?.length > 2 && (
                                <div className="font-sans text-[11px] text-fog">+{order.items.length - 2} more item(s)</div>
                              )}
                            </div>

                            {/* Tracking */}
                            {order.trackingId && (
                              <div className="bg-white/3 border border-gold/8 px-4 py-2.5 mb-4 flex items-center gap-2">
                                <Truck size={13} className="text-gold" />
                                <span className="font-sans text-[11px] text-fog">{order.courier}</span>
                                <span className="font-sans text-[11px] text-gold ml-2">{order.trackingId}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-3 flex-wrap">
                              <Link
                                href={`/profile/orders/${order._id}`}
                                className="flex items-center gap-1.5 font-sans text-[10px] tracking-[2px] uppercase text-gold border border-gold/30 px-4 py-2 hover:bg-gold/10 transition-colors"
                              >
                                View Details <ChevronRight size={11} />
                              </Link>
                              {['pending', 'confirmed', 'processing'].includes(order.status) && (
                                <button
                                  onClick={() => handleCancelOrder(order._id)}
                                  className="font-sans text-[10px] tracking-[2px] uppercase text-red-400 border border-red-400/30 px-4 py-2 hover:bg-red-400/10 transition-colors"
                                >
                                  Cancel Order
                                </button>
                              )}
                              {order.status === 'delivered' && (
                                <Link
                                  href={`/product/${order.items?.[0]?.product?._id || order.items?.[0]?.product}`}
                                  className="flex items-center gap-1.5 font-sans text-[10px] tracking-[2px] uppercase text-fog border border-fog/20 px-4 py-2 hover:text-cream transition-colors"
                                >
                                  <Star size={11} /> Write Review
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h2 className="font-display text-2xl text-cream mb-6">Personal Information</h2>
                  <div className="bg-charcoal border border-gold/15 p-8 max-w-lg">
                    <form onSubmit={handleProfileSave} className="space-y-5">
                      <div>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Full Name</label>
                        <input
                          value={profileForm.name}
                          onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Email Address</label>
                        <input
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-white/2 border border-gold/10 text-fog font-sans text-[13px] px-4 py-3 outline-none cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Phone Number</label>
                        <input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                          className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Member Since</label>
                        <div className="font-serif text-[15px] text-fog px-1">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={savingProfile}
                        className="w-full py-3.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60"
                      >
                        {savingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <motion.div key="address" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl text-cream">Saved Addresses</h2>
                    <button className="font-sans text-[10px] tracking-[2px] uppercase text-gold border border-gold/30 px-4 py-2 hover:bg-gold/10 transition-colors">
                      + Add New
                    </button>
                  </div>
                  {user?.addresses?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.addresses.map((addr, i) => (
                        <div key={i} className={`bg-charcoal border p-5 ${addr.isDefault ? 'border-gold/40' : 'border-gold/12'}`}>
                          {addr.isDefault && (
                            <span className="font-sans text-[9px] tracking-[2px] uppercase text-gold bg-gold/10 border border-gold/25 px-2 py-1 mb-3 inline-block">Default</span>
                          )}
                          <div className="font-sans text-[13px] font-semibold text-cream mb-1">{addr.label || 'Home'}</div>
                          <div className="font-sans text-[12px] text-fog leading-relaxed">
                            {addr.fullName}<br />
                            {addr.street}, {addr.city}<br />
                            {addr.state} – {addr.pincode}<br />
                            {addr.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-charcoal border border-gold/10">
                      <div className="text-5xl mb-4 opacity-20">📍</div>
                      <p className="font-serif text-[16px] italic text-fog">No addresses saved yet.</p>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
