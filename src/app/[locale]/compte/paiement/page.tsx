"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CreditCard, Edit3, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/ToastContainer";
import { Modal } from "@/components/ui/Modal";
import { PaymentForm } from "@/components/forms/PaymentForm";

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export default function PaiementPage() {
  const { addToast } = useToast();
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCards = async () => {
    try {
      const res = await fetch("/api/paiement");
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDelete = async () => {
    if (!cardToDelete) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/paiement/${cardToDelete}`, { method: "DELETE" });
      if (res.ok) {
        addToast({ title: "Carte supprimée", type: "success" });
        fetchCards();
        setIsConfirmModalOpen(false);
      } else {
        addToast({ title: "Erreur lors de la suppression", type: "error" });
      }
    } catch (error) {
      addToast({ title: "Erreur lors de la suppression", type: "error" });
    } finally {
      setIsSubmitting(false);
      setCardToDelete(null);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setCardToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleOpenEdit = (card: PaymentMethod) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
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
        setIsModalOpen(false);
        fetchCards();
      } else {
        const errorData = await res.json();
        addToast({ title: errorData.error || "Erreur lors de l'enregistrement", type: "error" });
      }
    } catch (error) {
      addToast({ title: "Erreur lors de l'enregistrement", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div className="loader-luxe"></div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 400 }}>Mes moyens de paiement</h2>
        <button className="btn btn-primary" onClick={handleOpenAdd} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> Ajouter une carte
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {cards.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", padding: "4rem 2rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "4px" }}>
            <CreditCard size={48} style={{ color: "var(--divider)", marginBottom: "1rem" }} />
            <p style={{ color: "var(--text-muted)" }}>Vous n'avez pas encore enregistré de carte bancaire.</p>
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="payment-card" style={{ border: "1px solid var(--divider)", borderRadius: "4px", padding: "2rem", position: "relative", backgroundColor: "var(--bg-card)", transition: "all 0.3s var(--ease-luxury)", overflow: "hidden" }}>
              <div className="card-bg-icon">
                <CreditCard size={120} />
              </div>
              
              {card.isDefault && (
                <span style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", fontWeight: 700, border: "1px solid var(--gold)", padding: "0.25rem 0.5rem", borderRadius: "2px", zIndex: 2 }}>
                  Par défaut
                </span>
              )}

              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                  <div style={{ width: "40px", height: "25px", background: "linear-gradient(135deg, #d4af37 0%, #f9e29c 100%)", borderRadius: "4px" }}></div>
                  <h3 style={{ fontWeight: 600, letterSpacing: "0.1em", fontSize: "1rem", color: "var(--text)" }}>{card.brand.toUpperCase()}</h3>
                </div>

                <div style={{ fontSize: "1.25rem", letterSpacing: "0.2em", fontFamily: "monospace", color: "var(--text)", marginBottom: "1.5rem" }}>
                  **** **** **** {card.last4}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <span style={{ fontSize: "0.625rem", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>Expire le</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{card.expMonth.toString().padStart(2, "0")}/{card.expYear}</span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button 
                      onClick={() => handleOpenEdit(card)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", transition: "color 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.color = "var(--gold)"}
                      onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                      <Edit3 size={14} /> Modifier
                    </button>
                    <button 
                      onClick={() => openDeleteConfirm(card.id)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", transition: "color 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.color = "var(--error)"}
                      onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCard ? "Modifier la carte" : "Ajouter une carte"}
      >
        <PaymentForm 
          initialData={editingCard || undefined}
          onSubmit={handleSubmit} 
          onCancel={() => setIsModalOpen(false)} 
          submitting={isSubmitting} 
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmation de suppression"
        maxWidth="400px"
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ backgroundColor: "rgba(196, 43, 28, 0.1)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <AlertTriangle size={30} color="#c42b1c" />
          </div>
          <p style={{ color: "var(--text)", marginBottom: "0.5rem", fontWeight: 500 }}>Voulez-vous vraiment supprimer cette carte ?</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>Cette action est irréversible.</p>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={() => setIsConfirmModalOpen(false)} 
              style={{ flex: 1, padding: "0.75rem", background: "var(--bg-secondary)", border: "1px solid var(--divider)", borderRadius: "4px", color: "var(--text)", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
            >
              Annuler
            </button>
            <button 
              onClick={handleDelete} 
              disabled={isSubmitting}
              style={{ flex: 1, padding: "0.75rem", background: "#c42b1c", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}
            >
              {isSubmitting ? "Suppression..." : "Oui, supprimer"}
            </button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .payment-card:hover {
          border-color: var(--gold-soft) !important;
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .card-bg-icon {
          position: absolute;
          bottom: -20px;
          right: -20px;
          color: var(--divider);
          opacity: 0.1;
          pointer-events: none;
          transform: rotate(-15deg);
        }
      `}</style>
    </div>
  );
}
