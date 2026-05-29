'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, TrendingUp,
  Plus, Edit2, Trash2, Eye, CheckCircle, Truck, Clock, XCircle, LogOut, Upload
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { adminApi, orderApi, productApi } from '@/lib/api';
import toast from 'react-hot-toast';

const fmt   = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const fmtCr = (n) => n >= 10000000 ? `₹${(n/10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : fmt(n);

const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'products',  label: 'Products',   icon: Package },
  { id: 'orders',    label: 'Orders',     icon: ShoppingCart },
  { id: 'customers', label: 'Customers',  icon: Users },
  { id: 'offers',    label: 'Offers',     icon: Tag },
  { id: 'analytics', label: 'Analytics',  icon: TrendingUp },
];

const STATUS_COLOR = {
  pending:          'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  confirmed:        'text-blue-400 bg-blue-400/10 border-blue-400/25',
  processing:       'text-orange-400 bg-orange-400/10 border-orange-400/25',
  shipped:          'text-purple-400 bg-purple-400/10 border-purple-400/25',
  out_for_delivery: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  delivered:        'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  cancelled:        'text-red-400 bg-red-400/10 border-red-400/25',
};

// Mock data for demonstration
const MOCK_ANALYTICS = {
  todayRevenue:  4820000,
  todayOrders:   284,
  totalCustomers:1847,
  avgOrderValue: 16970,
  monthRevenue:  48000000,
  monthOrders:   8240,
  satisfaction:  94.2,
  goldTurnover:  162,
};

const MOCK_ORDERS = [
  { _id: '1', orderNumber: 'SSJ10284', user: { name: 'Priya Reddy',    email: 'priya@email.com'   }, items: [{ name: 'Bridal Kundan Choker Set' }], total: 385000, status: 'delivered',  createdAt: '2024-12-20' },
  { _id: '2', orderNumber: 'SSJ10285', user: { name: 'Ananya Patel',   email: 'ananya@email.com'  }, items: [{ name: 'Solitaire Diamond Ring'   }], total: 85000,  status: 'processing', createdAt: '2024-12-21' },
  { _id: '3', orderNumber: 'SSJ10286', user: { name: 'Sunita Sharma',  email: 'sunita@email.com'  }, items: [{ name: 'Gold Jhumka Earrings'     }], total: 28500,  status: 'shipped',    createdAt: '2024-12-22' },
  { _id: '4', orderNumber: 'SSJ10287', user: { name: 'Kavya Menon',    email: 'kavya@email.com'   }, items: [{ name: 'Polki Haaram Set'         }], total: 520000, status: 'confirmed',  createdAt: '2024-12-22' },
  { _id: '5', orderNumber: 'SSJ10288', user: { name: 'Meera Krishnan', email: 'meera@email.com'   }, items: [{ name: 'Diamond Tennis Bracelet'  }], total: 192000, status: 'delivered',  createdAt: '2024-12-23' },
];

const MOCK_PRODUCTS = [
  { _id: 'p1', name: 'Royal Temple Necklace', category: { name: 'Necklaces' }, price: 124500, purity: '22K', stock: 8,  badge: 'bestseller', icon: '📿' },
  { _id: 'p2', name: 'Solitaire Diamond Ring', category: { name: 'Rings' },    price: 85000,  purity: '18K', stock: 12, badge: 'new',        icon: '💍' },
  { _id: 'p3', name: 'Bridal Kundan Choker',   category: { name: 'Bridal' },   price: 385000, purity: '22K', stock: 3,  badge: 'trending',   icon: '👑' },
  { _id: 'p4', name: 'Gold Jhumka Earrings',   category: { name: 'Earrings' }, price: 28500,  purity: '22K', stock: 25, badge: 'sale',       icon: '✨' },
];

const MOCK_CUSTOMERS = [
  { _id: 'c1', name: 'Priya Reddy',    email: 'priya@email.com',  phone: '+91 98765 00001', orders: 8,  totalSpent: 648500 },
  { _id: 'c2', name: 'Sunita Sharma',  email: 'sunita@email.com', phone: '+91 98765 00002', orders: 3,  totalSpent: 92000  },
  { _id: 'c3', name: 'Ananya Patel',   email: 'ananya@email.com', phone: '+91 98765 00003', orders: 5,  totalSpent: 185000 },
  { _id: 'c4', name: 'Kavya Menon',    email: 'kavya@email.com',  phone: '+91 98765 00004', orders: 12, totalSpent: 1240000},
  { _id: 'c5', name: 'Meera Krishnan', email: 'meera@email.com',  phone: '+91 98765 00005', orders: 2,  totalSpent: 42500  },
];

const MOCK_OFFERS = [
  { code: 'GOLD10',  type: 'percent', value: 10, minOrderValue: 50000,  usedCount: 1284, usageLimit: 5000, isActive: true, desc: '10% off on orders above ₹50,000' },
  { code: 'BRIDE15', type: 'percent', value: 15, minOrderValue: 0,       usedCount: 342,  usageLimit: 1000, isActive: true, desc: '15% off on Bridal Sets' },
  { code: 'FIRST5',  type: 'percent', value: 5,  minOrderValue: 0,       usedCount: 4521, usageLimit: 10000,isActive: true, desc: '5% off on First Order' },
];

function AnalyticCard({ label, value, change, changeUp, icon }) {
  return (
    <div className="bg-charcoal border border-gold/12 hover:border-gold/30 transition-all p-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-[28px] text-gold-light">{value}</div>
          <div className="font-sans text-[10px] tracking-[2px] uppercase text-fog mt-1">{label}</div>
        </div>
        <span className="text-2xl opacity-60">{icon}</span>
      </div>
      {change && (
        <div className={`font-sans text-[11px] mt-3 ${changeUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {changeUp ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [activeTab,    setActiveTab]    = useState('dashboard');
  const [showAddProd,  setShowAddProd]  = useState(false);
  const [prodForm,     setProdForm]     = useState({ name: '', category: 'Rings', price: '', purity: '22K', weight: '', stock: '', description: '' });
  const [uploading,    setUploading]    = useState(false);
  const [orderFilter,  setOrderFilter]  = useState('all');
  const [selectedOrder,setSelectedOrder]= useState(null);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      // For demo, allow access; in production redirect non-admins
      // router.push('/login');
    }
  }, [isLoggedIn]);

  const handleLogout = () => { logout(); router.push('/'); toast.success('Logged out'); };

  const filteredOrders = orderFilter === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === orderFilter);

  const handleSaveProduct = () => {
    if (!prodForm.name || !prodForm.price) return toast.error('Please fill required fields');
    toast.success(`Product "${prodForm.name}" saved successfully!`);
    setShowAddProd(false);
    setProdForm({ name: '', category: 'Rings', price: '', purity: '22K', weight: '', stock: '', description: '' });
  };

  const handleSimulateUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); toast.success('3 images uploaded to Cloudinary!'); }, 1800);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    toast.success(`Order #${MOCK_ORDERS.find(o => o._id === orderId)?.orderNumber} marked as ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-obsidian" style={{ paddingTop: '60px' }}>
      <div className="grid" style={{ gridTemplateColumns: '240px 1fr' }}>

        {/* Sidebar */}
        <aside className="bg-charcoal border-r border-gold/15 min-h-screen sticky top-0 pt-16">
          <div className="px-6 pb-6 border-b border-gold/10">
            <div className="font-display text-[16px] text-gold-light tracking-[2px]">Admin Panel</div>
            <div className="font-sans text-[9px] tracking-[2px] uppercase text-fog mt-1">S.S. Jewellers</div>
          </div>
          <nav className="py-4">
            {ADMIN_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-3.5 font-sans text-[10px] tracking-[2px] uppercase transition-all border-l-2 ${
                  activeTab === tab.id
                    ? 'border-gold text-gold bg-gold/6'
                    : 'border-transparent text-fog hover:text-cream hover:bg-white/2'
                }`}
              >
                <tab.icon size={14} />{tab.label}
              </button>
            ))}
          </nav>
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="border-t border-gold/10 pt-5 mb-4">
              <div className="font-sans text-[11px] text-cream font-semibold">{user?.name || 'Admin'}</div>
              <div className="font-sans text-[10px] text-fog">{user?.email || 'admin@ssjewellers.in'}</div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 font-sans text-[10px] tracking-[1px] uppercase text-red-400 hover:text-red-300 transition-colors">
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="p-8 pt-20 min-h-screen">
          <AnimatePresence mode="wait">

            {/* ── Dashboard ─────────────────────────────── */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="mb-8">
                  <h1 className="font-display text-3xl text-cream">Good Morning 👋</h1>
                  <p className="font-sans text-[11px] text-fog mt-1 tracking-wide">Sunday, 17 May 2026 · All Systems Operational</p>
                </div>
                <div className="grid grid-cols-4 gap-5 mb-8">
                  <AnalyticCard label="Today's Revenue"   value={fmtCr(MOCK_ANALYTICS.todayRevenue)}  change="12.4% vs yesterday" changeUp icon="💰" />
                  <AnalyticCard label="Orders Today"       value={MOCK_ANALYTICS.todayOrders}          change="8.1% vs yesterday"  changeUp icon="📦" />
                  <AnalyticCard label="Active Customers"   value={MOCK_ANALYTICS.totalCustomers.toLocaleString()} change="3.2% this week" changeUp icon="👥" />
                  <AnalyticCard label="Avg. Order Value"   value={fmt(MOCK_ANALYTICS.avgOrderValue)}   change="2.1% vs last week"  changeUp={false} icon="📊" />
                </div>
                {/* Recent orders */}
                <div className="bg-charcoal border border-gold/12 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-[18px] text-cream">Recent Orders</h2>
                    <button onClick={() => setActiveTab('orders')} className="font-sans text-[10px] tracking-[2px] uppercase text-gold hover:text-gold-light transition-colors">View All →</button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/15">
                        {['Order ID', 'Customer', 'Product', 'Amount', 'Status'].map((h) => (
                          <th key={h} className="text-left pb-3 font-sans text-[9px] tracking-[2px] uppercase text-gold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.map((o) => (
                        <tr key={o._id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                          <td className="py-3.5 font-sans text-[11px] text-gold">#{o.orderNumber}</td>
                          <td className="py-3.5 font-serif text-[14px] text-cream">{o.user.name}</td>
                          <td className="py-3.5 font-serif text-[13px] text-fog">{o.items[0]?.name?.slice(0, 28)}...</td>
                          <td className="py-3.5 font-display text-[13px] text-gold-light">{fmt(o.total)}</td>
                          <td className="py-3.5">
                            <span className={`font-sans text-[9px] tracking-[1px] uppercase border px-2.5 py-1.5 ${STATUS_COLOR[o.status]}`}>
                              {o.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Products ──────────────────────────────── */}
            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-3xl text-cream">Products</h1>
                  <button
                    onClick={() => setShowAddProd((s) => !s)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                {/* Add product form */}
                <AnimatePresence>
                  {showAddProd && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="bg-charcoal border border-gold/20 p-7">
                        <h3 className="font-display text-[18px] text-cream mb-5">Add New Product</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { key: 'name',        label: 'Product Name *',   type: 'text',   placeholder: '22K Gold Bridal Necklace',   span: 2 },
                            { key: 'price',        label: 'Price (₹) *',      type: 'number', placeholder: '125000',                    span: 1 },
                            { key: 'weight',       label: 'Weight (grams) *', type: 'number', placeholder: '28.5',                      span: 1 },
                            { key: 'stock',        label: 'Stock Qty *',      type: 'number', placeholder: '10',                        span: 1 },
                            { key: 'description',  label: 'Description',      type: 'text',   placeholder: 'Describe the product...',   span: 2 },
                          ].map((f) => (
                            <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                              <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">{f.label}</label>
                              {f.key === 'description' ? (
                                <textarea
                                  value={prodForm[f.key]}
                                  onChange={(e) => setProdForm((p) => ({ ...p, [f.key]: e.target.value }))}
                                  placeholder={f.placeholder}
                                  rows={3}
                                  className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none resize-none"
                                />
                              ) : (
                                <input
                                  type={f.type}
                                  value={prodForm[f.key]}
                                  onChange={(e) => setProdForm((p) => ({ ...p, [f.key]: e.target.value }))}
                                  placeholder={f.placeholder}
                                  className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none"
                                />
                              )}
                            </div>
                          ))}
                          <div>
                            <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Category</label>
                            <select
                              value={prodForm.category}
                              onChange={(e) => setProdForm((p) => ({ ...p, category: e.target.value }))}
                              className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none"
                            >
                              {['Rings', 'Earrings', 'Necklaces', 'Bangles', 'Chains', 'Bridal', 'Men'].map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Gold Purity</label>
                            <select
                              value={prodForm.purity}
                              onChange={(e) => setProdForm((p) => ({ ...p, purity: e.target.value }))}
                              className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none"
                            >
                              {['18K', '22K', '24K'].map((p) => <option key={p}>{p}</option>)}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Product Images (Cloudinary)</label>
                            <div
                              onClick={handleSimulateUpload}
                              className="border-2 border-dashed border-gold/25 hover:border-gold/50 p-10 text-center cursor-pointer transition-colors"
                            >
                              {uploading ? (
                                <div className="text-gold font-sans text-[11px]">Uploading to Cloudinary... ☁️</div>
                              ) : (
                                <>
                                  <Upload size={28} className="text-fog mx-auto mb-3" />
                                  <div className="font-sans text-[12px] text-fog">Click to upload images</div>
                                  <div className="font-sans text-[10px] text-ash mt-1">JPG, PNG, WebP · Max 10MB each · Up to 8 images</div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                          <button onClick={handleSaveProduct} className="px-6 py-3 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase">
                            Save Product
                          </button>
                          <button onClick={() => setShowAddProd(false)} className="px-6 py-3 border border-gold/25 text-fog font-sans text-[11px] tracking-[2px] uppercase hover:text-cream hover:border-gold/40 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Products table */}
                <div className="bg-charcoal border border-gold/12 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/15">
                        {['Product', 'Category', 'Purity', 'Price', 'Stock', 'Badge', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-5 py-4 font-sans text-[9px] tracking-[2px] uppercase text-gold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PRODUCTS.map((p) => (
                        <tr key={p._id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{p.icon}</span>
                              <span className="font-serif text-[14px] text-cream">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-sans text-[11px] text-fog capitalize">{p.category.name}</td>
                          <td className="px-5 py-4 font-sans text-[11px] text-gold">{p.purity}</td>
                          <td className="px-5 py-4 font-display text-[13px] text-gold-light">{fmt(p.price)}</td>
                          <td className="px-5 py-4">
                            <span className={`font-sans text-[11px] font-semibold ${p.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {p.badge && (
                              <span className="font-sans text-[9px] tracking-[1px] uppercase bg-gold/10 border border-gold/25 text-gold px-2 py-1">{p.badge}</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toast.success(`Editing: ${p.name}`)} className="w-8 h-8 bg-gold/10 border border-gold/25 text-gold flex items-center justify-center hover:bg-gold/20 transition-colors">
                                <Edit2 size={12} />
                              </button>
                              <button onClick={() => toast.error(`Deleted: ${p.name}`)} className="w-8 h-8 bg-red-500/10 border border-red-500/25 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Orders ────────────────────────────────── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-3xl text-cream mb-6">Order Management</h1>
                {/* Status filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setOrderFilter(s)}
                      className={`font-sans text-[10px] tracking-[1px] uppercase px-4 py-2 border transition-all ${
                        orderFilter === s ? 'border-gold bg-gold/10 text-gold' : 'border-gold/15 text-fog hover:text-cream'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
                <div className="bg-charcoal border border-gold/12 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/15">
                        {['Order #', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-5 py-4 font-sans text-[9px] tracking-[2px] uppercase text-gold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o._id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                          <td className="px-5 py-4 font-sans text-[11px] text-gold">#{o.orderNumber}</td>
                          <td className="px-5 py-4 font-sans text-[11px] text-fog">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="px-5 py-4">
                            <div className="font-serif text-[14px] text-cream">{o.user.name}</div>
                            <div className="font-sans text-[10px] text-fog">{o.user.email}</div>
                          </td>
                          <td className="px-5 py-4 font-serif text-[13px] text-fog">{o.items[0]?.name?.slice(0, 22)}...</td>
                          <td className="px-5 py-4 font-display text-[14px] text-gold-light">{fmt(o.total)}</td>
                          <td className="px-5 py-4">
                            <span className={`font-sans text-[9px] tracking-[1px] uppercase border px-2.5 py-1.5 ${STATUS_COLOR[o.status]}`}>
                              {o.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => toast.success(`Viewing order #${o.orderNumber}`)} className="w-8 h-8 border border-gold/20 text-fog flex items-center justify-center hover:text-gold hover:border-gold transition-colors">
                                <Eye size={12} />
                              </button>
                              {o.status !== 'delivered' && o.status !== 'cancelled' && (
                                <select
                                  onChange={(e) => e.target.value && handleUpdateOrderStatus(o._id, e.target.value)}
                                  defaultValue=""
                                  className="bg-charcoal border border-gold/15 text-fog font-sans text-[10px] px-2 py-1 outline-none cursor-pointer"
                                >
                                  <option value="" disabled>Update</option>
                                  {['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map((s) => (
                                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Customers ─────────────────────────────── */}
            {activeTab === 'customers' && (
              <motion.div key="customers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-3xl text-cream mb-6">Customer Management</h1>
                <div className="bg-charcoal border border-gold/12 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/15">
                        {['Customer', 'Phone', 'Orders', 'Total Spent', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-5 py-4 font-sans text-[9px] tracking-[2px] uppercase text-gold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_CUSTOMERS.map((c) => (
                        <tr key={c._id} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-dark to-gold flex items-center justify-center font-display text-obsidian font-bold text-sm">
                                {c.name[0]}
                              </div>
                              <div>
                                <div className="font-serif text-[14px] text-cream">{c.name}</div>
                                <div className="font-sans text-[10px] text-fog">{c.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-sans text-[12px] text-fog">{c.phone}</td>
                          <td className="px-5 py-4 font-display text-[16px] text-cream">{c.orders}</td>
                          <td className="px-5 py-4 font-display text-[14px] text-gold-light">{fmt(c.totalSpent)}</td>
                          <td className="px-5 py-4">
                            <span className={`font-sans text-[9px] tracking-[1px] uppercase border px-2.5 py-1.5 ${
                              c.totalSpent > 500000 ? 'text-gold border-gold/30 bg-gold/10' : 'text-emerald-400 border-emerald-400/25 bg-emerald-400/8'
                            }`}>
                              {c.totalSpent > 500000 ? 'VIP' : 'Active'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button onClick={() => toast.success(`Viewing: ${c.name}`)} className="font-sans text-[10px] tracking-[1px] uppercase text-gold border border-gold/25 px-3 py-1.5 hover:bg-gold/10 transition-colors">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Offers ────────────────────────────────── */}
            {activeTab === 'offers' && (
              <motion.div key="offers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-3xl text-cream">Coupons & Offers</h1>
                  <button onClick={() => toast.success('Add coupon modal opened (demo)')} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[11px] font-bold tracking-[2px] uppercase">
                    <Plus size={14} /> Add Coupon
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-5">
                  {MOCK_OFFERS.map((offer) => (
                    <div key={offer.code} className="bg-charcoal border border-gold/15 p-6 relative overflow-hidden">
                      {/* Decorative */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-bl-full" />
                      <div className="font-display text-[28px] text-gold-light tracking-[3px] mb-1">{offer.code}</div>
                      <div className="font-serif text-[14px] italic text-fog mb-3">{offer.desc}</div>
                      <div className="font-display text-[24px] text-cream mb-1">
                        {offer.value}{offer.type === 'percent' ? '%' : '₹'} <span className="font-sans text-[12px] text-fog">off</span>
                      </div>
                      {offer.minOrderValue > 0 && (
                        <div className="font-sans text-[10px] text-fog mb-3">Min. order: {fmt(offer.minOrderValue)}</div>
                      )}
                      {/* Usage bar */}
                      <div className="mb-3">
                        <div className="flex justify-between font-sans text-[10px] text-fog mb-1">
                          <span>{offer.usedCount.toLocaleString()} used</span>
                          <span>{offer.usageLimit.toLocaleString()} limit</span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-gold-dark to-gold"
                            style={{ width: `${Math.min(100, (offer.usedCount / offer.usageLimit) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-sans text-[9px] tracking-[1px] uppercase border px-2 py-1 ${offer.isActive ? 'text-emerald-400 border-emerald-400/25' : 'text-red-400 border-red-400/25'}`}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => toast.success(`Editing: ${offer.code}`)} className="text-fog hover:text-gold transition-colors"><Edit2 size={13} /></button>
                          <button onClick={() => toast.error(`Deactivated: ${offer.code}`)} className="text-fog hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Analytics ─────────────────────────────── */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-3xl text-cream mb-6">Analytics Overview</h1>
                <div className="grid grid-cols-4 gap-5 mb-8">
                  <AnalyticCard label="Monthly Revenue"      value={fmtCr(MOCK_ANALYTICS.monthRevenue)}   change="18% MoM" changeUp icon="📈" />
                  <AnalyticCard label="Monthly Orders"        value={MOCK_ANALYTICS.monthOrders.toLocaleString()} change="14% MoM" changeUp icon="🛒" />
                  <AnalyticCard label="Customer Satisfaction" value={`${MOCK_ANALYTICS.satisfaction}%`}   change="2.1%"    changeUp icon="⭐" />
                  <AnalyticCard label="Gold Turnover (kg)"    value={`${MOCK_ANALYTICS.goldTurnover}kg`}  change="6%"      changeUp icon="🏅" />
                </div>

                {/* Category breakdown */}
                <div className="bg-charcoal border border-gold/12 p-6 mb-6">
                  <h3 className="font-display text-[18px] text-cream mb-5">Sales by Category</h3>
                  <div className="space-y-4">
                    {[
                      { cat: 'Bridal Sets',   pct: 38, revenue: 18200000 },
                      { cat: 'Necklaces',     pct: 22, revenue: 10600000 },
                      { cat: 'Rings',         pct: 16, revenue: 7680000  },
                      { cat: 'Earrings',      pct: 12, revenue: 5760000  },
                      { cat: 'Bangles',       pct: 8,  revenue: 3840000  },
                      { cat: 'Chains',        pct: 4,  revenue: 1920000  },
                    ].map((item) => (
                      <div key={item.cat}>
                        <div className="flex justify-between font-sans text-[11px] mb-1.5">
                          <span className="text-cream">{item.cat}</span>
                          <span className="text-gold">{fmtCr(item.revenue)} · {item.pct}%</span>
                        </div>
                        <div className="h-2 bg-white/6 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.pct}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-gold-dark to-gold-light"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top products */}
                <div className="bg-charcoal border border-gold/12 p-6">
                  <h3 className="font-display text-[18px] text-cream mb-5">Top Performing Products</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Polki Haaram Set',         sales: 42, revenue: 21840000, icon: '🌟' },
                      { name: 'Bridal Kundan Choker Set',  sales: 89, revenue: 34265000, icon: '👑' },
                      { name: 'Royal Temple Necklace',     sales: 234,revenue: 29133000, icon: '📿' },
                      { name: 'Solitaire Diamond Ring',    sales: 187,revenue: 15895000, icon: '💍' },
                    ].map((p, i) => (
                      <div key={p.name} className="flex items-center gap-4 py-3 border-b border-white/4">
                        <span className="font-display text-[14px] text-gold-dark w-6 text-center">#{i + 1}</span>
                        <span className="text-xl">{p.icon}</span>
                        <div className="flex-1">
                          <div className="font-serif text-[14px] text-cream">{p.name}</div>
                          <div className="font-sans text-[10px] text-fog">{p.sales} units sold</div>
                        </div>
                        <div className="font-display text-[14px] text-gold-light">{fmtCr(p.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
