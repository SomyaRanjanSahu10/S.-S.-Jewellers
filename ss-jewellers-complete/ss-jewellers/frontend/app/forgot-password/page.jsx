'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

/* ── FORGOT PASSWORD ──────────────────────────────────── */
export function ForgotPasswordPage() {
  const [email,    setEmail]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [sent,     setSent]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      // Always show success (security)
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center pt-28 pb-16 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="font-display text-3xl text-gold-light tracking-[3px]">S.S. JEWELLERS</div>
            <div className="font-sans text-[9px] tracking-[5px] uppercase text-gold mt-1">Est. 1987 · Hyderabad</div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-charcoal border border-gold/15 p-8"
        >
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-cream mb-3">Check Your Email</h2>
              <p className="font-serif text-[15px] italic text-fog mb-6">
                If that email is registered, we've sent a password reset link. Check your inbox (and spam folder).
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase text-gold hover:text-gold-light transition-colors">
                <ArrowLeft size={12} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-display text-2xl text-cream mb-2">Reset Password</h2>
                <p className="font-serif text-[14px] italic text-fog">Enter your email and we'll send you a reset link.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/login" className="inline-flex items-center gap-2 font-sans text-[11px] tracking-[1px] text-fog hover:text-gold transition-colors">
                  <ArrowLeft size={11} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ── RESET PASSWORD ──────────────────────────────────── */
export function ResetPasswordPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get('token') || '';
  const [form,     setForm]     = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 8)      return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password: form.password });
      setDone(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset link is invalid or expired.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center pt-28 pb-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="font-display text-3xl text-gold-light tracking-[3px]">S.S. JEWELLERS</div>
          </Link>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-charcoal border border-gold/15 p-8">
          {done ? (
            <div className="text-center py-6">
              <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-cream mb-3">Password Updated!</h2>
              <p className="font-serif text-[15px] italic text-fog">Redirecting you to sign in...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-display text-2xl text-cream mb-2">New Password</h2>
                <p className="font-serif text-[14px] italic text-fog">Choose a strong password for your account.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: 'password', label: 'New Password',     placeholder: 'Min 8 characters' },
                  { key: 'confirm',  label: 'Confirm Password', placeholder: 'Repeat password' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">{f.label}</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={form[f.key]}
                        onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        required
                        className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none pr-12 placeholder:text-ash transition-colors"
                      />
                      {f.key === 'password' && (
                        <button type="button" onClick={() => setShowPass((s) => !s)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-fog hover:text-gold transition-colors">
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all mt-2">
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* Next.js page exports */
export default ForgotPasswordPage;
