'use client';
import { useState } from 'react';
import { Fund, FUND_TYPE_COLORS } from '@/data/funds-data';
import {
  ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Repeat, Lock,
  CheckCircle, Bell, Smartphone, Mail, CreditCard, Building2,
} from 'lucide-react';

type TxnKind = 'purchase' | 'redemption' | 'transfer' | 'switch' | 'pledge';

const KINDS: { id: TxnKind; label: string; icon: React.ReactNode }[] = [
  { id:'purchase',   label:'NEW INVESTMENT',  icon:<ArrowDownToLine size={11} /> },
  { id:'redemption', label:'REDEMPTION',      icon:<ArrowUpFromLine size={11} /> },
  { id:'transfer',   label:'ACCT TRANSFER',   icon:<ArrowLeftRight size={11} /> },
  { id:'switch',     label:'FUND SWITCH',     icon:<Repeat size={11} /> },
  { id:'pledge',     label:'PLEDGE',          icon:<Lock size={11} /> },
];

// Front-end (sale) load and back-end (redemption) load by fund type
const LOADS: Record<string, { front: number; back: number }> = {
  mutual:         { front: 0.015, back: 0.010 },
  pension:        { front: 0.0,   back: 0.0   },
  provident:      { front: 0.0,   back: 0.0   },
  private_equity: { front: 0.020, back: 0.015 },
};

