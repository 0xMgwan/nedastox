'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, ArrowLeft, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { TRADES, tradeStats } from '@/data/backoffice-data';
import type { Trade } from '@/data/backoffice-data';
import TradeBlotter from '@/components/backoffice/TradeBlotter';
import ContractNotePanel from '@/components/backoffice/ContractNotePanel';
import FeeCalculator from '@/components/backoffice/FeeCalculator';
import SettlementQueue from '@/components/backoffice/SettlementQueue';
import CorporateActionsPanel from '@/components/backoffice/CorporateActionsPanel';
import RegulatoryReports from '@/components/backoffice/RegulatoryReports';
import AuditLog from '@/components/backoffice/AuditLog';

type Tab = 'trades' | 'contract_notes' | 'fees' | 'settlement' | 'corporate' | 'reports' | 'audit';

const TABS: { id: Tab; label: string }[] = [
  { id:'trades',         label:'TRADE BLOTTER'      },
  { id:'contract_notes', label:'CONTRACT NOTES'     },
  { id:'fees',           label:'FEE CALCULATOR'     },
  { id:'settlement',     label:'SETTLEMENT T+2'     },
  { id:'corporate',      label:'CORPORATE ACTIONS'  },
  { id:'reports',        label:'REG REPORTING'      },
  { id:'audit',          label:'AUDIT & CONTROLS'   },
];

