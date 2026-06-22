'use client';
import { REGULATORY_REPORTS, RegulatoryReport } from '@/data/backoffice-data';
import { FileText, Download, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const STATUS_CFG: Record<string, { c: string; icon: React.ReactNode }> = {
  draft:        { c: '#888',            icon: <Clock       size={9} /> },
  submitted:    { c: '#00aaff',         icon: <Send        size={9} /> },
  acknowledged: { c: 'var(--positive)', icon: <CheckCircle size={9} /> },
  overdue:      { c: 'var(--negative)', icon: <AlertCircle size={9} /> },
};

const TYPE_LABELS: Record<string, string> = {
  daily_trades:       'DAILY TRADE REPORT',
  client_activity:    'CLIENT ACTIVITY',
  settlement_summary: 'SETTLEMENT SUMMARY',
  regulatory_cmsa:    'CMSA RETURN',
  regulatory_dse:     'DSE MEMBER REPORT',
};

export default function RegulatoryReports() {
  const pending = REGULATORY_REPORTS.filter(r => r.status === 'draft' || r.status === 'overdue');
  const submitted = REGULATORY_REPORTS.filter(r => r.status !== 'draft' && r.status !== 'overdue');

  function ReportRow({ r }: { r: RegulatoryReport }) {
    const sc = STATUS_CFG[r.status];
    return (
      <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3 transition-colors"
        style={{ borderBottom: '1px solid var(--border)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
        <div className="flex items-center gap-3">
          <FileText size={14} style={{ color: sc.c }} />
          <div>
            <div className="text-[9px] font-mono font-bold" style={{ color: 'var(--fg)' }}>{r.title}</div>
            <div className="text-[7px] font-mono mt-0.5" style={{ color: 'var(--fg-faint)' }}>
              Period: {r.period} · {r.records} records · To: {r.submittedTo}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[7px] font-mono text-right">
            <div style={{ color: 'var(--fg-faint)' }}>GENERATED</div>
            <div style={{ color: 'var(--fg-dim)' }}>{new Date(r.generatedAt).toLocaleString('en-TZ', { hour12:false }).replace(',','')}</div>
          </div>
          <span className="flex items-center gap-1 text-[8px] font-mono px-2 py-0.5" style={{ color: sc.c, border: `1px solid ${sc.c}40` }}>
            {sc.icon}{r.status.toUpperCase()}
          </span>
          <div className="flex items-center gap-1">
            {r.status === 'draft' && (
              <button className="flex items-center gap-1 px-2 py-1 text-[8px] font-mono" style={{ border: '1px solid #00aaff', color: '#00aaff' }}>
                <Send size={8} /> SUBMIT
              </button>
            )}
            <button className="flex items-center gap-1 px-2 py-1 text-[8px] font-mono" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              <Download size={8} /> CSV
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pending submission */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            PENDING SUBMISSION ({pending.length})
          </span>
          {pending.length > 0 && (
            <button className="flex items-center gap-1 px-3 py-1 text-[8px] font-mono" style={{ background: 'var(--accent)', color: 'var(--bg)', border: '1px solid var(--accent)' }}>
              <Send size={8} /> SUBMIT ALL
            </button>
          )}
        </div>
        {pending.length === 0 ? (
          <div className="px-4 py-6 text-center text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>All reports submitted</div>
        ) : pending.map(r => <ReportRow key={r.id} r={r} />)}
      </div>

      {/* Submitted/Acknowledged */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            SUBMITTED ({submitted.length})
          </span>
        </div>
        {submitted.map(r => <ReportRow key={r.id} r={r} />)}
      </div>

      {/* Report schedule */}
      <div className="p-3" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="text-[8px] font-mono mb-2" style={{ color: 'var(--fg-dim)' }}>REPORTING SCHEDULE</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-[8px] font-mono">
          {[
            { l:'Daily Trade Report',    freq:'Daily by 17:00 EAT', to:'DSE' },
            { l:'Settlement Summary',    freq:'Daily by 17:30 EAT', to:'CSD' },
            { l:'Client Activity',       freq:'Daily by 17:00 EAT', to:'CMSA' },
            { l:'CMSA Monthly Return',   freq:'5th of each month',  to:'CMSA' },
            { l:'DSE Member Report',     freq:'5th of each month',  to:'DSE' },
            { l:'CMSA Quarterly Return', freq:'End of each quarter', to:'CMSA' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 mt-0.5 rounded-full flex-shrink-0" style={{ background: 'var(--positive)' }} />
              <div>
                <div style={{ color: 'var(--fg)' }}>{s.l}</div>
                <div style={{ color: 'var(--fg-faint)' }}>{s.freq} → {s.to}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
