'use client';

import { useState } from 'react';
import { Asset, formatTZS, DSE_STOCKS, GOVERNMENT_BONDS, UNIT_TRUST_FUNDS } from '@/data/tanzania-assets';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import AllocationChart from './AllocationChart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Holding { asset: Asset; shares: number; avgCost: number; }

const ALL_SELECTABLE = [...DSE_STOCKS, ...GOVERNMENT_BONDS, ...UNIT_TRUST_FUNDS];

const DEFAULT_HOLDINGS: Holding[] = [
  { asset: DSE_STOCKS[0],      shares: 2000, avgCost: 440  },
  { asset: DSE_STOCKS[1],      shares: 100,  avgCost: 3700 },
  { asset: DSE_STOCKS[2],      shares: 50,   avgCost: 7200 },
  { asset: GOVERNMENT_BONDS[4], shares: 5,   avgCost: 100000 },
  { asset: UNIT_TRUST_FUNDS[0], shares: 800, avgCost: 1150 },
];

function buildPortfolioHistory(holdings: Holding[]) {
  const days = 90;
  return Array.from({ length: days + 1 }, (_, idx) => {
    const i = days - idx;
    let value = 0;
    for (const h of holdings) {
      const point = h.asset.history[h.asset.history.length - 1 - i];
      value += (point?.price ?? h.avgCost) * h.shares;
    }
    const datePoint = holdings[0]?.asset.history[holdings[0].asset.history.length - 1 - i];
    return {
      date: datePoint?.date ?? new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      value: Math.round(value),
    };
  });
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  color: 'var(--fg)',
  fontFamily: 'monospace',
  fontSize: '10px',
  padding: '4px 8px',
  outline: 'none',
};

