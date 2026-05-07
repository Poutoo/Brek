"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Lock, CheckCircle, ArrowRight, ShieldCheck, Check, Plus, X, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/ToastContainer";
import { Button } from "@/components/ui/Button";

type Address = {
  id: string; label: string; firstName: string; lastName: string;
  line1: string; line2?: string; city: string; postalCode: string;
  country: string; isDefault: boolean;
};

type PaymentMethod = {
  id: string; brand: string; last4: string;
  expMonth: number; expYear: number; isDefault: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();
  const { addToast } = useToast();

  const [step, setStep] = useState<"checkout" | "confirmed">("checkout");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // Form states for modals
  const [addressForm, setAddressForm] = useState({ label: "", firstName: "", lastName: "", line1: "", line2: "", city: "", postalCode: "", country: "France", isDefault: false });
  const [cardForm, setCardForm] = useState({ cardNumber: "", expMonth: "", expYear: "", cvc: "", isDefault: false });

  const fetchData = async () => {
    try {
      const [resAddr, resCard] = await Promise.all([
        fetch("/api/adresses"), fetch("/api/paiement")
      ]);
      if (resAddr.ok) {
        const data = await resAddr.json();
        setAddresses(data.addresses);
        if (data.addresses.length > 0 && !selectedAddressId) {
          const def = data.addresses.find((a: Address) => a.isDefault);
          setSelectedAddressId(def ? def.id : data.addresses[0].id);
        }
      }
      if (resCard.ok) {
        const data = await resCard.json();
        setCards(data.cards);
        if (data.cards.length > 0 && !selectedCardId) {
          const def = data.cards.find((c: PaymentMethod) => c.isDefault);
          setSelectedCardId(def ? def.id : data.cards[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/adresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addressForm) });
      if (res.ok) {
        addToast({ title: "Adresse ajoutée", type: "success" });
        setShowAddressModal(false);
        setAddressForm({ label: "", firstName: "", lastName: "", line1: "", line2: "", city: "", postalCode: "", country: "France", isDefault: false });
        fetchData(); // reload and it will auto-select if we want, or we can just refetch
      } else {
        addToast({ title: "Erreur", type: "error" });
      }
    } catch {
      addToast({ title: "Erreur", type: "error" });
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/paiement", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cardForm) });
      if (res.ok) {
        addToast({ title: "Carte ajoutée", type: "success" });
        setShowCardModal(false);
        setCardForm({ cardNumber: "", expMonth: "", expYear: "", cvc: "", isDefault: false });
        fetchData();
      } else {
        addToast({ title: "Erreur", type: "error" });
      }
    } catch {
      addToast({ title: "Erreur", type: "error" });
    }
  };

  const handleConfirm = async () => {
    if (!selectedAddressId) return addToast({ title: "Veuillez sélectionner une adresse", type: "error" });
    if (!selectedCardId) return addToast({ title: "Veuillez sélectionner un moyen de paiement", type: "error" });

    setSubmitting(true);
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })) }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNumber(data.order.orderNumber);
        clearCart();
        setStep("confirmed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  const selectedCard = cards.find(c => c.id === selectedCardId);

  if (step === "confirmed") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <CheckCircle size={56} style={{ color: "#16a34a", margin: "0 auto 1.5rem" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "1rem" }}>Commande confirmée !</h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>Numéro de commande :</p>
          <p style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--gold)", marginBottom: "2rem" }}>{orderNumber}</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/fr/compte/commandes" className="btn btn-primary">Voir mes commandes <ArrowRight size={14} /></a>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>Votre panier est vide.</p>
          <a href="/fr/produits" className="btn btn-primary">Découvrir nos produits</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem", background: "var(--bg-secondary)", minHeight: "100vh" }}>
      <div className="container-brek" style={{ maxWidth: 1200 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "3rem" }}>Finaliser la commande</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
          <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "start" }}>
            {/* Left Column: Formulaire */}
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
              
              {/* Adresse Section */}
              <section>
                <h2 style={{ fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>
                  Adresse de livraison
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  
                  {/* Carte Sombre - Adresse sélectionnée */}
                  <div style={{ background: "#4a3b3b", color: "#fffdf8", padding: "2.5rem", display: "flex", flexDirection: "column", borderRadius: "2px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "2rem" }}>Mon adresse de livraison</h3>
                    
                    {selectedAddress ? (
                      <>
                        <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                          {selectedAddress.lastName || selectedAddress.label}
                        </div>
                        <div style={{ fontSize: "0.875rem", lineHeight: 1.8, opacity: 0.9, letterSpacing: "0.02em" }}>
                          {selectedAddress.line1}<br/>
                          {selectedAddress.postalCode} {selectedAddress.city}<br/>
                          {selectedAddress.country.toUpperCase()}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", opacity: 0.8, marginTop: "2rem", color: "#e5e1da" }}>
                          <Check size={16} /> Adresse de livraison par défaut
                        </div>
                        <div style={{ marginTop: "3rem" }}>
                          <button onClick={() => setShowAddressModal(true)} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", width: "100%", padding: "1rem", borderRadius: "4px", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                            MODIFIER CETTE ADRESSE
                          </button>
                        </div>
                      </>
                    ) : (
                      <p style={{ opacity: 0.8, fontSize: "0.875rem" }}>Aucune adresse disponible.</p>
                    )}
                  </div>

                  {/* Carte Blanche - Choisir une autre adresse */}
                  <div style={{ background: "#fff", border: "1px solid var(--divider)", padding: "2.5rem", display: "flex", flexDirection: "column", borderRadius: "2px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text)", marginBottom: "2rem" }}>Choisir une autre adresse</h3>
                    
                    <div style={{ position: "relative", marginBottom: "auto" }}>
                      <select 
                        value={selectedAddressId} 
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        style={{ width: "100%", padding: "1rem 1.25rem", border: "1px solid var(--divider)", borderRadius: "4px", appearance: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--text)", background: "transparent", outline: "none" }}
                      >
                        {addresses.length === 0 && <option value="">Aucune adresse</option>}
                        {addresses.map(a => (
                          <option key={a.id} value={a.id}>{a.label} - {a.city}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }} />
                    </div>

                    <div style={{ marginTop: "3rem" }}>
                      <button onClick={() => setShowAddressModal(true)} style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--divider)", width: "100%", padding: "1rem", borderRadius: "4px", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--bg-secondary)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                        <Plus size={16} /> AJOUTER UNE ADRESSE
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Paiement Section */}
              <section>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.25rem", color: "var(--text)", fontFamily: "var(--font-display)" }}>
                    Moyen de paiement
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <Lock size={12} /> Paiement sécurisé
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                  
                  {/* Carte Sombre - Paiement sélectionnée */}
                  <div style={{ background: "#4a3b3b", color: "#fffdf8", padding: "2.5rem", display: "flex", flexDirection: "column", borderRadius: "2px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "2rem" }}>Ma carte bancaire</h3>
                    
                    {selectedCard ? (
                      <>
                        <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <CreditCard size={24} color="var(--gold)" />
                          {selectedCard.brand || "CARTE"}
                        </div>
                        <div style={{ fontSize: "1.125rem", letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: "0.5rem" }}>
                          **** **** **** {selectedCard.last4}
                        </div>
                        <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                          Expire le : {selectedCard.expMonth.toString().padStart(2, '0')}/{selectedCard.expYear}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", opacity: 0.8, marginTop: "2rem", color: "#e5e1da" }}>
                          <Check size={16} /> Carte par défaut
                        </div>
                        <div style={{ marginTop: "3rem" }}>
                          <button onClick={() => setShowCardModal(true)} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", width: "100%", padding: "1rem", borderRadius: "4px", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                            MODIFIER CETTE CARTE
                          </button>
                        </div>
                      </>
                    ) : (
                      <p style={{ opacity: 0.8, fontSize: "0.875rem" }}>Aucune carte disponible.</p>
                    )}
                  </div>

                  {/* Carte Blanche - Choisir une autre carte */}
                  <div style={{ background: "#fff", border: "1px solid var(--divider)", padding: "2.5rem", display: "flex", flexDirection: "column", borderRadius: "2px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text)", marginBottom: "2rem" }}>Choisir une autre carte</h3>
                    
                    <div style={{ position: "relative", marginBottom: "auto" }}>
                      <select 
                        value={selectedCardId} 
                        onChange={(e) => setSelectedCardId(e.target.value)}
                        style={{ width: "100%", padding: "1rem 1.25rem", border: "1px solid var(--divider)", borderRadius: "4px", appearance: "none", cursor: "pointer", fontSize: "0.875rem", color: "var(--text)", background: "transparent", outline: "none" }}
                      >
                        {cards.length === 0 && <option value="">Aucune carte</option>}
                        {cards.map(c => (
                          <option key={c.id} value={c.id}>{c.brand} se terminant par {c.last4}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }} />
                    </div>

                    <div style={{ marginTop: "3rem" }}>
                      <button onClick={() => setShowCardModal(true)} style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--divider)", width: "100%", padding: "1rem", borderRadius: "4px", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--bg-secondary)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                        <Plus size={16} /> AJOUTER UNE CARTE
                      </button>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column: Récap commande */}
            <aside style={{ background: "var(--bg-card)", border: "1px solid var(--divider)", borderRadius: 2, padding: "2rem", position: "sticky", top: "8rem" }}>
              <h2 style={{ fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text)", marginBottom: "2rem", fontFamily: "var(--font-body)", fontWeight: 500 }}>
                Récapitulatif
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{product.name} × {quantity}m</span>
                    <span style={{ fontWeight: 500 }}>{formatPrice(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid var(--divider)", paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <span>Livraison</span><span style={{ color: "var(--gold)" }}>Offerte</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 400, fontSize: "1.25rem", marginTop: "0.5rem", fontFamily: "var(--font-display)" }}>
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              
              <div style={{ marginTop: "2rem" }}>
                <Button type="button" withLine className="w-full-checkout" onClick={handleConfirm} disabled={submitting || !selectedAddressId || !selectedCardId}>
                  {submitting ? "TRAITEMENT…" : "CONFIRMER LA COMMANDE"}
                </Button>
              </div>

              <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 2, padding: "1rem", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem", alignItems: "flex-start", lineHeight: 1.5 }}>
                <ShieldCheck size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: "2px" }} /> 
                Environnement de démonstration. Aucune transaction réelle ne sera effectuée lors de la confirmation.
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showAddressModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(2px)", padding: "1rem" }}>
          <div style={{ backgroundColor: "var(--bg-card)", padding: "2.5rem", borderRadius: "4px", width: "100%", maxWidth: "500px", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <button onClick={() => setShowAddressModal(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={24} />
            </button>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "2rem" }}>Ajouter une adresse</h3>
            
            <form onSubmit={handleAddAddress} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group">
                <input type="text" id="label" className="input-field" required placeholder=" " value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} />
                <label htmlFor="label" className="input-label">Nom de l'adresse (ex: Bureau)</label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="input-group">
                  <input type="text" id="fname" className="input-field" required placeholder=" " value={addressForm.firstName} onChange={e => setAddressForm({...addressForm, firstName: e.target.value})} />
                  <label htmlFor="fname" className="input-label">Prénom</label>
                </div>
                <div className="input-group">
                  <input type="text" id="lname" className="input-field" required placeholder=" " value={addressForm.lastName} onChange={e => setAddressForm({...addressForm, lastName: e.target.value})} />
                  <label htmlFor="lname" className="input-label">Nom</label>
                </div>
              </div>
              <div className="input-group">
                <input type="text" id="line1" className="input-field" required placeholder=" " value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} />
                <label htmlFor="line1" className="input-label">Adresse (Ligne 1)</label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                <div className="input-group">
                  <input type="text" id="zip" className="input-field" required placeholder=" " value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} />
                  <label htmlFor="zip" className="input-label">Code Postal</label>
                </div>
                <div className="input-group">
                  <input type="text" id="city" className="input-field" required placeholder=" " value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                  <label htmlFor="city" className="input-label">Ville</label>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input type="checkbox" id="isDefA" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} style={{ accentColor: "var(--gold)", width: "16px", height: "16px" }} />
                <label htmlFor="isDefA" style={{ marginBottom: 0, fontSize: "0.875rem", cursor: "pointer" }}>Définir comme adresse par défaut</label>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                <Button type="submit" withLine className="w-full-checkout">ENREGISTRER L'ADRESSE</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCardModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(2px)", padding: "1rem" }}>
          <div style={{ backgroundColor: "var(--bg-card)", padding: "2.5rem", borderRadius: "4px", width: "100%", maxWidth: "500px", position: "relative", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <button onClick={() => setShowCardModal(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={24} />
            </button>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "1rem" }}>Ajouter une carte</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "2rem" }}>Ceci est un environnement de démonstration.</p>
            
            <form onSubmit={handleAddCard} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group">
                <input type="text" id="cnum" className="input-field" required placeholder=" " maxLength={19} value={cardForm.cardNumber} onChange={e => setCardForm({...cardForm, cardNumber: e.target.value})} />
                <label htmlFor="cnum" className="input-label">Numéro de carte</label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className="input-group">
                  <input type="text" id="cmm" className="input-field" required placeholder=" " maxLength={2} value={cardForm.expMonth} onChange={e => setCardForm({...cardForm, expMonth: e.target.value})} />
                  <label htmlFor="cmm" className="input-label">Mois (MM)</label>
                </div>
                <div className="input-group">
                  <input type="text" id="caa" className="input-field" required placeholder=" " maxLength={2} value={cardForm.expYear} onChange={e => setCardForm({...cardForm, expYear: e.target.value})} />
                  <label htmlFor="caa" className="input-label">Année (AA)</label>
                </div>
                <div className="input-group">
                  <input type="text" id="ccvc" className="input-field" required placeholder=" " maxLength={3} value={cardForm.cvc} onChange={e => setCardForm({...cardForm, cvc: e.target.value})} />
                  <label htmlFor="ccvc" className="input-label">CVC</label>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input type="checkbox" id="isDefC" checked={cardForm.isDefault} onChange={e => setCardForm({...cardForm, isDefault: e.target.checked})} style={{ accentColor: "var(--gold)", width: "16px", height: "16px" }} />
                <label htmlFor="isDefC" style={{ marginBottom: 0, fontSize: "0.875rem", cursor: "pointer" }}>Définir comme carte par défaut</label>
              </div>
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                <Button type="submit" withLine className="w-full-checkout">AJOUTER LA CARTE</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style jsx>{`
        @media (min-width: 1024px) {
          .checkout-grid { grid-template-columns: 2fr 1fr !important; }
        }
        :global(.w-full-checkout) { 
          width: 100% !important; 
          justify-content: center !important; 
        }
      `}</style>
    </div>
  );
}
