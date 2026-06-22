'use client';
import { useState } from 'react';
import { calcFees, TradeSide } from '@/data/backoffice-data';
import { DSE_STOCKS } from '@/data/tanzania-assets';
import { Calculator } from 'lucide-react';

export default function FeeCalculator() {
  const [symbol, setSymbol]   = useState('CRDB');
  const [qty, setQty]         = useState('10000');
  const [price, setPrice]     = useState('2710');
  const [side, setSide]       = useState<TradeSide>('buy');

  const gross = parseInt(qty || '0') * parseFloat(price || '0');
  const fees  = gross > 0 ? calcFees(gross, side) : null;

  const stock = DSE_STOCKS.find(s => s.symbol === symbol);

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
        <Calculator size={11} style={{ color: 'var(--accent)' }} />
        <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>DSE FEE CALCULATOR</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Inputs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>SECURITY</div>
            <select value={symbol} onChange={e => { setSymbol(e.target.value); const s = DSE_STOCKS.find(x => x.symbol === e.target.value); if (s) setPrice(String(s.price)); }}
              className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent"
              style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}>
              {DSE_STOCKS.map(s => <option key={s.symbol} value={s.symbol} style={{ background: 'var(--bg)' }}>{s.symbol}</option>)}
            </select>
          </div>
          <div>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>SIDE</div>
            <div className="flex">
              {(['buy','sell'] as const).map(s => (
                <button key={s} onClick={() => setSide(s)}
                  className="flex-1 py-1.5 text-[9px] font-mono"
                  style={side === s ? {
                    background: s === 'buy' ? 'var(--positive)' : 'var(--negative)',
                    color: 'var(--bg)', border: '1px solid transparent',
                  } : { border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>QUANTITY</div>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)}
              className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent"
              style={{ border: '1px solid var(--border)', color: 'var(--fg)' }} />
          </div>
          <div>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>PRICE (TZS)</div>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full px-2 py-1.5 text-[9px] font-mono bg-transparent"
              style={{ border: '1px solid var(--border)', color: 'var(--fg)' }} />
          </div>
        </div>

        {/* Market price hint */}
        {stock && (
          <div className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>
            Market price: {stock.price.toLocaleString()} TZS · Change: {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
          </div>
        )}

        {/* Results */}
        {fees && (
          <div style={{ border: '1px solid var(--border)' }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}>
              <span className="text-[8px] font-mono" style={{ color: 'var(--fg-dim)' }}>FEE BREAKDOWN</span>
              <span className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>BROKERAGE RATE: {fees.brokerageRate.toFixed(2)}%</span>
            </div>
            {[
              { l:'Gross Transaction Value', v: fees.grossValue,    highlight: false },
              { l:`Brokerage (${fees.brokerageRate.toFixed(2)}%)`,  v: fees.brokerage,   highlight: false },
              { l:'VAT on Brokerage (18%)',  v: fees.vatOnBrok,   highlight: false },
              { l:'DSE Fee (0.010%)',         v: fees.dseFee,      highlight: false },
              { l:'CMSA Levy (0.010%)',       v: fees.cmsaLevy,    highlight: false },
              { l:'CDS Fee (0.005%)',         v: fees.cdsFee,      highlight: false },
              { l:'Total Charges',            v: fees.totalCharges,highlight: true  },
              { l: side === 'buy' ? 'Net Amount Payable' : 'Net Amount Receivable', v: fees.netSettlement, highlight: true },
            ].map((r, i) => (
              <div key={i} className="px-3 py-2 flex justify-between items-center"
                style={{ borderBottom: i < 7 ? '1px solid var(--border)' : 'none', background: r.highlight ? 'var(--bg-hover)' : 'transparent' }}>
                <span className="text-[9px] font-mono" style={{ color: r.highlight ? 'var(--fg)' : 'var(--fg-muted)' }}>{r.l}</span>
                <span className="text-[10px] font-mono tabular-nums font-bold" style={{
                  color: i === 7 ? (side === 'buy' ? 'var(--negative)' : 'var(--positive)') : 'var(--fg)',
                }}>
                  {r.v.toLocaleString('en-TZ')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="text-[7px] font-mono leading-relaxed" style={{ color: 'var(--fg-faint)' }}>
          * Brokerage: 1.5% (≤TZS 5M) · 1.0% (TZS 5M–50M) · 0.8% ({'>'}TZS 50M) — DSE member tariff schedule.
          VAT (18%) applies on brokerage only. DSE fee, CMSA levy, and CDS fee are statutory.
        </div>
      </div>
    </div>
  );
}
