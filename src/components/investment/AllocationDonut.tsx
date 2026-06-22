'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Fund } from '@/data/funds-data';

function Tip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="px-3 py-2 text-[9px] font-mono" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div style={{ color: p.payload.color }}>{p.name}</div>
      <div className="font-bold" style={{ color: 'var(--fg)' }}>{p.value}%</div>
    </div>
  );
}

export default function AllocationDonut({ fund }: { fund: Fund }) {
  return (
    <div className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="text-[9px] font-mono tracking-wider mb-4" style={{ color: 'var(--fg-dim)' }}>
        PORTFOLIO ALLOCATION — {fund.shortName}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={fund.allocation} dataKey="pct" innerRadius={28} outerRadius={52} stroke="none">
                {fund.allocation.map((a, i) => <Cell key={i} fill={a.color} />)}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {fund.allocation.map((a, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ background: a.color }} />
                <span className="text-[9px] font-mono" style={{ color: 'var(--fg-muted)' }}>{a.asset}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1" style={{ background: 'var(--border)' }}>
                  <div className="h-full" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
                <span className="text-[9px] font-mono w-8 text-right" style={{ color: 'var(--fg)' }}>{a.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="text-[8px] font-mono" style={{ color: 'var(--fg-faint)' }}>BENCHMARK</div>
        <div className="text-[8px] font-mono text-right" style={{ color: 'var(--fg-dim)' }}>{fund.benchmark}</div>
      </div>
    </div>
  );
}
