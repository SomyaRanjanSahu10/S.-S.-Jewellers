'use client';
import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell,
} from 'recharts';

const GOLD  = '#C9A84C';
const LIGHT = '#E8CC7A';
const DARK  = '#8B6914';
const GRAY  = '#3D3D3D';
const GREEN = '#4CAF50';
const RED   = '#F44336';
const BLUE  = '#2196F3';

// Custom tooltip
const CustomTooltip = ({ active, payload, label, prefix = '₹', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-charcoal border border-gold/25 p-3 shadow-dark">
      <p className="font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 font-sans text-[11px]">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-fog capitalize">{entry.name}:</span>
          <span className="text-cream font-semibold">
            {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Revenue Area Chart ────────────────────────────────────
export function RevenueChart({ data }) {
  const SAMPLE = [
    { month: 'Jun', revenue: 3200000, orders: 620 },
    { month: 'Jul', revenue: 2900000, orders: 540 },
    { month: 'Aug', revenue: 3500000, orders: 690 },
    { month: 'Sep', revenue: 4100000, orders: 780 },
    { month: 'Oct', revenue: 5200000, orders: 960 },
    { month: 'Nov', revenue: 6800000, orders: 1240 },
    { month: 'Dec', revenue: 8400000, orders: 1580 },
    { month: 'Jan', revenue: 4200000, orders: 820 },
    { month: 'Feb', revenue: 3900000, orders: 740 },
    { month: 'Mar', revenue: 4600000, orders: 890 },
    { month: 'Apr', revenue: 5100000, orders: 960 },
    { month: 'May', revenue: 4800000, orders: 900 },
  ];
  const chartData = data || SAMPLE;

  return (
    <div className="bg-charcoal border border-gold/12 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-[18px] text-cream">Revenue (12 months)</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 font-sans text-[10px] text-fog">
            <div className="w-3 h-0.5 rounded" style={{ background: GOLD }} /> Revenue
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={GOLD} stopOpacity={0.3} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRAY} strokeOpacity={0.3} />
          <XAxis dataKey="month" tick={{ fill: '#888', fontSize: 10, fontFamily: 'Raleway' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: '#888', fontSize: 10, fontFamily: 'Raleway' }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000000 ? `₹${(v/100000).toFixed(0)}L` : `₹${(v/1000).toFixed(0)}K`}
          />
          <Tooltip content={<CustomTooltip prefix="₹" />} />
          <Area type="monotone" dataKey="revenue" name="revenue" stroke={GOLD} strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: GOLD }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Orders Bar Chart ──────────────────────────────────────
export function OrdersChart({ data }) {
  const SAMPLE = [
    { day: 'Mon', orders: 38 }, { day: 'Tue', orders: 52 }, { day: 'Wed', orders: 44 },
    { day: 'Thu', orders: 67 }, { day: 'Fri', orders: 84 }, { day: 'Sat', orders: 120 },
    { day: 'Sun', orders: 96 },
  ];
  const chartData = data || SAMPLE;

  return (
    <div className="bg-charcoal border border-gold/12 p-6">
      <h3 className="font-display text-[18px] text-cream mb-6">Orders (This Week)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRAY} strokeOpacity={0.3} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 10, fontFamily: 'Raleway' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#888', fontSize: 10, fontFamily: 'Raleway' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip prefix="" />} />
          <Bar dataKey="orders" fill={GOLD} radius={[2, 2, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === chartData.length - 1 ? LIGHT : GOLD} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Category Pie Chart ────────────────────────────────────
export function CategoryChart({ data }) {
  const SAMPLE = [
    { name: 'Bridal Sets',  value: 38, color: GOLD },
    { name: 'Necklaces',    value: 22, color: LIGHT },
    { name: 'Rings',        value: 16, color: '#d4b44a' },
    { name: 'Earrings',     value: 12, color: DARK },
    { name: 'Bangles',      value: 8,  color: '#a07830' },
    { name: 'Others',       value: 4,  color: GRAY },
  ];
  const chartData = data || SAMPLE;

  return (
    <div className="bg-charcoal border border-gold/12 p-6">
      <h3 className="font-display text-[18px] text-cream mb-6">Sales by Category</h3>
      <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value}%`, '']}
              contentStyle={{ background: '#141414', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 0 }}
              labelStyle={{ color: '#FAF6EE', fontFamily: 'Cinzel' }}
              itemStyle={{ color: '#888', fontFamily: 'Raleway', fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 min-w-[120px]">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
              <div>
                <div className="font-sans text-[10px] text-cream">{item.name}</div>
                <div className="font-display text-[12px] text-gold">{item.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Conversion Funnel ─────────────────────────────────────
export function ConversionChart() {
  const data = [
    { stage: 'Visitors',    value: 12840, pct: 100 },
    { stage: 'Product View',value: 7220,  pct: 56  },
    { stage: 'Cart Added',  value: 2140,  pct: 17  },
    { stage: 'Checkout',    value: 980,   pct: 7.6 },
    { stage: 'Ordered',     value: 740,   pct: 5.8 },
  ];

  return (
    <div className="bg-charcoal border border-gold/12 p-6">
      <h3 className="font-display text-[18px] text-cream mb-6">Conversion Funnel</h3>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={item.stage}>
            <div className="flex justify-between font-sans text-[11px] mb-1.5">
              <span className="text-cream">{item.stage}</span>
              <div className="flex gap-3">
                <span className="text-fog">{item.value.toLocaleString()}</span>
                <span className="text-gold font-semibold w-10 text-right">{item.pct}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/6 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${item.pct}%`,
                  background: `linear-gradient(90deg, ${DARK}, ${GOLD})`,
                  opacity: 1 - i * 0.12,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Combined Revenue + Orders Line Chart ──────────────────
export function TrendChart() {
  const data = [
    { week: 'W1', revenue: 850000, orders: 160 },
    { week: 'W2', revenue: 1100000, orders: 210 },
    { week: 'W3', revenue: 950000, orders: 185 },
    { week: 'W4', revenue: 1380000, orders: 265 },
    { week: 'W5', revenue: 1200000, orders: 230 },
    { week: 'W6', revenue: 1650000, orders: 310 },
    { week: 'W7', revenue: 1480000, orders: 285 },
    { week: 'W8', revenue: 1820000, orders: 340 },
  ];

  return (
    <div className="bg-charcoal border border-gold/12 p-6">
      <h3 className="font-display text-[18px] text-cream mb-6">8-Week Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRAY} strokeOpacity={0.3} />
          <XAxis dataKey="week" tick={{ fill: '#888', fontSize: 10, fontFamily: 'Raleway' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="revenue" tick={{ fill: '#888', fontSize: 9, fontFamily: 'Raleway' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
          <YAxis yAxisId="orders" orientation="right" tick={{ fill: '#888', fontSize: 9, fontFamily: 'Raleway' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle" iconSize={8}
            wrapperStyle={{ fontFamily: 'Raleway', fontSize: 11, color: '#888' }}
          />
          <Line yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke={GOLD} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: GOLD }} />
          <Line yAxisId="orders"  type="monotone" dataKey="orders"  name="Orders"  stroke={BLUE} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: BLUE }} strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
