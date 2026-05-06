"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Lock, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  const [step, setStep] = useState<"address" | "payment" | "confirmed">("address");
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [address, setAddress] = useState({ firstName: "", lastName: "", line1: "", city: "", postalCode: "", country: "France" });
  const [card, setCard] = useState({ number: "4242 4242 4242 4242", expiry: "12/26", cvv: "123", name: "" });

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNumber(data.order.orderNumber);
        clearCart();
        setStep("confirmed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === "confirmed") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <CheckCircle size={56} style={{ color: "#16a34a", margin: "0 auto 1.5rem" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "1rem" }}>Commande confirmée !</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Numéro de commande :</p>
          <p style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--gold)", marginBottom: "2rem" }}>{orderNumber}</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Vous pouvez suivre l'avancement de votre commande dans votre espace personnel.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/fr/commandes" className="btn btn-primary">Voir mes commandes <ArrowRight size={14} /></a>
            <a href="/fr/produits" className="btn btn-secondary">Continuer les achats</a>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>Votre panier est vide.</p>
          <a href="/fr/produits" className="btn btn-primary">Découvrir nos produits</a>
        </div>
      </div>
    );
  }

  const inputStyle = { width: "100%", padding: "0.875rem 1rem", border: "1px solid var(--divider)", borderRadius: 2, background: "var(--bg-card)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "0.9375rem", outline: "none" };

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek" style={{ maxWidth: 960 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "2.5rem" }}>Finaliser la commande</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          {/* Formulaire */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Adresse */}
            <section style={{ border: "1px solid var(--divider)", borderRadius: 4, padding: "1.5rem" }}>
              <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem", fontFamily: "var(--font-body)" }}>
                Adresse de livraison
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <input placeholder="Prénom" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} style={inputStyle} id="checkout-firstname" aria-label="Prénom" />
                <input placeholder="Nom" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} style={inputStyle} id="checkout-lastname" aria-label="Nom" />
                <input placeholder="Adresse" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} style={{ ...inputStyle, gridColumn: "1/-1" }} id="checkout-address" aria-label="Adresse" />
                <input placeholder="Code postal" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} style={inputStyle} id="checkout-postal" aria-label="Code postal" />
                <input placeholder="Ville" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} style={inputStyle} id="checkout-city" aria-label="Ville" />
              </div>
            </section>

            {/* Paiement simulé */}
            <section style={{ border: "1px solid var(--divider)", borderRadius: 4, padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", fontFamily: "var(--font-body)" }}>
                  Paiement
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                  <Lock size={12} /> Paiement sécurisé — Simulation
                </div>
              </div>
              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, padding: "0.75rem 1rem", marginBottom: "1.25rem", fontSize: "0.75rem", color: "var(--gold)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <ShieldCheck size={14} /> Environnement de démonstration — Aucune transaction réelle
              </div>
              <div style={{ display: "grid", gap: "0.875rem" }}>
                <input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} style={inputStyle} id="card-number" aria-label="Numéro de carte" placeholder="Numéro de carte" />
                <input placeholder="Nom du titulaire" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} style={inputStyle} id="cardholder" aria-label="Nom du titulaire" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                  <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} style={inputStyle} id="card-expiry" aria-label="Date d'expiration" placeholder="MM/AA" />
                  <input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} style={inputStyle} id="card-cvv" aria-label="CVV" placeholder="CVV" />
                </div>
              </div>
            </section>
          </div>

          {/* Récap commande */}
          <aside style={{ border: "1px solid var(--divider)", borderRadius: 4, padding: "1.5rem", alignSelf: "flex-start" }}>
            <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1.25rem", fontFamily: "var(--font-body)" }}>
              Récapitulatif
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.5rem" }}>
              {items.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>{product.name} × {quantity}m</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--divider)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                <span>Livraison</span><span style={{ color: "#16a34a" }}>Offerte</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "1.0625rem", marginTop: "0.5rem" }}>
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}
              onClick={handleConfirm} disabled={loading} id="confirm-order-btn" aria-label="Confirmer la commande">
              <CreditCard size={16} />
              {loading ? "Traitement…" : "Confirmer la commande"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
