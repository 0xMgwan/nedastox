'use client';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Fund, navChange, navChangePct, FUND_TYPE_COLORS } from '@/data/funds-data';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RANGES = [{ l:'1M', d:22 }, { l:'3M', d:65 }, { l:'6M', d:130 }];

function Tip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 text-[9px] font-mono" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--fg-muted)' }}>{label}</div>
      <div className="text-sm font-bold tabular-nums" style={{ color: 'var(--fg)' }}>
        {payload[0].value.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TZS
      </div>
    </div>
  );
}

export default function NAVChart({ fund }: { fund: Fund }) {
  const [range, setRange] = useState(65);
  const color  = FUND_TYPE_COLORS[fund.type];
  const data   = fund.navHistory.slice(-range);
  const chg    = navChange(fund);
  const pct    = navChangePct(fund);
  const pos    = chg >= 0;
  const min    = data.length ? Math.min(...data.map(d => d.nav)) * 0.997 : 0;
  const max    = data.length ? Math.max(...data.map(d => d.nav)) * 1.003 : 1;

  // period return
  const firstNav = data[0]?.nav ?? fund.prevNav;
  const periodPct = firstNav ? ((fund.nav - firstNav) / firstNav) * 100 : 0;

  return (
    <div className="p-4 h-full" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--fg-dim)' }}>NAV PER UNIT — {fund.shortName}</div>
          <div className="text-2xl font-mono font-bold tabular-nums" style={{ color: 'var(--fg)' }}>
            {fund.nav.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
            <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--fg-dim)' }}>TZS</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[9px] font-mono" style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}>
              {pos ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {pos ? '+' : ''}{pct.toFixed(3)}% 1D
            </span>
            <span className="text-[9px] font-mono" style={{ color: periodPct >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
              {periodPct >= 0 ? '+' : ''}{periodPct.toFixed(2)}% {RANGES.find(r => r.d === range)?.l}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button key={r.l} onClick={() => setRange(r.d)}
              className="px-2 py-1 text-[9px] font-mono"
              style={range === r.d ? { border: `1px solid ${color}`, color } : { border: '1px solid var(--border)', color: 'var(--fg-dim)' }}>
              {r.l}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top:4, right:4, bottom:0, left:0 }}>
            <defs>
              <linearGradient id={`nav-grad-${fund.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
            <XAxis dataKey="date" tick={{ fill:'var(--fg-dim)', fontSize:8, fontFamily:'monospace' }}
              tickLine={false} axisLine={false}
              interval={Math.floor(data.length / 4)} tickFormatter={d => d.slice(5)} />
            <YAxis domain={[min, max]} tick={{ fill:'var(--fg-dim)', fontSize:8, fontFamily:'monospace' }}
              tickLine={false} axisLine={false} width={65}
              tickFormatter={v => v.toLocaleString('en-TZ', { maximumFractionDigits:0 })} />
            <Tooltip content={<Tip />} />
            <Area type="monotone" dataKey="nav" stroke={color} strokeWidth={1.5}
              fill={`url(#nav-grad-${fund.id})`} dot={false}
              activeDot={{ r:3, fill:color, stroke:'var(--bg)', strokeWidth:1 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Fund stats row */}
      <div className="grid grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { l:'AUM',         v: fund.aum >= 1e12 ? `${(fund.aum/1e12).toFixed(2)}T` : `${(fund.aum/1e9).toFixed(1)}B TZS` },
          { l:'YTD RETURN',  v: `${fund.ytdReturn >= 0 ? '+' : ''}${fund.ytdReturn.toFixed(2)}%` },
          { l:'1YR RETURN',  v: `${fund.oneYrReturn >= 0 ? '+' : ''}${fund.oneYrReturn.toFixed(2)}%` },
          { l:'MGMT FEE',    v: `${fund.managementFee.toFixed(2)}% p.a.` },
        ].map((s, i) => (
          <div key={i}>
            <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>{s.l}</div>
            <div className="text-[10px] font-mono font-bold" style={{ color: i === 1 || i === 2 ? 'var(--positive)' : 'var(--fg)' }}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
