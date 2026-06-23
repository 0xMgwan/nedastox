'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TopBarProps {
  activeTab:    string;
  onTabChange:  (tab: string) => void;
  tzsUsd?:      number;
  dseIndex?:    number;
}

const TABS = [
  { id: 'overview',   label: 'OVERVIEW'   },
  { id: 'stocks',     label: 'STOCKS'     },
  { id: 'bonds',      label: 'BONDS'      },
  { id: 'funds',      label: 'FUNDS'      },
  { id: 'portfolio',  label: 'PORTFOLIO'  },
];

export default function TopBar({ activeTab, onTabChange, tzsUsd, dseIndex }: TopBarProps) {
  const { theme, toggle } = useTheme();
  const [time, setTime] = useState('');
  const [marketStatus, setMarketStatus] = useState<'OPEN' | 'CLOSED'>('CLOSED');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-TZ', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Africa/Dar_es_Salaam' })
      );
      const h   = (now.getUTCHours() + 3) % 24;
      const day = now.getUTCDay();
      setMarketStatus(day >= 1 && day <= 5 && h >= 10 && h < 13 ? 'OPEN' : 'CLOSED');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const topStripStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--border)',
    padding: '4px 16px',
    fontSize: '9px',
    fontFamily: 'monospace',
    color: 'var(--fg-dim)',
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--header-bg)' }}>

      {/* Top strip */}
      <div className="flex items-center justify-between" style={topStripStyle}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: marketStatus === 'OPEN' ? 'var(--positive)' : 'var(--negative)' }}
            />
            <span>DSE {marketStatus}</span>
          </div>
          <span className="hidden sm:inline" style={{ color: 'var(--fg-faint)' }}>
            DAR ES SALAAM STOCK EXCHANGE · BANK OF TANZANIA REGULATED
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">EAT {time}</span>
          <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--positive)' }} />
          <span style={{ color: 'var(--positive)' }}>LIVE</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8 py-3">
          {/* Logo */}
          <Link href="/" className="no-underline">
            <div className="font-semibold text-base tracking-tight transition-colors"
              style={{ color: 'var(--fg)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}>
              AssetConnect
            </div>
          </Link>

          <div className="h-4 w-px hidden sm:block" style={{ background: 'var(--border)' }} />

          {/* Nav tabs */}
          <nav className="hidden sm:flex items-center gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="px-3 py-1.5 text-[10px] font-mono tracking-wider border-b-2 transition-all"
                style={
                  activeTab === tab.id
                    ? { color: 'var(--accent)', borderColor: 'var(--accent)' }
                    : { color: 'var(--fg-dim)', borderColor: 'transparent' }
                }
                onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--fg-muted)'; }}
                onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--fg-dim)'; }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Live stats */}
          <div className="hidden lg:flex items-center gap-4 text-[9px] font-mono">
            {tzsUsd != null && (
              <div style={{ color: 'var(--fg-dim)' }}>
                TZS/USD <span className="font-bold" style={{ color: 'var(--fg)' }}>
                  {tzsUsd.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            {dseIndex != null && (
              <div style={{ color: 'var(--fg-dim)' }}>
                DSE IDX <span className="font-bold" style={{ color: 'var(--positive)' }}>
                  {dseIndex.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--fg)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark'
              ? <Sun size={12} />
              : <Moon size={12} />
            }
          </button>

          <Link href="/" className="w-8 h-8 flex items-center justify-center transition-all no-underline"
            style={{ color: 'var(--fg-dim)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--fg)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-dim)'}>
            <Home size={12} />
          </Link>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="sm:hidden flex overflow-x-auto" style={{ borderTop: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            className="flex-shrink-0 px-4 py-2 text-[9px] font-mono tracking-wider border-b-2 transition-all"
            style={activeTab === tab.id
              ? { color: 'var(--accent)', borderColor: 'var(--accent)' }
              : { color: 'var(--fg-dim)', borderColor: 'transparent' }}>
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}
