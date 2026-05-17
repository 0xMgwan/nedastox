'use client';

import { useState } from 'react';
import { Asset, formatTZS, DATA_SOURCE_LABELS } from '@/data/tanzania-assets';
import { TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown } from 'lucide-react';

interface AssetTableProps {
  assets:     Asset[];
  onSelect?:  (asset: Asset) => void;
  selectedId?: string;
  showYield?:  boolean;
  showNAV?:    boolean;
}

type SortKey = 'symbol' | 'price' | 'changePct' | 'volume' | 'marketCap' | 'yield';
type SortDir = 'asc' | 'desc';

export default function AssetTable({ assets, onSelect, selectedId, showYield, showNAV }: AssetTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('marketCap');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [search, setSearch] = useState('');

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const filtered = assets
    .filter(a =>
      a.symbol.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = ((a as unknown as Record<string, unknown>)[sortKey] as number) ?? 0;
      const bv = ((b as unknown as Record<string, unknown>)[sortKey] as number) ?? 0;
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span style={{ color: 'var(--fg-faint)' }} className="ml-1">↕</span>;
    return sortDir === 'asc'
      ? <ChevronUp size={8} className="inline ml-1" style={{ color: 'var(--accent)' }} />
      : <ChevronDown size={8} className="inline ml-1" style={{ color: 'var(--accent)' }} />;
  }

  const thStyle: React.CSSProperties = {
    color: 'var(--fg-dim)',
    fontWeight: 'normal',
    padding: '10px 16px',
    letterSpacing: '0.08em',
    fontSize: '9px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    borderBottom: '1px solid var(--border)',
  };

  return (
    <div style={{ border: '1px solid var(--border)' }}>
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>SEARCH:</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="symbol or name..."
          className="flex-1 text-[10px] font-mono outline-none bg-transparent border-none"
          style={{ color: 'var(--fg)', caretColor: 'var(--accent)' }}
        />
        <span className="text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>{filtered.length}/{assets.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] font-mono">
          <thead>
            <tr>
              <th style={thStyle} onClick={() => handleSort('symbol')}>SYMBOL <SortIcon col="symbol" /></th>
              <th style={{ ...thStyle, display: 'table-cell' }} className="hidden md:table-cell">NAME</th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('price')}>PRICE <SortIcon col="price" /></th>
              <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('changePct')}>CHG% <SortIcon col="changePct" /></th>
              {showYield && <th style={{ ...thStyle, textAlign: 'right' }} onClick={() => handleSort('yield')}>YIELD <SortIcon col="yield" /></th>}
              {!showYield && !showNAV && <th style={{ ...thStyle, textAlign: 'right' }} className="hidden lg:table-cell" onClick={() => handleSort('volume')}>VOL <SortIcon col="volume" /></th>}
              {!showYield && !showNAV && <th style={{ ...thStyle, textAlign: 'right' }} className="hidden lg:table-cell" onClick={() => handleSort('marketCap')}>MKT CAP <SortIcon col="marketCap" /></th>}
              {showNAV && <th style={{ ...thStyle, textAlign: 'right' }}>NAV</th>}
              <th style={{ ...thStyle, textAlign: 'right' }} className="hidden sm:table-cell">SOURCE</th>
              <th style={{ ...thStyle, textAlign: 'right' }} className="hidden sm:table-cell">52W RANGE</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(asset => {
              const isPos     = asset.changePct > 0;
              const isNeutral = asset.changePct === 0;
              const isSelected = asset.id === selectedId;
              const srcInfo    = DATA_SOURCE_LABELS[asset.source];

              const rowStyle: React.CSSProperties = isSelected
                ? { background: 'var(--accent-bg)', borderBottom: '1px solid var(--border-accent)', cursor: 'pointer' }
                : { borderBottom: '1px solid var(--border)', cursor: 'pointer' };

              return (
                <tr
                  key={asset.id}
                  onClick={() => onSelect?.(asset)}
                  style={rowStyle}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = ''; }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-0.5 h-4 flex-shrink-0"
                        style={{ background: isPos ? 'var(--positive)' : isNeutral ? 'var(--fg-faint)' : 'var(--negative)' }} />
                      <span className="font-bold tracking-wider"
                        style={{ color: isSelected ? 'var(--accent)' : 'var(--fg)' }}>
                        {asset.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-[180px] truncate" style={{ color: 'var(--fg-muted)' }}>
                    {asset.name}
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums" style={{ color: 'var(--fg)' }}>
                    {asset.price.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums"
                    style={{ color: isPos ? 'var(--positive)' : isNeutral ? 'var(--fg-dim)' : 'var(--negative)' }}>
                    <span className="flex items-center justify-end gap-1">
                      {isPos ? <TrendingUp size={8} /> : isNeutral ? <Minus size={8} /> : <TrendingDown size={8} />}
                      {isPos ? '+' : ''}{asset.changePct.toFixed(2)}%
                    </span>
                  </td>
                  {showYield && (
                    <td className="px-4 py-3 text-right font-bold tabular-nums" style={{ color: 'var(--positive)' }}>
                      {asset.yield?.toFixed(2)}%
                    </td>
                  )}
                  {!showYield && !showNAV && (
                    <td className="px-4 py-3 text-right tabular-nums hidden lg:table-cell" style={{ color: 'var(--fg-dim)' }}>
                      {asset.volume ? asset.volume.toLocaleString() : '—'}
                    </td>
                  )}
                  {!showYield && !showNAV && (
                    <td className="px-4 py-3 text-right tabular-nums hidden lg:table-cell" style={{ color: 'var(--fg-dim)' }}>
                      {asset.marketCap ? formatTZS(asset.marketCap, true) : '—'}
                    </td>
                  )}
                  {showNAV && (
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                      {asset.nav?.toLocaleString('en-TZ', { minimumFractionDigits: 2 }) ?? '—'}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span
                      className="text-[7px] font-mono px-1 py-0.5"
                      style={{ color: srcInfo.color, background: `${srcInfo.color}18`, border: `1px solid ${srcInfo.color}25` }}
                    >
                      {srcInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {asset.high52w && asset.low52w ? (
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-[8px] tabular-nums" style={{ color: 'var(--fg-faint)' }}>
                          {asset.low52w.toLocaleString()}
                        </span>
                        <div className="w-10 h-1 relative" style={{ background: 'var(--fg-faint)' }}>
                          <div
                            className="absolute top-0 left-0 h-full"
                            style={{
                              width: `${((asset.price - asset.low52w) / (asset.high52w - asset.low52w)) * 100}%`,
                              background: 'var(--accent)',
                              opacity: 0.7,
                            }}
                          />
                        </div>
                        <span className="text-[8px] tabular-nums" style={{ color: 'var(--fg-faint)' }}>
                          {asset.high52w.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--fg-faint)' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
