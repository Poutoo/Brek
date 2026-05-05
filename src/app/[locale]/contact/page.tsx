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
    { icon: <MapPin size={18} />, label: "Adresse", value: "12 rue de la Soie, 69001 Lyon, France" },
    { icon: <Phone size={18} />, label: "Téléphone", value: "+33 (0)4 72 XX XX XX" },
    { icon: <Mail size={18} />, label: "Email", value: "contact@brek.fr" },
    { icon: <Clock size={18} />, label: "Horaires", value: "Lun–Ven : 9h–18h" },
  ];

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-subtitle">Nous écrire</p>
          <h1 className="section-title">Nous contacter</h1>
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
            Notre équipe vous répond sous 48 heures ouvrées.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
          {/* Formulaire */}
          <div>
            {status === "success" ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "1rem", padding: "3rem", textAlign: "center",
                background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 4
              }}>
                <CheckCircle size={40} style={{ color: "#16a34a" }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400 }}>
                  Message envoyé !
                </h2>
                <p style={{ color: "var(--text-muted)" }}>
                  Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
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
                  style={{ alignSelf: "flex-start" }}>
                  {status === "loading" ? "Envoi…" : "Envoyer le message"}
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>

          {/* Infos */}
          <aside>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.5rem" }}>
              Nos coordonnées
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {infos.map((info) => (
                <div key={info.label} style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ color: "var(--gold)", marginTop: 2 }}>{info.icon}</span>
                  <div>
                    <p style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.25rem" }}>
                      {info.label}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
