"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

interface NewsletterSectionProps {
  locale: string;
}

export function NewsletterSection({ locale: _locale }: NewsletterSectionProps) {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="newsletter-bg" aria-hidden="true" />
      <div className="container-brek" style={{ position: "relative", zIndex: 1 }}>
        <div className="newsletter-content">
          <div className="newsletter-icon" aria-hidden="true">
            <Mail size={28} />
          </div>
          <h2 id="newsletter-title" className="newsletter-title">
            {t("newsletter_title")}
          </h2>
          <p className="newsletter-subtitle">{t("newsletter_subtitle")}</p>

          {status === "success" ? (
            <div className="newsletter-success" role="status">
              <CheckCircle size={20} />
              <span>{t("newsletter_success")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="newsletter-input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter_placeholder")}
                  className="newsletter-input"
                  required
                  aria-label="Votre adresse email pour la newsletter"
                  id="newsletter-email"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  className="btn btn-primary newsletter-btn"
                  disabled={status === "loading" || !email}
                  aria-label={t("newsletter_cta")}
                >
                  {status === "loading" ? (
                    "…"
                  ) : (
                    <>
                      {t("newsletter_cta")}
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
              {status === "error" && (
                <p className="newsletter-error" role="alert">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
              <p className="newsletter-legal">
                En vous inscrivant, vous acceptez notre{" "}
                <a href="/fr/confidentialite" className="newsletter-legal-link">
                  politique de confidentialité
                </a>
                . Vous pouvez vous désabonner à tout moment.
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .newsletter-section {
          padding: 6rem 0;
          position: relative;
          overflow: hidden;
        }
        .newsletter-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--dark-brown) 0%, #2a1f1f 100%);
        }
        .newsletter-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          color: var(--cream);
        }
        .newsletter-icon {
          width: 60px;
          height: 60px;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
        }
        .newsletter-title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 300;
          color: var(--cream);
          margin: 0;
        }
        .newsletter-subtitle {
          font-size: 0.9375rem;
          color: rgba(255,253,247,0.6);
          line-height: 1.6;
        }
        .newsletter-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .newsletter-input-wrapper {
          display: flex;
          gap: 0;
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 2px;
          overflow: hidden;
        }
        .newsletter-input {
          flex: 1;
          padding: 0.875rem 1.25rem;
          background: rgba(255,253,247,0.05);
          border: none;
          outline: none;
          color: var(--cream);
          font-family: var(--font-body);
          font-size: 0.9375rem;
        }
        .newsletter-input::placeholder { color: rgba(255,253,247,0.35); }
        .newsletter-btn {
          border-radius: 0;
          white-space: nowrap;
        }
        .newsletter-error {
          font-size: 0.75rem;
          color: #f87171;
        }
        .newsletter-legal {
          font-size: 0.6875rem;
          color: rgba(255,253,247,0.35);
          line-height: 1.5;
        }
        .newsletter-legal-link {
          color: rgba(201,168,76,0.7);
          text-decoration: underline;
        }
        .newsletter-success {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 4px;
          color: #86efac;
          font-size: 0.9375rem;
        }
      `}</style>
    </section>
  );
}
