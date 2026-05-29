'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') || '/profile';
  const { login }    = useAuthStore();

  const [form,      setForm]      = useState({ email: '', password: '' });
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Signup form
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.data);
      toast.success(`Welcome back, ${data.data.user.name.split(' ')[0]}! ✨`);
      router.push(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) return toast.error('Please fill all required fields');
    if (signupForm.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      const { data } = await authApi.register(signupForm);
      login(data.data);
      toast.success(`Welcome to S.S. Jewellers, ${data.data.user.name.split(' ')[0]}! 🏅`);
      router.push(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          className="bg-charcoal border border-gold/15"
        >
          {/* Tabs */}
          <div className="flex border-b border-gold/15">
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-sans text-[11px] tracking-[2px] uppercase transition-all ${
                  activeTab === tab ? 'text-gold border-b-2 border-gold' : 'text-fog hover:text-cream'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="p-8">

            {/* Login */}
            {activeTab === 'login' && (
              <motion.form key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                    required
                    className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                      required
                      className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none pr-12 placeholder:text-ash transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-fog hover:text-gold transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="font-sans text-[10px] tracking-[1px] text-gold hover:text-gold-light transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </motion.form>
            )}

            {/* Signup */}
            {activeTab === 'signup' && (
              <motion.form key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSignup} className="space-y-4">
                {[
                  { key: 'name',     label: 'Full Name',     type: 'text',     placeholder: 'Priya Sharma',      required: true },
                  { key: 'email',    label: 'Email Address', type: 'email',    placeholder: 'you@email.com',     required: true },
                  { key: 'phone',    label: 'Phone Number',  type: 'tel',      placeholder: '+91 98765 43210',   required: false },
                  { key: 'password', label: 'Password',      type: 'password', placeholder: 'Min 8 characters',  required: true },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block font-sans text-[10px] tracking-[2px] uppercase text-gold mb-2">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={signupForm[field.key]}
                      onChange={(e) => setSignupForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full bg-white/4 border border-gold/20 focus:border-gold text-cream font-sans text-[13px] px-4 py-3.5 outline-none placeholder:text-ash transition-colors"
                    />
                  </div>
                ))}
                <p className="font-sans text-[10px] text-fog leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-gold">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-gold">Privacy Policy</Link>.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-obsidian font-sans text-[12px] font-bold tracking-[2px] uppercase disabled:opacity-60 hover:shadow-gold transition-all"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </motion.form>
            )}

          </div>
        </motion.div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {['🔒 Secure', '✅ BIS Certified', '🏅 37 Years Trust'].map((t) => (
            <span key={t} className="font-sans text-[10px] text-fog">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
