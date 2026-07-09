import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = { id: string; name: string; email: string; avatar?: string };

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
};

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "navyatra_users";
const SESSION_KEY = "navyatra_session";

type StoredUser = User & { password: string };

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function writeUsers(u: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    const users = readUsers();
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return { ok: false, error: "Invalid credentials" };
    const session: User = { id: u.id, name: u.name, email: u.email, avatar: u.avatar };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const signup: AuthCtx["signup"] = async (name, email, password) => {
    const users = readUsers();
    if (users.some((x) => x.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: "Email already registered" };
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name, email, password,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
    };
    writeUsers([...users, newUser]);
    const session: User = { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, signup, logout, loading }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
