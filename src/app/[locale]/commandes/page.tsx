"use client";

import { useEffect, useState } from "react";
import { Package, Clock, X, Eye } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmée", PROCESSING: "En préparation",
  SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée",
};
const STATUS_CLASS: Record<string, string> = {
  PENDING: "status-pending", CONFIRMED: "status-confirmed", PROCESSING: "status-processing",
  SHIPPED: "status-shipped", DELIVERED: "status-delivered", CANCELLED: "status-cancelled",
};

interface Order {
  id: string; orderNumber: string; status: string; totalAmount: number;
  createdAt: string; items: { productName: string; quantity: number; unitPrice: number }[];
}

export default function CommandesPage({ params }: { params: Promise<{ locale: string }> }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/commandes").then((r) => r.json()).then((d) => { setOrders(d.orders || []); setLoading(false); });
  }, []);

  const cancel = async (id: string) => {
    if (!confirm("Annuler cette commande ?")) return;
    setCancelling(id);
    const res = await fetch(`/api/commandes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "CANCELLED" }) });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "CANCELLED" } : o));
    }
    setCancelling(null);
  };

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek" style={{ maxWidth: 900 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "2rem" }}>Mes commandes</h1>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 4 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
            <Package size={48} strokeWidth={1} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <p style={{ marginBottom: "1.5rem" }}>Aucune commande pour le moment</p>
            <Link href="/fr/produits" className="btn btn-primary">Découvrir nos produits</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {orders.map((order) => (
              <article key={order.id} style={{ border: "1px solid var(--divider)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{order.orderNumber}</span>
                    <span className={`badge ${STATUS_CLASS[order.status] || "badge-muted"}`}>{STATUS_LABELS[order.status] || order.status}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    <Clock size={13} />
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>{item.productName} × {item.quantity}m</span>
                        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--divider)" }}>
                    <span style={{ fontWeight: 600 }}>Total : {formatPrice(order.totalAmount)}</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {["PENDING", "CONFIRMED"].includes(order.status) && (
                        <button className="btn btn-secondary btn-sm" onClick={() => cancel(order.id)} disabled={cancelling === order.id} id={`cancel-${order.id}`} aria-label={`Annuler commande ${order.orderNumber}`}>
                          <X size={13} /> {cancelling === order.id ? "…" : "Annuler"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
