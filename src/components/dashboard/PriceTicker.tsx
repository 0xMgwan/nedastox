'use client';

import { Asset, DATA_SOURCE_LABELS } from '@/data/tanzania-assets';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceTickerProps {
  assets: Asset[];
}

export default function PriceTicker({ assets }: PriceTickerProps) {
  const tickerItems = [...assets, ...assets];

  return (
    <div
      className="overflow-hidden relative"
      style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg-secondary), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg-secondary), transparent)' }} />

      <div className="ticker-track flex items-center gap-0">
        {tickerItems.map((asset, idx) => {
          const isPos = asset.changePct > 0;
          const srcInfo = DATA_SOURCE_LABELS[asset.source];
          return (
            <div
              key={`${asset.id}-${idx}`}
              className="flex items-center gap-2 px-5 py-2 flex-shrink-0 cursor-default group"
              style={{ borderRight: '1px solid var(--border)' }}
            >
              <span
                className="text-[8px] font-mono font-bold tracking-wider transition-colors"
                style={{ color: 'var(--fg-muted)' }}
              >
                {asset.symbol}
              </span>
              <span className="text-[9px] font-mono tabular-nums" style={{ color: 'var(--fg)' }}>
                {asset.price.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className="text-[8px] font-mono flex items-center gap-0.5"
                style={{ color: isPos ? 'var(--positive)' : asset.changePct < 0 ? 'var(--negative)' : 'var(--fg-dim)' }}
              >
                {isPos ? <TrendingUp size={7} /> : asset.changePct < 0 ? <TrendingDown size={7} /> : null}
                {isPos ? '+' : ''}{asset.changePct.toFixed(2)}%
              </span>
              <span
                className="text-[7px] font-mono px-1 py-0.5 hidden lg:inline"
                style={{ color: srcInfo.color, background: `${srcInfo.color}18`, border: `1px solid ${srcInfo.color}30` }}
              >
                {srcInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
