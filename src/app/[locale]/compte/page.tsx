"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Package, Heart, LogOut, Settings } from "lucide-react";

export default function ComptePage({ params }: { params: Promise<{ locale: string }> }) {
  const { data: session } = useSession();
  const [locale, setLocale] = useState("fr");
  const [profile, setProfile] = useState<{ name?: string; email?: string; firstName?: string; lastName?: string; phone?: string; createdAt?: string } | null>(null);

  useEffect(() => { params.then((p) => setLocale(p.locale)); }, [params]);
  useEffect(() => {
    fetch("/api/auth/register").then((r) => r.json()).then((d) => setProfile(d.user));
  }, []);

  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "2.5rem" }}>Mon compte</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          {/* Profil */}
          <section style={{ border: "1px solid var(--divider)", borderRadius: 4, padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-secondary)", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                <User size={28} />
              </div>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400 }}>{profile?.name || session?.user?.name || "—"}</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{profile?.email || session?.user?.email}</p>
                {isAdmin && <span className="badge badge-gold" style={{ marginTop: 4 }}>Administrateur</span>}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem" }}>
              {[["Prénom", profile?.firstName], ["Nom", profile?.lastName], ["Email", profile?.email], ["Membre depuis", profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "—"]].map(([label, value]) => (
                <div key={label as string}>
                  <p style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.25rem", fontFamily: "var(--font-body)" }}>{label}</p>
                  <p style={{ color: "var(--text-muted)" }}>{value || "—"}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation rapide */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { icon: <Package size={20} />, label: "Mes commandes", href: `/${locale}/commandes`, desc: "Suivre & gérer" },
              { icon: <Heart size={20} />, label: "Mes favoris", href: `/${locale}/favoris`, desc: "Wishlist" },
              ...(isAdmin ? [{ icon: <Settings size={20} />, label: "Administration", href: `/${locale}/admin`, desc: "Dashboard admin" }] : []),
            ].map((item) => (
              <Link key={item.label} href={item.href} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.25rem", border: "1px solid var(--divider)", borderRadius: 4, color: "var(--text)", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--divider)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <span style={{ color: "var(--gold)" }}>{item.icon}</span>
                <div>
                  <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{item.label}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </section>

          <button className="btn btn-secondary" style={{ alignSelf: "flex-start" }}
            onClick={() => signOut({ callbackUrl: `/${locale}` })} id="logout-btn" aria-label="Se déconnecter">
            <LogOut size={16} /> Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
