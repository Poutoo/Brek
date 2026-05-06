import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail, MailOpen, User, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminMessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const { locale } = await params;

  if (!session || !isAdmin) redirect(`/${locale}/connexion`);

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ marginBottom: "2.5rem" }}>
          <Link href={`/${locale}/admin`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: "0.5rem" }}>
            ← Retour au Dashboard
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Messages de contact</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-secondary)", borderRadius: 4 }}>
              <Mail size={48} style={{ color: "var(--divider)", marginBottom: "1rem" }} />
              <p style={{ color: "var(--text-muted)" }}>Aucun message reçu pour le moment.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className="card" 
                style={{ 
                  padding: "1.5rem", 
                  borderLeft: `4px solid ${msg.read ? "var(--divider)" : "var(--gold)"}`,
                  background: msg.read ? "var(--bg-card)" : "color-mix(in srgb, var(--gold) 5%, var(--bg-card))"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>
                      <User size={16} style={{ color: "var(--gold)" }} /> {msg.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      <Mail size={16} /> {msg.email}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                      <Calendar size={16} /> {format(new Date(msg.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-ghost btn-sm" title={msg.read ? "Marquer comme non lu" : "Marquer comme lu"}>
                      {msg.read ? <Mail size={16} /> : <MailOpen size={16} />}
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }} title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: 2, fontSize: "0.9375rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem", color: "var(--gold)" }}>Objet : {msg.subject}</p>
                  {msg.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
