"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, Edit3, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/ToastContainer";
import { Modal } from "@/components/ui/Modal";
import { AddressForm } from "@/components/forms/AddressForm";
import { Button } from "@/components/ui/Button";

type Address = {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function AdressesPage() {
  const { addToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/adresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async () => {
    if (!addressToDelete) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/adresses/${addressToDelete}`, { method: "DELETE" });
      if (res.ok) {
        addToast({ title: "Adresse supprimée", type: "success" });
        fetchAddresses();
        setIsConfirmModalOpen(false);
      } else {
        addToast({ title: "Erreur lors de la suppression", type: "error" });
      }
    } catch (error) {
      addToast({ title: "Erreur lors de la suppression", type: "error" });
    } finally {
      setIsSubmitting(false);
      setAddressToDelete(null);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setAddressToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
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
        setIsModalOpen(false);
        fetchAddresses();
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
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 400 }}>Mes adresses</h2>
        <button className="btn btn-primary" onClick={handleOpenAdd} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> Ajouter une adresse
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {addresses.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", padding: "4rem 2rem", textAlign: "center", background: "var(--bg-secondary)", borderRadius: "4px" }}>
            <MapPin size={48} style={{ color: "var(--divider)", marginBottom: "1rem" }} />
            <p style={{ color: "var(--text-muted)" }}>Vous n'avez pas encore enregistré d'adresse.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} style={{ border: "1px solid var(--divider)", borderRadius: "4px", padding: "2rem", position: "relative", backgroundColor: "var(--bg-card)", transition: "all 0.3s var(--ease-luxury)" }} className="address-card">
              {addr.isDefault && (
                <span style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", fontWeight: 700, border: "1px solid var(--gold)", padding: "0.25rem 0.5rem", borderRadius: "2px" }}>
                  Par défaut
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", color: "var(--gold)" }}>
                <MapPin size={20} />
                <h3 style={{ fontWeight: 500, fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>{addr.label}</h3>
              </div>
              <div style={{ fontSize: "0.9375rem", color: "var(--text)", lineHeight: "1.8" }}>
                <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>{addr.firstName} {addr.lastName}</p>
                <p style={{ color: "var(--text-muted)" }}>{addr.line1}</p>
                {addr.line2 && <p style={{ color: "var(--text-muted)" }}>{addr.line2}</p>}
                <p style={{ color: "var(--text-muted)" }}>{addr.postalCode} {addr.city}</p>
                <p style={{ color: "var(--text-muted)", textTransform: "uppercase" }}>{addr.country}</p>
              </div>
              
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}>
                <button 
                  onClick={() => handleOpenEdit(addr)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--gold)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  <Edit3 size={14} /> Modifier
                </button>
                <button 
                  onClick={() => openDeleteConfirm(addr.id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--error)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingAddress ? "Modifier l'adresse" : "Ajouter une adresse"}
      >
        <AddressForm 
          initialData={editingAddress || undefined}
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
          <p style={{ color: "var(--text)", marginBottom: "0.5rem", fontWeight: 500 }}>Voulez-vous vraiment supprimer cette adresse ?</p>
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
        .address-card:hover {
          border-color: var(--gold-soft) !important;
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
}
