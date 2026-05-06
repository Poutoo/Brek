"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      setError("Identifiants incorrects ou accès refusé.");
    } else {
      // Force refresh and redirect to dashboard
      router.push(`/${locale}/dashboard`);
      router.refresh();
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <ShieldCheck size={48} strokeWidth={1} style={{ marginBottom: "1rem", color: "var(--gold)" }} />
          <h1 className="admin-auth-title">Portail Sécurisé</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Accès réservé à l'équipe Brek Paris</p>
        </div>

        {error && (
          <div className="admin-auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form" noValidate>
          <div className="input-group">
            <input type="email" name="email" id="email" value={form.email}
              onChange={handleChange} className="input-field" placeholder=" " required
              autoComplete="email" />
            <label htmlFor="email" className="input-label">Email Professionnel</label>
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <input type={showPwd ? "text" : "password"} name="password" id="password"
              value={form.password} onChange={handleChange} className="input-field"
              placeholder=" " required autoComplete="current-password" />
            <label htmlFor="password" className="input-label">Mot de passe</label>
            <button type="button" className="auth-pwd-toggle"
              onClick={() => setShowPwd(!showPwd)}
              aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: "1rem", background: "#111" }}>
            {loading ? "Vérification…" : "Connexion au Dashboard"}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href={`/${locale}`} style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "underline" }}>Retour au site public</Link>
        </div>
      </div>

      <style jsx>{`
        .admin-auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: #000;
          color: #fff;
        }
        .admin-auth-card {
          width: 100%;
          max-width: 400px;
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 3rem 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .admin-auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .admin-auth-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 300;
          color: #fff;
          letter-spacing: 0.05em;
        }
        .admin-auth-error {
          background: rgba(200, 60, 60, 0.15);
          border: 1px solid rgba(200, 60, 60, 0.3);
          border-radius: 4px;
          padding: 0.875rem 1rem;
          font-size: 0.8125rem;
          color: #ff8080;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .input-group {
          position: relative;
        }
        .input-field {
          width: 100%;
          padding: 1.25rem 1rem 0.5rem;
          background: #000;
          border: 1px solid #333;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #fff;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--gold);
        }
        .input-label {
          position: absolute;
          left: 1rem;
          top: 1rem;
          font-size: 0.8125rem;
          color: #888;
          transition: all 0.2s;
          pointer-events: none;
        }
        .input-field:focus ~ .input-label,
        .input-field:not(:placeholder-shown) ~ .input-label {
          top: 0.35rem;
          font-size: 0.625rem;
          color: var(--gold);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .auth-pwd-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
        }
        .auth-pwd-toggle:hover {
          color: #fff;
        }
      `}</style>
    </div>
  );
}
