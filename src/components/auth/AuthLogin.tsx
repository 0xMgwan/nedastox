'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, User, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import type { DemoCredential } from '@/contexts/createAuth';

interface Props {
  title:       string;
  subtitle:    string;
  accent:      string;
  footerNote:  string;
  demoCredentials: DemoCredential[];
  login:       (username: string, password: string) => { ok: boolean; error?: string };
}

export default function AuthLogin({ title, subtitle, accent, footerNote, demoCredentials, login }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const res = login(username, password);
      if (!res.ok) { setError(res.error ?? 'Login failed'); setLoading(false); }
    }, 350);
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      {['top-6 left-6 border-t-2 border-l-2','top-6 right-6 border-t-2 border-r-2',
        'bottom-6 left-6 border-b-2 border-l-2','bottom-6 right-6 border-b-2 border-r-2'].map((c, i) => (
        <div key={i} className={`absolute w-8 h-8 ${c}`} style={{ borderColor: 'var(--border-strong)' }} />
      ))}

      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-1 mb-6 no-underline" style={{ color: 'var(--fg-muted)' }}>
          <ArrowLeft size={12} />
          <span className="text-[9px] font-mono">BACK TO ASSETCONNECT</span>
        </Link>

        <div className="p-6" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} style={{ color: accent }} />
            <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>
              {title}
            </span>
          </div>
          <div className="text-[9px] font-mono mb-6" style={{ color: 'var(--fg-muted)' }}>{subtitle}</div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[8px] font-mono block mb-1" style={{ color: 'var(--fg-faint)' }}>USERNAME</label>
              <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--border)' }}>
                <User size={11} style={{ color: 'var(--fg-faint)' }} />
                <input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username"
                  className="bg-transparent text-[10px] font-mono outline-none w-full" style={{ color: 'var(--fg)' }}
                  placeholder="enter username" />
              </div>
            </div>
            <div>
              <label className="text-[8px] font-mono block mb-1" style={{ color: 'var(--fg-faint)' }}>PASSWORD</label>
              <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--border)' }}>
                <Lock size={11} style={{ color: 'var(--fg-faint)' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"
                  className="bg-transparent text-[10px] font-mono outline-none w-full" style={{ color: 'var(--fg)' }}
                  placeholder="enter password" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--negative)', background: 'var(--negative-bg)' }}>
                <AlertCircle size={11} style={{ color: 'var(--negative)' }} />
                <span className="text-[9px] font-mono" style={{ color: 'var(--negative)' }}>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 text-[10px] font-mono tracking-wider transition-all"
              style={{ background: accent, color: '#fff', border: `1px solid ${accent}`, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'AUTHENTICATING…' : 'SIGN IN →'}
            </button>
          </form>

          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-[8px] font-mono mb-2" style={{ color: 'var(--fg-faint)' }}>DEMO CREDENTIALS</div>
            <div className="space-y-1 text-[8px] font-mono">
              {demoCredentials.map(c => (
                <button key={c.username} type="button"
                  onClick={() => { setUsername(c.username); setPassword(c.password); setError(''); }}
                  className="flex items-center justify-between w-full px-2 py-1 transition-colors text-left"
                  style={{ border: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ color: 'var(--fg-muted)' }}>{c.username} / {c.password}</span>
                  <span style={{ color: accent }}>{c.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>{footerNote}</div>
      </div>
    </div>
  );
}
