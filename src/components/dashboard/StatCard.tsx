'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label:     string;
  value:     string;
  sub?:      string;
  subColor?: 'green' | 'red' | 'muted';
  icon?:     LucideIcon;
  index?:    number;
}

export default function StatCard({ label, value, sub, subColor = 'muted', icon: Icon, index = 0 }: StatCardProps) {
  const subStyle: React.CSSProperties =
    subColor === 'green' ? { color: 'var(--positive)' } :
    subColor === 'red'   ? { color: 'var(--negative)' } :
                           { color: 'var(--fg-dim)' };

  return (
    <div
      className="relative p-4 transition-all group cursor-default"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card)')}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: 'var(--fg-dim)' }}>
          {label}
        </span>
        <span className="text-[9px] font-mono" style={{ color: 'var(--fg-faint)' }}>
          0{index + 1}
        </span>
      </div>
      <div className="text-xl font-mono font-bold tracking-tight mb-1" style={{ color: 'var(--fg)' }}>
        {value}
      </div>
      {sub && (
        <div className="text-[9px] font-mono" style={subStyle}>{sub}</div>
      )}
      {Icon && (
        <Icon
          size={10}
          className="absolute bottom-3 right-3 transition-colors"
          style={{ color: 'var(--fg-faint)' }}
        />
      )}
    </div>
  );
}
