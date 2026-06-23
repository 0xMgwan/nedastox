// ─── Role-based access control ──────────────────────────────────────────
// Maps each demo role to the functional areas it may use. The role labels
// match those defined in IMSAuth / BackOfficeAuth.

export type IMSInnerTab = 'overview' | 'unit_mgmt' | 'holders' | 'transactions' | 'contributions';

export interface IMSAccess {
  tabs:       IMSInnerTab[];
  canApprove: boolean;   // maker-checker: only checkers approve queued transactions
  scope:      string;    // human-readable scope shown in the UI
}

export const IMS_ACCESS: Record<string, IMSAccess> = {
  'Portfolio Mgr':  { tabs: ['overview', 'unit_mgmt', 'holders', 'transactions', 'contributions'], canApprove: true,  scope: 'Full access · approver (checker)' },
  'Dealer':         { tabs: ['overview', 'unit_mgmt'],                                              canApprove: false, scope: 'Dealing · order entry (maker)' },
  'Transfer Agent': { tabs: ['overview', 'unit_mgmt', 'transactions'],                              canApprove: false, scope: 'Transfers & redemptions (maker)' },
  'Registrar':      { tabs: ['overview', 'holders', 'contributions'],                               canApprove: false, scope: 'Unit register & KYC' },
};

export const IMS_ACCESS_FALLBACK: IMSAccess = {
  tabs: ['overview', 'unit_mgmt', 'holders', 'transactions', 'contributions'], canApprove: true, scope: 'Full access',
};

export function imsAccess(role?: string): IMSAccess {
  return (role && IMS_ACCESS[role]) || IMS_ACCESS_FALLBACK;
}

// ─── Back office ────────────────────────────────────────────────────────
export type BOTab = 'trades' | 'contract_notes' | 'fees' | 'settlement' | 'corporate' | 'reports' | 'audit';

export interface BOAccess {
  tabs:  BOTab[];
  scope: string;
}

export const BO_ACCESS: Record<string, BOAccess> = {
  'Sysadmin':   { tabs: ['trades', 'contract_notes', 'fees', 'settlement', 'corporate', 'reports', 'audit'], scope: 'Full access' },
  'Operations': { tabs: ['trades', 'contract_notes', 'fees'],                                                scope: 'Trade operations' },
  'Settlement': { tabs: ['settlement', 'contract_notes'],                                                    scope: 'Settlement & T+2' },
  'Compliance': { tabs: ['reports', 'audit'],                                                                scope: 'Compliance & audit' },
};

export const BO_ACCESS_FALLBACK: BOAccess = {
  tabs: ['trades', 'contract_notes', 'fees', 'settlement', 'corporate', 'reports', 'audit'], scope: 'Full access',
};

export function boAccess(role?: string): BOAccess {
  return (role && BO_ACCESS[role]) || BO_ACCESS_FALLBACK;
}
