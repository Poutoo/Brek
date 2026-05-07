"use client";

import { useEffect, useState } from "react";
import { Package, Clock, X, FileText } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/ToastContainer";

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

interface Quote {
  id: string; quoteNumber: string; status: string; totalAmount: number;
  createdAt: string; validUntil: string; items: { productName: string; quantity: number; unitPrice: number }[];
}

export default function CommandesDevisPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"commandes" | "devis">("commandes");
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/commandes").then(r => r.json()),
      fetch("/api/devis").then(r => r.json())
    ]).then(([ordersData, quotesData]) => {
      setOrders(ordersData.orders || []);
      setQuotes(quotesData.quotes || []);
      setLoading(false);
    });
  }, []);

  const cancelOrder = async (id: string) => {
    if (!confirm("Annuler cette commande ?")) return;
    setCancelling(id);
    const res = await fetch(`/api/commandes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "CANCELLED" }) });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "CANCELLED" } : o));
      addToast({ title: "Commande annulée", type: "success" });
    }
    setCancelling(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 400 }}>Commandes & devis</h2>
      </div>

      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--divider)", marginBottom: "2rem" }}>
        <button 
          onClick={() => setActiveTab("commandes")}
          style={{ 
            padding: "0.75rem 1rem", 
            background: "none", 
            border: "none", 
            borderBottom: activeTab === "commandes" ? "2px solid var(--gold)" : "2px solid transparent",
            color: activeTab === "commandes" ? "var(--gold)" : "var(--text)",
            fontWeight: activeTab === "commandes" ? 600 : 400,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Package size={18} /> Commandes
        </button>
        <button 
          onClick={() => setActiveTab("devis")}
          style={{ 
            padding: "0.75rem 1rem", 
            background: "none", 
            border: "none", 
            borderBottom: activeTab === "devis" ? "2px solid var(--gold)" : "2px solid transparent",
            color: activeTab === "devis" ? "var(--gold)" : "var(--text)",
            fontWeight: activeTab === "devis" ? 600 : 400,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <FileText size={18} /> Devis
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 4 }} />)}
        </div>
      ) : activeTab === "commandes" ? (
        orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)", border: "1px dashed var(--divider)", borderRadius: "8px" }}>
            <Package size={48} strokeWidth={1} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <p style={{ marginBottom: "1.5rem" }}>Vous n'avez passé aucune commande pour le moment.</p>
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
                        <button className="btn btn-secondary btn-sm" onClick={() => cancelOrder(order.id)} disabled={cancelling === order.id}>
                          <X size={13} /> {cancelling === order.id ? "…" : "Annuler"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )
      ) : (
        quotes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)", border: "1px dashed var(--divider)", borderRadius: "8px" }}>
            <FileText size={48} strokeWidth={1} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <p style={{ marginBottom: "1.5rem" }}>Vous n'avez aucun devis en cours.</p>
            <Link href="/fr/contact" className="btn btn-secondary">Demander un devis sur-mesure</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {quotes.map((quote) => (
              <article key={quote.id} style={{ border: "1px solid var(--divider)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{quote.quoteNumber}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    <Clock size={13} />
                    Date : {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                    {quote.validUntil && (
                      <span style={{ marginLeft: "1rem", color: "var(--gold)" }}>Valide jusqu'au : {new Date(quote.validUntil).toLocaleDateString("fr-FR")}</span>
                    )}
                  </div>
                </div>
                <div style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                    {quote.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>{item.productName} × {item.quantity}m</span>
                        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--divider)" }}>
                    <span style={{ fontWeight: 600 }}>Total estimé : {formatPrice(quote.totalAmount)}</span>
                    {/* Les devis n'ont pas de statut affiché comme demandé par l'utilisateur (sans 'état') */}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )
      )}
    </div>
  );
}
