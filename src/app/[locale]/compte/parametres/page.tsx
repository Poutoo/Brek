"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/ToastContainer";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function ParametresPage() {
  const { addToast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    // Fetch current user info
    fetch("/api/auth/register").then(r => r.json()).then(data => {
      if (data.user) {
        setFormData(prev => ({
          ...prev,
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          email: data.user.email || ""
        }));
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      addToast({ title: "Les nouveaux mots de passe ne correspondent pas", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        addToast({ title: "Informations mises à jour", type: "success" });
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      } else {
        addToast({ title: data.error || "Erreur lors de la mise à jour", type: "error" });
      }
    } catch (error) {
      addToast({ title: "Erreur serveur", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 400 }}>Paramètres du compte</h2>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <LogOut size={16} /> Se déconnecter
        </button>
      </div>

      <div style={{ border: "1px solid var(--divider)", borderRadius: "4px", padding: "2rem", backgroundColor: "var(--bg-secondary)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div>
            <h3 style={{ fontSize: "1.125rem", marginBottom: "1rem", color: "var(--gold)" }}>Informations personnelles</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" className="form-control" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input type="text" className="form-control" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Email</label>
              <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--divider)", margin: "1rem 0" }} />

          <div>
            <h3 style={{ fontSize: "1.125rem", marginBottom: "1rem", color: "var(--gold)" }}>Sécurité</h3>
            <div className="form-group">
              <label>Mot de passe actuel (requis pour modifier la sécurité)</label>
              <input type="password" className="form-control" value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input type="password" className="form-control" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Confirmer le mot de passe</label>
                <input type="password" className="form-control" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
