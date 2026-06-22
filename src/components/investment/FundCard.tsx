'use client';
import { Fund, navChange, navChangePct, FUND_TYPE_LABELS, FUND_TYPE_COLORS, RISK_LABELS } from '@/data/funds-data';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props { fund: Fund; selected: boolean; onClick: () => void; }

export default function FundCard({ fund, selected, onClick }: Props) {
  const chg = navChange(fund);
  const pct = navChangePct(fund);
  const pos = chg >= 0;
  const typeColor = FUND_TYPE_COLORS[fund.type];

  function fmtAum(n: number) {
    if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
    if (n >= 1e9)  return `${(n / 1e9).toFixed(1)}B`;
    return `${(n / 1e6).toFixed(0)}M`;
  }

  return (
    <div
      onClick={onClick}
      className="p-4 cursor-pointer transition-all"
      style={{
        border: selected ? `1px solid ${typeColor}` : '1px solid var(--border)',
        background: selected ? `${typeColor}08` : 'var(--bg-card)',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-card)'; }}
    >
      {/* Type badge + status */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[7px] font-mono px-1.5 py-0.5" style={{ color: typeColor, background: `${typeColor}18`, border: `1px solid ${typeColor}30` }}>
          {FUND_TYPE_LABELS[fund.type]}
        </span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: fund.status === 'active' ? 'var(--positive)' : '#888' }} />
          <span className="text-[7px] font-mono uppercase" style={{ color: 'var(--fg-faint)' }}>{fund.status}</span>
        </div>
      </div>

      {/* Fund name */}
      <div className="text-[10px] font-mono font-bold mb-0.5 leading-tight" style={{ color: 'var(--fg)' }}>
        {fund.shortName}
      </div>
      <div className="text-[8px] font-mono mb-3 leading-tight" style={{ color: 'var(--fg-muted)' }}>
        {fund.name.replace('UTT AMIS ', '').replace('GEPF Tanzania — ', '').replace(' Staff Provident Fund', ' PF')}
      </div>

      {/* NAV */}
      <div className="text-lg font-mono font-bold tabular-nums mb-0.5" style={{ color: 'var(--fg)' }}>
        {fund.nav.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span className="text-[8px] font-normal ml-1" style={{ color: 'var(--fg-dim)' }}>TZS/unit</span>
      </div>
      <div className="flex items-center gap-1 mb-3" style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}>
        {pos ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
        <span className="text-[9px] font-mono">{pos ? '+' : ''}{pct.toFixed(3)}%</span>
        <span className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>1D</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>AUM</div>
          <div className="text-[10px] font-mono font-bold" style={{ color: 'var(--fg)' }}>TZS {fmtAum(fund.aum)}</div>
        </div>
        <div>
          <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>YTD RETURN</div>
          <div className="text-[10px] font-mono font-bold" style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}>
            {fund.ytdReturn >= 0 ? '+' : ''}{fund.ytdReturn.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>UNIT HOLDERS</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--fg)' }}>{fund.unitHolders.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>RISK</div>
          <div className="text-[8px] font-mono" style={{ color: typeColor }}>{RISK_LABELS[fund.riskProfile].split(' ')[0]}</div>
        </div>
      </div>
    </div>
  );
}
