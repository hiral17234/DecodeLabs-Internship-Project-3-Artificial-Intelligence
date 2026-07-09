import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const KEY = "navyatra_wishlist";
const Ctx = createContext<{
  wishlist: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
} | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setWishlist(JSON.parse(raw));
    } catch {}
  }, []);
  const persist = (v: string[]) => {
    setWishlist(v);
    localStorage.setItem(KEY, JSON.stringify(v));
  };
  const toggle = (id: string) => {
    persist(wishlist.includes(id) ? wishlist.filter((x) => x !== id) : [...wishlist, id]);
  };
  const has = (id: string) => wishlist.includes(id);
  return <Ctx.Provider value={{ wishlist, toggle, has }}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useWishlist inside provider");
  return c;
}
