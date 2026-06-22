'use client';
import { SETTLEMENT_QUEUE, SettleStatus } from '@/data/backoffice-data';

const STATUS_STYLE: Record<SettleStatus, { color: string; label: string }> = {
  pending:   { color: '#ffaa00',         label: 'PENDING'   },
  sent:      { color: '#00aaff',         label: 'SENT'      },
  confirmed: { color: 'var(--positive)', label: 'CONFIRMED' },
  failed:    { color: 'var(--negative)', label: 'FAILED'    },
  overdue:   { color: 'var(--negative)', label: 'OVERDUE'   },
};

export default function SettlementQueue() {
  const today = '2026-06-22';
  const upcoming = SETTLEMENT_QUEUE.filter(s => s.settlementDate >= today).sort((a, b) => a.settlementDate.localeCompare(b.settlementDate));
  const past      = SETTLEMENT_QUEUE.filter(s => s.settlementDate < today).sort((a, b) => b.settlementDate.localeCompare(a.settlementDate));

  const totalPending   = upcoming.filter(s => s.status === 'pending' || s.status === 'sent').reduce((sum, s) => sum + s.netSettlement, 0);
  const totalSettled   = past.filter(s => s.status === 'confirmed').reduce((sum, s) => sum + s.netSettlement, 0);

  function renderTable(items: typeof SETTLEMENT_QUEUE, label: string) {
    return (
      <div style={{ border: '1px solid var(--border)' }}>
        <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}>
          <span className="text-[8px] font-mono" style={{ color: 'var(--fg-dim)' }}>{label} ({items.length})</span>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-[9px] font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['CONTRACT','SYMBOL','SIDE','QTY','SETTLE DATE','NET VALUE (TZS)','DVP','CSD STATUS','STATUS'].map(h => (
                  <th key={h} className="px-3 py-1.5 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(s => {
                const sc = STATUS_STYLE[s.status];
                const csdCol = s.csdStatus === 'confirmed' ? 'var(--positive)' : s.csdStatus === 'rejected' ? 'var(--negative)' : '#ffaa00';
                return (
                  <tr key={s.tradeId} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-3 py-2" style={{ color: 'var(--accent)' }}>{s.contractNo}</td>
                    <td className="px-3 py-2 font-bold" style={{ color: 'var(--fg)' }}>{s.symbol}</td>
                    <td className="px-3 py-2" style={{ color: s.side === 'buy' ? 'var(--positive)' : 'var(--negative)' }}>{s.side.toUpperCase()}</td>
                    <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{s.quantity.toLocaleString()}</td>
                    <td className="px-3 py-2 tabular-nums" style={{ color: s.settlementDate === today ? '#ffaa00' : 'var(--fg-muted)' }}>
                      {s.settlementDate}{s.settlementDate === today ? ' ◀ TODAY' : ''}
                    </td>
                    <td className="px-3 py-2 tabular-nums font-bold" style={{ color: 'var(--fg)' }}>
                      {(s.netSettlement / 1e6).toFixed(2)}M
                    </td>
                    <td className="px-3 py-2 text-center" style={{ color: s.dvp ? 'var(--positive)' : 'var(--fg-muted)' }}>
                      {s.dvp ? '✓' : '—'}
                    </td>
                    <td className="px-3 py-2">
                      <span style={{ color: csdCol }}>{s.csdStatus?.toUpperCase() ?? 'AWAITING'}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span style={{ color: sc.color }}>{sc.label}</span>
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

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { l:'PENDING SETTLEMENT', v: `TZS ${(totalPending/1e9).toFixed(2)}B`, c:'#ffaa00' },
          { l:'SETTLED (TODAY)',    v: `${past.filter(s => s.status === 'confirmed' && s.settlementDate === today).length} trades`, c:'var(--positive)' },
          { l:'TOTAL SETTLED',      v: `TZS ${(totalSettled/1e9).toFixed(2)}B`, c:'var(--positive)' },
        ].map((k, i) => (
          <div key={i} className="p-3" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>{k.l}</div>
            <div className="text-sm font-mono font-bold tabular-nums" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      {renderTable(upcoming, 'UPCOMING SETTLEMENT (T+2 QUEUE)')}
      {renderTable(past,     'SETTLED / HISTORY')}
    </div>
  );
}
