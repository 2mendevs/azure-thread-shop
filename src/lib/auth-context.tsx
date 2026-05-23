import { createContext, useContext, type ReactNode } from "react";
import { setLocal, uid, useLocal } from "./local-db";

export type LocalUser = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextValue = {
  user: LocalUser | null;
  loading: boolean;
  signIn: (email: string, name?: string) => LocalUser;
  signOut: () => Promise<void>;
};

const KEY = "2mendevs.user";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useLocal<LocalUser | null>(KEY, null);

  const signIn = (email: string, name?: string): LocalUser => {
    const u: LocalUser = {
      id: uid("user"),
      email: email.trim().toLowerCase(),
      name: name?.trim() || email.split("@")[0],
    };
    setLocal<LocalUser | null>(KEY, u);
    return u;
  };

  const signOut = async () => {
    setLocal<LocalUser | null>(KEY, null);
  };

  return (
    <AuthContext.Provider value={{ user, loading: false, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