export default function PortfolioTracker() {
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS);
  const [addSymbol, setAddSymbol] = useState('');
  const [addShares, setAddShares] = useState('');
  const [addCost,   setAddCost]   = useState('');
  const [showAdd,   setShowAdd]   = useState(false);

  const totalValue = holdings.reduce((s, h) => s + h.asset.price * h.shares, 0);
  const totalCost  = holdings.reduce((s, h) => s + h.avgCost * h.shares, 0);
  const totalRet   = totalValue - totalCost;
  const totalRetPct = (totalRet / totalCost) * 100;
  const isPos = totalRet >= 0;

  const allocationData = holdings.map(h => ({
    name:  h.asset.symbol,
    value: (h.asset.price * h.shares / totalValue) * 100,
    color: h.asset.category === 'bond' ? '#ffaa00' : h.asset.category === 'fund' ? '#00ccff' : 'var(--positive)',
  }));

  const historyData = buildPortfolioHistory(holdings);

  function addHolding() {
    const asset = ALL_SELECTABLE.find(a => a.symbol.toLowerCase() === addSymbol.toLowerCase());
    if (!asset) return;
    const shares = parseFloat(addShares);
    const cost   = parseFloat(addCost);
    if (isNaN(shares) || isNaN(cost)) return;

    setHoldings(prev => {
      const idx = prev.findIndex(h => h.asset.id === asset.id);
      if (idx >= 0) {
        const updated = [...prev];
        const old = updated[idx];
        const totalSh = old.shares + shares;
        updated[idx] = { ...old, shares: totalSh, avgCost: (old.avgCost * old.shares + cost * shares) / totalSh };
        return updated;
      }
      return [...prev, { asset, shares, avgCost: cost }];
    });
    setAddSymbol(''); setAddShares(''); setAddCost(''); setShowAdd(false);
  }

  function removeHolding(id: string) {
    setHoldings(prev => prev.filter(h => h.asset.id !== id));
  }

  const retColor = isPos ? 'var(--positive)' : 'var(--negative)';
  const rawRetColor = isPos ? '#00ff88' : '#ff3b3b';

  const summaryCards = [
    { label: 'TOTAL VALUE',  value: formatTZS(totalValue, true),                      color: 'var(--fg)'       },
    { label: 'TOTAL COST',   value: formatTZS(totalCost, true),                        color: 'var(--fg-muted)' },
    { label: 'TOTAL RETURN', value: formatTZS(totalRet, true),                         color: retColor          },
    { label: 'RETURN %',     value: `${isPos ? '+' : ''}${totalRetPct.toFixed(2)}%`,  color: retColor          },
  ];

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((s, i) => (
          <div key={i} className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div className="text-[9px] font-mono mb-2 tracking-wider" style={{ color: 'var(--fg-dim)' }}>{s.label}</div>
            <div className="text-base font-mono font-bold tabular-nums" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Portfolio value chart */}
        <div className="lg:col-span-2 p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>PORTFOLIO VALUE — 90 DAYS</div>
            <div className="text-[9px] font-mono flex items-center gap-1" style={{ color: retColor }}>
              {isPos ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {isPos ? '+' : ''}{totalRetPct.toFixed(2)}%
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={rawRetColor} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={rawRetColor} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fill: 'var(--fg-dim)', fontSize: 8, fontFamily: 'monospace' }}
                  tickLine={false} axisLine={false} interval={15} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fill: 'var(--fg-dim)', fontSize: 8, fontFamily: 'monospace' }}
                  tickLine={false} axisLine={false} width={70}
                  tickFormatter={v => `${(v / 1e6).toFixed(0)}M`} />
                <Tooltip
                  formatter={(v) => [formatTZS(Number(v), true), 'Value']}
                  contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 0, fontFamily: 'monospace', fontSize: 10, color: 'var(--fg)' }}
                />
                <Area type="monotone" dataKey="value"
                  stroke={rawRetColor} strokeWidth={1.5}
                  fill="url(#portGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation */}
        <AllocationChart data={allocationData} title="ALLOCATION" centerLabel={`${holdings.length} ASSETS`} />
      </div>

      {/* Holdings table */}
      <div style={{ border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            HOLDINGS ({holdings.length})
          </span>
          <button
            onClick={() => setShowAdd(v => !v)}
            className="flex items-center gap-1.5 text-[9px] font-mono px-2 py-1 transition-all"
            style={{ color: 'var(--fg-muted)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--border-accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <Plus size={9} /> ADD POSITION
          </button>
        </div>

        {showAdd && (
          <div className="flex flex-wrap gap-2 items-end p-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            {[
              { label: 'SYMBOL', value: addSymbol, onChange: (v: string) => setAddSymbol(v.toUpperCase()), placeholder: 'CRDB', width: 96, list: 'sym-list' },
              { label: 'SHARES / UNITS', value: addShares, onChange: setAddShares, placeholder: '1000', width: 112, type: 'number' },
              { label: 'AVG COST (TZS)',  value: addCost,   onChange: setAddCost,   placeholder: '450',  width: 112, type: 'number' },
            ].map(field => (
              <div key={field.label} className="flex flex-col gap-1">
                <span className="text-[8px] font-mono" style={{ color: 'var(--fg-dim)' }}>{field.label}</span>
                <input
                  type={field.type ?? 'text'}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  style={{ ...inputStyle, width: field.width }}
                  list={field.list}
                />
                {field.list && (
                  <datalist id={field.list}>
                    {ALL_SELECTABLE.map(a => <option key={a.id} value={a.symbol} />)}
                  </datalist>
                )}
              </div>
            ))}
            <button
              onClick={addHolding}
              className="px-3 py-1 text-[9px] font-mono transition-all"
              style={{ background: 'var(--accent)', color: 'var(--bg)', border: '1px solid var(--accent)' }}
            >
              ADD
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ASSET', 'SHARES', 'AVG COST', 'CUR PRICE', 'VALUE', 'RETURN', 'RETURN%', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left font-normal tracking-wider whitespace-nowrap"
                    style={{ color: 'var(--fg-dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map(h => {
                const value  = h.asset.price * h.shares;
                const cost   = h.avgCost * h.shares;
                const ret    = value - cost;
                const retPct = (ret / cost) * 100;
                const pos    = ret >= 0;
                return (
                  <tr key={h.asset.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td className="px-4 py-3">
                      <div className="font-bold" style={{ color: 'var(--fg)' }}>{h.asset.symbol}</div>
                      <div className="text-[8px]" style={{ color: 'var(--fg-dim)' }}>{h.asset.category.toUpperCase()}</div>
                    </td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{h.shares.toLocaleString()}</td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                      {h.avgCost.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-bold" style={{ color: 'var(--fg)' }}>
                      {h.asset.price.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 tabular-nums" style={{ color: 'var(--fg)' }}>{formatTZS(value, true)}</td>
                    <td className="px-4 py-3 tabular-nums font-bold" style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}>
                      {pos ? '+' : ''}{formatTZS(ret, true)}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-bold" style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}>
                      {pos ? '+' : ''}{retPct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeHolding(h.asset.id)}
                        className="transition-colors"
                        style={{ color: 'var(--fg-faint)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--negative)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-faint)'}>
                        <Trash2 size={10} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
