import { Link, useRouter } from "@tanstack/react-router";
import { Menu, Moon, Sun, User, X, Compass, Sparkles, Map, BarChart3, Info, Home } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/states", label: "States", icon: Map },
  { to: "/recommendation", label: "Recommend", icon: Sparkles },
  { to: "/assistant", label: "Bharat Guide", icon: Sparkles },
  { to: "/about", label: "About", icon: Info },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-saffron shadow-lg">
            <span className="text-lg font-bold text-white">न</span>
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold tracking-tight text-gradient-saffron">NavYatra</div>
            <div className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">Know Your India</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
              activeProps={{ className: "bg-white/15 text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 transition hover:bg-white/20"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.span key="s" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Sun className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Moon className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/profile" className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 hover:bg-white/20">
                <img src={user.avatar} alt="" className="h-6 w-6 rounded-full" />
                <span className="text-sm">{user.name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={() => { logout(); router.navigate({ to: "/" }); }}
                className="rounded-xl px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-lg glow md:inline-flex">
              <User className="mr-1.5 h-4 w-4" /> Sign In
            </Link>
          )}

          <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl p-2 lg:hidden"
          >
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/10"
              >
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            ))}
            {!user && (
              <Link to="/auth" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2.5 text-sm font-medium text-white">
                Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
