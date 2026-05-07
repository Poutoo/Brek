"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Lock, CheckCircle, ArrowRight, ShieldCheck, Check, Plus, X, ChevronDown, FileText, ShoppingBag, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/ToastContainer";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AddressForm } from "@/components/forms/AddressForm";
import { PaymentForm } from "@/components/forms/PaymentForm";

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

  const [step, setStep] = useState<"checkout" | "review" | "confirmed">("checkout");
  const [checkoutType, setCheckoutType] = useState<"order" | "quote">("order");
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null);

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
    setIsMounted(true);
    fetchData();
  }, []);

  const handleOpenEditAddress = () => {
    const addr = addresses.find(a => a.id === selectedAddressId);
    if (addr) {
      setEditingAddress(addr);
      setShowAddressModal(true);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleOpenEditCard = () => {
    const card = cards.find(c => c.id === selectedCardId);
    if (card) {
      setEditingCard(card);
      setShowCardModal(true);
    }
  };

  const handleOpenAddCard = () => {
    setEditingCard(null);
    setShowCardModal(true);
  };

  const handleAddressSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const url = editingAddress ? `/api/adresses/${editingAddress.id}` : "/api/adresses";
      const method = editingAddress ? "PATCH" : "POST";
      const res = await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      if (res.ok) {
        addToast({ title: editingAddress ? "Adresse mise à jour" : "Adresse ajoutée", type: "success" });
        setShowAddressModal(false);
        fetchData();
      } else {
        const errorData = await res.json();
        addToast({ title: errorData.error || "Erreur", type: "error" });
      }
    } catch {
      addToast({ title: "Erreur", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const url = editingCard ? `/api/paiement/${editingCard.id}` : "/api/paiement";
      const method = editingCard ? "PATCH" : "POST";
      const res = await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      if (res.ok) {
        addToast({ title: editingCard ? "Carte mise à jour" : "Carte ajoutée", type: "success" });
        setShowCardModal(false);
        fetchData();
      } else {
        const errorData = await res.json();
        addToast({ title: errorData.error || "Erreur", type: "error" });
      }
    } catch {
      addToast({ title: "Erreur", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAddressId) return addToast({ title: "Veuillez sélectionner une adresse", type: "error" });
    if (checkoutType === "order" && !selectedCardId) return addToast({ title: "Veuillez sélectionner un moyen de paiement", type: "error" });

    setSubmitting(true);
    try {
      const endpoint = checkoutType === "order" ? "/api/commandes" : "/api/devis";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          addressId: selectedAddressId,
          paymentMethodId: checkoutType === "order" ? selectedCardId : undefined
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderNumber(checkoutType === "order" ? data.order.orderNumber : data.quote.quoteNumber);
        clearCart();
        setStep("confirmed");
      } else {
        addToast({ title: data.error || "Erreur lors de la validation", type: "error" });
      }
    } catch (err) {
      addToast({ title: "Erreur serveur", type: "error" });
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
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "1rem" }}>
            {checkoutType === "order" ? "Commande confirmée !" : "Devis enregistré !"}
          </h1>
          <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {checkoutType === "order" ? "Numéro de commande :" : "Numéro de devis :"}
          </p>
          <p style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--gold)", marginBottom: "2rem" }}>{orderNumber}</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`/fr/compte/commandes`} className="btn btn-primary">
              Voir mes {checkoutType === "order" ? "commandes" : "devis"} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isMounted) return null;

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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>
            {step === "checkout" ? "Finaliser la commande" : "Récapitulatif de votre demande"}
          </h1>
          {step === "review" && (
            <button onClick={() => setStep("checkout")} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontSize: "0.875rem", textDecoration: "underline" }}>
              Modifier mes informations
            </button>
          )}
        </div>

        <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", alignItems: "start" }}>
          
          {/* Main Content Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            
            {step === "checkout" ? (
              <>
                {/* Type de commande Selection */}
                <section>
                  <h2 style={{ fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>
                    Type d'opération
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div 
                      onClick={() => setCheckoutType("order")}
                      style={{ 
                        background: checkoutType === "order" ? "#533b3b" : "#fff", 
                        color: checkoutType === "order" ? "#fff" : "var(--text)",
                        padding: "1.5rem", border: "1px solid var(--divider)", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "1rem", borderRadius: "2px", transition: "all 0.2s"
                      }}
                    >
                      <ShoppingBag size={24} />
                      <div>
                        <div style={{ fontWeight: 500 }}>Passer une commande</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Achat immédiat et paiement sécurisé</div>
                      </div>
                      {checkoutType === "order" && <Check size={20} style={{ marginLeft: "auto" }} />}
                    </div>
                    <div 
                      onClick={() => setCheckoutType("quote")}
                      style={{ 
                        background: checkoutType === "quote" ? "#533b3b" : "#fff", 
                        color: checkoutType === "quote" ? "#fff" : "var(--text)",
                        padding: "1.5rem", border: "1px solid var(--divider)", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "1rem", borderRadius: "2px", transition: "all 0.2s"
                      }}
                    >
                      <FileText size={24} />
                      <div>
                        <div style={{ fontWeight: 500 }}>Demander un devis</div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Recevoir une proposition par e-mail</div>
                      </div>
                      {checkoutType === "quote" && <Check size={20} style={{ marginLeft: "auto" }} />}
                    </div>
                  </div>
                </section>

                {/* Adresse Section */}
                <section>
                  <h2 style={{ fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>
                    Adresse de livraison
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
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
                          <div style={{ marginTop: "3rem" }}>
                            <button onClick={handleOpenEditAddress} className="checkout-sub-btn-dark">MODIFIER CETTE ADRESSE</button>
                          </div>
                        </>
                      ) : (
                        <p style={{ opacity: 0.8, fontSize: "0.875rem" }}>Aucune adresse disponible.</p>
                      )}
                    </div>
                    <div style={{ background: "#fff", border: "1px solid var(--divider)", padding: "2.5rem", display: "flex", flexDirection: "column", borderRadius: "2px" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text)", marginBottom: "2rem" }}>Choisir une autre adresse</h3>
                      <div style={{ position: "relative", marginBottom: "auto" }}>
                        <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)} className="checkout-select">
                          {addresses.length === 0 && <option value="">Aucune adresse</option>}
                          {addresses.map(a => <option key={a.id} value={a.id}>{a.label} - {a.city}</option>)}
                        </select>
                        <ChevronDown size={16} className="select-chevron" />
                      </div>
                      <div style={{ marginTop: "3rem" }}>
                        <button onClick={handleOpenAddAddress} className="checkout-sub-btn-light"><Plus size={16} /> AJOUTER UNE ADRESSE</button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Paiement Section (Only for Order) */}
                {checkoutType === "order" && (
                  <section>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                      <h2 style={{ fontSize: "1.25rem", color: "var(--text)", fontFamily: "var(--font-display)" }}>Moyen de paiement</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}><Lock size={12} /> Paiement sécurisé</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                      <div style={{ background: "#4a3b3b", color: "#fffdf8", padding: "2.5rem", display: "flex", flexDirection: "column", borderRadius: "2px" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 500, marginBottom: "2rem" }}>Ma carte bancaire</h3>
                        {selectedCard ? (
                          <>
                            <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-display)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                              <CreditCard size={24} color="var(--gold)" /> {selectedCard.brand || "CARTE"}
                            </div>
                            <div style={{ fontSize: "1.125rem", letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: "0.5rem" }}>**** **** **** {selectedCard.last4}</div>
                            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Expire le : {selectedCard.expMonth.toString().padStart(2, '0')}/{selectedCard.expYear}</div>
                            <div style={{ marginTop: "3rem" }}>
                              <button onClick={handleOpenEditCard} className="checkout-sub-btn-dark">MODIFIER CETTE CARTE</button>
                            </div>
                          </>
                        ) : (
                          <p style={{ opacity: 0.8, fontSize: "0.875rem" }}>Aucune carte disponible.</p>
                        )}
                      </div>
                      <div style={{ background: "#fff", border: "1px solid var(--divider)", padding: "2.5rem", display: "flex", flexDirection: "column", borderRadius: "2px" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 500, color: "var(--text)", marginBottom: "2rem" }}>Choisir une autre carte</h3>
                        <div style={{ position: "relative", marginBottom: "auto" }}>
                          <select value={selectedCardId} onChange={(e) => setSelectedCardId(e.target.value)} className="checkout-select">
                            {cards.length === 0 && <option value="">Aucune carte</option>}
                            {cards.map(c => <option key={c.id} value={c.id}>{c.brand} se terminant par {c.last4}</option>)}
                          </select>
                          <ChevronDown size={16} className="select-chevron" />
                        </div>
                        <div style={{ marginTop: "3rem" }}>
                          <button onClick={handleOpenAddCard} className="checkout-sub-btn-light"><Plus size={16} /> AJOUTER UNE CARTE</button>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            ) : (
              /* Review Step */
              <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div style={{ background: "#fff", padding: "2rem", border: "1px solid var(--divider)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "var(--gold)" }}>
                      <MapPin size={20} />
                      <h3 style={{ fontWeight: 500 }}>Adresse de livraison</h3>
                    </div>
                    {selectedAddress ? (
                      <div style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}>
                        <p style={{ fontWeight: 600 }}>{selectedAddress.firstName} {selectedAddress.lastName}</p>
                        <p>{selectedAddress.line1}</p>
                        <p>{selectedAddress.postalCode} {selectedAddress.city}</p>
                        <p>{selectedAddress.country}</p>
                      </div>
                    ) : <p>Aucune adresse</p>}
                  </div>

                  {checkoutType === "order" && (
                    <div style={{ background: "#fff", padding: "2rem", border: "1px solid var(--divider)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "var(--gold)" }}>
                        <CreditCard size={20} />
                        <h3 style={{ fontWeight: 500 }}>Mode de paiement</h3>
                      </div>
                      {selectedCard ? (
                        <div style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}>
                          <p style={{ fontWeight: 600 }}>{selectedCard.brand} Card</p>
                          <p>**** **** **** {selectedCard.last4}</p>
                          <p>Expire : {selectedCard.expMonth.toString().padStart(2, '0')}/{selectedCard.expYear}</p>
                        </div>
                      ) : <p>Aucune carte</p>}
                    </div>
                  )}
                </div>

                <div style={{ background: "#fff", padding: "2rem", border: "1px solid var(--divider)" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "var(--gold)" }}>
                      <ShoppingBag size={20} />
                      <h3 style={{ fontWeight: 500 }}>Articles dans {checkoutType === "order" ? "votre commande" : "votre devis"}</h3>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--divider)", textAlign: "left", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                          <th style={{ paddingBottom: "1rem" }}>Produit</th>
                          <th style={{ paddingBottom: "1rem", textAlign: "center" }}>Quantité</th>
                          <th style={{ paddingBottom: "1rem", textAlign: "right" }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(({ product, quantity }) => (
                          <tr key={product.id} style={{ borderBottom: "1px solid var(--bg-secondary)" }}>
                            <td style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0" }}>
                              <div style={{ width: 50, height: 50, background: "var(--bg-secondary)", flexShrink: 0 }}>
                                <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                              <div>
                                <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{product.name}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{product.ref}</div>
                              </div>
                            </td>
                            <td style={{ textAlign: "center", fontSize: "0.875rem" }}>{quantity} m</td>
                            <td style={{ textAlign: "right", fontWeight: 500, fontSize: "0.875rem" }}>{formatPrice(product.price * quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
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
              {step === "checkout" ? (
                <Button type="button" withLine className="w-full-checkout" onClick={() => setStep("review")} disabled={!selectedAddressId || (checkoutType === "order" && !selectedCardId)}>
                  VÉRIFIER LE RÉCAPITULATIF
                </Button>
              ) : (
                <Button type="button" withLine className="w-full-checkout" onClick={handleConfirm} disabled={submitting}>
                  {submitting ? "TRAITEMENT…" : checkoutType === "order" ? "CONFIRMER LA COMMANDE" : "VALIDER LE DEVIS"}
                </Button>
              )}
            </div>

            <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 2, padding: "1rem", marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem", alignItems: "flex-start", lineHeight: 1.5 }}>
              <ShieldCheck size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: "2px" }} /> 
              {checkoutType === "order" ? "Environnement de démonstration. Aucune transaction réelle." : "Votre devis sera enregistré dans votre espace client."}
            </div>
          </aside>
        </div>
      </div>

      {/* --- MODALS --- */}
      <Modal 
        isOpen={showAddressModal} 
        onClose={() => setShowAddressModal(false)} 
        title={editingAddress ? "Modifier l'adresse" : "Ajouter une adresse"}
      >
        <AddressForm 
          initialData={editingAddress || undefined} 
          onSubmit={handleAddressSubmit} 
          submitting={submitting} 
          onCancel={() => setShowAddressModal(false)} 
        />
      </Modal>

      <Modal 
        isOpen={showCardModal} 
        onClose={() => setShowCardModal(false)} 
        title={editingCard ? "Modifier la carte" : "Ajouter une carte"}
      >
        <PaymentForm 
          initialData={editingCard || undefined} 
          onSubmit={handleCardSubmit} 
          submitting={submitting} 
          onCancel={() => setShowCardModal(false)} 
        />
      </Modal>

      <style jsx>{`
        @media (min-width: 1024px) {
          .checkout-grid { grid-template-columns: 2fr 1fr !important; }
        }
        :global(.w-full-checkout) { 
          width: 100% !important; 
          justify-content: center !important; 
        }
        .checkout-select { width: 100%; padding: 1rem 1.25rem; border: 1px solid var(--divider); border-radius: 4px; appearance: none; cursor: pointer; font-size: 0.875rem; color: var(--text); background: transparent; outline: none; }
        .select-chevron { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); }
        .checkout-sub-btn-dark { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.4); width: 100%; padding: 1rem; border-radius: 4px; font-size: 0.75rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; }
        .checkout-sub-btn-dark:hover { background: rgba(255,255,255,0.1); }
        .checkout-sub-btn-light { background: transparent; color: var(--text); border: 1px solid var(--divider); width: 100%; padding: 1rem; border-radius: 4px; font-size: 0.75rem; letter-spacing: 0.1em; cursor: pointer; display: flex; alignItems: center; justifyContent: center; gap: 0.5rem; transition: all 0.2s; }
        .checkout-sub-btn-light:hover { background: var(--bg-secondary); }
      `}</style>
    </div>
  );
}
