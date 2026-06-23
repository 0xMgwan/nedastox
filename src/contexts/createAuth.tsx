'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser {
  username: string;
  name:     string;
  role:     string;
}

export interface Credential {
  password: string;
  user:     AuthUser;
}

export interface DemoCredential {
  username: string;
  password: string;
  role:     string;
}

export interface AuthContextValue {
  user:   AuthUser | null;
  ready:  boolean;
  login:  (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

/**
 * Factory that produces an isolated auth Provider + hook backed by sessionStorage.
 * Each module (Back Office, IMS) gets its own storage key and credential set,
 * so their sessions are fully independent.
 */
export function createAuth(storageKey: string, validUsers: Record<string, Credential>) {
  const Context = createContext<AuthContextValue | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    const [user, setUser]   = useState<AuthUser | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      try {
        const raw = sessionStorage.getItem(storageKey);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
      } catch { /* ignore */ }
      setReady(true);
    }, []);

    function login(username: string, password: string) {
      const entry = validUsers[username.trim().toLowerCase()];
      if (!entry || entry.password !== password) {
        return { ok: false, error: 'Invalid username or password' };
      }
      setUser(entry.user);
      try { sessionStorage.setItem(storageKey, JSON.stringify(entry.user)); } catch { /* ignore */ }
      return { ok: true };
    }

    function logout() {
      setUser(null);
      try { sessionStorage.removeItem(storageKey); } catch { /* ignore */ }
    }

    return <Context.Provider value={{ user, ready, login, logout }}>{children}</Context.Provider>;
  }

  function useAuth() {
    const c = useContext(Context);
    if (!c) throw new Error('useAuth must be used within its Provider');
    return c;
  }

  const demoCredentials: DemoCredential[] = Object.entries(validUsers).map(([username, c]) => ({
    username,
    password: c.password,
    role:     c.user.role,
  }));

  return { Provider, useAuth, demoCredentials };
}
