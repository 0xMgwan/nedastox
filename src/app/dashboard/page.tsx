'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  DSE_STOCKS, GOVERNMENT_BONDS, UNIT_TRUST_FUNDS, FOREX_RATES,
  Asset,
} from '@/data/tanzania-assets';
import type { LiveStock } from '@/app/api/stocks/route';
import TopBar from '@/components/dashboard/TopBar';
import PriceTicker from '@/components/dashboard/PriceTicker';
import MarketOverview from '@/components/dashboard/MarketOverview';
import AssetTable from '@/components/dashboard/AssetTable';
import PriceChart from '@/components/dashboard/PriceChart';
import PortfolioTracker from '@/components/dashboard/PortfolioTracker';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'overview');

  const [stocks, setStocks]           = useState(DSE_STOCKS);
  const [bonds]                        = useState(GOVERNMENT_BONDS);
  const [funds]                        = useState(UNIT_TRUST_FUNDS);
  const [forex, setForex]              = useState(FOREX_RATES);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [tick, setTick]                = useState(0);
  const [forexSource, setForexSource]  = useState<string>('');
  const [forexFetchedAt, setForexFetchedAt] = useState<string>('');
  const [stocksSource, setStocksSource] = useState<string>('');
  const [stocksFetchedAt, setStocksFetchedAt] = useState<string>('');

  // ── Live DSE stocks fetch ────────────────────────────────────────────
  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch('/api/stocks');
      if (!res.ok) return;
      const data = await res.json() as {
        source: string; fetchedAt: string;
        stocks: LiveStock[];
      };
      setStocksSource(data.source);
      setStocksFetchedAt(data.fetchedAt);
      setStocks(prev =>
        prev.map(asset => {
          const match = data.stocks.find(s => s.symbol === asset.symbol);
          if (!match) return asset;
          return {
            ...asset,
            price:     match.price,
            change:    match.change,
            changePct: match.changePct,
            volume:    match.volume,
            lastUpdated: data.fetchedAt,
          };
        })
      );
    } catch { /* silently keep seed values */ }
  }, []);

  useEffect(() => {
    fetchStocks();
    const id = setInterval(fetchStocks, 30_000); // refresh every 30s
    return () => clearInterval(id);
  }, [fetchStocks]);

  // ── Live forex fetch ────────────────────────────────────────────────
  const fetchForex = useCallback(async () => {
    try {
      const res  = await fetch('/api/forex');
      if (!res.ok) return;
      const data = await res.json() as {
        source: string; fetchedAt: string;
        pairs: { id: string; symbol: string; name: string; rate: number }[];
      };
      setForexSource(data.source);
      setForexFetchedAt(data.fetchedAt);
      setForex(prev =>
        prev.map(asset => {
          const match = data.pairs.find(p => p.id === asset.id);
          if (!match) return asset;
          const diff = match.rate - asset.price;
          const pct  = asset.price ? (diff / asset.price) * 100 : 0;
          return { ...asset, price: match.rate, change: diff, changePct: Math.round(pct * 100) / 100, lastUpdated: data.fetchedAt };
        })
      );
    } catch { /* silently use seed values */ }
  }, []);

  useEffect(() => {
    fetchForex();
    const id = setInterval(fetchForex, 60_000); // refresh every 60s
    return () => clearInterval(id);
  }, [fetchForex]);

  // ── Tick counter for UI refresh indicator ────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const allAssets = [...stocks, ...bonds, ...funds, ...forex];

  const handleSelect = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    if (asset.category === 'bond')  setActiveTab('bonds');
    else if (asset.category === 'fund')  setActiveTab('funds');
    else if (asset.category === 'stock') setActiveTab('stocks');
  }, []);

  return (
    <div className="min-h-screen grid-bg" style={{ background: 'var(--bg)' }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tzsUsd={forex[0]?.price}
        dseIndex={2847.32 + (tick * 0.03)}
      />
      <PriceTicker assets={allAssets.slice(0, 22)} />

      <main className="px-4 lg:px-8 py-6 space-y-4 max-w-[1600px] mx-auto">
        {/* Breadcrumb + live indicator */}
        <div className="flex items-center gap-2 text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>
          <span style={{ color: 'var(--fg-dim)' }}>TZASSETS</span>
          <span>/</span>
          <span style={{ color: 'var(--fg-muted)' }}>{activeTab.toUpperCase()}</span>
          {selectedAsset && !['overview','portfolio'].includes(activeTab) && (
            <>
              <span>/</span>
              <span style={{ color: 'var(--accent)' }}>{selectedAsset.symbol}</span>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            {stocksSource && (
              <span style={{ color: 'var(--positive)' }}>● DSE LIVE · {stocksFetchedAt ? new Date(stocksFetchedAt).toLocaleTimeString() : ''}</span>
            )}
            {(forexSource === 'LIVE' || forexSource === 'ExchangeRate-API') && (
              <span style={{ color: 'var(--positive)' }}>● FOREX LIVE · {forexFetchedAt ? new Date(forexFetchedAt).toLocaleTimeString() : ''}</span>
            )}
            <span style={{ color: 'var(--fg-faint)' }}>BOT REF · UTT NAV · #{tick}</span>
          </div>
        </div>

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <MarketOverview
            stocks={stocks} bonds={bonds} funds={funds} forex={forex}
            onSelect={handleSelect} selectedAsset={selectedAsset}
          />
        )}

        {/* ── STOCKS ───────────────────────────────────────────── */}
        {activeTab === 'stocks' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <AssetTable assets={stocks} onSelect={setSelectedAsset}
                selectedId={selectedAsset?.category === 'stock' ? selectedAsset.id : undefined} />
            </div>
            <div className="lg:col-span-2">
              <PriceChart asset={selectedAsset?.category === 'stock' ? selectedAsset : stocks[0]} />
            </div>
          </div>
        )}

        {/* ── BONDS ────────────────────────────────────────────── */}
        {activeTab === 'bonds' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              {/* BOT summary */}
              <div className="p-4 mb-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
                    GOVERNMENT SECURITIES — BANK OF TANZANIA
                  </span>
                  <a href="https://www.bot.go.tz" target="_blank" rel="noreferrer"
                    className="text-[8px] font-mono px-1.5 py-0.5 no-underline"
                    style={{ color: '#ffaa00', background: '#ffaa0018', border: '1px solid #ffaa0030' }}>
                    BOT REF ↗
                  </a>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'LOWEST T-BILL', value: `${bonds[0].yield?.toFixed(2)}%`, sub: '91-Day' },
                    { label: 'HIGHEST BOND',  value: `${bonds[bonds.length - 1].yield?.toFixed(2)}%`, sub: '25-Year' },
                    { label: 'YIELD CURVE',   value: 'NORMAL',     sub: 'Upward slope' },
                    { label: 'ACTIVE ISSUES', value: `${bonds.length}`, sub: 'BOT securities' },
                  ].map((s, i) => (
                    <div key={i} className="p-3" style={{ border: '1px solid var(--border)' }}>
                      <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>{s.label}</div>
                      <div className="text-sm font-mono font-bold" style={{ color: 'var(--positive)' }}>{s.value}</div>
                      <div className="text-[8px] font-mono" style={{ color: 'var(--fg-dim)' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <AssetTable assets={bonds} onSelect={setSelectedAsset}
                selectedId={selectedAsset?.category === 'bond' ? selectedAsset.id : undefined}
                showYield />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <PriceChart asset={selectedAsset?.category === 'bond' ? selectedAsset : bonds[0]} />
              {/* Yield curve viz */}
              <div className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div className="text-[9px] font-mono tracking-wider mb-3" style={{ color: 'var(--fg-dim)' }}>
                  YIELD CURVE (BOT AUCTION RATES)
                </div>
                <div className="flex items-end gap-1.5 h-24">
                  {bonds.map(b => {
                    const maxY = Math.max(...bonds.map(x => x.yield ?? 0));
                    const h = ((b.yield ?? 0) / maxY) * 100;
                    return (
                      <div key={b.id} className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                        onClick={() => setSelectedAsset(b)}
                        title={`${b.symbol}: ${b.yield?.toFixed(2)}%`}>
                        <span className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--positive)' }}>
                          {b.yield?.toFixed(1)}
                        </span>
                        <div className="w-full transition-opacity group-hover:opacity-100"
                          style={{ height: `${h}%`, background: 'var(--positive)', opacity: 0.5 }} />
                        <span className="text-[6px] font-mono text-center leading-tight" style={{ color: 'var(--fg-faint)' }}>
                          {b.maturity?.replace(' ', '\n')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FUNDS ────────────────────────────────────────────── */}
        {activeTab === 'funds' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {funds.map(f => (
                  <div key={f.id} onClick={() => setSelectedAsset(f)}
                    className="p-4 cursor-pointer transition-all"
                    style={{
                      border: selectedAsset?.id === f.id ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                      background: selectedAsset?.id === f.id ? 'var(--accent-bg)' : 'var(--bg-card)',
                    }}
                    onMouseEnter={e => { if (selectedAsset?.id !== f.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={e => { if (selectedAsset?.id !== f.id) e.currentTarget.style.background = 'var(--bg-card)'; }}>
                    <div className="text-[9px] font-mono mb-2" style={{ color: 'var(--fg-dim)' }}>{f.symbol}</div>
                    <div className="text-base font-mono font-bold tabular-nums mb-1" style={{ color: 'var(--fg)' }}>
                      {f.nav?.toLocaleString('en-TZ', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] font-mono mb-2 leading-tight" style={{ color: 'var(--fg-muted)' }}>{f.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono" style={{ color: 'var(--positive)' }}>{f.yield?.toFixed(1)}% p.a.</span>
                      <span className="text-[9px] font-mono"
                        style={{ color: f.changePct >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
                        {f.changePct >= 0 ? '+' : ''}{f.changePct.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-[7px] font-mono mt-1.5" style={{ color: 'var(--fg-faint)' }}>
                      Updated: {f.lastUpdated}
                    </div>
                  </div>
                ))}
              </div>
              <AssetTable assets={funds} onSelect={setSelectedAsset}
                selectedId={selectedAsset?.category === 'fund' ? selectedAsset.id : undefined}
                showNAV />
            </div>
            <div className="lg:col-span-2">
              <PriceChart asset={selectedAsset?.category === 'fund' ? selectedAsset : funds[0]} />
            </div>
          </div>
        )}

        {/* ── PORTFOLIO ─────────────────────────────────────────── */}
        {activeTab === 'portfolio' && <PortfolioTracker />}
      </main>

      {/* Footer */}
      <footer className="px-4 lg:px-8 py-4 mt-8 text-[8px] font-mono"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--fg-faint)' }}>
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span>TZASSETS v1.0.0</span>
            {['dse.co.tz', 'bot.go.tz', 'utt-amis.co.tz', 'exchangerate-api.com'].map(s => (
              <span key={s} style={{ color: 'var(--fg-faint)' }}>· {s}</span>
            ))}
          </div>
          <div>
            FOREX: LIVE · STOCKS: DSE EOD · BONDS: BOT AUCTION REF · FUNDS: UTT AMIS NAV
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-[10px] font-mono" style={{ color: 'var(--fg-dim)' }}>LOADING MARKET DATA...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
