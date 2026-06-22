'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, User, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useBackOfficeAuth } from '@/contexts/BackOfficeAuth';

export default function BackOfficeLogin() {
  const { login } = useBackOfficeAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const accent = '#00aaff';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    // small delay to feel like an auth round-trip
    setTimeout(() => {
      const res = login(username, password);
      if (!res.ok) { setError(res.error ?? 'Login failed'); setLoading(false); }
    }, 350);
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      {/* Corner accents */}
      {['top-6 left-6 border-t-2 border-l-2','top-6 right-6 border-t-2 border-r-2',
        'bottom-6 left-6 border-b-2 border-l-2','bottom-6 right-6 border-b-2 border-r-2'].map((c, i) => (
        <div key={i} className={`absolute w-8 h-8 ${c}`} style={{ borderColor: 'var(--border-strong)' }} />
      ))}

      <div className="w-full max-w-sm">
        {/* Back link */}
        <Link href="/" className="flex items-center gap-1 mb-6 no-underline" style={{ color: 'var(--fg-muted)' }}>
          <ArrowLeft size={12} />
          <span className="text-[9px] font-mono">BACK TO ASSETCONNECT</span>
        </Link>

        {/* Card */}
        <div className="p-6" style={{ border: `1px solid var(--border)`, background: 'var(--bg-card)' }}>
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} style={{ color: accent }} />
            <span className="font-mono text-lg font-bold tracking-widest italic -skew-x-12" style={{ color: 'var(--fg)' }}>
              BACK OFFICE
            </span>
          </div>
          <div className="text-[9px] font-mono mb-6" style={{ color: 'var(--fg-muted)' }}>
            FIMCO SECURITIES · DSE MEMBER · SECURE ACCESS
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username */}
            <div>
              <label className="text-[8px] font-mono block mb-1" style={{ color: 'var(--fg-faint)' }}>USERNAME</label>
              <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--border)' }}>
                <User size={11} style={{ color: 'var(--fg-faint)' }} />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  className="bg-transparent text-[10px] font-mono outline-none w-full"
                  style={{ color: 'var(--fg)' }}
                  placeholder="enter username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[8px] font-mono block mb-1" style={{ color: 'var(--fg-faint)' }}>PASSWORD</label>
              <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--border)' }}>
                <Lock size={11} style={{ color: 'var(--fg-faint)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="bg-transparent text-[10px] font-mono outline-none w-full"
                  style={{ color: 'var(--fg)' }}
                  placeholder="enter password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--negative)', background: 'var(--negative-bg)' }}>
                <AlertCircle size={11} style={{ color: 'var(--negative)' }} />
                <span className="text-[9px] font-mono" style={{ color: 'var(--negative)' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-[10px] font-mono tracking-wider transition-all"
              style={{ background: accent, color: '#000', border: `1px solid ${accent}`, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'AUTHENTICATING…' : 'SIGN IN →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="text-[8px] font-mono mb-2" style={{ color: 'var(--fg-faint)' }}>DEMO CREDENTIALS</div>
            <div className="space-y-1 text-[8px] font-mono" style={{ color: 'var(--fg-dim)' }}>
              {[
                { u:'admin',       p:'fimco2025',  r:'Sysadmin' },
                { u:'ops.officer', p:'ops2025',    r:'Operations' },
                { u:'settlement',  p:'settle2025', r:'Settlement' },
                { u:'compliance',  p:'comply2025', r:'Compliance' },
              ].map(c => (
                <button key={c.u} type="button"
                  onClick={() => { setUsername(c.u); setPassword(c.p); setError(''); }}
                  className="flex items-center justify-between w-full px-2 py-1 transition-colors text-left"
                  style={{ border: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <span style={{ color: 'var(--fg-muted)' }}>{c.u} / {c.p}</span>
                  <span style={{ color: accent }}>{c.r}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>
          CMSA LICENSED · CSD CONNECTED · SESSION ENCRYPTED
        </div>
      </div>
    </div>
  );
}
