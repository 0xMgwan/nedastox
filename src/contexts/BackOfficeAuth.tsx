'use client';

import { createAuth } from './createAuth';

// Demo credentials — in production these would be validated server-side
const { Provider, useAuth, demoCredentials } = createAuth('bo-session', {
  'admin':       { password: 'fimco2025',  user: { username: 'admin',       name: 'System Administrator', role: 'Sysadmin'   } },
  'ops.officer': { password: 'ops2025',    user: { username: 'ops.officer', name: 'Operations Officer',   role: 'Operations' } },
  'settlement':  { password: 'settle2025', user: { username: 'settlement',  name: 'Settlement Clerk',     role: 'Settlement' } },
  'compliance':  { password: 'comply2025', user: { username: 'compliance',  name: 'Compliance Officer',   role: 'Compliance' } },
});

export const BackOfficeAuthProvider = Provider;
export const useBackOfficeAuth      = useAuth;
export const BO_DEMO_CREDENTIALS    = demoCredentials;
