"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

interface AuthFormProps {
  locale: string;
  mode: "login" | "register";
}

export function AuthForm({ locale, mode }: AuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(t("error_invalid"));
    } else {
      router.push(`/${locale}`);
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("error_exists"));
      } else {
        // Auto-login après inscription
        await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        router.push(`/${locale}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--nav-height))] flex items-center justify-center py-8 px-4 bg-[var(--bg-secondary)]">
      <div className="w-full max-w-[440px] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm p-10 shadow-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex flex-col items-center font-serif text-[1.25rem] font-semibold tracking-[0.2em] text-[var(--text)] mb-6 no-underline">
            BREK 
            <small className="text-[0.45rem] tracking-[0.35em] text-[var(--gold)] mt-0.5 font-normal font-body italic-none">
              PARIS
            </small>
          </Link>
          <h1 className="font-serif text-[1.75rem] font-normal text-[var(--text)] m-0">
            {mode === "login" ? t("login_title") : t("register_title")}
          </h1>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-sm py-3 px-4 text-[0.8125rem] text-red-600 mb-5" role="alert">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="flex flex-col gap-4" noValidate>
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-3.5">
              <div className="relative">
                <input 
                  type="text" name="firstName" id="firstName" value={form.firstName}
                  onChange={handleChange} 
                  className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent" 
                  placeholder=" " required 
                />
                <label htmlFor="firstName" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
                  {t("first_name")}
                </label>
              </div>
              <div className="relative">
                <input 
                  type="text" name="lastName" id="lastName" value={form.lastName}
                  onChange={handleChange} 
                  className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent" 
                  placeholder=" " required 
                />
                <label htmlFor="lastName" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
                  {t("last_name")}
                </label>
              </div>
            </div>
          )}

          <div className="relative">
            <input 
              type="email" name="email" id="email" value={form.email}
              onChange={handleChange} 
              className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent" 
              placeholder=" " required
              autoComplete="email" 
            />
            <label htmlFor="email" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
              {t("email")}
            </label>
          </div>

          <div className="relative">
            <input 
              type={showPwd ? "text" : "password"} name="password" id="password"
              value={form.password} onChange={handleChange} 
              className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
              placeholder=" " required autoComplete={mode === "login" ? "current-password" : "new-password"} 
            />
            <label htmlFor="password" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
              {t("password")}
            </label>
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center justify-center p-1"
              onClick={() => setShowPwd(!showPwd)}
              aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {mode === "register" && (
            <div className="relative">
              <input 
                type="password" name="confirmPassword" id="confirmPassword"
                value={form.confirmPassword} onChange={handleChange} 
                className="w-full px-4 pt-4 pb-2 font-body text-[0.9375rem] bg-[var(--bg-card)] border border-[var(--divider)] rounded-sm outline-none transition-colors duration-200 focus:border-[var(--gold)] peer placeholder:text-transparent"
                placeholder=" " required autoComplete="new-password" 
              />
              <label htmlFor="confirmPassword" className="absolute top-1/2 left-4 -translate-y-1/2 text-sm text-[var(--text-muted)] pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-[var(--gold)] peer-focus:tracking-wider peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-[var(--gold)] peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:uppercase">
                {t("confirm_password")}
              </label>
            </div>
          )}

          <button type="submit" className="bg-[var(--gold)] text-white w-full py-4 px-6 font-bold text-[0.8125rem] tracking-widest uppercase transition-all hover:bg-[var(--gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 rounded-sm" disabled={loading}>
            {loading ? "Chargement…" : (mode === "login" ? t("login_cta") : t("register_cta"))}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-[0.8125rem] text-[var(--text-muted)] mt-6">
          {mode === "login" ? (
            <>
              {t("no_account")}{" "}
              <Link href={`/${locale}/inscription`} className="text-[var(--gold)] font-medium hover:underline">
                {t("register_cta")}
              </Link>
            </>
          ) : (
            <>
              {t("already_account")}{" "}
              <Link href={`/${locale}/connexion`} className="text-[var(--gold)] font-medium hover:underline">
                {t("login_cta")}
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
