'use client';
import { CORPORATE_ACTIONS, CorporateAction } from '@/data/backoffice-data';
import { Calendar, DollarSign, Percent, AlertCircle, CheckCircle } from 'lucide-react';

const TYPE_LABELS: Record<string, { l: string; c: string }> = {
  dividend:    { l: 'DIVIDEND',    c: '#0e8a4f' },
  rights_issue:{ l: 'RIGHTS',      c: '#e10600' },
  bonus_share: { l: 'BONUS',       c: '#ffaa00' },
  stock_split: { l: 'SPLIT',       c: '#6b7280' },
  agm:         { l: 'AGM',         c: '#888'    },
};

const STATUS_STYLE: Record<string, { c: string; icon: React.ReactNode }> = {
  upcoming:        { c: '#ffaa00',         icon: <Calendar   size={9} /> },
  ex_date_passed:  { c: '#e10600',         icon: <AlertCircle size={9} /> },
  paid:            { c: 'var(--positive)', icon: <CheckCircle size={9} /> },
  processing:      { c: '#6b7280',         icon: <AlertCircle size={9} /> },
};

export default function CorporateActionsPanel() {
  const upcoming = CORPORATE_ACTIONS.filter(a => a.status !== 'paid').sort((a, b) => a.exDate.localeCompare(b.exDate));
  const past     = CORPORATE_ACTIONS.filter(a => a.status === 'paid');

  function ActionCard({ a }: { a: CorporateAction }) {
    const tc = TYPE_LABELS[a.type] ?? { l: a.type.toUpperCase(), c: '#888' };
    const sc = STATUS_STYLE[a.status] ?? { c: '#888', icon: null };
    return (
      <div className="p-3" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm" style={{ color: 'var(--fg)' }}>{a.symbol}</span>
            <span className="text-[7px] px-1.5 py-0.5" style={{ color: tc.c, border: `1px solid ${tc.c}40`, background: `${tc.c}10` }}>{tc.l}</span>
          </div>
          <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: sc.c }}>
            {sc.icon}{a.status.replace(/_/g,' ').toUpperCase()}
          </span>
        </div>
        <div className="text-[8px] font-mono mb-2 leading-tight" style={{ color: 'var(--fg-muted)' }}>{a.details}</div>
        <div className="grid grid-cols-3 gap-2 text-[7px] font-mono">
          <div>
            <div style={{ color: 'var(--fg-faint)' }}>ANNOUNCED</div>
            <div style={{ color: 'var(--fg-dim)' }}>{a.announcedDate}</div>
          </div>
          <div>
            <div style={{ color: 'var(--fg-faint)' }}>EX-DATE</div>
            <div style={{ color: sc.c }}>{a.exDate}</div>
          </div>
          <div>
            <div style={{ color: 'var(--fg-faint)' }}>PAY DATE</div>
            <div style={{ color: 'var(--fg-dim)' }}>{a.payDate}</div>
          </div>
        </div>
        {a.amount && (
          <div className="mt-2 flex items-center gap-1 text-[9px] font-mono" style={{ color: 'var(--positive)' }}>
            <DollarSign size={9} />
            TZS {a.amount.toLocaleString()} per share
          </div>
        )}
        {a.ratio && (
          <div className="mt-2 flex items-center gap-1 text-[9px] font-mono" style={{ color: '#e10600' }}>
            <Percent size={9} />
            Ratio: {a.ratio}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[9px] font-mono mb-2 tracking-wider" style={{ color: 'var(--fg-dim)' }}>
          UPCOMING CORPORATE ACTIONS ({upcoming.length})
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {upcoming.map(a => <ActionCard key={a.id} a={a} />)}
        </div>
      </div>
      <div>
        <div className="text-[9px] font-mono mb-2 tracking-wider" style={{ color: 'var(--fg-dim)' }}>
          COMPLETED ({past.length})
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {past.map(a => <ActionCard key={a.id} a={a} />)}
        </div>
      </div>
    </div>
  );
}
