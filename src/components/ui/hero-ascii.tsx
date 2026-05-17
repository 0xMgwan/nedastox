'use client';

import { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function HeroAscii() {
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const embedScript = document.createElement('script');
    embedScript.type = 'text/javascript';
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] { position:relative!important;overflow:hidden!important; }
      [data-us-project] canvas { clip-path:inset(0 0 10% 0)!important; }
      [data-us-project] * { pointer-events:none!important; }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display:none!important;visibility:hidden!important;opacity:0!important;
        position:absolute!important;left:-9999px!important;top:-9999px!important;
      }
    `;
    document.head.appendChild(style);

    const hideBranding = () => {
      const el = document.querySelector('[data-us-project]');
      if (!el) return;
      el.querySelectorAll('*').forEach(node => {
        const t = (node.textContent ?? '').toLowerCase();
        if (t.includes('made with') || t.includes('unicorn'))
          (node as HTMLElement).style.display = 'none';
      });
    };

    hideBranding();
    const interval = setInterval(hideBranding, 100);
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 3000);

    return () => {
      clearInterval(interval);
      if (document.head.contains(embedScript)) document.head.removeChild(embedScript);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background animation (desktop) */}
      <div className="absolute inset-0 w-full h-full hidden lg:block" style={{ opacity: isDark ? 1 : 0.15 }}>
        <div data-us-project="whwOGlfJ5Rz2rHaEUgHl" style={{ width: '100%', height: '100%', minHeight: '100vh' }} />
      </div>

      {/* Stars / grid bg (mobile) */}
      <div className="absolute inset-0 w-full h-full lg:hidden stars-bg" />
      <div className="absolute inset-0 w-full h-full grid-bg opacity-60" />

      {/* Top header */}
      <div className="absolute top-0 left-0 right-0 z-20" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container mx-auto px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="font-mono text-xl lg:text-2xl font-bold tracking-widest italic transform -skew-x-12"
              style={{ color: 'var(--fg)' }}>
              TZASSETS
            </div>
            <div className="h-3 lg:h-4 w-px" style={{ background: 'var(--border-strong)' }} />
            <span className="text-[8px] lg:text-[10px] font-mono" style={{ color: 'var(--fg-muted)' }}>EST. 2025</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono" style={{ color: 'var(--fg-muted)' }}>
              <span>DSE: ACTIVE</span>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
              <span style={{ color: 'var(--positive)' }}>TZS MARKET OPEN</span>
            </div>
            {/* Theme toggle */}
            <button onClick={toggle}
              className="w-8 h-8 flex items-center justify-center transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      {['top-0 left-0 border-t-2 border-l-2','top-0 right-0 border-t-2 border-r-2'].map((cls, i) => (
        <div key={i} className={`absolute w-8 h-8 lg:w-12 lg:h-12 z-20 ${cls}`}
          style={{ borderColor: 'var(--border-strong)' }} />
      ))}
      {['left-0 border-b-2 border-l-2','right-0 border-b-2 border-r-2'].map((cls, i) => (
        <div key={i} className={`absolute w-8 h-8 lg:w-12 lg:h-12 z-20 ${cls}`}
          style={{ borderColor: 'var(--border-strong)', bottom: '5vh' }} />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center pt-16 lg:pt-0" style={{ marginTop: '5vh' }}>
        <div className="container mx-auto px-6 lg:px-16 lg:ml-[10%]">
          <div className="max-w-lg relative">
            {/* Decorative top line */}
            <div className="flex items-center gap-2 mb-3" style={{ opacity: 0.5 }}>
              <div className="w-8 h-px" style={{ background: 'var(--fg)' }} />
              <span className="text-[10px] font-mono tracking-wider" style={{ color: 'var(--fg)' }}>001</span>
              <div className="flex-1 h-px" style={{ background: 'var(--fg)' }} />
            </div>

            {/* Title */}
            <div className="relative mb-3 lg:mb-4">
              <div className="hidden lg:block absolute -left-3 top-0 bottom-0 w-1 dither-pattern" style={{ color: 'var(--fg)' }} />
              <h1 className="text-2xl lg:text-5xl font-bold leading-tight font-mono tracking-wider"
                style={{ color: 'var(--fg)', letterSpacing: '0.1em' }}>
                TANZANIA
                <span className="block mt-1 lg:mt-2" style={{ color: 'var(--fg)' }}>FINANCIAL</span>
                <span className="block mt-1 lg:mt-2 text-xl lg:text-4xl" style={{ color: 'var(--accent)' }}>MARKETS</span>
              </h1>
            </div>

            {/* Dot row */}
            <div className="hidden lg:flex gap-1 mb-3" style={{ opacity: 0.3 }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 rounded-full" style={{ background: 'var(--fg)' }} />
              ))}
            </div>

            <p className="text-xs lg:text-base mb-5 lg:mb-6 leading-relaxed font-mono" style={{ color: 'var(--fg-muted)' }}>
              Real-time tracker for DSE equities, BOT government bonds, UTT AMIS unit trusts, and live TZS forex rates.
            </p>

            {/* Market stats mini-panel */}
            <div className="grid grid-cols-3 gap-3 mb-6 p-3" style={{ border: '1px solid var(--border)' }}>
              <div>
                <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>DSE STOCKS</div>
                <div className="text-sm font-mono font-bold" style={{ color: 'var(--accent)' }}>12 listed</div>
                <div className="text-[9px] font-mono" style={{ color: 'var(--fg-dim)' }}>EOD prices</div>
              </div>
              <div>
                <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>T-BILL 91D</div>
                <div className="text-sm font-mono font-bold" style={{ color: 'var(--fg)' }}>9.65%</div>
                <div className="text-[9px] font-mono" style={{ color: 'var(--fg-dim)' }}>BOT auction</div>
              </div>
              <div>
                <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>TZS/USD</div>
                <div className="text-sm font-mono font-bold" style={{ color: 'var(--fg)' }}>2,644</div>
                <div className="text-[9px] font-mono" style={{ color: 'var(--positive)' }}>● LIVE</div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <a href="/dashboard"
                className="relative px-5 lg:px-6 py-2 lg:py-2.5 font-mono text-xs lg:text-sm text-center no-underline transition-all duration-200 group"
                style={{ background: 'var(--accent)', color: 'var(--bg)', border: '1px solid var(--accent)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--bg)'; }}>
                OPEN DASHBOARD →
              </a>
              <a href="/dashboard?tab=portfolio"
                className="relative px-5 lg:px-6 py-2 lg:py-2.5 font-mono text-xs lg:text-sm text-center no-underline transition-all duration-200"
                style={{ background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-strong)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--fg)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'transparent'; }}>
                VIEW PORTFOLIO
              </a>
            </div>

            {/* Bottom notation */}
            <div className="hidden lg:flex items-center gap-2 mt-6" style={{ opacity: 0.35 }}>
              <span className="text-[9px] font-mono" style={{ color: 'var(--fg)' }}>◈</span>
              <div className="flex-1 h-px" style={{ background: 'var(--fg)' }} />
              <span className="text-[9px] font-mono" style={{ color: 'var(--fg)' }}>DSE · BOT · UTT AMIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <div className="absolute left-0 right-0 z-20 backdrop-blur-sm" style={{ bottom: '5vh', borderTop: '1px solid var(--border)', background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(242,239,232,0.6)' }}>
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-6 text-[8px] lg:text-[9px] font-mono" style={{ color: 'var(--fg-muted)' }}>
            <span className="hidden lg:inline">SYSTEM.ACTIVE</span>
            <span className="lg:hidden">SYS.ACT</span>
            <div className="hidden lg:flex gap-1 items-end">
              {[8,14,6,12,10,16,8,11].map((h, i) => (
                <div key={i} className="w-1" style={{ height: `${h}px`, background: 'var(--fg-muted)' }} />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[9px] font-mono" style={{ color: 'var(--fg-muted)' }}>
            <span className="hidden lg:inline">◐ LIVE FEED</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <div key={i} className="w-1 h-1 rounded-full animate-pulse"
                  style={{ background: 'var(--positive)', opacity: 1 - i * 0.3, animationDelay: `${delay}s` }} />
              ))}
            </div>
            <span className="hidden lg:inline">DAR ES SALAAM EXCHANGE</span>
          </div>
        </div>
      </div>
    </main>
  );
}
