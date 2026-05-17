'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Asset, DATA_SOURCE_LABELS } from '@/data/tanzania-assets';
import type { HistoryPoint } from '@/app/api/stocks/history/route';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

const RANGES = [
  { label: '7D',  days: 7  },
  { label: '1M',  days: 30 },
  { label: '3M',  days: 90 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 text-[9px] font-mono" style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--fg-muted)' }}>
      <div className="mb-1">{label}</div>
      <div className="text-sm font-bold" style={{ color: 'var(--fg)' }}>
        {payload[0].value.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}

export default function PriceChart({ asset }: { asset: Asset }) {
  const [range, setRange]         = useState(30);
  const [liveHistory, setLiveHistory] = useState<{ date: string; price: number }[] | null>(null);
  const [loading, setLoading]     = useState(false);
  const [liveHigh52w, setLiveHigh52w] = useState<number | null>(null);
  const [liveLow52w, setLiveLow52w]   = useState<number | null>(null);
  const [liveMarketCap, setLiveMarketCap] = useState<number | null>(null);

  const fetchHistory = useCallback(async (symbol: string, days: number) => {
    if (asset.category !== 'stock') return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/history?symbol=${encodeURIComponent(symbol)}&days=${days}`);
      if (!res.ok) return;
      const data = await res.json() as {
        history: HistoryPoint[];
        high52w: number;
        low52w:  number;
        marketCap: number;
      };
      setLiveHistory(data.history.map(h => ({ date: h.date, price: h.close })));
      setLiveHigh52w(data.high52w);
      setLiveLow52w(data.low52w);
      setLiveMarketCap(data.marketCap);
    } catch { /* fall back to seed history */ }
    finally { setLoading(false); }
  }, [asset.category]);

  useEffect(() => {
    if (asset.category === 'stock') {
      setLiveHistory(null);
      fetchHistory(asset.symbol, 90);
    }
  }, [asset.id, asset.symbol, asset.category, fetchHistory]);

  useEffect(() => {
    if (asset.category === 'stock' && liveHistory) {
      fetchHistory(asset.symbol, range === 7 ? 7 : range === 30 ? 30 : 90);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const seedData = asset.history.slice(-range);
  const chartData = liveHistory ? liveHistory.slice(-range) : seedData;

  const data    = chartData;
  const first   = data[0]?.price ?? asset.price;
  const last    = data[data.length - 1]?.price ?? asset.price;
  const pct     = first ? ((last - first) / first) * 100 : 0;
  const isPos   = pct >= 0;
  const rawColor = isPos ? '#00ff88' : '#ff3b3b';
  const minP    = data.length ? Math.min(...data.map(d => d.price)) * 0.995 : 0;
  const maxP    = data.length ? Math.max(...data.map(d => d.price)) * 1.005 : 1;
  const srcInfo  = DATA_SOURCE_LABELS[asset.source];
  const high52w  = liveHigh52w ?? asset.high52w;
  const low52w   = liveLow52w  ?? asset.low52w;
  const marketCap = liveMarketCap ?? asset.marketCap;

  return (
    <div className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
              {asset.symbol}
            </span>
            <a
              href={srcInfo.url}
              target="_blank"
              rel="noreferrer"
              className="text-[7px] font-mono px-1 py-0.5 flex items-center gap-0.5 no-underline"
              style={{ color: srcInfo.color, background: `${srcInfo.color}18`, border: `1px solid ${srcInfo.color}30` }}
            >
              {srcInfo.label} <ExternalLink size={6} />
            </a>
            {loading && (
              <span className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>loading…</span>
            )}
          </div>
          <div className="text-2xl font-mono font-bold tabular-nums" style={{ color: 'var(--fg)' }}>
            {asset.price.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] font-mono flex items-center gap-1 mt-1" style={{ color: isPos ? 'var(--positive)' : 'var(--negative)' }}>
            {isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isPos ? '+' : ''}{pct.toFixed(2)}% ({RANGES.find(r => r.days === range)?.label})
          </div>
          {asset.lastUpdated && (
            <div className="text-[8px] font-mono mt-0.5" style={{ color: 'var(--fg-faint)' }}>
              Updated: {asset.lastUpdated}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <button
              key={r.label}
              onClick={() => setRange(r.days)}
              className="px-2 py-1 text-[9px] font-mono transition-all"
              style={
                range === r.days
                  ? { border: `1px solid var(--accent)`, color: 'var(--accent)' }
                  : { border: '1px solid var(--border)', color: 'var(--fg-dim)' }
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`grad-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={rawColor} stopOpacity={0.15} />
                <stop offset="95%" stopColor={rawColor} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--fg-dim)', fontSize: 8, fontFamily: 'monospace' }}
              tickLine={false} axisLine={false}
              interval={Math.floor(data.length / 4)}
              tickFormatter={d => d.slice(5)}
            />
            <YAxis
              domain={[minP, maxP]}
              tick={{ fill: 'var(--fg-dim)', fontSize: 8, fontFamily: 'monospace' }}
              tickLine={false} axisLine={false} width={62}
              tickFormatter={v => v.toLocaleString('en-TZ', { maximumFractionDigits: 0 })}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="price"
              stroke={rawColor} strokeWidth={1.5}
              fill={`url(#grad-${asset.id})`} dot={false}
              activeDot={{ r: 3, fill: rawColor, stroke: 'var(--bg)', strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      {(high52w || asset.yield || marketCap || asset.volume) && (
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          {high52w ? (
            <div>
              <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>52W HIGH</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--fg)' }}>{high52w.toLocaleString()}</div>
            </div>
          ) : null}
          {low52w ? (
            <div>
              <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>52W LOW</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--fg)' }}>{low52w.toLocaleString()}</div>
            </div>
          ) : null}
          {asset.yield ? (
            <div>
              <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>YIELD p.a.</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--positive)' }}>{asset.yield.toFixed(2)}%</div>
            </div>
          ) : null}
          {marketCap ? (
            <div>
              <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>MKT CAP</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--fg)' }}>
                {marketCap >= 1e12 ? `${(marketCap / 1e12).toFixed(2)}T` : `${(marketCap / 1e9).toFixed(1)}B`} TZS
              </div>
            </div>
          ) : null}
          {asset.volume > 0 && (
            <div>
              <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>VOLUME</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--fg)' }}>{asset.volume.toLocaleString()}</div>
            </div>
          )}
          {asset.sector && (
            <div>
              <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>SECTOR</div>
              <div className="text-[10px] font-mono" style={{ color: 'var(--fg)' }}>{asset.sector}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
