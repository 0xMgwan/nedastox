'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Slice { name: string; value: number; color: string; }

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-2 py-1.5 text-[9px] font-mono" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--fg-muted)' }}>{payload[0].name}</div>
      <div className="font-bold" style={{ color: 'var(--fg)' }}>{payload[0].value.toFixed(1)}%</div>
    </div>
  );
}

export default function AllocationChart({ data, title, centerLabel }: {
  data: Slice[];
  title: string;
  centerLabel?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="p-4" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="text-[9px] font-mono tracking-wider mb-4" style={{ color: 'var(--fg-dim)' }}>{title}</div>
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={56}
                paddingAngle={2} dataKey="value" strokeWidth={0}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {centerLabel && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[7px] font-mono" style={{ color: 'var(--fg-dim)' }}>TOTAL</div>
              <div className="text-[10px] font-mono font-bold" style={{ color: 'var(--fg)' }}>{centerLabel}</div>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          {data.map((slice, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 flex-shrink-0" style={{ background: slice.color }} />
                <span className="text-[9px] font-mono truncate max-w-[100px]" style={{ color: 'var(--fg-muted)' }}>
                  {slice.name}
                </span>
              </div>
              <span className="text-[9px] font-mono tabular-nums" style={{ color: 'var(--fg)' }}>
                {((slice.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
