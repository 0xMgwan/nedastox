'use client';
import { useState } from 'react';
import { Fund, FUND_TYPE_COLORS, MEMBER_CONTRIBUTIONS } from '@/data/funds-data';
import {
  FileSpreadsheet, Upload, FileText, Users, CheckCircle, XCircle, Globe,
} from 'lucide-react';

type Section = 'schedule' | 'withdrawal' | 'statement' | 'balances';

const IMPORT_ROWS = [
  { staff:'emp316', acct:'7',  self:1000, employer:1000, name:'Tahir Mahmood', cnic:'123', status:'new' },
  { staff:'emp319', acct:'8',  self:1000, employer:1000, name:'Tahir Mahmood', cnic:'123', status:'ok' },
  { staff:'emp320', acct:'9',  self:1000, employer:1000, name:'Tahir Mahmood', cnic:'123', status:'ok' },
  { staff:'emp321', acct:'10', self:1000, employer:1000, name:'Tahir Mahmood', cnic:'123', status:'rejected' },
  { staff:'emp322', acct:'11', self:1000, employer:1000, name:'Tahir Mahmood', cnic:'123', status:'ok' },
  { staff:'emp323', acct:'12', self:1000, employer:1000, name:'Tahir Mahmood', cnic:'123', status:'ok' },
];

const WITHDRAWAL_ROWS = [
  { staff:'GFE 20009', acct:'-', date:'2026-08-28', selfBal:20, selfAmt:0,  empBal:20, empAmt:0,  reject:'Redemption date is greater than current date' },
  { staff:'GFE 20013', acct:'-', date:'2026-08-28', selfBal:10, selfAmt:0,  empBal:20, empAmt:0,  reject:'Redemption date is greater than current date' },
  { staff:'GFE 20014', acct:'21',date:'2026-06-28', selfBal:20, selfAmt:20, empBal:20, empAmt:20, reject:'' },
  { staff:'GFE 20015', acct:'22',date:'2026-06-28', selfBal:20, selfAmt:20, empBal:20, empAmt:20, reject:'' },
  { staff:'GFE 20016', acct:'-', date:'2026-08-28', selfBal:10, selfAmt:0,  empBal:20, empAmt:0,  reject:'Redemption date is greater than current date' },
];

