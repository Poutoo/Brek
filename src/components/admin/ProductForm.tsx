"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

interface ProductFormProps {
  initialData?: any;
  locale: string;
}

export function ProductForm({ initialData, locale }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    ref: initialData?.ref || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    minOrder: initialData?.minOrder || 0.5,
    unit: initialData?.unit || "m",
    collectionId: initialData?.collectionId || "",
    featured: initialData?.featured || false,
    active: initialData?.active !== undefined ? initialData.active : true,
    images: initialData?.images || [],
    metadata: initialData?.metadata || {
      weight: "",
      composition: "",
      width: "",
      origin: "",
      care: "",
    },
  });

  useEffect(() => {
    // Fetch collections for the select input
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => setCollections(data))
      .catch((err) => console.error("Error fetching collections:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith("metadata.")) {
      const metaKey = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [metaKey]: value }
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
               type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleImageAdd = () => {
    const url = prompt("Entrez l'URL de l'image :");
    if (url) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = initialData ? "PATCH" : "POST";
    const url = initialData ? `/api/produits/${initialData.id}` : "/api/produits";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push(`/${locale}/dashboard/produits`);
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-grid">
        <div className="form-main">
          <section className="form-section">
            <h2 className="section-title-sm">Informations Générales</h2>
            <div className="input-group">
              <label>Nom du produit</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Galon Impérial" />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Référence (Unique)</label>
                <input type="text" name="ref" value={formData.ref} onChange={handleChange} required placeholder="Ex: BK-001" />
              </div>
              <div className="input-group">
                <label>Slug (URL)</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required placeholder="ex-galon-imperial" />
              </div>
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Description détaillée..." />
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title-sm">Images</h2>
            <div className="image-grid">
              {formData.images.map((img: string, index: number) => (
                <div key={index} className="image-preview">
                  <Image src={img} alt="" fill style={{ objectFit: "cover" }} />
                  <button type="button" onClick={() => removeImage(index)} className="image-remove"><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={handleImageAdd} className="image-add">
                <Upload size={20} />
                <span>Ajouter URL</span>
              </button>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title-sm">Caractéristiques Techniques (Metadata)</h2>
            <div className="input-row">
              <div className="input-group">
                <label>Poids (g/m²)</label>
                <input type="text" name="metadata.weight" value={formData.metadata.weight} onChange={handleChange} placeholder="Ex: 450" />
              </div>
              <div className="input-group">
                <label>Composition</label>
                <input type="text" name="metadata.composition" value={formData.metadata.composition} onChange={handleChange} placeholder="Ex: 100% Soie" />
              </div>
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Largeur (cm)</label>
                <input type="text" name="metadata.width" value={formData.metadata.width} onChange={handleChange} placeholder="Ex: 140" />
              </div>
              <div className="input-group">
                <label>Origine</label>
                <input type="text" name="metadata.origin" value={formData.metadata.origin} onChange={handleChange} placeholder="Ex: France" />
              </div>
            </div>
          </section>
        </div>

        <div className="form-sidebar">
          <section className="form-section">
            <h2 className="section-title-sm">Vente & Stock</h2>
            <div className="input-group">
              <label>Prix (au mètre)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Stock ({formData.unit})</label>
                <input type="number" step="0.1" name="stock" value={formData.stock} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Unité</label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} required />
              </div>
            </div>
            <div className="input-group">
              <label>Commande min.</label>
              <input type="number" step="0.1" name="minOrder" value={formData.minOrder} onChange={handleChange} required />
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title-sm">Organisation</h2>
            <div className="input-group">
              <label>Collection</label>
              <select name="collectionId" value={formData.collectionId} onChange={handleChange}>
                <option value="">Aucune collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))} />
              <label htmlFor="featured">Produit à la une</label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="active" name="active" checked={formData.active} onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))} />
              <label htmlFor="active">Actif (visible sur le site)</label>
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {initialData ? "Enregistrer" : "Créer le produit"}
            </button>
            <button type="button" onClick={() => router.back()} className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
              Annuler
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-form {
          margin-top: 2rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .form-grid { grid-template-columns: 1fr; }
        }
        .form-section {
          background: var(--bg-card);
          border: 1px solid var(--divider);
          border-radius: 4px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .section-title-sm {
          font-family: var(--font-display);
          font-size: 1.125rem;
          margin-bottom: 1.25rem;
          color: var(--gold);
        }
        .input-group {
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        input[type="text"],
        input[type="number"],
        textarea,
        select {
          padding: 0.75rem 1rem;
          background: var(--bg);
          border: 1px solid var(--divider);
          border-radius: 2px;
          color: var(--text);
          font-size: 0.875rem;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--gold);
        }
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .checkbox-group label {
          text-transform: none;
          letter-spacing: normal;
          font-size: 0.875rem;
          color: var(--text);
          cursor: pointer;
        }
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
        }
        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 2px;
          overflow: hidden;
          background: var(--bg-secondary);
        }
        .image-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          padding: 4px;
          border-radius: 50%;
          cursor: pointer;
        }
        .image-add {
          aspect-ratio: 1;
          border: 2px dashed var(--divider);
          background: transparent;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.75rem;
        }
        .image-add:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        .form-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          position: sticky;
          top: 2rem;
        }
      `}</style>
    </form>
  );
}
