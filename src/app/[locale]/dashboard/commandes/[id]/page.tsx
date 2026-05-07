import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Package, User, MapPin, Calendar, CreditCard, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default async function OrderDetailPage({ 
  params 
}: { 
  params: Promise<{ locale: string, id: string }> 
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const { locale, id } = await params;

  if (!session || !isAdmin) redirect(`/${locale}/connexion`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      address: true,
      items: {
        include: {
          product: { select: { images: true } }
        }
      }
    }
  });

  if (!order) notFound();

  const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PROCESSING: "En préparation",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <header style={{ marginBottom: "2.5rem" }}>
          <Link href={`/${locale}/dashboard/commandes`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: "0.5rem" }}>
            <ChevronLeft size={16} /> Retour aux commandes
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Commande {order.orderNumber}</h1>
              <p style={{ color: "var(--text-muted)" }}>
                Passée le {format(new Date(order.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <select 
                defaultValue={order.status}
                style={{ padding: "0.625rem 1rem", borderRadius: 2, border: "1px solid var(--divider)", background: "var(--bg)" }}
              >
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <button className="btn btn-primary">Mettre à jour le statut</button>
            </div>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Articles */}
            <section style={{ border: "1px solid var(--divider)", borderRadius: 4, overflow: "hidden", background: "var(--bg-card)" }}>
              <div style={{ padding: "1.25rem", borderBottom: "1px solid var(--divider)", background: "var(--bg-secondary)" }}>
                <h2 style={{ fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Package size={18} /> Articles commandés
                </h2>
              </div>
              <div style={{ padding: "1.25rem" }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: "1.5rem", padding: "1rem 0", borderBottom: "1px solid var(--divider)" }}>
                    <div style={{ position: "relative", width: 80, height: 80, background: "var(--bg-secondary)", borderRadius: 2, overflow: "hidden" }}>
                      <img src={item.product?.images[0] || "/assets/placeholder.png"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 500 }}>{item.productName}</h3>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Réf: {item.productRef}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: "0.875rem" }}>{item.quantity} m x {formatPrice(item.unitPrice)}</p>
                        <p style={{ fontWeight: 600 }}>{formatPrice(item.quantity * item.unitPrice)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", gap: "4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Sous-total</span>
                    <span>{formatPrice(order.totalAmount - order.shippingAmount)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>Livraison</span>
                    <span>{formatPrice(order.shippingAmount)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "4rem", fontSize: "1.25rem", fontWeight: 600, marginTop: "0.5rem", borderTop: "1px solid var(--divider)", paddingTop: "0.5rem" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--gold)" }}>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Client */}
            <section style={{ border: "1px solid var(--divider)", borderRadius: 4, background: "var(--bg-card)", padding: "1.25rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={14} /> Client
              </h2>
              <div style={{ fontSize: "0.875rem" }}>
                <p style={{ fontWeight: 600 }}>{order.user?.name || "Client Invité"}</p>
                <p style={{ color: "var(--text-muted)" }}>{order.user?.email}</p>
                <p style={{ color: "var(--text-muted)" }}>{order.user?.phone || "Pas de téléphone"}</p>
              </div>
            </section>

            {/* Livraison */}
            <section style={{ border: "1px solid var(--divider)", borderRadius: 4, background: "var(--bg-card)", padding: "1.25rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={14} /> Adresse de livraison
              </h2>
              {order.address ? (
                <div style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                  <p style={{ fontWeight: 600 }}>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.line1}</p>
                  {order.address.line2 && <p>{order.address.line2}</p>}
                  <p>{order.address.postalCode} {order.address.city}</p>
                  <p>{order.address.country}</p>
                </div>
              ) : (
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Aucune adresse renseignée</p>
              )}
            </section>

            {/* Paiement */}
            <section style={{ border: "1px solid var(--divider)", borderRadius: 4, background: "var(--bg-card)", padding: "1.25rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CreditCard size={14} /> Paiement
              </h2>
              <div style={{ fontSize: "0.875rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--green)", fontWeight: 500 }}>
                  <Clock size={14} /> Simulé - Confirmé
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>Réf: {order.simulatedPayRef || "N/A"}</p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
