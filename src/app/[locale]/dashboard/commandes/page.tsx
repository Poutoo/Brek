import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search, Eye, Filter } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function AdminOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const { locale } = await params;

  if (!session || !isAdmin) redirect(`/${locale}/connexion`);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { 
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } }
    },
  });

  const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PROCESSING: "En préparation",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "var(--text-muted)",
    CONFIRMED: "var(--gold)",
    PROCESSING: "#2563eb",
    SHIPPED: "#9333ea",
    DELIVERED: "#16a34a",
    CANCELLED: "var(--red)",
  };

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ marginBottom: "2.5rem" }}>
          <Link href={`/${locale}/dashboard`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: "0.5rem" }}>
            ← Retour au Dashboard
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Gestion des commandes</h1>
        </div>

        {/* Filtres */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", background: "var(--bg-secondary)", padding: "1rem", borderRadius: 4, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              type="text" 
              placeholder="Numéro de commande, nom client..." 
              style={{ width: "100%", padding: "0.625rem 1rem 0.625rem 2.5rem", borderRadius: 2, border: "1px solid var(--divider)", background: "var(--bg)" }}
            />
          </div>
          <button className="btn btn-ghost" style={{ background: "var(--bg)", border: "1px solid var(--divider)" }}>
            <Filter size={16} /> Filtres avancés
          </button>
        </div>

        <div style={{ border: "1px solid var(--divider)", borderRadius: 4, overflow: "hidden", background: "var(--bg-card)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--divider)" }}>
                <th style={{ padding: "1rem", textAlign: "left" }}>N° Commande</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Date</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Client</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>Articles</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Total</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>Statut</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid var(--divider)" }}>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>{order.orderNumber}</td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                    {format(new Date(order.createdAt), "dd MMM yyyy", { locale: fr })}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 500 }}>{order.user?.name || "Client Invité"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>{order._count.items}</td>
                  <td style={{ padding: "1rem", fontWeight: 600 }}>{formatPrice(order.totalAmount)}</td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <span className="badge" style={{ borderColor: STATUS_COLORS[order.status], color: STATUS_COLORS[order.status] }}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <Link href={`/${locale}/dashboard/commandes/${order.id}`} className="btn btn-ghost btn-sm" style={{ padding: 8 }} title="Voir détails">
                      <Eye size={14} />
                    </Link>
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
