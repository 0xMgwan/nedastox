'use client';
import { Trade } from '@/data/backoffice-data';
import { Printer, Mail, FileText } from 'lucide-react';

interface Props { trade: Trade | null; }

export default function ContractNotePanel({ trade }: Props) {
  if (!trade) return (
    <div className="p-8 flex flex-col items-center justify-center h-64" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <FileText size={24} style={{ color: 'var(--fg-faint)', marginBottom: 8 }} />
      <div className="text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>SELECT A TRADE TO VIEW CONTRACT NOTE</div>
    </div>
  );

  const f = trade.fees;
  const isPos = trade.side === 'buy';

  const rows = [
    { l:'Gross Transaction Value',  v: f.grossValue,                          bold: false },
    { l:`Brokerage (${f.brokerageRate.toFixed(2)}%)`, v: f.brokerage,        bold: false },
    { l:'VAT on Brokerage (18%)',   v: f.vatOnBrok,                           bold: false },
    { l:`DSE Fee (0.01%)`,          v: f.dseFee,                              bold: false },
    { l:'CMSA Levy (0.01%)',        v: f.cmsaLevy,                            bold: false },
    { l:'CDS Fee (0.005%)',         v: f.cdsFee,                              bold: false },
    { l:'Total Charges',            v: f.totalCharges,                        bold: true  },
    { l: isPos ? 'Net Amount Payable' : 'Net Amount Receivable', v: f.netSettlement, bold: true },
  ];

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>CONTRACT NOTE — {trade.contractNo}</span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-2 py-1 text-[8px] font-mono" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
            <Printer size={9} /> PRINT
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-[8px] font-mono" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
            <Mail size={9} /> EMAIL
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Trade details grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { l:'Contract No',      v: trade.contractNo },
            { l:'Trade Date',       v: trade.tradeDate },
            { l:'Settlement Date',  v: trade.settlementDate + ' (T+2)' },
            { l:'Security',         v: `${trade.symbol} — ${trade.companyName}` },
            { l:'Transaction Type', v: trade.side.toUpperCase() },
            { l:'Broker',           v: `${trade.brokerCode} (${BROKERS_MAP[trade.brokerId] ?? trade.brokerId})` },
            { l:'Fund / Client',    v: trade.clientName },
            { l:'DSE Reference',    v: trade.dseRef ?? 'Pending' },
            { l:'CSD Reference',    v: trade.csdRef ?? 'Pending' },
          ].map((r, i) => (
            <div key={i}>
              <div className="text-[7px] font-mono mb-0.5" style={{ color: 'var(--fg-faint)' }}>{r.l}</div>
              <div className="text-[9px] font-mono" style={{ color: 'var(--fg)' }}>{r.v}</div>
            </div>
          ))}
        </div>

        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Quantity / Price */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3" style={{ border: '1px solid var(--border)' }}>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>QUANTITY (SHARES)</div>
            <div className="text-base font-mono font-bold tabular-nums" style={{ color: 'var(--fg)' }}>{trade.quantity.toLocaleString()}</div>
          </div>
          <div className="p-3" style={{ border: '1px solid var(--border)' }}>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>PRICE (TZS/SHARE)</div>
            <div className="text-base font-mono font-bold tabular-nums" style={{ color: 'var(--fg)' }}>{trade.price.toLocaleString()}</div>
          </div>
          <div className="p-3" style={{ border: '1px solid var(--border)' }}>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>TRADE TIME</div>
            <div className="text-base font-mono font-bold" style={{ color: 'var(--fg)' }}>10:42:18 EAT</div>
          </div>
        </div>

        {/* Fee breakdown */}
        <div style={{ border: '1px solid var(--border)' }}>
          <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}>
            <span className="text-[8px] font-mono" style={{ color: 'var(--fg-dim)' }}>CHARGES BREAKDOWN (TZS)</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="px-3 py-2 flex items-center justify-between"
              style={{
                borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                background: r.bold ? 'var(--bg-hover)' : 'transparent',
              }}>
              <span className="text-[9px] font-mono" style={{ color: r.bold ? 'var(--fg)' : 'var(--fg-muted)' }}>{r.l}</span>
              <span className="text-[9px] font-mono tabular-nums font-bold" style={{
                color: i === rows.length - 1 ? (isPos ? 'var(--negative)' : 'var(--positive)') : 'var(--fg)',
              }}>
                {r.v.toLocaleString('en-TZ')}
              </span>
            </div>
          ))}
        </div>

        {/* Break reason */}
        {trade.breakReason && (
          <div className="p-3 flex items-start gap-2" style={{ border: '1px solid var(--negative)', background: 'rgba(255,59,59,0.05)' }}>
            <span className="text-[8px] font-mono" style={{ color: 'var(--negative)' }}>BREAK REASON: {trade.breakReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const BROKERS_MAP: Record<string, string> = {
  br1: 'FIMCO Securities', br2: 'Orbit Securities', br3: 'Core Securities',
  br4: 'Vertex International', br5: 'Rasilimali Limited', br6: 'Standard Securities',
};
