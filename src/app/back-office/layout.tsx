'use client';

import { ReactNode } from 'react';
import { BackOfficeAuthProvider, useBackOfficeAuth, BO_DEMO_CREDENTIALS } from '@/contexts/BackOfficeAuth';
import AuthLogin from '@/components/auth/AuthLogin';

function Gate({ children }: { children: ReactNode }) {
  const { user, ready, login } = useBackOfficeAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-[10px] font-mono" style={{ color: 'var(--fg-dim)' }}>VERIFYING SESSION…</div>
      </div>
    );
  }

  if (!user) return (
    <AuthLogin
      title="BACK OFFICE"
      subtitle="FIMCO SECURITIES · DSE MEMBER · SECURE ACCESS"
      accent="#e10600"
      footerNote="CMSA LICENSED · CSD CONNECTED · SESSION ENCRYPTED"
      demoCredentials={BO_DEMO_CREDENTIALS}
      login={login}
    />
  );
  return <>{children}</>;
}

export default function BackOfficeLayout({ children }: { children: ReactNode }) {
  return (
    <BackOfficeAuthProvider>
      <Gate>{children}</Gate>
    </BackOfficeAuthProvider>
  );
}
