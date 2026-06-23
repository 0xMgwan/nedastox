'use client';
import Link from 'next/link';
import { TRADES } from '@/data/backoffice-data';
import { ArrowUpRight, Link2 } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  settled:'var(--positive)', matched:'#e10600', pending:'#ffaa00', break:'var(--negative)', failed:'var(--negative)', cancelled:'#888',
};

export default function BackOfficeLink({ fundId }: { fundId: string }) {
  const trades = TRADES.filter(t => t.fundId === fundId);

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="flex items-center gap-2 text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
          <Link2 size={11} style={{ color: '#e10600' }} />
          BACK OFFICE LINKAGE — DSE EXECUTIONS FOR THIS FUND
        </span>
        <Link href="/back-office" className="flex items-center gap-1 text-[8px] font-mono no-underline" style={{ color: '#e10600' }}>
          OPEN BACK OFFICE <ArrowUpRight size={9} />
        </Link>
      </div>

      {trades.length === 0 ? (
        <div className="px-4 py-6 text-center text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>
          No DSE trades executed for this fund in the current window
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-[9px] font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['CONTRACT','SYMBOL','SIDE','QTY','PRICE','NET (TZS)','SETTLE','STATUS'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-3 py-2" style={{ color: '#e10600' }}>{t.contractNo}</td>
                  <td className="px-3 py-2 font-bold" style={{ color: 'var(--fg)' }}>{t.symbol}</td>
                  <td className="px-3 py-2" style={{ color: t.side === 'buy' ? 'var(--positive)' : 'var(--negative)' }}>{t.side.toUpperCase()}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{t.quantity.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{t.price.toLocaleString()}</td>
                  <td className="px-3 py-2 tabular-nums font-bold" style={{ color: 'var(--fg)' }}>{(t.fees.netSettlement/1e6).toFixed(2)}M</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{t.settlementDate}</td>
                  <td className="px-3 py-2"><span style={{ color: STATUS_COLOR[t.status] }}>{t.status.toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-4 py-2 text-[7px] font-mono" style={{ borderTop: '1px solid var(--border)', color: 'var(--fg-faint)' }}>
        Equity orders placed in IMS Unit Management are routed to the Broker Back Office for execution, contract note generation, and T+2 settlement.
      </div>
    </div>
  );
}
