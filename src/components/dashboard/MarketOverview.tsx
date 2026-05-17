'use client';

import { Asset, DSE_STOCKS, GOVERNMENT_BONDS, UNIT_TRUST_FUNDS, FOREX_RATES, SECTOR_COLORS, DATA_SOURCE_LABELS } from '@/data/tanzania-assets';
import StatCard from './StatCard';
import AllocationChart from './AllocationChart';
import PriceChart from './PriceChart';
import { Activity, TrendingUp, BarChart2, DollarSign, Info } from 'lucide-react';

interface Props {
  stocks: Asset[]; bonds: Asset[]; funds: Asset[]; forex: Asset[];
  onSelect: (asset: Asset) => void;
  selectedAsset: Asset | null;
}

export default function MarketOverview({ stocks, bonds, funds, forex, onSelect, selectedAsset }: Props) {
  const gainers = [...stocks].sort((a, b) => b.changePct - a.changePct).slice(0, 5);
  const losers  = [...stocks].sort((a, b) => a.changePct - b.changePct).slice(0, 5);

  const totalMktCap  = stocks.reduce((s, a) => s + (a.marketCap ?? 0), 0);
  const avgBondYield = bonds.reduce((s, b) => s + (b.yield ?? 0), 0) / bonds.length;
  const avgFundYield = funds.reduce((s, f) => s + (f.yield ?? 0), 0) / funds.length;

  const sectorAlloc = Object.entries(
    stocks.reduce<Record<string, number>>((acc, s) => {
      const sec = s.sector ?? 'Other';
      acc[sec] = (acc[sec] ?? 0) + (s.marketCap ?? 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: SECTOR_COLORS[name] ?? '#888' }));

  const assetClassAlloc = [
    { name: 'Equities', value: totalMktCap,                             color: 'var(--positive)' },
    { name: 'Bonds',    value: bonds.length * 100_000 * 10,             color: '#ffaa00' },
    { name: 'Funds',    value: funds.reduce((s, f) => s + f.price * 1000, 0), color: '#00ccff' },
  ];

  return (
    <div className="space-y-4">
      {/* Data sources notice */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-[8px] font-mono"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <Info size={9} style={{ color: 'var(--fg-dim)' }} />
        <span style={{ color: 'var(--fg-dim)' }}>DATA SOURCES:</span>
        {Object.entries(DATA_SOURCE_LABELS).map(([key, info]) => (
          <a key={key} href={info.url} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 px-1.5 py-0.5 no-underline transition-opacity hover:opacity-80"
            style={{ color: info.color, background: `${info.color}18`, border: `1px solid ${info.color}30` }}>
            {info.label}
          </a>
        ))}
        <span style={{ color: 'var(--fg-faint)' }}>· Forex rates are live · Stock prices are DSE end-of-day</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="DSE MARKET CAP" value={`${(totalMktCap / 1e12).toFixed(2)}T TZS`}
          sub="Dar es Salaam Stock Exchange" subColor="muted" icon={BarChart2} index={0} />
        <StatCard label="AVG BOND YIELD" value={`${avgBondYield.toFixed(2)}%`}
          sub="BOT Government Securities" subColor="green" icon={TrendingUp} index={1} />
        <StatCard label="AVG FUND YIELD" value={`${avgFundYield.toFixed(2)}%`}
          sub="UTT AMIS Unit Trusts" subColor="green" icon={Activity} index={2} />
        <StatCard
          label="TZS / USD"
          value={forex[0]?.price.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
          sub={`${forex[0]?.changePct >= 0 ? '+' : ''}${forex[0]?.changePct.toFixed(2)}% · LIVE`}
          subColor={forex[0]?.changePct >= 0 ? 'green' : 'red'}
          icon={DollarSign} index={3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PriceChart asset={selectedAsset ?? stocks[0]} />
        </div>
        <div className="space-y-4">
          <AllocationChart data={sectorAlloc}    title="SECTOR BREAKDOWN (BY MKT CAP)" centerLabel="DSE" />
          <AllocationChart data={assetClassAlloc} title="ASSET CLASS MIX"               centerLabel="TZ MKTS" />
        </div>
      </div>

      {/* Gainers / Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { list: gainers, label: 'TOP GAINERS', positive: true },
          { list: losers,  label: 'TOP LOSERS',  positive: false },
        ].map(({ list, label, positive }) => (
          <div key={label} style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-1.5 h-1.5" style={{ background: positive ? 'var(--positive)' : 'var(--negative)' }} />
              <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>{label}</span>
            </div>
            {list.map((a, i) => (
              <div key={a.id} onClick={() => onSelect(a)}
                className="flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-mono w-3" style={{ color: 'var(--fg-faint)' }}>{i + 1}</span>
                  <div>
                    <div className="text-[10px] font-mono font-bold" style={{ color: 'var(--fg)' }}>{a.symbol}</div>
                    <div className="text-[8px] font-mono" style={{ color: 'var(--fg-dim)' }}>{a.sector}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono tabular-nums" style={{ color: 'var(--fg)' }}>{a.price.toLocaleString()}</div>
                  <div className="text-[9px] font-mono font-bold"
                    style={{ color: positive ? 'var(--positive)' : 'var(--negative)' }}>
                    {positive ? '+' : ''}{a.changePct.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Forex panel */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            FOREX RATES — TZS BASE
          </span>
          <span className="text-[8px] font-mono px-1.5 py-0.5"
            style={{ color: 'var(--positive)', background: 'var(--accent-bg)', border: '1px solid var(--border-accent)' }}>
            ● LIVE · ExchangeRate-API
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: '1px solid var(--border)' }}>
          {forex.map(f => (
            <div key={f.id} className="px-4 py-3" style={{ borderRight: '1px solid var(--border)' }}>
              <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--fg-dim)' }}>{f.symbol}</div>
              <div className="text-sm font-mono font-bold tabular-nums" style={{ color: 'var(--fg)' }}>
                {f.price.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[9px] font-mono mt-0.5"
                style={{ color: f.changePct >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                {f.changePct >= 0 ? '+' : ''}{f.changePct.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
