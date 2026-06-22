'use client';
import { AUDIT_LOG } from '@/data/backoffice-data';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const STATUS_ICON = {
  success: <CheckCircle size={9} style={{ color: 'var(--positive)' }} />,
  warning: <AlertTriangle size={9} style={{ color: '#ffaa00' }} />,
  failed:  <XCircle size={9} style={{ color: 'var(--negative)' }} />,
};

export default function AuditLog() {
  const warnings = AUDIT_LOG.filter(e => e.status === 'warning').length;
  const failures = AUDIT_LOG.filter(e => e.status === 'failed').length;

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { l:'TOTAL EVENTS', v: String(AUDIT_LOG.length), c:'var(--fg)' },
          { l:'WARNINGS',     v: String(warnings),         c:'#ffaa00' },
          { l:'FAILURES',     v: String(failures),         c:'var(--negative)' },
        ].map((k, i) => (
          <div key={i} className="p-3" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <div className="text-[7px] font-mono mb-1" style={{ color: 'var(--fg-faint)' }}>{k.l}</div>
            <div className="text-base font-mono font-bold" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Log table */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <Shield size={11} style={{ color: 'var(--accent)' }} />
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>AUDIT TRAIL — FULL TRANSACTION HISTORY</span>
        </div>
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-[9px] font-mono">
            <thead className="sticky top-0" style={{ background: 'var(--bg-card)' }}>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['','TIMESTAMP','USER','ROLE','ACTION','MODULE','DETAILS','IP'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-normal whitespace-nowrap" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOG.map(e => (
                <tr key={e.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}>
                  <td className="px-3 py-2">{STATUS_ICON[e.status]}</td>
                  <td className="px-3 py-2 tabular-nums whitespace-nowrap" style={{ color: 'var(--fg-muted)' }}>
                    {new Date(e.timestamp).toLocaleString('en-TZ', { hour12:false }).replace(',','')}
                  </td>
                  <td className="px-3 py-2 font-bold" style={{ color: 'var(--fg)' }}>{e.user}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{e.role}</td>
                  <td className="px-3 py-2">
                    <span className="text-[7px] px-1.5 py-0.5" style={{
                      color: e.status === 'success' ? 'var(--positive)' : e.status === 'warning' ? '#ffaa00' : 'var(--negative)',
                      border: `1px solid currentColor`,
                      opacity: 0.8,
                    }}>
                      {e.action.replace(/_/g,' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{e.module}</td>
                  <td className="px-3 py-2" style={{ color: 'var(--fg-dim)', maxWidth: 280 }}>{e.details}</td>
                  <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-faint)' }}>{e.ipAddr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
