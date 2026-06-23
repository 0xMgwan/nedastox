'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowUp, Sun, Moon, TrendingUp, Wallet, Building2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { TOTAL_AUM, TOTAL_UNIT_HOLDERS, ALL_FUNDS } from '@/data/funds-data';
import { DSE_STOCKS } from '@/data/tanzania-assets';
import { MarketIndexChart, AllocationChart, MoversChart } from './LandingCharts';

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: 'var(--accent)' }}>
        <div className="w-3.5 h-3.5 rounded-[4px] border-2" style={{ borderColor: '#fff' }} />
      </div>
      <span className="text-[17px] font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>AssetConnect</span>
    </div>
  );
}

const PROMPTS = [
  'How is the DSE performing today?',
  'Show me top mutual funds by 1-year return',
  'What is my pension fund allocation?',
  'Which DSE stocks moved the most today?',
];

export default function LandingPage() {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';
  const [prompt, setPrompt] = useState('');

  function ask() {
    router.push('/dashboard');
  }

  const stats = [
    { label: 'Assets under management', value: `TZS ${(TOTAL_AUM / 1e12).toFixed(1)}T` },
    { label: 'Unit holders',           value: TOTAL_UNIT_HOLDERS.toLocaleString() },
    { label: 'Funds managed',          value: String(ALL_FUNDS.length) },
    { label: 'DSE listed equities',    value: String(DSE_STOCKS.length) },
  ];

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-8 text-sm" style={{ color: 'var(--fg-muted)' }}>
            <Link href="/dashboard" className="no-underline hover:opacity-70" style={{ color: 'inherit' }}>Markets</Link>
            <Link href="/funds" className="no-underline hover:opacity-70" style={{ color: 'inherit' }}>Investment Mgmt</Link>
            <Link href="/back-office" className="no-underline hover:opacity-70" style={{ color: 'inherit' }}>Back Office</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link href="/dashboard" className="hidden sm:block text-sm no-underline px-4 py-2 rounded-full font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              Get started <ArrowRight size={13} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* soft red glow backdrop */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(60% 50% at 50% 0%, var(--accent-bg) 0%, transparent 70%)' }} />
        <div className="relative max-w-4xl mx-auto px-5 lg:px-8 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8"
            style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            LIVE · DSE · BOT · UTT AMIS
          </div>

          <h1 className="font-display leading-[0.95] tracking-tight"
            style={{ color: 'var(--fg)', fontSize: 'clamp(2.75rem, 8vw, 5.5rem)' }}>
            <span className="font-display-italic" style={{ color: 'var(--accent)' }}>Own</span> your markets.
          </h1>

          <p className="mt-7 text-lg font-medium" style={{ color: 'var(--fg)' }}>
            AssetConnect is Tanzania&apos;s investment management platform.
          </p>
          <p className="mt-1.5 text-base max-w-xl mx-auto" style={{ color: 'var(--fg-muted)' }}>
            Track DSE equities, bonds and forex. Manage mutual, pension, provident and
            private-equity funds. Run the broker back office — all in one place.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/dashboard" className="text-sm no-underline px-6 py-3 rounded-full font-medium"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              Get started <ArrowRight size={14} className="inline ml-1" />
            </Link>
            <Link href="/funds" className="text-sm no-underline px-6 py-3 rounded-full font-medium"
              style={{ border: '1px solid var(--border-strong)', color: 'var(--fg)' }}>
              Explore funds
            </Link>
          </div>

          {/* Prompt bar */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 p-2 pl-5 rounded-full"
              style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-card)' }}>
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                placeholder="How have markets moved this week?"
                className="flex-1 bg-transparent outline-none text-base"
                style={{ color: 'var(--fg)' }}
              />
              <button onClick={ask} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--accent)', color: '#fff' }}>
                <ArrowUp size={18} />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {PROMPTS.map(p => (
                <button key={p} onClick={() => { setPrompt(p); }}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Live charts ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display text-2xl" style={{ color: 'var(--fg)' }}>
            <span className="font-display-italic">See</span> the market, live.
          </h2>
          <Link href="/dashboard" className="text-sm no-underline" style={{ color: 'var(--accent)' }}>
            Open dashboard <ArrowRight size={13} className="inline" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MarketIndexChart />
          <AllocationChart />
          <MoversChart />
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-4 rounded-2xl overflow-hidden" style={{ background: 'var(--border)' }}>
          {stats.map(s => (
            <div key={s.label} className="p-5" style={{ background: 'var(--bg-card)' }}>
              <div className="font-display text-3xl mb-1" style={{ color: 'var(--fg)' }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'var(--fg-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Module cards ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
        <h2 className="font-display text-2xl mb-5" style={{ color: 'var(--fg)' }}>
          <span className="font-display-italic">Everything</span> you need.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { href:'/dashboard', icon:<TrendingUp size={20} />, title:'Market Data', sub:'Live DSE equities, government bonds, UTT AMIS funds and TZS forex with charts and portfolio tracking.', tag:'Open' },
            { href:'/funds', icon:<Wallet size={20} />, title:'Investment Management', sub:'Mutual, pension, provident and private-equity fund operations — unit management, NAV, contributions.', tag:'Secure login' },
            { href:'/back-office', icon:<Building2 size={20} />, title:'Broker Back Office', sub:'Trade reconciliation, contract notes, fees, T+2 settlement, corporate actions and regulatory reporting.', tag:'Secure login' },
          ].map(m => (
            <Link key={m.href} href={m.href} className="group no-underline p-6 rounded-2xl transition-all"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                {m.icon}
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="font-display text-xl" style={{ color: 'var(--fg)' }}>{m.title}</h3>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--fg-muted)' }}>{m.sub}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                {m.tag} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Closing band ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-16">
        <div className="rounded-3xl px-8 py-14 text-center" style={{ background: 'var(--accent)' }}>
          <h2 className="font-display text-white leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
            <span className="font-display-italic">Track</span> everything. <span className="font-display-italic">Ask</span> anything.
          </h2>
          <p className="text-white/80 mt-3 max-w-md mx-auto">From DSE tick data to fund NAVs and settlement — one platform.</p>
          <Link href="/dashboard" className="inline-block mt-7 text-sm no-underline px-6 py-3 rounded-full font-medium"
            style={{ background: '#fff', color: 'var(--accent)' }}>
            Get started <ArrowRight size={14} className="inline ml-1" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            DSE · BOT · UTT AMIS · CMSA regulated · © 2026 AssetConnect
          </div>
        </div>
      </footer>
    </div>
  );
}
