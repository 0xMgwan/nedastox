'use client';
import { FUND_TRANSACTIONS, FundTransaction } from '@/data/funds-data';

const TXN_COLORS: Record<string, string> = {
  purchase:     'var(--positive)',
  redemption:   'var(--negative)',
  transfer_in:  '#e10600',
  transfer_out: '#ffaa00',
  dividend:     '#6b7280',
  bonus:        '#6b7280',
};

interface Props { fundId?: string; limit?: number; }

export default function TransactionLedger({ fundId, limit = 20 }: Props) {
  const txns = FUND_TRANSACTIONS
    .filter(t => !fundId || t.fundId === fundId)
    .slice(0, limit);

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
          RECENT TRANSACTIONS
        </span>
      </div>
      <div className="overflow-auto max-h-56">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['DATE','HOLDER','TYPE','UNITS','NAV','AMOUNT','FEE','STATUS'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns.map(t => (
              <tr key={t.id}
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{t.date}</td>
                <td className="px-3 py-2" style={{ color: 'var(--fg)' }}>{t.holderName}</td>
                <td className="px-3 py-2">
                  <span className="text-[7px] px-1.5 py-0.5" style={{
                    color: TXN_COLORS[t.type] ?? 'var(--fg-dim)',
                    border: `1px solid ${TXN_COLORS[t.type] ?? 'var(--border)'}40`,
                  }}>
                    {t.type.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>
                  {t.units > 0 ? t.units.toLocaleString() : '—'}
                </td>
                <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                  {t.nav > 0 ? t.nav.toLocaleString('en-TZ', { minimumFractionDigits: 2 }) : '—'}
                </td>
                <td className="px-3 py-2 tabular-nums font-bold" style={{ color: 'var(--fg)' }}>
                  {(t.amount / 1e6).toFixed(3)}M
                </td>
                <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                  {t.fee > 0 ? `${(t.fee / 1000).toFixed(1)}K` : '—'}
                </td>
                <td className="px-3 py-2">
                  <span style={{ color: t.status === 'processed' ? 'var(--positive)' : t.status === 'pending' ? '#ffaa00' : 'var(--negative)' }}>
                    {t.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