export default function BackOfficePage() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const [tab, setTab]             = useState<Tab>('trades');
  const [selectedTrade, setSelected] = useState<Trade | null>(TRADES[0]);

  const stats = tradeStats();
  const accentColor = '#00aaff';

  const kpis = [
    { l:'TOTAL TRADES',    v: String(stats.total),   c:'var(--fg)',         icon: <TrendingUp size={11} /> },
    { l:'SETTLED',         v: String(stats.settled), c:'var(--positive)',   icon: <CheckCircle size={11} /> },
    { l:'PENDING',         v: String(stats.pending), c:'#ffaa00',           icon: <Clock size={11} /> },
    { l:'BREAKS',          v: String(stats.breaks),  c: stats.breaks > 0 ? 'var(--negative)' : 'var(--positive)', icon: <AlertTriangle size={11} /> },
    { l:'GROSS TURNOVER',  v: `TZS ${(stats.totalGross/1e9).toFixed(2)}B`, c:'var(--fg)', icon: <TrendingUp size={11} /> },
    { l:'TOTAL FEES',      v: `TZS ${(stats.totalFees/1e6).toFixed(1)}M`,  c: accentColor, icon: <CheckCircle size={11} /> },
  ];

  return (
    <div className="min-h-screen grid-bg" style={{ background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 no-underline" style={{ color: 'var(--fg-muted)' }}>
              <ArrowLeft size={12} />
              <span className="text-[9px] font-mono">HOME</span>
            </Link>
            <div className="h-3 w-px" style={{ background: 'var(--border-strong)' }} />
            <div className="font-mono text-lg font-bold tracking-widest italic -skew-x-12" style={{ color: 'var(--fg)' }}>TZASSETS</div>
            <div className="h-3 w-px" style={{ background: 'var(--border-strong)' }} />
            <span className="text-[10px] font-mono" style={{ color: accentColor }}>BROKER BACK OFFICE</span>
            <span className="text-[8px] font-mono hidden lg:inline" style={{ color: 'var(--fg-faint)' }}>FIMCO · DSE MEMBER</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 text-[9px] font-mono" style={{ color: 'var(--fg-muted)' }}>
              <Link href="/dashboard" className="no-underline hover:underline" style={{ color: 'var(--fg-muted)' }}>MARKET DATA</Link>
              <span>·</span>
              <Link href="/funds" className="no-underline hover:underline" style={{ color: 'var(--fg-muted)' }}>IMS</Link>
            </div>
            <button onClick={toggle} className="w-8 h-8 flex items-center justify-center" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {kpis.map((k, i) => (
            <div key={i} className="p-3 flex items-center gap-2" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ color: k.c }}>
                {k.icon}
              </div>
              <div>
                <div className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>{k.l}</div>
                <div className="text-xs font-mono font-bold tabular-nums" style={{ color: k.c }}>{k.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module tabs */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-0 overflow-x-auto" style={{ borderBottom: '1px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-2.5 text-[9px] font-mono tracking-wider whitespace-nowrap transition-all flex-shrink-0"
              style={tab === t.id ? {
                color: accentColor,
                borderBottom: `2px solid ${accentColor}`,
                marginBottom: '-1px',
              } : { color: 'var(--fg-muted)', borderBottom: '2px solid transparent', marginBottom: '-1px' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[8px] font-mono mb-4" style={{ color: 'var(--fg-faint)' }}>
          <span style={{ color: 'var(--fg-dim)' }}>TZASSETS</span>
          <span>/</span><span>BACK OFFICE</span>
          <span>/</span><span style={{ color: accentColor }}>{TABS.find(t=>t.id===tab)?.label}</span>
          {stats.breaks > 0 && (
            <div className="ml-auto flex items-center gap-1" style={{ color: 'var(--negative)' }}>
              <AlertTriangle size={9} />
              <span>{stats.breaks} BREAK{stats.breaks > 1 ? 'S' : ''} UNRESOLVED</span>
            </div>
          )}
        </div>

        {/* ── TRADE BLOTTER ─────────────────────────────────────────────── */}
        {tab === 'trades' && (
          <div className="space-y-4">
            <TradeBlotter onSelect={setSelected} selected={selectedTrade} />
            {selectedTrade && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ContractNotePanel trade={selectedTrade} />
                <div className="space-y-3">
                  {/* Quick account ledger update */}
                  <div className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                    <div className="text-[9px] font-mono tracking-wider mb-3" style={{ color: 'var(--fg-dim)' }}>CLIENT LEDGER IMPACT</div>
                    <div className="space-y-2 text-[9px] font-mono">
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--fg-muted)' }}>Fund / Client</span>
                        <span style={{ color: 'var(--fg)' }}>{selectedTrade.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--fg-muted)' }}>Holdings change</span>
                        <span style={{ color: selectedTrade.side === 'buy' ? 'var(--positive)' : 'var(--negative)' }}>
                          {selectedTrade.side === 'buy' ? '+' : '-'}{selectedTrade.quantity.toLocaleString()} {selectedTrade.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--fg-muted)' }}>Cash movement</span>
                        <span style={{ color: selectedTrade.side === 'buy' ? 'var(--negative)' : 'var(--positive)' }}>
                          {selectedTrade.side === 'buy' ? '-' : '+'}TZS {(selectedTrade.fees.netSettlement/1e6).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--fg-muted)' }}>Settlement date</span>
                        <span style={{ color: 'var(--fg)' }}>{selectedTrade.settlementDate}</span>
                      </div>
                      <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--fg-muted)' }}>Ledger status</span>
                        <span style={{ color: selectedTrade.status === 'settled' ? 'var(--positive)' : '#ffaa00' }}>
                          {selectedTrade.status === 'settled' ? 'POSTED' : 'PENDING SETTLEMENT'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reconciliation status */}
                  <div className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                    <div className="text-[9px] font-mono tracking-wider mb-3" style={{ color: 'var(--fg-dim)' }}>RECONCILIATION STATUS</div>
                    <div className="space-y-2">
                      {[
                        { l:'Broker Match',  ok: selectedTrade.status !== 'failed' && selectedTrade.status !== 'break' },
                        { l:'DSE Reference', ok: !!selectedTrade.dseRef },
                        { l:'CSD Reference', ok: !!selectedTrade.csdRef },
                        { l:'Fees Matched',  ok: selectedTrade.status !== 'failed' },
                        { l:'Settlement',    ok: selectedTrade.status === 'settled' },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-[9px] font-mono">
                          <span style={{ color: 'var(--fg-muted)' }}>{c.l}</span>
                          <span style={{ color: c.ok ? 'var(--positive)' : selectedTrade.status === 'pending' ? '#ffaa00' : 'var(--negative)' }}>
                            {c.ok ? '● MATCHED' : selectedTrade.status === 'pending' ? '○ PENDING' : '✕ UNMATCHED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONTRACT NOTES ────────────────────────────────────────────── */}
        {tab === 'contract_notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 space-y-2">
              <div className="text-[8px] font-mono mb-2" style={{ color: 'var(--fg-faint)' }}>SELECT TRADE</div>
              {TRADES.slice(0, 8).map(t => (
                <div key={t.id} onClick={() => setSelected(t)}
                  className="p-3 cursor-pointer flex items-center justify-between"
                  style={{
                    border: selectedTrade?.id === t.id ? '1px solid #00aaff' : '1px solid var(--border)',
                    background: selectedTrade?.id === t.id ? 'rgba(0,170,255,0.05)' : 'var(--bg-card)',
                  }}
                  onMouseEnter={e => { if (selectedTrade?.id !== t.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (selectedTrade?.id !== t.id) e.currentTarget.style.background = 'var(--bg-card)'; }}>
                  <div>
                    <div className="text-[9px] font-mono" style={{ color: accentColor }}>{t.contractNo}</div>
                    <div className="text-[8px] font-mono" style={{ color: 'var(--fg-muted)' }}>{t.symbol} · {t.side.toUpperCase()} {t.quantity.toLocaleString()}</div>
                  </div>
                  <div className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>{t.tradeDate}</div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3">
              <ContractNotePanel trade={selectedTrade} />
            </div>
          </div>
        )}

        {/* ── FEE CALCULATOR ────────────────────────────────────────────── */}
        {tab === 'fees' && <FeeCalculator />}

        {/* ── SETTLEMENT ────────────────────────────────────────────────── */}
        {tab === 'settlement' && <SettlementQueue />}

        {/* ── CORPORATE ACTIONS ─────────────────────────────────────────── */}
        {tab === 'corporate' && <CorporateActionsPanel />}

        {/* ── REGULATORY REPORTS ────────────────────────────────────────── */}
        {tab === 'reports' && <RegulatoryReports />}

        {/* ── AUDIT ─────────────────────────────────────────────────────── */}
        {tab === 'audit' && <AuditLog />}
      </main>

      <footer className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4 mt-6 text-[8px] font-mono"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--fg-faint)' }}>
        TZASSETS BROKER BACK OFFICE v1.0.0 · FIMCO Securities · DSE Member · CMSA Licensed · CSD Connected
      </footer>
    </div>
  );
}