export default function UnitManagement({ fund, canApprove = true }: { fund: Fund; canApprove?: boolean }) {
  const color = FUND_TYPE_COLORS[fund.type];
  const load  = LOADS[fund.type];

  const [kind, setKind]       = useState<TxnKind>('purchase');
  const [account, setAccount] = useState('UH-2024-0001');
  const [amount, setAmount]   = useState('5000000');
  const [units, setUnits]     = useState('2000');
  const [payment, setPayment] = useState('Bank Transfer');
  const [approved, setApproved] = useState(false);
  const [confirm, setConfirm] = useState<null | {
    ref: string; units: number; gross: number; loadFee: number; net: number; cn: string | null;
  }>(null);

  const isEquityFund = fund.allocation.some(a => a.asset.includes('Equ'));

  // Live computation
  const amt   = parseFloat(amount || '0');
  const unitCount = parseFloat(units || '0');
  const frontLoad = amt * load.front;
  const purchaseUnits = fund.nav ? (amt - frontLoad) / fund.nav : 0;
  const redeemGross   = unitCount * fund.nav;
  const backLoad      = redeemGross * load.back;
  const redeemNet     = redeemGross - backLoad;

  function submit() {
    setApproved(false);
    const ref = `IMS-${Date.now().toString().slice(-7)}`;
    const cn  = isEquityFund && (kind === 'purchase' || kind === 'redemption')
      ? `CN-2026-${Math.floor(Math.random() * 900 + 100)}`
      : null;
    if (kind === 'purchase') {
      setConfirm({ ref, units: purchaseUnits, gross: amt, loadFee: frontLoad, net: amt, cn });
    } else if (kind === 'redemption') {
      setConfirm({ ref, units: unitCount, gross: redeemGross, loadFee: backLoad, net: redeemNet, cn });
    } else {
      setConfirm({ ref, units: unitCount, gross: redeemGross, loadFee: 0, net: redeemGross, cn });
    }
  }

  return (
    <div className="space-y-4">
      {/* Transaction module */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            UNIT MANAGEMENT MODULE — {fund.shortName}
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Kind selector */}
          <div className="flex flex-wrap gap-1">
            {KINDS.map(k => (
              <button key={k.id} onClick={() => { setKind(k.id); setConfirm(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] font-mono transition-all"
                style={kind === k.id
                  ? { background: color, color: '#fff', border: `1px solid ${color}` }
                  : { border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
                {k.icon}{k.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div>
              <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>UNIT HOLDER ACCOUNT</div>
              <input value={account} onChange={e => setAccount(e.target.value)}
                className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--fg)' }} />
            </div>

            {(kind === 'purchase') ? (
              <div>
                <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>AMOUNT (TZS)</div>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent"
                  style={{ border: '1px solid var(--border)', color: 'var(--fg)' }} />
              </div>
            ) : (
              <div>
                <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>UNITS</div>
                <input type="number" value={units} onChange={e => setUnits(e.target.value)}
                  className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent"
                  style={{ border: '1px solid var(--border)', color: 'var(--fg)' }} />
              </div>
            )}

            <div>
              <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>
                {kind === 'purchase' ? 'PAYMENT METHOD' : kind === 'redemption' ? 'PAYOUT METHOD' : 'CHANNEL'}
              </div>
              <select value={payment} onChange={e => setPayment(e.target.value)}
                className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}>
                {['Bank Transfer','Mobile Money (M-Pesa)','Cheque','ATM Network'].map(m => (
                  <option key={m} style={{ background: 'var(--bg)' }}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Live calc */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kind === 'purchase' && [
              { l:'NAV / UNIT',          v: fund.nav.toLocaleString('en-TZ', { minimumFractionDigits: 2 }) },
              { l:`FRONT-END LOAD (${(load.front*100).toFixed(1)}%)`, v: frontLoad.toLocaleString('en-TZ', { maximumFractionDigits: 0 }) },
              { l:'UNITS ALLOTTED',      v: purchaseUnits.toFixed(4), c: color },
              { l:'TOTAL PAYABLE',       v: amt.toLocaleString('en-TZ'), c:'var(--fg)' },
            ].map((s, i) => (
              <div key={i} className="p-2" style={{ border: '1px solid var(--border)' }}>
                <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>{s.l}</div>
                <div className="text-[11px] font-mono font-bold tabular-nums" style={{ color: s.c ?? 'var(--fg)' }}>{s.v}</div>
              </div>
            ))}
            {(kind === 'redemption') && [
              { l:'NAV / UNIT',         v: fund.nav.toLocaleString('en-TZ', { minimumFractionDigits: 2 }) },
              { l:'GROSS PROCEEDS',     v: redeemGross.toLocaleString('en-TZ', { maximumFractionDigits: 0 }) },
              { l:`BACK-END LOAD (${(load.back*100).toFixed(1)}%)`, v: backLoad.toLocaleString('en-TZ', { maximumFractionDigits: 0 }) },
              { l:'NET PAYOUT',         v: redeemNet.toLocaleString('en-TZ', { maximumFractionDigits: 0 }), c: color },
            ].map((s, i) => (
              <div key={i} className="p-2" style={{ border: '1px solid var(--border)' }}>
                <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>{s.l}</div>
                <div className="text-[11px] font-mono font-bold tabular-nums" style={{ color: s.c ?? 'var(--fg)' }}>{s.v}</div>
              </div>
            ))}
            {(kind === 'transfer' || kind === 'switch' || kind === 'pledge') && (
              <div className="col-span-2 lg:col-span-4 p-2 text-[8px] font-mono" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
                {kind === 'transfer' && 'Account-to-account transfer of units between holders within the same fund. No load applied; signatory verification required.'}
                {kind === 'switch'   && 'Fund-to-fund switch — redeem from this fund and reinvest into another within the AMC. Reduced switching load may apply.'}
                {kind === 'pledge'   && 'Pledge units as collateral. Units are frozen (non-redeemable) until pledge release & call instruction is received.'}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button onClick={submit}
              className="px-5 py-2 text-[9px] font-mono tracking-wider"
              style={{ background: color, color: '#fff', border: `1px solid ${color}` }}>
              SUBMIT {KINDS.find(k => k.id === kind)?.label} →
            </button>
            <span className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>
              {canApprove
                ? 'You are a checker — you may approve queued transactions · 4-decimal units'
                : 'Maker role — transactions queue for checker approval · 4-decimal units'}
            </span>
          </div>

          {/* Confirmation */}
          {confirm && (
            <div className="p-3 space-y-2" style={{ border: `1px solid ${color}`, background: `${color}08` }}>
              <div className="flex items-center gap-2">
                <CheckCircle size={12} style={{ color: approved ? 'var(--positive)' : color }} />
                <span className="text-[9px] font-mono font-bold" style={{ color: approved ? 'var(--positive)' : color }}>
                  {approved ? 'TRANSACTION APPROVED & POSTED' : 'TRANSACTION QUEUED'} — {confirm.ref}
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-[8px] font-mono">
                <div><span style={{ color: 'var(--fg-faint)' }}>Units: </span><span style={{ color: 'var(--fg)' }}>{confirm.units.toFixed(4)}</span></div>
                <div><span style={{ color: 'var(--fg-faint)' }}>Load: </span><span style={{ color: 'var(--fg)' }}>{confirm.loadFee.toLocaleString('en-TZ', { maximumFractionDigits: 0 })}</span></div>
                <div><span style={{ color: 'var(--fg-faint)' }}>Net: </span><span style={{ color: 'var(--fg)' }}>TZS {confirm.net.toLocaleString('en-TZ', { maximumFractionDigits: 0 })}</span></div>
                <div><span style={{ color: 'var(--fg-faint)' }}>Status: </span>
                  <span style={{ color: approved ? 'var(--positive)' : '#ffaa00' }}>{approved ? 'POSTED' : 'PENDING APPROVAL'}</span>
                </div>
              </div>
              {confirm.cn && (
                <div className="text-[8px] font-mono pt-1" style={{ borderTop: '1px solid var(--border)', color: '#e10600' }}>
                  ↳ Routed to Broker Back Office — contract note <strong>{confirm.cn}</strong> generated for DSE execution & T+2 settlement
                </div>
              )}
              {/* Maker-checker action */}
              <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 text-[7px] font-mono" style={{ color: 'var(--fg-muted)' }}>
                  <span className="flex items-center gap-1"><Mail size={8} /> Email sent</span>
                  <span className="flex items-center gap-1"><Smartphone size={8} /> SMS sent</span>
                </div>
                {!approved && (
                  canApprove ? (
                    <button onClick={() => setApproved(true)}
                      className="px-3 py-1 text-[8px] font-mono" style={{ background: 'var(--positive)', color: '#fff' }}>
                      APPROVE & POST
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>
                      <Lock size={8} /> Awaiting Fund Manager approval
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Investment plans + Admin plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>UNIT PLANS</span>
          </div>
          <div className="p-4 space-y-2">
            {[
              { l:'Periodic Investment Plan', d:'Recurring auto-debit at fixed intervals (monthly/quarterly)' },
              { l:'Fixed Income Plan',        d:'Regular income payouts at defined periods' },
              { l:'Fixed Investment Plan',    d:'Lump-sum lock-in with target maturity' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--fg)' }}>{p.l}</div>
                  <div className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>{p.d}</div>
                </div>
                <span className="text-[7px] font-mono px-2 py-0.5" style={{ color: 'var(--positive)', border: '1px solid var(--positive)' }}>ENABLED</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>ADMIN PLANS & NOTIFICATIONS</span>
          </div>
          <div className="p-4 space-y-2">
            {[
              { l:'Configurable Admin Plan', d:'Auto-distribute investment across multiple funds', on:true },
              { l:'Plan Transfers & Reversals', d:'Move between plans; reverse on request', on:true },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2" style={{ border: '1px solid var(--border)' }}>
                <div>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--fg)' }}>{p.l}</div>
                  <div className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>{p.d}</div>
                </div>
                <span className="text-[7px] font-mono px-2 py-0.5" style={{ color: 'var(--positive)', border: '1px solid var(--positive)' }}>ENABLED</span>
              </div>
            ))}
            {/* Notification channels */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { icon:<Smartphone size={9} />, l:'SMS Alerts' },
                { icon:<Mail size={9} />,       l:'Email Reports' },
                { icon:<Bell size={9} />,       l:'NAV Price Alerts' },
                { icon:<CreditCard size={9} />, l:'ATM Network' },
              ].map((n, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1.5" style={{ border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--positive)' }}>{n.icon}</span>
                  <span className="text-[8px] font-mono" style={{ color: 'var(--fg-muted)' }}>{n.l}</span>
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--positive)' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Client portal note */}
      <div className="p-3 flex items-center gap-2 text-[8px] font-mono" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--fg-muted)' }}>
        <Building2 size={11} style={{ color }} />
        White-labeled client portal active — holders can view statements, initiate redemptions and fund transfers, and receive day-end email/SMS confirmations.
      </div>
    </div>
  );
}
