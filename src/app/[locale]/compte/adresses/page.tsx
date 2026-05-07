"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, MapPin, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastContainer";

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
  const [formData, setFormData] = useState({
    label: "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    country: "France",
    isDefault: false
  });

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

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette adresse ?")) return;
    
    try {
      const res = await fetch(`/api/adresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        addToast({ title: "Adresse supprimée", type: "success" });
        fetchAddresses();
      } else {
        addToast({ title: "Erreur lors de la suppression", type: "error" });
      }
    } catch (error) {
      addToast({ title: "Erreur lors de la suppression", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/adresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        addToast({ title: "Adresse ajoutée", type: "success" });
        setIsModalOpen(false);
        setFormData({ label: "", firstName: "", lastName: "", line1: "", line2: "", city: "", postalCode: "", country: "France", isDefault: false });
        fetchAddresses();
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
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 400 }}>Mes adresses</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> Ajouter une adresse
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {addresses.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Vous n'avez pas encore enregistré d'adresse.</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} style={{ border: "1px solid var(--divider)", borderRadius: "4px", padding: "1.5rem", position: "relative" }}>
              {addr.isDefault && (
                <span className="badge badge-gold" style={{ position: "absolute", top: "1rem", right: "1rem" }}>Défaut</span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "var(--gold)" }}>
                <MapPin size={20} />
                <h3 style={{ fontWeight: 500 }}>{addr.label}</h3>
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--text)", lineHeight: "1.6" }}>
                <p style={{ fontWeight: 500 }}>{addr.firstName} {addr.lastName}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{addr.postalCode} {addr.city}</p>
                <p>{addr.country}</p>
              </div>
              <button 
                onClick={() => handleDelete(addr.id)}
                style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--error)", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <Trash2 size={16} /> Supprimer
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "var(--bg)", padding: "2rem", borderRadius: "4px", width: "100%", maxWidth: "500px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>
              <X size={24} />
            </button>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Ajouter une adresse</h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label>Nom de l'adresse (ex: Domicile, Bureau)</label>
                <input type="text" className="form-control" required value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" className="form-control" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" className="form-control" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse (Ligne 1)</label>
                <input type="text" className="form-control" required value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Complément d'adresse (Ligne 2)</label>
                <input type="text" className="form-control" value={formData.line2} onChange={e => setFormData({...formData, line2: e.target.value})} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Code Postal</label>
                  <input type="text" className="form-control" required value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input type="text" className="form-control" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                <label htmlFor="isDefault" style={{ marginBottom: 0 }}>Définir comme adresse par défaut</label>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Enregistrer l'adresse
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
