"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  const infos = [
    { icon: <MapPin size={18} />, label: "Adresse", value: "12 rue de la Soie, 75011 Paris, France" },
    { icon: <Phone size={18} />, label: "Téléphone", value: "+33 (0)4 72 XX XX XX" },
    { icon: <Mail size={18} />, label: "Email", value: "contact@brek.fr" },
    { icon: <Clock size={18} />, label: "Horaires", value: "Lun–Ven : 9h–18h" },
  ];

  return (
    <div style={{ paddingTop: "6rem", paddingBottom: "8rem" }}>
      <div className="container-brek">
        <div className="contact-grid">
          {/* GAUCHE : Intro + Formulaire */}
          <div className="contact-left">
            <div style={{ marginBottom: "3rem" }}>
              <p className="section-subtitle">Nous écrire</p>
              <h1 className="section-title">Nous contacter</h1>
              <p style={{ marginTop: "1rem", color: "var(--text-muted)", maxWidth: "480px" }}>
                Notre équipe vous répond sous 48 heures ouvrées pour toute question concernant nos collections ou un projet sur-mesure.
              </p>
            </div>

            {status === "success" ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "1rem", padding: "4rem 2rem", textAlign: "center",
                background: "rgba(34,197,94,0.03)", border: "1px solid rgba(83,59,59,0.1)", borderRadius: 0
              }}>
                <CheckCircle size={40} style={{ color: "var(--gold)" }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400 }}>
                  Message envoyé !
                </h2>
                <p style={{ color: "var(--text-muted)" }}>
                  Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="input-group">
                    <input type="text" id="contact-name" name="name" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field" placeholder=" " required />
                    <label htmlFor="contact-name" className="input-label">Nom complet</label>
                  </div>
                  <div className="input-group">
                    <input type="email" id="contact-email" name="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field" placeholder=" " required />
                    <label htmlFor="contact-email" className="input-label">Email</label>
                  </div>
                </div>
                <div className="input-group">
                  <input type="text" id="contact-subject" name="subject" value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-field" placeholder=" " required />
                  <label htmlFor="contact-subject" className="input-label">Sujet</label>
                </div>
                <div className="input-group">
                  <textarea id="contact-message" name="message" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field" placeholder=" " required rows={6}
                    style={{ resize: "vertical", paddingTop: "1.5rem", height: "auto" }} />
                  <label htmlFor="contact-message" className="input-label">Message</label>
                </div>
                {status === "error" && (
                  <p style={{ color: "#c83c3c", fontSize: "0.8125rem" }} role="alert">
                    Une erreur est survenue. Veuillez réessayer.
                  </p>
                )}
                <button type="submit" className="btn btn-primary" disabled={status === "loading"}
                  style={{ alignSelf: "flex-start", marginTop: "1rem" }}>
                  <span>{status === "loading" ? "Envoi…" : "Envoyer le message"}</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>

          {/* DROITE : Infos */}
          <aside className="contact-right">
            <div className="contact-info-card">
              <h2 className="contact-info-title">
                Nos coordonnées
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {infos.map((info) => (
                  <div key={info.label} style={{ display: "flex", gap: "1.5rem" }}>
                    <span style={{ color: "var(--gold)", marginTop: 4 }}>{info.icon}</span>
                    <div>
                      <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem", fontWeight: 600 }}>
                        {info.label}
                      </p>
                      <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6 }}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-divider" />

              <div className="contact-extra">
                <p>Suivez-nous sur les réseaux sociaux pour découvrir nos dernières collections et actualités.</p>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  {/* Liens réseaux sociaux si besoin */}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: flex-start;
        }
        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1.5fr 1fr;
            gap: 8rem;
          }
        }
        .contact-right {
          position: sticky;
          top: calc(var(--nav-height) + 2rem);
        }
        .contact-info-card {
          border-radius: 0.5rem;
        }
        .contact-info-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 400;
          margin-bottom: 3rem;
          color: var(--text);
          letter-spacing: 0.02em;
        }
        .contact-divider {
          height: 1px;
          background: #e5e1da;
          margin: 3rem 0;
        }
        .contact-extra {
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
