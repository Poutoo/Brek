"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CreditCard, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastContainer";
import { Button } from "@/components/ui/Button";

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
  const [formData, setFormData] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "", // Juste pour l'UI, ne sera pas envoyé
    isDefault: false
  });

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

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette carte ?")) return;
    
    try {
      const res = await fetch(`/api/paiement/${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast({ title: "Carte supprimée", type: "success" });
        fetchCards();
      } else {
        addToast({ title: "Erreur lors de la suppression", type: "error" });
      }
    } catch (error) {
      addToast({ title: "Erreur lors de la suppression", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber.length < 15) {
      addToast({ title: "Numéro de carte invalide", type: "error" });
      return;
    }

    try {
      const res = await fetch("/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardNumber: formData.cardNumber,
          expMonth: formData.expMonth,
          expYear: formData.expYear,
          isDefault: formData.isDefault
        })
      });
      
      if (res.ok) {
        addToast({ title: "Carte ajoutée", type: "success" });
        setIsModalOpen(false);
        setFormData({ cardNumber: "", expMonth: "", expYear: "", cvc: "", isDefault: false });
        fetchCards();
      } else {
        addToast({ title: "Erreur lors de l'ajout", type: "error" });
      }
    } catch (error) {
      addToast({ title: "Erreur lors de l'ajout", type: "error" });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 400 }}>Mes cartes bancaires</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> Ajouter une carte
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {cards.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Vous n'avez pas encore enregistré de moyen de paiement.</p>
        ) : (
          cards.map((card) => (
            <div key={card.id} style={{ border: "1px solid var(--divider)", borderRadius: "8px", padding: "1.5rem", position: "relative", background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg) 100%)" }}>
              {card.isDefault && (
                <span className="badge badge-gold" style={{ position: "absolute", top: "1rem", right: "1rem" }}>Défaut</span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", color: "var(--gold)" }}>
                <CreditCard size={24} />
                <h3 style={{ fontWeight: 500, letterSpacing: "0.05em" }}>{card.brand}</h3>
              </div>
              <div style={{ fontSize: "1.25rem", letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: "1rem" }}>
                **** **** **** {card.last4}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                <span>Expire le : {card.expMonth.toString().padStart(2, '0')}/{card.expYear}</span>
                <button 
                  onClick={() => handleDelete(card.id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--error)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "var(--bg)", padding: "2.5rem", borderRadius: "4px", width: "100%", maxWidth: "500px", position: "relative" }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>
              <X size={24} />
            </button>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", marginBottom: "1rem" }}>Ajouter une carte</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
              Ceci est un environnement de démonstration. N'entrez pas de vraies informations bancaires.
            </p>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="input-group">
                <input type="text" id="cardNumber" className="input-field" required placeholder=" " maxLength={19} value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} />
                <label htmlFor="cardNumber" className="input-label">Numéro de carte</label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className="input-group">
                  <input type="text" id="expMonth" className="input-field" required placeholder=" " maxLength={2} value={formData.expMonth} onChange={e => setFormData({...formData, expMonth: e.target.value})} />
                  <label htmlFor="expMonth" className="input-label">Mois (MM)</label>
                </div>
                <div className="input-group">
                  <input type="text" id="expYear" className="input-field" required placeholder=" " maxLength={2} value={formData.expYear} onChange={e => setFormData({...formData, expYear: e.target.value})} />
                  <label htmlFor="expYear" className="input-label">Année (AA)</label>
                </div>
                <div className="input-group">
                  <input type="text" id="cvc" className="input-field" required placeholder=" " maxLength={3} value={formData.cvc} onChange={e => setFormData({...formData, cvc: e.target.value})} />
                  <label htmlFor="cvc" className="input-label">CVC</label>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input type="checkbox" id="isDefaultCard" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} style={{ accentColor: "var(--gold)", width: "16px", height: "16px" }} />
                <label htmlFor="isDefaultCard" style={{ marginBottom: 0, fontSize: "0.875rem", cursor: "pointer" }}>Définir comme carte par défaut</label>
              </div>
              
              <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
                <Button type="submit" withLine className="w-full-btn">
                  AJOUTER LA CARTE
                </Button>
              </div>
            </form>
          </div>
          <style jsx>{`
            :global(.w-full-btn) { width: 100%; }
          `}</style>
        </div>
      )}
    </div>
  );
}
