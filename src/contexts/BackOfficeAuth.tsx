'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface BOUser {
  username: string;
  name:     string;
  role:     string;
}

// Demo credentials — in production these would be validated server-side
const VALID_USERS: Record<string, { password: string; user: BOUser }> = {
  'admin': {
    password: 'fimco2025',
    user: { username: 'admin', name: 'System Administrator', role: 'Sysadmin' },
  },
  'ops.officer': {
    password: 'ops2025',
    user: { username: 'ops.officer', name: 'Operations Officer', role: 'Operations' },
  },
  'settlement': {
    password: 'settle2025',
    user: { username: 'settlement', name: 'Settlement Clerk', role: 'Settlement' },
  },
  'compliance': {
    password: 'comply2025',
    user: { username: 'compliance', name: 'Compliance Officer', role: 'Compliance' },
  },
};

interface BOAuthCtx {
  user:    BOUser | null;
  ready:   boolean;
  login:   (username: string, password: string) => { ok: boolean; error?: string };
  logout:  () => void;
}

const Ctx = createContext<BOAuthCtx | null>(null);
const STORAGE_KEY = 'bo-session';

export function BackOfficeAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<BOUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as BOUser);
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  function login(username: string, password: string) {
    const entry = VALID_USERS[username.trim().toLowerCase()];
    if (!entry || entry.password !== password) {
      return { ok: false, error: 'Invalid username or password' };
    }
    setUser(entry.user);
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user)); } catch { /* ignore */ }
    return { ok: true };
  }

  function logout() {
    setUser(null);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  return <Ctx.Provider value={{ user, ready, login, logout }}>{children}</Ctx.Provider>;
}

export function useBackOfficeAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useBackOfficeAuth must be used within BackOfficeAuthProvider');
  return c;
}
