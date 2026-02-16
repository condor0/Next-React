import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type AuthContextValue = {
  isAuthed: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);

  const login = useCallback(() => setIsAuthed(true), []);
  const logout = useCallback(() => setIsAuthed(false), []);

  const value = useMemo(() => ({ isAuthed, login, logout }), [isAuthed, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}