'use client';

import { createAuth } from './createAuth';

// Investment Management Solution — independent demo credentials & session
const { Provider, useAuth, demoCredentials } = createAuth('ims-session', {
  'fund.manager':  { password: 'ims2025',   user: { username: 'fund.manager',  name: 'Fund Manager',       role: 'Portfolio Mgr'  } },
  'transfer.agent':{ password: 'agent2025', user: { username: 'transfer.agent',name: 'Transfer Agent',     role: 'Transfer Agent' } },
  'registrar':     { password: 'reg2025',   user: { username: 'registrar',     name: 'Fund Registrar',     role: 'Registrar'      } },
  'dealer':        { password: 'deal2025',  user: { username: 'dealer',        name: 'Dealing Officer',    role: 'Dealer'         } },
});

export const IMSAuthProvider  = Provider;
export const useIMSAuth        = useAuth;
export const IMS_DEMO_CREDENTIALS = demoCredentials;
