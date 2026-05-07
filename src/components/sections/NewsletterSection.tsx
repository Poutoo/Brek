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
    <section className="py-24 relative overflow-hidden" aria-labelledby="newsletter-title">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--dark-brown)] to-[#2a1f1f]" aria-hidden="true" />
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-32 relative z-[1]">
        <div className="max-w-[600px] mx-auto text-center flex flex-col items-center gap-5 text-[var(--cream)]">
          <div className="w-[60px] h-[60px] border border-[var(--gold)]/30 rounded-full flex items-center justify-center text-[var(--gold)]" aria-hidden="true">
            <Mail size={28} />
          </div>
          <h2 id="newsletter-title" className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-light text-[var(--cream)] m-0 leading-tight">
            {t("newsletter_title")}
          </h2>
          <p className="text-[0.9375rem] text-[var(--cream)]/60 leading-relaxed m-0">
            {t("newsletter_subtitle")}
          </p>

          {status === "success" ? (
            <div className="flex items-center gap-3 py-4 px-6 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-[0.9375rem]" role="status">
              <CheckCircle size={20} />
              <span>{t("newsletter_success")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <div className="flex border border-[var(--gold)]/30 rounded-sm overflow-hidden group focus-within:border-[var(--gold)] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("newsletter_placeholder")}
                  className="flex-1 py-3.5 px-5 bg-[var(--cream)]/5 border-none outline-none text-[var(--cream)] font-body text-[0.9375rem] placeholder:text-[var(--cream)]/35"
                  required
                  aria-label="Votre adresse email pour la newsletter"
                  id="newsletter-email"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  className="bg-[var(--gold)] text-[var(--charcoal)] px-6 py-3.5 font-medium text-sm uppercase tracking-wider transition-all hover:bg-[var(--gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
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
                <p className="text-[0.75rem] text-red-400 m-0" role="alert">
                  Une erreur est survenue. Veuillez réessayer.
                </p>
              )}
              <p className="text-[0.6875rem] text-[var(--cream)]/35 leading-relaxed m-0">
                En vous inscrivant, vous acceptez notre{" "}
                <a href="/fr/confidentialite" className="text-[var(--gold)]/70 underline transition-colors hover:text-[var(--gold)]">
                  politique de confidentialité
                </a>
                . Vous pouvez vous désabonner à tout moment.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
