'use client';

import {
  AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import { MUTUAL_FUNDS } from '@/data/funds-data';
import { DSE_STOCKS } from '@/data/tanzania-assets';

const RED = '#e10600';

/* ── Composite market index area chart ───────────────────────────── */
export function MarketIndexChart() {
  // Build a composite index from the flagship fund's NAV history
  const hist = MUTUAL_FUNDS[0].navHistory.slice(-60);
  const base = hist[0]?.nav ?? 1;
  const data = hist.map(p => ({ date: p.date, index: Math.round((p.nav / base) * 1000) }));
  const first = data[0]?.index ?? 0;
  const last  = data[data.length - 1]?.index ?? 0;
  const pct   = first ? ((last - first) / first) * 100 : 0;

  return (
    <div className="p-5 rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs tracking-wide" style={{ color: 'var(--fg-muted)' }}>DSE COMPOSITE INDEX</span>
        <span className="text-xs font-medium" style={{ color: pct >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
          {pct >= 0 ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
        </span>
      </div>
      <div className="text-3xl font-display mb-3" style={{ color: 'var(--fg)' }}>{last.toLocaleString()}</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor={RED} stopOpacity={0.22} />
                <stop offset="100%" stopColor={RED} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="index" stroke={RED} strokeWidth={2} fill="url(#idxGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── AUM allocation donut by asset class ─────────────────────────── */
export function AllocationChart() {
  const data = [
    { name: 'Equities',  value: 42, color: RED },
    { name: 'Gov Bonds', value: 28, color: '#1a1a1a' },
    { name: 'T-Bills',   value: 18, color: '#9a9a9a' },
    { name: 'Cash & MM', value: 12, color: '#d8d8d8' },
  ];
  return (
    <div className="p-5 rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <span className="text-xs tracking-wide" style={{ color: 'var(--fg-muted)' }}>PORTFOLIO ALLOCATION</span>
      <div className="flex items-center gap-4 mt-2">
        <div className="h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={32} outerRadius={52} paddingAngle={2} stroke="none">
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {data.map(d => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2" style={{ color: 'var(--fg-muted)' }}>
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />{d.name}
              </span>
              <span className="font-medium tabular-nums" style={{ color: 'var(--fg)' }}>{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Top movers bar ──────────────────────────────────────────────── */
export function MoversChart() {
  const data = [...DSE_STOCKS]
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    .slice(0, 5)
    .map(s => ({ symbol: s.symbol, pct: Number(s.changePct.toFixed(2)) }));

  return (
    <div className="p-5 rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <span className="text-xs tracking-wide" style={{ color: 'var(--fg-muted)' }}>TODAY&apos;S TOP MOVERS</span>
      <div className="h-32 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="symbol" width={48}
              tick={{ fill: 'var(--fg-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'var(--bg-hover)' }}
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
              formatter={(v) => [`${Number(v) > 0 ? '+' : ''}${v}%`, 'Change']} />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]} barSize={14}>
              {data.map((d, i) => <Cell key={i} fill={d.pct >= 0 ? 'var(--positive)' : RED} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
