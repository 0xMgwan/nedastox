'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon, ArrowLeft, TrendingUp, Users, DollarSign, BarChart2, LogOut, UserCircle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useIMSAuth } from '@/contexts/IMSAuth';
import {
  ALL_FUNDS, MUTUAL_FUNDS, PENSION_FUNDS, PROVIDENT_FUNDS, PRIVATE_EQUITY_FUNDS,
  MEMBER_CONTRIBUTIONS, Fund, FUND_TYPE_COLORS, TOTAL_AUM, TOTAL_UNIT_HOLDERS,
  navChangePct,
} from '@/data/funds-data';
import FundCard from '@/components/investment/FundCard';
import NAVChart from '@/components/investment/NAVChart';
import AllocationDonut from '@/components/investment/AllocationDonut';
import UnitHolderTable from '@/components/investment/UnitHolderTable';
import TransactionLedger from '@/components/investment/TransactionLedger';
import UnitManagement from '@/components/investment/UnitManagement';
import PensionOperations from '@/components/investment/PensionOperations';
import ProvidentOperations from '@/components/investment/ProvidentOperations';
import BackOfficeLink from '@/components/investment/BackOfficeLink';
import { imsAccess, type IMSInnerTab } from '@/lib/permissions';
import { Lock } from 'lucide-react';

type Tab = 'mutual' | 'pension' | 'provident' | 'private_equity';

const TABS: { id: Tab; label: string; funds: Fund[] }[] = [
  { id: 'mutual',         label: 'MUTUAL FUNDS',   funds: MUTUAL_FUNDS },
  { id: 'pension',        label: 'PENSION FUNDS',  funds: PENSION_FUNDS },
  { id: 'provident',      label: 'PROVIDENT FUNDS',funds: PROVIDENT_FUNDS },
  { id: 'private_equity', label: 'PRIVATE EQUITY', funds: PRIVATE_EQUITY_FUNDS },
];

