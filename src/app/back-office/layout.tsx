'use client';

import { ReactNode } from 'react';
import { BackOfficeAuthProvider, useBackOfficeAuth } from '@/contexts/BackOfficeAuth';
import BackOfficeLogin from '@/components/backoffice/BackOfficeLogin';

function Gate({ children }: { children: ReactNode }) {
  const { user, ready } = useBackOfficeAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-[10px] font-mono" style={{ color: 'var(--fg-dim)' }}>VERIFYING SESSION…</div>
      </div>
    );
  }

  if (!user) return <BackOfficeLogin />;
  return <>{children}</>;
}

export default function BackOfficeLayout({ children }: { children: ReactNode }) {
  return (
    <BackOfficeAuthProvider>
      <Gate>{children}</Gate>
    </BackOfficeAuthProvider>
  );
}
