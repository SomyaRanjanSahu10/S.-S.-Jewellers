'use client';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// ── Gold Button ───────────────────────────────────────────
export const Button = forwardRef(function Button(
  { children, variant = 'gold', size = 'md', loading = false, disabled, className, ...props },
  ref
) {
  const base = 'inline-flex items-center justify-center gap-2.5 font-sans font-bold tracking-[2px] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    gold:    'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian hover:-translate-y-0.5 hover:shadow-gold',
    outline: 'border border-gold text-gold hover:bg-gold/10 hover:-translate-y-0.5',
    ghost:   'text-gold hover:bg-gold/10',
    danger:  'border border-red-500/40 text-red-400 hover:bg-red-500/10',
    white:   'bg-white text-obsidian hover:-translate-y-0.5 hover:shadow-lg',
  };

  const sizes = {
    sm:  'text-[9px] px-5 py-2.5',
    md:  'text-[11px] px-8 py-3.5',
    lg:  'text-[12px] px-10 py-4',
    xl:  'text-[13px] px-12 py-5',
    icon:'text-[14px] w-10 h-10',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
});

// ── Badge ─────────────────────────────────────────────────
export function Badge({ children, variant = 'gold', className }) {
  const variants = {
    gold:     'bg-gold text-obsidian',
    outline:  'border border-gold/30 text-gold bg-gold/8',
    new:      'bg-gold text-obsidian',
    sale:     'bg-ruby text-white',
    trending: 'bg-emerald text-white',
    info:     'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    success:  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning:  'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    error:    'bg-red-500/20 text-red-300 border border-red-500/30',
  };

  return (
    <span className={clsx(
      'inline-flex items-center font-sans text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-1',
      variants[variant] || variants.gold,
      className
    )}>
      {children}
    </span>
  );
}

// ── Glass Card ─────────────────────────────────────────────
export function GlassCard({ children, className, hover = true, padding = true }) {
  return (
    <div className={clsx(
      'bg-white/3 border border-gold/15 transition-all duration-400',
      hover && 'hover:border-gold/40 hover:bg-white/5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(201,168,76,0.2)]',
      padding && 'p-6',
      className
    )}>
      {children}
    </div>
  );
}

// ── Loading Spinner ────────────────────────────────────────
export function Spinner({ size = 20, className }) {
  return (
    <Loader2
      size={size}
      className={clsx('animate-spin text-gold', className)}
    />
  );
}

// ── Section Header ─────────────────────────────────────────
export function SectionHeader({ label, title, subtitle, center = true, className }) {
  return (
    <div className={clsx('mb-14', center && 'text-center', className)}>
      {label && (
        <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold mb-3">
          {label}
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-serif text-[17px] italic text-fog mt-3 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Gold Divider ───────────────────────────────────────────
export function GoldDivider({ label, className }) {
  return (
    <div className={clsx('flex items-center gap-4 my-6', className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      {label && (
        <span className="font-sans text-[9px] tracking-[3px] uppercase text-gold flex-shrink-0">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </div>
  );
}

// ── Shimmer Text ───────────────────────────────────────────
export function ShimmerText({ children, className, as: Tag = 'span' }) {
  return (
    <Tag
      className={clsx('shimmer-text', className)}
      style={{
        background: 'linear-gradient(90deg, #8B6914 0%, #E8CC7A 40%, #C9A84C 60%, #8B6914 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'shimmer 4s linear infinite',
      }}
    >
      {children}
    </Tag>
  );
}

// ── Animated Counter ───────────────────────────────────────
export function AnimatedNumber({ value, prefix = '', suffix = '', duration = 2 }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {prefix}{value}{suffix}
    </motion.span>
  );
}

// ── Price Display ──────────────────────────────────────────
export function PriceDisplay({ price, oldPrice, discount, size = 'md' }) {
  const fmt = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const sizes = {
    sm:  'text-[14px]',
    md:  'text-[20px]',
    lg:  'text-[28px]',
    xl:  'text-[36px]',
  };

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className={clsx('font-display text-gold-light', sizes[size] || sizes.md)}>
        {fmt(price)}
      </span>
      {oldPrice && (
        <span className="font-sans text-[13px] text-fog line-through">
          {fmt(oldPrice)}
        </span>
      )}
      {discount > 0 && (
        <span className="font-sans text-[11px] text-emerald-400 font-semibold">
          {discount}% off
        </span>
      )}
    </div>
  );
}

// ── Rating Stars ───────────────────────────────────────────
export function RatingStars({ rating = 4.5, count, size = 'sm' }) {
  const starSizes = { sm: 12, md: 16, lg: 20 };
  const filled = Math.round(rating);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width={starSizes[size]}
            height={starSizes[size]}
            viewBox="0 0 24 24"
            fill={i < filled ? '#C9A84C' : 'none'}
            stroke={i < filled ? '#C9A84C' : '#3D3D3D'}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      {count !== undefined && (
        <span className="font-sans text-[10px] text-fog">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

// ── Input Field ────────────────────────────────────────────
export const Input = forwardRef(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full bg-white/4 border focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors',
          error ? 'border-red-500' : 'border-gold/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 font-sans text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
});

// ── Select Field ───────────────────────────────────────────
export const Select = forwardRef(function Select(
  { label, options = [], error, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          'w-full bg-charcoal border text-cream font-sans text-[13px] px-4 py-3.5 outline-none cursor-pointer transition-colors appearance-none',
          error ? 'border-red-500' : 'border-gold/20 focus:border-gold',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 font-sans text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
});

// ── Textarea ───────────────────────────────────────────────
export const Textarea = forwardRef(function Textarea(
  { label, error, rows = 4, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-sans text-[9px] tracking-[2px] uppercase text-gold mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          'w-full bg-white/4 border focus:border-gold text-cream font-sans text-[13px] px-4 py-3 outline-none resize-none placeholder:text-ash transition-colors',
          error ? 'border-red-500' : 'border-gold/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 font-sans text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
});

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm:  'max-w-md',
    md:  'max-w-2xl',
    lg:  'max-w-4xl',
    xl:  'max-w-6xl',
    full:'max-w-[95vw]',
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={clsx(
          'relative w-full bg-charcoal border border-gold/20 shadow-dark-lg max-h-[90vh] overflow-y-auto',
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gold/15">
            <h2 className="font-display text-xl text-cream">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-fog hover:text-gold transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ icon = '💎', title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-7xl mb-5 opacity-15">{icon}</div>
      <h3 className="font-display text-2xl text-cream mb-2">{title}</h3>
      {desc && <p className="font-serif text-[15px] italic text-fog mb-6 max-w-xs">{desc}</p>}
      {action}
    </div>
  );
}

export default Button;
