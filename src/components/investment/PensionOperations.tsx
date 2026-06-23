'use client';
import { useState } from 'react';
import { Fund, FUND_TYPE_COLORS } from '@/data/funds-data';
import {
  Building2, Users, PieChart, LogOut, Repeat, HeartPulse, CalendarClock, CheckCircle, Receipt,
} from 'lucide-react';

type Section = 'contribution' | 'allocation' | 'retirement' | 'income';

const MEMBERS = [
  { acct:'37405-9779396-4-2', title:'Mrs Darakhshan Tanveer', last:'2026-05-24', amt: 140_000 },
  { acct:'42101-1318210-9-2', title:'Mr Syed Faraz Ahmed',    last:'2026-03-30', amt: 152_000 },
  { acct:'42101-1530609-7-2', title:'Mr Akber Sultan',        last:'2026-05-28', amt: 103_000 },
  { acct:'42201-2133468-6-2', title:'Ms Ghulam Fatima',       last:'2026-06-12', amt: 14_000  },
  { acct:'42201-6998293-9-2', title:'Mr Asad Ahmed Burney',   last:'2026-06-28', amt: 104_000 },
  { acct:'42301-1431273-3-2', title:'Mr Raja Chohan',         last:'2026-06-28', amt: 129_000 },
];

const MAX_TAX_DEDUCTIBLE = 24_000_000; // demo annual cap

