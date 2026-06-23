'use client';

import { ReactNode } from 'react';
import { IMSAuthProvider, useIMSAuth, IMS_DEMO_CREDENTIALS } from '@/contexts/IMSAuth';
import AuthLogin from '@/components/auth/AuthLogin';

function Gate({ children }: { children: ReactNode }) {
  const { user, ready, login } = useIMSAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-[10px] font-mono" style={{ color: 'var(--fg-dim)' }}>VERIFYING SESSION…</div>
      </div>
    );
  }

  if (!user) return (
    <AuthLogin
      title="ASSETCONNECT IMS"
      subtitle="INVESTMENT MANAGEMENT · FUND OPERATIONS · SECURE ACCESS"
      accent="#e10600"
      footerNote="IAS 39 COMPLIANT · CMSA REGULATED · SESSION ENCRYPTED"
      demoCredentials={IMS_DEMO_CREDENTIALS}
      login={login}
    />
  );
  return <>{children}</>;
}

export default function FundsLayout({ children }: { children: ReactNode }) {
  return (
    <IMSAuthProvider>
      <Gate>{children}</Gate>
    </IMSAuthProvider>
  );
}
