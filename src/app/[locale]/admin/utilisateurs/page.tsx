import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Shield, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const { locale } = await params;

  if (!session || !isAdmin) redirect(`/${locale}/connexion`);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } }
  });

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ marginBottom: "2.5rem" }}>
          <Link href={`/${locale}/admin`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: "0.5rem" }}>
            ← Retour au Dashboard
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Utilisateurs</h1>
        </div>

        <div style={{ border: "1px solid var(--divider)", borderRadius: 4, overflow: "hidden", background: "var(--bg-card)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--divider)" }}>
                <th style={{ padding: "1rem", textAlign: "left" }}>Utilisateur</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>Rôle</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>Commandes</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Inscrit le</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--divider)" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", color: "var(--charcoal)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "0.75rem" }}>
                        {(u.firstName?.[0] || u.name?.[0] || "U").toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Mail size={14} /> {u.email}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    {u.role === "ADMIN" ? (
                      <span className="badge badge-gold" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <Shield size={10} /> Admin
                      </span>
                    ) : (
                      <span className="badge">User</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>{u._count.orders}</td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Calendar size={14} /> {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: fr })}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button className="btn btn-ghost btn-sm">Gérer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