export default function PensionOperations({ fund }: { fund: Fund }) {
  const color = FUND_TYPE_COLORS[fund.type];
  const [section, setSection] = useState<Section>('contribution');

  // Contribution generation
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [genConfirm, setGenConfirm] = useState<string | null>(null);
  const toggle = (a: string) => setChecked(p => ({ ...p, [a]: !p[a] }));
  const selectedCount = Object.values(checked).filter(Boolean).length;
  const selectedTotal = MEMBERS.filter(m => checked[m.acct]).reduce((s, m) => s + m.amt, 0);

  // Retirement / redemption
  const [redeemType, setRedeemType] = useState('Early Redemption');
  const [pctOption, setPctOption]   = useState('25');
  const availableBalance = 15_100_899;
  const redeemAmount = availableBalance * (parseFloat(pctOption || '0') / 100);
  const isEarly = redeemType === 'Early Redemption';
  const whtRate = isEarly ? 0.10 : 0.0; // early redemption attracts withholding
  const wht = redeemAmount * whtRate;
  const netPayout = redeemAmount - wht;
  const [retConfirm, setRetConfirm] = useState<string | null>(null);

  const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id:'contribution', label:'VPS CONTRIBUTION', icon:<Users size={11} /> },
    { id:'allocation',   label:'SUB-FUND SCHEME',  icon:<PieChart size={11} /> },
    { id:'retirement',   label:'RETIREMENT / REDEMPTION', icon:<LogOut size={11} /> },
    { id:'income',       label:'INCOME PLANS',     icon:<CalendarClock size={11} /> },
  ];

  return (
    <div className="space-y-4">
      {/* Header + section nav */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            VOLUNTARY PENSION SYSTEM — {fund.shortName}
          </span>
          <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>
            <Building2 size={9} /> 42 PARTICIPATING COMPANIES · {fund.unitHolders.toLocaleString()} MEMBERS
          </span>
        </div>
        <div className="flex flex-wrap gap-1 p-3">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] font-mono transition-all"
              style={section === s.id
                ? { background: color, color: '#fff', border: `1px solid ${color}` }
                : { border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              {s.icon}{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* VPS Generate Contribution */}
      {section === 'contribution' && (
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[9px] font-mono" style={{ color }}>VPS GENERATE CONTRIBUTION</span>
            <select className="px-2 py-1 text-[8px] font-mono bg-transparent" style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}>
              <option style={{ background:'var(--bg)' }}>1 Link (Guarantee) Limited</option>
              <option style={{ background:'var(--bg)' }}>Vodacom Tanzania PLC</option>
              <option style={{ background:'var(--bg)' }}>CRDB Bank PLC</option>
            </select>
            <select className="px-2 py-1 text-[8px] font-mono bg-transparent" style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}>
              <option style={{ background:'var(--bg)' }}>ONE MONTH</option>
              <option style={{ background:'var(--bg)' }}>ONE WEEK</option>
              <option style={{ background:'var(--bg)' }}>ONE QUARTER</option>
            </select>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[9px] font-mono">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ACCOUNT NUMBER','ACCOUNT TITLE','LAST CONTRIBUTION','AMOUNT (TZS)','GENERATE'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEMBERS.map(m => (
                  <tr key={m.acct} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{m.acct}</td>
                    <td className="px-3 py-2" style={{ color: 'var(--fg)' }}>{m.title}</td>
                    <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{m.last}</td>
                    <td className="px-3 py-2 tabular-nums text-right" style={{ color: 'var(--fg)' }}>{m.amt.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={!!checked[m.acct]} onChange={() => toggle(m.acct)} style={{ accentColor: color }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 flex items-center gap-3" style={{ borderTop: '1px solid var(--border)' }}>
            <button onClick={() => setGenConfirm(`Generated ${selectedCount} contributions · TZS ${selectedTotal.toLocaleString()} · split across sub-funds per scheme`)}
              disabled={selectedCount === 0}
              className="px-4 py-1.5 text-[9px] font-mono" style={{ background: color, color: '#fff', border: `1px solid ${color}`, opacity: selectedCount === 0 ? 0.5 : 1 }}>
              SUBMIT ({selectedCount})
            </button>
            <span className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>
              Employer + employee split · sales load deducted · accounting on receive basis
            </span>
          </div>
          {genConfirm && (
            <div className="mx-4 mb-4 p-2 flex items-center gap-2" style={{ border: `1px solid ${color}`, background: `${color}08` }}>
              <CheckCircle size={11} style={{ color }} />
              <span className="text-[8px] font-mono" style={{ color }}>{genConfirm}</span>
            </div>
          )}
        </div>
      )}

      {/* Sub-fund allocation scheme */}
      {section === 'allocation' && (
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[9px] font-mono" style={{ color }}>AUTOMATIC SUB-FUND ALLOCATION SCHEME</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-[8px] font-mono" style={{ color: 'var(--fg-muted)' }}>
              Invested amount is automatically split into sub-funds per the member&apos;s investment scheme.
              Auto re-allocation runs on schedule to maintain target ratios.
            </div>
            {fund.allocation.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-32 text-[9px] font-mono" style={{ color: 'var(--fg)' }}>{a.asset}</span>
                <div className="flex-1 h-3" style={{ background: 'var(--bg-hover)' }}>
                  <div className="h-full" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
                <span className="w-10 text-right text-[9px] font-mono tabular-nums" style={{ color: a.color }}>{a.pct}%</span>
              </div>
            ))}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
              {['Pre-defined Scheme','Customized Scheme','Auto Re-allocation'].map(s => (
                <div key={s} className="flex items-center justify-between px-2 py-1.5" style={{ border: '1px solid var(--border)' }}>
                  <span className="text-[8px] font-mono" style={{ color: 'var(--fg-muted)' }}>{s}</span>
                  <span className="text-[7px] font-mono px-1.5 py-0.5" style={{ color: 'var(--positive)', border: '1px solid var(--positive)' }}>ON</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Retirement / redemption with taxation */}
      {section === 'retirement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-[9px] font-mono" style={{ color }}>VPS REDEMPTION / RETIREMENT OPTION</span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { l:'ACCOUNT NO', v:'42201-7954181-9-2' },
                { l:'CLIENT', v:'Mr Kashif Ali' },
                { l:'RETIREMENT DATE', v:'2041-01-16' },
              ].map(f => (
                <div key={f.l} className="flex items-center justify-between">
                  <span className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>{f.l}</span>
                  <span className="text-[9px] font-mono" style={{ color: 'var(--fg)' }}>{f.v}</span>
                </div>
              ))}
              <div>
                <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>REDEMPTION TYPE</div>
                <select value={redeemType} onChange={e => setRedeemType(e.target.value)}
                  className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent" style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}>
                  {['Early Redemption','At Retirement','Death (Nominee Claim)','Transfer to Other Provider'].map(o => (
                    <option key={o} style={{ background:'var(--bg)' }}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>REDEMPTION % OF BALANCE</div>
                <input type="number" value={pctOption} onChange={e => setPctOption(e.target.value)}
                  className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent" style={{ border: '1px solid var(--border)', color: 'var(--fg)' }} />
              </div>
              <button onClick={() => setRetConfirm(`Redemption queued · ${redeemType} · net payout TZS ${netPayout.toLocaleString(undefined,{maximumFractionDigits:0})}`)}
                className="w-full py-2 text-[9px] font-mono" style={{ background: color, color: '#fff', border: `1px solid ${color}` }}>
                PROCESS REDEMPTION →
              </button>
              {retConfirm && (
                <div className="p-2 flex items-center gap-2" style={{ border: `1px solid ${color}`, background: `${color}08` }}>
                  <CheckCircle size={11} style={{ color }} />
                  <span className="text-[8px] font-mono" style={{ color }}>{retConfirm}</span>
                </div>
              )}
            </div>
          </div>

          {/* Taxation panel */}
          <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
              <Receipt size={11} style={{ color }} />
              <span className="text-[9px] font-mono" style={{ color }}>TAXATION & WITHHOLDING</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l:'AVAILABLE BALANCE', v:`TZS ${availableBalance.toLocaleString()}` },
                  { l:'REDEMPTION AMOUNT', v:`TZS ${redeemAmount.toLocaleString(undefined,{maximumFractionDigits:0})}` },
                  { l:`WITHHOLDING (${(whtRate*100).toFixed(0)}%)`, v:`TZS ${wht.toLocaleString(undefined,{maximumFractionDigits:0})}`, c:'var(--negative)' },
                  { l:'NET PAYOUT', v:`TZS ${netPayout.toLocaleString(undefined,{maximumFractionDigits:0})}`, c: color },
                ].map(s => (
                  <div key={s.l} className="p-2" style={{ border: '1px solid var(--border)' }}>
                    <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>{s.l}</div>
                    <div className="text-[10px] font-mono font-bold tabular-nums" style={{ color: s.c ?? 'var(--fg)' }}>{s.v}</div>
                  </div>
                ))}
              </div>
              <table className="w-full text-[8px] font-mono">
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['YEAR','TAX PAID (TZS)','TAXABLE INCOME (TZS)'].map(h => (
                    <th key={h} className="px-2 py-1 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[['2024','0','0'],['2025','16,751','518,000'],['2026','25,279','611,200']].map(r => (
                    <tr key={r[0]} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-2 py-1" style={{ color: 'var(--fg-muted)' }}>{r[0]}</td>
                      <td className="px-2 py-1 tabular-nums" style={{ color: 'var(--fg)' }}>{r[1]}</td>
                      <td className="px-2 py-1 tabular-nums" style={{ color: 'var(--fg)' }}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>
                Max tax-deductible contribution: TZS {MAX_TAX_DEDUCTIBLE.toLocaleString()} p.a. ·
                Transfers to/from other pension providers carry no sales load.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post-retirement income plans */}
      {section === 'income' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {[
            { l:'Monthly Pension Plan', d:'10-year structured payout, capital-protected, re-evaluated yearly on fund valuation', icon:<CalendarClock size={12} /> },
            { l:'Annuity Transfer',     d:'Remaining balance after maturity transferred to annuity provider', icon:<Repeat size={12} /> },
            { l:'Nominee / Death Benefit', d:'Total or partial encashment to nominees before/after maturity', icon:<HeartPulse size={12} /> },
          ].map(p => (
            <div key={p.l} className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color }}>{p.icon}
                <span className="text-[9px] font-mono font-bold" style={{ color: 'var(--fg)' }}>{p.l}</span>
              </div>
              <div className="text-[8px] font-mono leading-relaxed" style={{ color: 'var(--fg-muted)' }}>{p.d}</div>
              <span className="inline-block mt-3 text-[7px] font-mono px-2 py-0.5" style={{ color: 'var(--positive)', border: '1px solid var(--positive)' }}>AVAILABLE</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