export default function ProvidentOperations({ fund }: { fund: Fund }) {
  const color = FUND_TYPE_COLORS[fund.type];
  const [section, setSection] = useState<Section>('schedule');
  const [imported, setImported] = useState(false);

  const members = MEMBER_CONTRIBUTIONS.filter(m => m.fundId === fund.id);
  const newCount = IMPORT_ROWS.filter(r => r.status === 'new').length;
  const rejCount = IMPORT_ROWS.filter(r => r.status === 'rejected').length;
  const okCount  = IMPORT_ROWS.filter(r => r.status === 'ok').length;

  const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id:'schedule',   label:'SCHEDULE IMPORT',   icon:<FileSpreadsheet size={11} /> },
    { id:'withdrawal', label:'WITHDRAWAL IMPORT', icon:<Upload size={11} /> },
    { id:'statement',  label:'EMPLOYER STATEMENT',icon:<FileText size={11} /> },
    { id:'balances',   label:'MEMBER BALANCES',   icon:<Users size={11} /> },
  ];

  return (
    <div className="space-y-4">
      <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="text-[9px] font-mono tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            PROVIDENT FUND OPERATIONS — {fund.shortName}
          </span>
          <span className="flex items-center gap-1 text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>
            <Globe size={9} /> EMPLOYER ONLINE ACCESS ENABLED
          </span>
        </div>
        <div className="flex flex-wrap gap-1 p-3">
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[8px] font-mono transition-all"
              style={section === s.id
                ? { background: color, color: '#fff', border: `1px solid ${color}` }
                : { border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              {s.icon}{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule import */}
      {section === 'schedule' && (
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[9px] font-mono" style={{ color }}>SCHEDULE IMPORT (EXCEL)</span>
            <select className="px-2 py-1 text-[8px] font-mono bg-transparent" style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}>
              <option style={{ background:'var(--bg)' }}>Monthly Schedule</option>
              <option style={{ background:'var(--bg)' }}>Quarterly Schedule</option>
              <option style={{ background:'var(--bg)' }}>Non-Scheduled</option>
            </select>
            <span className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>Contribution Month: 2026-05</span>
            <button onClick={() => setImported(true)}
              className="ml-auto flex items-center gap-1 px-3 py-1 text-[8px] font-mono" style={{ background: color, color: '#fff', border: `1px solid ${color}` }}>
              <Upload size={9} /> PROCESS IMPORT
            </button>
          </div>
          {/* Legend */}
          <div className="px-4 py-2 flex items-center gap-4 text-[7px] font-mono" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="flex items-center gap-1" style={{ color: '#ff66cc' }}><span className="w-2 h-2" style={{ background:'#ff66cc' }} /> New Account ({newCount})</span>
            <span className="flex items-center gap-1" style={{ color: 'var(--negative)' }}><span className="w-2 h-2" style={{ background:'var(--negative)' }} /> Rejected ({rejCount})</span>
            <span className="flex items-center gap-1" style={{ color: 'var(--positive)' }}><span className="w-2 h-2" style={{ background:'var(--positive)' }} /> Non-Restricted ({okCount})</span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[9px] font-mono">
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['STAFF ID','ACCT NO','SELF AMT','EMPLOYER AMT','CLIENT NAME','CNIC'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {IMPORT_ROWS.map(r => {
                  const c = r.status === 'new' ? '#ff66cc' : r.status === 'rejected' ? 'var(--negative)' : 'var(--fg)';
                  return (
                    <tr key={r.staff} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-3 py-2" style={{ color: c }}>{r.staff}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{r.acct}</td>
                      <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{r.self.toLocaleString()}</td>
                      <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{r.employer.toLocaleString()}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{r.name}</td>
                      <td className="px-3 py-2" style={{ color: 'var(--fg-muted)' }}>{r.cnic}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {imported && (
            <div className="mx-4 my-3 p-2 flex items-center gap-2" style={{ border: `1px solid ${color}`, background: `${color}08` }}>
              <CheckCircle size={11} style={{ color }} />
              <span className="text-[8px] font-mono" style={{ color }}>
                Import processed · {newCount} new account(s) auto-created · {okCount} posted · {rejCount} rejected
              </span>
            </div>
          )}
        </div>
      )}

      {/* Withdrawal / redemption import */}
      {section === 'withdrawal' && (
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3 flex flex-wrap items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[9px] font-mono" style={{ color }}>REDEMPTION / WITHDRAWAL IMPORT</span>
            <span className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>Cheque Type: Single For All Employees</span>
            <div className="ml-auto flex items-center gap-1 px-2 py-1 text-[8px] font-mono" style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)' }}>
              <FileSpreadsheet size={9} /> withdrawal_requests.xlsx
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[8px] font-mono">
              <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['STAFF ID','ACCT','REDEMPTION DATE','SELF BAL','SELF AMT','EMP BAL','EMP AMT','RESULT'].map(h => (
                  <th key={h} className="px-2 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {WITHDRAWAL_ROWS.map(r => (
                  <tr key={r.staff} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-2 py-2" style={{ color: 'var(--fg)' }}>{r.staff}</td>
                    <td className="px-2 py-2" style={{ color: 'var(--fg-muted)' }}>{r.acct}</td>
                    <td className="px-2 py-2" style={{ color: 'var(--fg-muted)' }}>{r.date}</td>
                    <td className="px-2 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{r.selfBal}</td>
                    <td className="px-2 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{r.selfAmt}</td>
                    <td className="px-2 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{r.empBal}</td>
                    <td className="px-2 py-2 tabular-nums" style={{ color: 'var(--fg)' }}>{r.empAmt}</td>
                    <td className="px-2 py-2">
                      {r.reject
                        ? <span className="flex items-center gap-1" style={{ color: 'var(--negative)' }}><XCircle size={9} /> {r.reject}</span>
                        : <span className="flex items-center gap-1" style={{ color: 'var(--positive)' }}><CheckCircle size={9} /> Accepted</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employer account statement */}
      {section === 'statement' && (
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-[9px] font-mono" style={{ color }}>EMPLOYER ACCOUNT STATEMENT — MAY 2026</span>
          </div>
          {members.length === 0 ? (
            <div className="px-4 py-6 text-center text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>No contribution records for this fund</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-[9px] font-mono">
                <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['MEMBER','EMPLOYER CONTRIB','EMPLOYEE CONTRIB','TOTAL','STATUS'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-normal" style={{ color: 'var(--fg-faint)' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.memberId} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="px-3 py-2" style={{ color: 'var(--fg)' }}>{m.memberName}</td>
                      <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{m.employerContrib.toLocaleString()}</td>
                      <td className="px-3 py-2 tabular-nums" style={{ color: 'var(--fg-muted)' }}>{m.employeeContrib.toLocaleString()}</td>
                      <td className="px-3 py-2 tabular-nums font-bold" style={{ color: 'var(--fg)' }}>{m.total.toLocaleString()}</td>
                      <td className="px-3 py-2"><span style={{ color: m.status === 'posted' ? 'var(--positive)' : '#ffaa00' }}>{m.status.toUpperCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Member balances */}
      {section === 'balances' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {members.map(m => {
            const bal = m.total * 14; // demo accumulated balance
            return (
              <div key={m.memberId} className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div className="text-[9px] font-mono font-bold mb-1" style={{ color: 'var(--fg)' }}>{m.memberName}</div>
                <div className="text-[7px] font-mono mb-3" style={{ color: 'var(--fg-faint)' }}>{m.employer} · {m.memberId}</div>
                <div className="text-[7px] font-mono" style={{ color: 'var(--fg-faint)' }}>ACCUMULATED BALANCE</div>
                <div className="text-base font-mono font-bold tabular-nums" style={{ color }}>TZS {bal.toLocaleString()}</div>
                <div className="flex justify-between mt-2 text-[7px] font-mono" style={{ color: 'var(--fg-muted)' }}>
                  <span>Employer: {(m.employerContrib*14).toLocaleString()}</span>
                  <span>Self: {(m.employeeContrib*14).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className="col-span-3 px-4 py-6 text-center text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>No members for this fund</div>
          )}
        </div>
      )}
    </div>
  );
}
