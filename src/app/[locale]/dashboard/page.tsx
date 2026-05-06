import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Users, ShoppingBag, BarChart3, Settings, MessageSquare } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration",
  description: "Dashboard d'administration Brek",
};

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const { locale } = await params;

  if (!session || !isAdmin) redirect(`/${locale}/admin`);

  const [productCount, userCount, orderCount, orderStats, contactCount, recentOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.order.findMany({
      take: 5, orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } }, items: { take: 1 } },
    }),
  ]);

  const totalRevenue = orderStats._sum.totalAmount || 0;

  const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente", CONFIRMED: "Confirmée", PROCESSING: "En préparation",
    SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée",
  };

  const stats = [
    { icon: <ShoppingBag size={22} />, label: "Produits actifs", value: productCount, color: "var(--gold)" },
    { icon: <Users size={22} />, label: "Utilisateurs", value: userCount, color: "#2563eb" },
    { icon: <Package size={22} />, label: "Commandes", value: orderCount, color: "#16a34a" },
    { icon: <BarChart3 size={22} />, label: "Revenus simulés", value: formatPrice(totalRevenue), color: "#9333ea" },
  ];

  const adminLinks = [
    { href: `/${locale}/dashboard/produits`, icon: <ShoppingBag size={18} />, label: "Gérer les produits", desc: `${productCount} produits` },
    { href: `/${locale}/dashboard/commandes`, icon: <Package size={18} />, label: "Gérer les commandes", desc: `${orderCount} commandes` },
    { href: `/${locale}/dashboard/utilisateurs`, icon: <Users size={18} />, label: "Gérer les utilisateurs", desc: `${userCount} comptes` },
    { href: `/${locale}/dashboard/messages`, icon: <MessageSquare size={18} />, label: "Messages contact", desc: contactCount > 0 ? `${contactCount} non lu(s)` : "Aucun nouveau" },
  ];

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.25rem" }}>Administration</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Dashboard</h1>
          </div>
          <span className="badge badge-gold" style={{ fontSize: "0.6875rem" }}>Admin</span>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ border: "1px solid var(--divider)", borderRadius: 4, padding: "1.25rem", background: "var(--bg-card)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <span style={{ fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{stat.label}</span>
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", fontWeight: 300 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          {/* Liens admin */}
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400, marginBottom: "1.25rem" }}>Actions rapides</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
              {adminLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="admin-link-card">
                  <span style={{ color: "var(--gold)" }}>{link.icon}</span>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{link.label}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Commandes récentes */}
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400, marginBottom: "1.25rem" }}>Commandes récentes</h2>
            <div style={{ border: "1px solid var(--divider)", borderRadius: 4, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--divider)" }}>
                    {["Numéro", "Client", "Article", "Statut", "Total"].map((h) => (
                      <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid var(--divider)" }}>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 600 }}>{order.orderNumber}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "var(--text-muted)" }}>{order.user?.name || order.user?.email || "—"}</td>
                      <td style={{ padding: "0.875rem 1rem", color: "var(--text-muted)" }}>{order.items[0]?.productName || "—"}</td>
                      <td style={{ padding: "0.875rem 1rem" }}>
                        <span className="badge" style={{ fontSize: "0.6875rem" }}>{STATUS_LABELS[order.status] || order.status}</span>
                      </td>
                      <td style={{ padding: "0.875rem 1rem", fontWeight: 500 }}>{formatPrice(order.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
