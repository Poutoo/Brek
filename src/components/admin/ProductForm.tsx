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
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <section className="bg-[var(--bg-card)] border border-[var(--divider)] rounded p-6">
            <h2 className="font-serif text-[1.125rem] mb-5 text-[var(--gold)]">Informations Générales</h2>
            <div className="mb-5 flex flex-col gap-2">
              <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Nom du produit</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required 
                placeholder="Ex: Galon Impérial" 
                className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Référence (Unique)</label>
                <input 
                  type="text" name="ref" value={formData.ref} onChange={handleChange} required 
                  placeholder="Ex: BK-001" 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Slug (URL)</label>
                <input 
                  type="text" name="slug" value={formData.slug} onChange={handleChange} required 
                  placeholder="ex-galon-imperial" 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows={5} 
                placeholder="Description détaillée..." 
                className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
              />
            </div>
          </section>

          <section className="bg-[var(--bg-card)] border border-[var(--divider)] rounded p-6">
            <h2 className="font-serif text-[1.125rem] mb-5 text-[var(--gold)]">Images</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {formData.images.map((img: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-sm overflow-hidden bg-[var(--bg-secondary)]">
                  <Image src={img} alt="" fill className="object-cover" />
                  <button 
                    type="button" onClick={() => removeImage(index)} 
                    className="absolute top-1 right-1 bg-black/50 text-white border-none p-1 rounded-full cursor-pointer hover:bg-black/70"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                type="button" onClick={handleImageAdd} 
                className="aspect-square border-2 border-dashed border-[var(--divider)] bg-transparent text-[var(--text-muted)] flex flex-col items-center justify-center gap-2 cursor-pointer text-[0.75rem] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors rounded-sm"
              >
                <Upload size={20} />
                <span>Ajouter URL</span>
              </button>
            </div>
          </section>

          <section className="bg-[var(--bg-card)] border border-[var(--divider)] rounded p-6">
            <h2 className="font-serif text-[1.125rem] mb-5 text-[var(--gold)]">Caractéristiques Techniques (Metadata)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Poids (g/m²)</label>
                <input 
                  type="text" name="metadata.weight" value={formData.metadata.weight} onChange={handleChange} 
                  placeholder="Ex: 450" 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Composition</label>
                <input 
                  type="text" name="metadata.composition" value={formData.metadata.composition} onChange={handleChange} 
                  placeholder="Ex: 100% Soie" 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Largeur (cm)</label>
                <input 
                  type="text" name="metadata.width" value={formData.metadata.width} onChange={handleChange} 
                  placeholder="Ex: 140" 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Origine</label>
                <input 
                  type="text" name="metadata.origin" value={formData.metadata.origin} onChange={handleChange} 
                  placeholder="Ex: France" 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-[var(--bg-card)] border border-[var(--divider)] rounded p-6">
            <h2 className="font-serif text-[1.125rem] mb-5 text-[var(--gold)]">Vente & Stock</h2>
            <div className="mb-5 flex flex-col gap-2">
              <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Prix (au mètre)</label>
              <input 
                type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required 
                className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Stock ({formData.unit})</label>
                <input 
                  type="number" step="0.1" name="stock" value={formData.stock} onChange={handleChange} required 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Unité</label>
                <input 
                  type="text" name="unit" value={formData.unit} onChange={handleChange} required 
                  className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Commande min.</label>
              <input 
                type="number" step="0.1" name="minOrder" value={formData.minOrder} onChange={handleChange} required 
                className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)]"
              />
            </div>
          </section>

          <section className="bg-[var(--bg-card)] border border-[var(--divider)] rounded p-6">
            <h2 className="font-serif text-[1.125rem] mb-5 text-[var(--gold)]">Organisation</h2>
            <div className="mb-5 flex flex-col gap-2">
              <label className="text-[0.75rem] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Collection</label>
              <select 
                name="collectionId" value={formData.collectionId} onChange={handleChange}
                className="p-3 bg-[var(--bg)] border border-[var(--divider)] rounded-sm text-[var(--text)] text-sm outline-none focus:border-[var(--gold)] cursor-pointer"
              >
                <option value="">Aucune collection</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <input 
                type="checkbox" id="featured" name="featured" checked={formData.featured} 
                onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))} 
                className="accent-[var(--gold)] w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm text-[var(--text)] lowercase-none cursor-pointer">Produit à la une</label>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <input 
                type="checkbox" id="active" name="active" checked={formData.active} 
                onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))} 
                className="accent-[var(--gold)] w-4 h-4"
              />
              <label htmlFor="active" className="text-sm text-[var(--text)] lowercase-none cursor-pointer">Actif (visible sur le site)</label>
            </div>
          </section>

          <div className="flex flex-col gap-3 lg:sticky lg:top-8">
            <button 
              type="submit" disabled={loading} 
              className="bg-[var(--gold)] text-white w-full py-4 px-6 font-bold text-[0.8125rem] tracking-widest uppercase transition-all hover:bg-[var(--gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {initialData ? "Enregistrer" : "Créer le produit"}
            </button>
            <button 
              type="button" onClick={() => router.back()} 
              className="bg-transparent border border-[var(--divider)] text-[var(--text)] w-full py-4 px-6 font-bold text-[0.8125rem] tracking-widest uppercase transition-all hover:bg-[var(--bg-secondary)] flex items-center justify-center rounded-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}