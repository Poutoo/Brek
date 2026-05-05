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
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <Link href={`/${locale}`} className="auth-logo">BREK <small>PARIS</small></Link>
          <h1 className="auth-title">
            {mode === "login" ? t("login_title") : t("register_title")}
          </h1>
        </div>

        {/* Erreur */}
        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="auth-form" noValidate>
          {mode === "register" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
              <div className="input-group">
                <input type="text" name="firstName" id="firstName" value={form.firstName}
                  onChange={handleChange} className="input-field" placeholder=" " required />
                <label htmlFor="firstName" className="input-label">{t("first_name")}</label>
              </div>
              <div className="input-group">
                <input type="text" name="lastName" id="lastName" value={form.lastName}
                  onChange={handleChange} className="input-field" placeholder=" " required />
                <label htmlFor="lastName" className="input-label">{t("last_name")}</label>
              </div>
            </div>
          )}

          <div className="input-group">
            <input type="email" name="email" id="email" value={form.email}
              onChange={handleChange} className="input-field" placeholder=" " required
              autoComplete="email" />
            <label htmlFor="email" className="input-label">{t("email")}</label>
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <input type={showPwd ? "text" : "password"} name="password" id="password"
              value={form.password} onChange={handleChange} className="input-field"
              placeholder=" " required autoComplete={mode === "login" ? "current-password" : "new-password"} />
            <label htmlFor="password" className="input-label">{t("password")}</label>
            <button type="button" className="auth-pwd-toggle"
              onClick={() => setShowPwd(!showPwd)}
              aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {mode === "register" && (
            <div className="input-group">
              <input type="password" name="confirmPassword" id="confirmPassword"
                value={form.confirmPassword} onChange={handleChange} className="input-field"
                placeholder=" " required autoComplete="new-password" />
              <label htmlFor="confirmPassword" className="input-label">{t("confirm_password")}</label>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}>
            {loading ? "Chargement…" : (mode === "login" ? t("login_cta") : t("register_cta"))}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        {/* Switch mode */}
        <p className="auth-switch">
          {mode === "login" ? (
            <>
              {t("no_account")}{" "}
              <Link href={`/${locale}/inscription`} className="auth-switch-link">
                {t("register_cta")}
              </Link>
            </>
          ) : (
            <>
              {t("already_account")}{" "}
              <Link href={`/${locale}/connexion`} className="auth-switch-link">
                {t("login_cta")}
              </Link>
            </>
          )}
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: calc(100vh - var(--nav-height));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: var(--bg-secondary);
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--bg-card);
          border: 1px solid var(--divider);
          border-radius: 4px;
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-logo {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: var(--text);
          margin-bottom: 1.5rem;
        }
        .auth-logo small {
          font-size: 0.45rem;
          letter-spacing: 0.35em;
          color: var(--gold);
          margin-top: 2px;
          font-style: normal;
          font-family: var(--font-body);
        }
        .auth-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 400;
          color: var(--text);
        }
        .auth-error {
          background: rgba(200, 60, 60, 0.08);
          border: 1px solid rgba(200, 60, 60, 0.2);
          border-radius: 4px;
          padding: 0.75rem 1rem;
          font-size: 0.8125rem;
          color: #c83c3c;
          margin-bottom: 1.25rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-pwd-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
        }
        .auth-switch {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-top: 1.5rem;
        }
        .auth-switch-link {
          color: var(--gold);
          font-weight: 500;
        }
        .auth-switch-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
