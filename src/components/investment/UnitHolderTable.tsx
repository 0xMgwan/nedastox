'use client';
import { useState } from 'react';
import { UNIT_HOLDERS, UnitHolder } from '@/data/funds-data';
import { Search, User, Building2, Users } from 'lucide-react';

const TYPE_ICON = { individual: User, joint: Users, corporate: Building2 };
const KYC_STYLE: Record<string, { color: string; label: string }> = {
  verified: { color: 'var(--positive)', label: 'KYC ✓' },
  pending:  { color: '#ffaa00', label: 'KYC ⚠' },
  expired:  { color: 'var(--negative)', label: 'KYC ✕' },
};

interface Props { fundId?: string; }

export default function UnitHolderTable({ fundId }: Props) {
  const [q, setQ] = useState('');
  const holders = UNIT_HOLDERS.filter(h =>
    (!fundId || h.fundId === fundId) &&
    (!q || h.name.toLowerCase().includes(q.toLowerCase()) || h.accountNo.includes(q))
  );

  function fmtTZS(n: number) {
    if (n >= 1e9) return `${(n/1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`;
    return n.toLocaleString();
  }

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
          UNIT HOLDERS — {holders.length} ACCOUNTS
        </span>
        <div className="flex items-center gap-2 px-2 py-1" style={{ border: '1px solid var(--border)' }}>
          <Search size={10} style={{ color: 'var(--fg-faint)' }} />
          <input
            value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
            className="bg-transparent text-[9px] font-mono outline-none w-28"
            style={{ color: 'var(--fg)' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-72">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['ACCOUNT','HOLDER','TYPE','UNITS','INVESTED','CURRENT VALUE','GAIN/LOSS','KYC','STATUS'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holders.map(h => {
              const Icon = TYPE_ICON[h.type];
              const kycS = KYC_STYLE[h.kyc];
              const pos  = h.gainLoss >= 0;
              return (
                <tr key={h.id} className="transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--accent)' }}>{h.accountNo}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--fg)' }}>{h.name}</td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1" style={{ color: 'var(--fg-muted)' }}>
                      <Icon size={9} />{h.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{h.units.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{fmtTZS(h.investedAmount)}</td>
                  <td className="px-3 py-2 tabular-nums font-bold" style={{ color: 'var(--fg)' }}>{fmtTZS(h.currentValue)}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: pos ? 'var(--positive)' : 'var(--negative)' }}>
                    {pos ? '+' : ''}{fmtTZS(h.gainLoss)} ({pos ? '+' : ''}{h.gainLossPct.toFixed(1)}%)
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-[7px] px-1 py-0.5" style={{ color: kycS.color, border: `1px solid ${kycS.color}40` }}>
                      {kycS.label}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-[7px] px-1 py-0.5" style={{
                      color: h.status === 'active' ? 'var(--positive)' : 'var(--fg-faint)',
                      border: `1px solid ${h.status === 'active' ? 'var(--positive)' : 'var(--border)'}40`,
                    }}>
                      {h.status.toUpperCase()}
                    </span>
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
