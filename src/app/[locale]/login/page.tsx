'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface Props { params: { locale: string }; }

export default function LoginPage({ params: { locale } }: Props) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') || `/${locale}/account`;

  const [mode, setMode]     = useState<'login' | 'register'>('login');
  const [email, setEmail]   = useState('');
  const [password, setPass] = useState('');
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoad]  = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoad(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(locale === 'th' ? 'เข้าสู่ระบบสำเร็จ!' : 'Logged in!');
        router.push(redirect);
      } else {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'register', email, password, full_name: name, phone, locale }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        // Auto login
        await supabase.auth.signInWithPassword({ email, password });
        toast.success(locale === 'th' ? 'สมัครสมาชิกสำเร็จ!' : 'Registration successful!');
        router.push(redirect);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Error occurred');
    } finally {
      setLoad(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-red rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-2xl">EG</span>
          </div>
          <h1 className="text-3xl font-black text-white">EARTHGANG</h1>
          <p className="text-brand-red text-xs tracking-widest uppercase">O.G. Tattoo Studio</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-brand-dark-2 rounded-xl p-1 mb-6">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                mode === m ? 'bg-brand-red text-white' : 'text-brand-gray hover:text-white'
              }`}
            >
              {m === 'login'
                ? (locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In')
                : (locale === 'th' ? 'สมัครสมาชิก' : 'Sign Up')}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-dark rounded-2xl p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-brand-gray-light text-sm mb-2 block">
                  {locale === 'th' ? 'ชื่อ-นามสกุล *' : 'Full Name *'}
                </label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="input-dark" required
                  placeholder={locale === 'th' ? 'ชื่อ-นามสกุล' : 'Your full name'}
                />
              </div>
              <div>
                <label className="text-brand-gray-light text-sm mb-2 block">
                  {locale === 'th' ? 'เบอร์โทรศัพท์' : 'Phone'}
                </label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="input-dark" placeholder="08X-XXX-XXXX"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-brand-gray-light text-sm mb-2 block">Email *</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input-dark" required placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="text-brand-gray-light text-sm mb-2 block">
              {locale === 'th' ? 'รหัสผ่าน *' : 'Password *'}
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password} onChange={e => setPass(e.target.value)}
                className="input-dark pr-10" required
                placeholder={mode === 'register' ? (locale === 'th' ? 'อย่างน้อย 6 ตัวอักษร' : 'At least 6 characters') : '••••••••'}
                minLength={6}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-white">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? <><Loader2 size={18} className="animate-spin" /> Loading...</> : (
              mode === 'login'
                ? (locale === 'th' ? 'เข้าสู่ระบบ' : 'Sign In')
                : (locale === 'th' ? 'สมัครสมาชิก' : 'Create Account')
            )}
          </button>

          {mode === 'login' && (
            <p className="text-center">
              <Link href="#" className="text-brand-red text-xs hover:underline">
                {locale === 'th' ? 'ลืมรหัสผ่าน?' : 'Forgot password?'}
              </Link>
            </p>
          )}
        </form>

        <p className="text-center text-brand-gray text-xs mt-4">
          {locale === 'th' ? 'ด้วยการสมัคร คุณยอมรับ' : 'By signing up, you agree to our'}{' '}
          <Link href={`/${locale}/terms`} className="text-brand-red hover:underline">
            {locale === 'th' ? 'ข้อกำหนดการใช้งาน' : 'Terms of Service'}
          </Link>
        </p>
      </div>
    </div>
  );
}
