import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { FloatingParticles } from "@/components/BackgroundFx";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { login, signup } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const r = await login(form.email, form.password);
        if (!r.ok) { toast.error(r.error || "Login failed"); return; }
        toast.success("Welcome back!");
        nav({ to: "/dashboard" });
      } else if (mode === "signup") {
        if (form.password.length < 6) { toast.error("Password must be 6+ chars"); return; }
        const r = await signup(form.name, form.email, form.password);
        if (!r.ok) { toast.error(r.error || "Signup failed"); return; }
        toast.success("Account created! Welcome to NavYatra 🎉");
        nav({ to: "/dashboard" });
      } else {
        toast.success(`Reset link sent to ${form.email} (demo)`);
        setMode("login");
      }
    } finally { setBusy(false); }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-12">
      <FloatingParticles count={40} />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass animated-border relative w-full max-w-md overflow-hidden rounded-3xl p-8"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-saffron shadow-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === "login" && "Welcome back"}
            {mode === "signup" && "Begin your Yatra"}
            {mode === "forgot" && "Reset password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" && "Sign in to your NavYatra journey"}
            {mode === "signup" && "Create an account to unlock personalized India"}
            {mode === "forgot" && "We'll send you a reset link"}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <Field icon={UserIcon} placeholder="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          )}
          <Field icon={Mail} type="email" placeholder="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          {mode !== "forgot" && (
            <div className="relative">
              <Field icon={Lock} type={showPw ? "text" : "password"} placeholder="Password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[var(--primary)]" />
                Remember me
              </label>
              <button type="button" onClick={() => setMode("forgot")} className="text-[var(--teal-glow)] hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full rounded-xl bg-gradient-primary py-3 font-semibold text-white shadow-lg glow transition hover:scale-[1.02] disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>

          {mode !== "forgot" && (
            <>
              <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
              </div>
              <button
                type="button"
                onClick={() => toast.info("Google login is a demo in this build")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white/5 py-3 font-medium transition hover:bg-white/10"
              >
                <GoogleIcon /> Continue with Google
              </button>
            </>
          )}

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "login" && (
              <>Don't have an account? <button type="button" onClick={() => setMode("signup")} className="font-semibold text-[var(--teal-glow)] hover:underline">Sign up</button></>
            )}
            {mode === "signup" && (
              <>Already registered? <button type="button" onClick={() => setMode("login")} className="font-semibold text-[var(--teal-glow)] hover:underline">Sign in</button></>
            )}
            {mode === "forgot" && (
              <button type="button" onClick={() => setMode("login")} className="text-[var(--teal-glow)] hover:underline">← Back to sign in</button>
            )}
          </p>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        {...props}
        className="w-full rounded-xl border border-border bg-white/5 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--primary)] focus:bg-white/10"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.7 14.97.7 12 .7 7.7.7 3.99 3.16 2.18 6.71l3.66 2.84C6.71 6.86 9.13 5.04 12 5.04z"/>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.4-1.09 2.59-2.32 3.39l3.57 2.77c2.08-1.92 3.28-4.74 3.28-8.4z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.24-.7-.37-1.44-.37-2.19s.13-1.49.37-2.19L2.18 6.87C1.43 8.37 1 10.13 1 12s.43 3.63 1.18 5.13l3.66-3.04z"/>
      <path fill="#34A853" d="M12 23.3c3.13 0 5.76-1.04 7.68-2.82l-3.57-2.77c-.99.67-2.26 1.05-4.11 1.05-2.87 0-5.29-1.82-6.16-4.51l-3.66 2.84C3.99 20.84 7.7 23.3 12 23.3z"/>
    </svg>
  );
}
