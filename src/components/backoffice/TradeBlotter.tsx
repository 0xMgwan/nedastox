'use client';
import { useState } from 'react';
import { TRADES, Trade, TradeStatus } from '@/data/backoffice-data';
import { AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

const STATUS_CONFIG: Record<TradeStatus, { color: string; icon: React.ReactNode; label: string }> = {
  settled:   { color: 'var(--positive)', icon: <CheckCircle size={9} />,  label: 'SETTLED'   },
  matched:   { color: '#e10600',         icon: <CheckCircle size={9} />,  label: 'MATCHED'   },
  pending:   { color: '#ffaa00',         icon: <Clock       size={9} />,  label: 'PENDING'   },
  break:     { color: 'var(--negative)', icon: <AlertTriangle size={9}/>, label: 'BREAK'     },
  failed:    { color: 'var(--negative)', icon: <XCircle     size={9} />,  label: 'FAILED'    },
  cancelled: { color: '#888',            icon: <XCircle     size={9} />,  label: 'CANCELLED' },
};

interface Props { onSelect?: (t: Trade) => void; selected?: Trade | null; }

export default function TradeBlotter({ onSelect, selected }: Props) {
  const [filter, setFilter] = useState<TradeStatus | 'all'>('all');

  const trades = filter === 'all' ? TRADES : TRADES.filter(t => t.status === filter);

  const counts = {
    all:       TRADES.length,
    settled:   TRADES.filter(t => t.status === 'settled').length,
    matched:   TRADES.filter(t => t.status === 'matched').length,
    pending:   TRADES.filter(t => t.status === 'pending').length,
    break:     TRADES.filter(t => t.status === 'break').length,
    failed:    TRADES.filter(t => t.status === 'failed').length,
    cancelled: 0,
  };

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {/* Header + filter pills */}
      <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>TRADE BLOTTER — DSE RECONCILIATION</span>
        <div className="flex items-center gap-1 flex-wrap">
          {(['all','settled','matched','pending','break','failed'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-2 py-0.5 text-[8px] font-mono transition-all"
              style={filter === s ? {
                background: s === 'all' ? 'var(--fg)' : STATUS_CONFIG[s as TradeStatus]?.color ?? 'var(--fg)',
                color: 'var(--bg)', border: '1px solid transparent',
              } : { color: 'var(--fg-muted)', border: '1px solid var(--border)' }}>
              {s.toUpperCase()} {s === 'all' ? `(${counts.all})` : `(${counts[s as TradeStatus]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-[9px] font-mono">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['CONTRACT','DATE','SETTLE','SYMBOL','SIDE','QTY','PRICE','GROSS VALUE','NET SETTLE','BROKER','FUND','STATUS','RECON'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-normal whitespace-nowrap" style={{ color: 'var(--fg-faint)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map(t => {
              const sc = STATUS_CONFIG[t.status];
              const isSelected = selected?.id === t.id;
              return (
                <tr key={t.id}
                  onClick={() => onSelect?.(t)}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: isSelected ? `${sc.color}10` : 'transparent',
                    borderLeft: isSelected ? `2px solid ${sc.color}` : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                  <td className="px-3 py-2" style={{ color: 'var(--accent)' }}>{t.contractNo}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{t.tradeDate}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{t.settlementDate}</td>
                  <td className="px-3 py-2 font-bold" style={{ color: 'var(--fg)' }}>{t.symbol}</td>
                  <td className="px-3 py-2" style={{ color: t.side === 'buy' ? 'var(--positive)' : 'var(--negative)' }}>
                    {t.side.toUpperCase()}
                  </td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{t.quantity.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{t.price.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums font-bold" style={{ color: 'var(--fg)' }}>
                    {(t.grossValue / 1e6).toFixed(2)}M
                  </td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>
                    {(t.fees.netSettlement / 1e6).toFixed(2)}M
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{t.brokerCode}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{t.fundId.toUpperCase()}</td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1" style={{ color: sc.color }}>
                      {sc.icon}{sc.label}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {t.status === 'break' ? (
                      <span style={{ color: 'var(--negative)' }}><AlertTriangle size={10} /></span>
                    ) : t.reconciled ? (
                      <span style={{ color: 'var(--positive)' }}><CheckCircle size={10} /></span>
                    ) : (
                      <span style={{ color: '#ffaa00' }}><RefreshCw size={10} /></span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Breaks alert */}
      {counts.break > 0 && (
        <div className="px-4 py-2 flex items-center gap-2" style={{ borderTop: '1px solid var(--border)', background: 'rgba(255,59,59,0.05)' }}>
          <AlertTriangle size={10} style={{ color: 'var(--negative)' }} />
          <span className="text-[8px] font-mono" style={{ color: 'var(--negative)' }}>
            {counts.break} BREAK{counts.break > 1 ? 'S' : ''} REQUIRE IMMEDIATE RESOLUTION
          </span>
        </div>
      )}
    </div>
  );
}