function fmt(n: number) {
  if (n >= 1e12) return `TZS ${(n/1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `TZS ${(n/1e9).toFixed(1)}B`;
  return `TZS ${(n/1e6).toFixed(0)}M`;
}

export default function FundsPage() {
  const { theme, toggle } = useTheme();
  const { user, logout }  = useIMSAuth();
  const isDark = theme === 'dark';
  const [tab, setTab]           = useState<Tab>('mutual');
  const [selected, setSelected] = useState<Fund>(MUTUAL_FUNDS[0]);
  const [innerTab, setInnerTab] = useState<'overview'|'holders'|'transactions'|'unit_mgmt'|'contributions'>('overview');

  const currentFunds = TABS.find(t => t.id === tab)!.funds;
  const color = FUND_TYPE_COLORS[tab];

  // Role-based access
  const access = imsAccess(user?.role);
  const effectiveInner: IMSInnerTab = access.tabs.includes(innerTab) ? innerTab : 'overview';

  // KPI bar
  const kpis = [
    { l:'TOTAL AUM',       v: fmt(TOTAL_AUM),                            c:'var(--fg)' },
    { l:'TOTAL FUNDS',     v: String(ALL_FUNDS.length),                   c: color },
    { l:'UNIT HOLDERS',    v: TOTAL_UNIT_HOLDERS.toLocaleString(),        c:'var(--fg)' },
    { l:'AVG 1YR RETURN',  v: `+${(ALL_FUNDS.reduce((s,f) => s+f.oneYrReturn,0)/ALL_FUNDS.length).toFixed(2)}%`, c:'var(--positive)' },
  ];

  function handleTabChange(t: Tab) {
    setTab(t);
    const funds = TABS.find(x => x.id === t)!.funds;
    setSelected(funds[0]);
    setInnerTab('overview');
  }

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
            <div className="text-lg font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>
              ASSETCONNECT
            </div>
            <div className="h-3 w-px" style={{ background: 'var(--border-strong)' }} />
            <span className="text-[10px] font-mono" style={{ color }}>INVESTMENT MANAGEMENT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 text-[9px] font-mono" style={{ color: 'var(--fg-muted)' }}>
              <Link href="/dashboard" className="no-underline hover:underline" style={{ color: 'var(--fg-muted)' }}>MARKET DATA</Link>
              <span>·</span>
              <Link href="/back-office" className="no-underline hover:underline" style={{ color: 'var(--fg-muted)' }}>BACK OFFICE</Link>
            </div>
            {user && (
              <div className="hidden lg:flex items-center gap-2 px-2 py-1" style={{ border: '1px solid var(--border)' }}>
                <UserCircle size={12} style={{ color }} />
                <div className="leading-tight">
                  <div className="text-[8px] font-mono" style={{ color: 'var(--fg)' }}>{user.name}</div>
                  <div className="text-[7px] font-mono" style={{ color }}>{user.role.toUpperCase()}</div>
                </div>
              </div>
            )}
            <button onClick={logout}
              className="flex items-center gap-1 px-2 h-8 text-[8px] font-mono transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--negative)'; e.currentTarget.style.color = 'var(--negative)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-muted)'; }}>
              <LogOut size={11} /> LOGOUT
            </button>
            <button onClick={toggle} className="w-8 h-8 flex items-center justify-center" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((k, i) => (
            <div key={i} className="p-3 flex items-center gap-3" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div className="w-6 h-6 flex items-center justify-center" style={{ background: `${k.c}15`, border: `1px solid ${k.c}30` }}>
                {i === 0 ? <DollarSign size={11} style={{ color: k.c }} /> :
                 i === 1 ? <BarChart2  size={11} style={{ color: k.c }} /> :
                 i === 2 ? <Users      size={11} style={{ color: k.c }} /> :
                           <TrendingUp size={11} style={{ color: k.c }} />}
              </div>
              <div>
                <div className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>{k.l}</div>
                <div className="text-sm font-mono font-bold tabular-nums" style={{ color: k.c }}>{k.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module tabs */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => handleTabChange(t.id)}
              className="px-5 py-2.5 text-[9px] font-mono tracking-wider transition-all"
              style={tab === t.id ? {
                color: FUND_TYPE_COLORS[t.id],
                borderBottom: `2px solid ${FUND_TYPE_COLORS[t.id]}`,
                marginBottom: '-1px',
              } : { color: 'var(--fg-muted)', borderBottom: '2px solid transparent', marginBottom: '-1px' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Fund list */}
          <div className="lg:col-span-3 space-y-2">
            <div className="text-[8px] font-mono mb-2" style={{ color: 'var(--fg-faint)' }}>
              {currentFunds.length} FUNDS — SELECT TO ANALYSE
            </div>
            {currentFunds.map(f => (
              <FundCard key={f.id} fund={f} selected={selected?.id === f.id}
                onClick={() => { setSelected(f); setInnerTab('overview'); }} />
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-9 space-y-4">
            {/* Inner tabs */}
            <div className="flex items-center gap-0" style={{ borderBottom: '1px solid var(--border)' }}>
              {([
                { id:'overview'      as const, l:'OVERVIEW'      },
                { id:'unit_mgmt'     as const, l: tab === 'pension' ? 'PENSION OPS' : tab === 'provident' ? 'PF OPERATIONS' : 'UNIT MGMT' },
                { id:'holders'       as const, l:'UNIT HOLDERS'  },
                { id:'transactions'  as const, l:'TRANSACTIONS'  },
                ...(tab === 'provident' ? [{ id:'contributions' as const, l:'CONTRIBUTIONS' }] : []),
              ] as { id: IMSInnerTab; l: string }[])
                .filter(t => access.tabs.includes(t.id))
                .map(t => (
                <button key={t.id} onClick={() => setInnerTab(t.id)}
                  className="px-4 py-2 text-[9px] font-mono transition-all"
                  style={effectiveInner === t.id ? {
                    color, borderBottom: `2px solid ${color}`, marginBottom: '-1px',
                  } : { color: 'var(--fg-muted)', borderBottom: '2px solid transparent', marginBottom: '-1px' }}>
                  {t.l}
                </button>
              ))}
              <div className="ml-auto pr-2 flex items-center gap-2 text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>
                <Lock size={8} />
                <span style={{ color }}>{access.scope}</span>
              </div>
            </div>

            {effectiveInner === 'overview' && selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2"><NAVChart fund={selected} /></div>
                  <div><AllocationDonut fund={selected} /></div>
                </div>

                {/* Fund info */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { l:'INCEPTION DATE',    v: selected.inceptionDate },
                    { l:'MIN INVESTMENT',    v: selected.minInvestment === 0 ? 'N/A' : `TZS ${selected.minInvestment.toLocaleString()}` },
                    { l:'UNITS OUTSTANDING', v: (selected.unitsOutstanding/1e6).toFixed(2) + 'M' },
                    { l:'3-YEAR RETURN',     v: `+${selected.threeYrReturn.toFixed(1)}%`, c:'var(--positive)' },
                  ].map((s, i) => (
                    <div key={i} className="p-3" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                      <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>{s.l}</div>
                      <div className="text-[11px] font-mono font-bold" style={{ color: s.c ?? 'var(--fg)' }}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Compliance bar */}
                <div className="p-3 flex flex-wrap items-center gap-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <span className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>COMPLIANCE:</span>
                  {[
                    { l:'IAS 39', ok:true },
                    { l:'CMSA', ok:true },
                    { l:'CMA', ok:true },
                    { l:'AML/KYC', ok:true },
                    { l:'RISK LIMITS', ok: navChangePct(selected) < 5 },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.ok ? 'var(--positive)' : 'var(--negative)' }} />
                      <span className="text-[8px] font-mono" style={{ color: c.ok ? 'var(--positive)' : 'var(--negative)' }}>{c.l}</span>
                    </div>
                  ))}
                </div>

                {/* Back office linkage */}
                <BackOfficeLink fundId={selected.id} />
              </div>
            )}

            {effectiveInner === 'unit_mgmt' && selected && (
              selected.type === 'pension'   ? <PensionOperations fund={selected} />   :
              selected.type === 'provident' ? <ProvidentOperations fund={selected} /> :
              <UnitManagement fund={selected} canApprove={access.canApprove} />
            )}

            {effectiveInner === 'holders' && (
              <UnitHolderTable fundId={selected?.id} />
            )}

            {effectiveInner === 'transactions' && (
              <TransactionLedger fundId={selected?.id} />
            )}

            {effectiveInner === 'contributions' && (
              <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
                    MEMBER CONTRIBUTIONS — MAY 2026
                  </span>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-[9px] font-mono">
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['MEMBER ID','NAME','EMPLOYER','EMPLOYER CONTRIB','EMPLOYEE CONTRIB','TOTAL','STATUS'].map(h => (
                          <th key={h} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MEMBER_CONTRIBUTIONS.filter(c => c.fundId === selected?.id).map(c => (
                        <tr key={c.memberId} style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td className="px-3 py-2" style={{ color: 'var(--accent)' }}>{c.memberId}</td>
                          <td className="px-3 py-2" style={{ color: 'var(--fg)' }}>{c.memberName}</td>
                          <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{c.employer}</td>
                          <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{c.employerContrib.toLocaleString()}</td>
                          <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{c.employeeContrib.toLocaleString()}</td>
                          <td className="px-3 py-2 tabular-nums font-bold" style={{ color: 'var(--positive)' }}>{c.total.toLocaleString()}</td>
                          <td className="px-3 py-2">
                            <span style={{ color: c.status === 'posted' ? 'var(--positive)' : c.status === 'pending' ? '#ffaa00' : 'var(--negative)' }}>
                              {c.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4 mt-6 text-[8px] font-mono"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--fg-faint)' }}>
        AssetConnect IMS v1.0.0 · AssetConnect Module · IAS 39 Compliant · CMSA Regulated · BOT Supervised
      </footer>
    </div>
  );
}
