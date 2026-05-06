"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Download, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, formatStock } from "@/lib/utils";
import { ProductCard } from "@/components/molecules/ProductCard";

interface ProductDetailClientProps {
  product: {
    id: string; ref: string; name: string; slug: string; description: string;
    price: number; stock: number; unit: string; images: string[]; pdfUrl?: string | null;
    featured: boolean; metadata: Record<string, string>;
    collection?: {
      id: string; name: string; slug: string;
      designers?: { designer: { name: string; slug: string } }[];
    } | null;
  };
  suggestions: Array<{
    id: string; ref: string; name: string; slug: string; price: number;
    stock: number; unit: string; images: string[]; featured: boolean; collectionName?: string;
  }>;
  locale: string;
}

export function ProductDetailClient({ product, suggestions, locale }: ProductDetailClientProps) {
  const { addItem, openCart } = useCartStore();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;
  const images = product.images.length ? product.images : ["/assets/placeholder.png"];

  const handleAdd = () => {
    addItem({ id: product.id, ref: product.ref, name: product.name, price: product.price, images: product.images, stock: product.stock, unit: product.unit }, qty);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const metaRows = [
    { label: "Composition", key: "composition" },
    { label: "Largeur", key: "width" },
    { label: "Poids", key: "weight" },
    { label: "Origine", key: "origin" },
    { label: "Entretien", key: "care" },
  ];

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: "2rem", fontSize: "0.8125rem", color: "var(--text-muted)", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Link href={`/${locale}/produits`}>Produits</Link>
          <span>/</span>
          {product.collection && <><Link href={`/${locale}/collections/${product.collection.slug}`}>{product.collection.name}</Link><span>/</span></>}
          <span style={{ color: "var(--text)" }}>{product.name}</span>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
          {/* Galerie */}
          <div>
            <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: 4, overflow: "hidden", background: "var(--bg-secondary)", marginBottom: "0.75rem" }}>
              <Image src={images[activeImg]} alt={product.name} fill style={{ objectFit: "cover" }} priority sizes="(max-width:1024px) 100vw, 50vw" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)} aria-label="Image précédente"
                    style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,253,247,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImg((p) => (p + 1) % images.length)} aria-label="Image suivante"
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,253,247,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} aria-label={`Voir image ${i + 1}`}
                    style={{ width: 64, height: 64, borderRadius: 2, overflow: "hidden", border: `2px solid ${activeImg === i ? "var(--gold)" : "transparent"}`, cursor: "pointer", position: "relative", background: "var(--bg-secondary)", padding: 0 }}>
                    <Image src={img} alt="" fill style={{ objectFit: "cover" }} sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info produit */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {product.collection && (
              <p style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)" }}>
                {product.collection.name}
              </p>
            )}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 400, lineHeight: 1.1 }}>
              {product.name}
            </h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>Réf. {product.ref}</p>

            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300 }}>{formatPrice(product.price)}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>/ {product.unit}</span>
            </div>

            {/* Stock */}
            <div>
              {inStock ? (
                <span className="badge badge-green">{formatStock(product.stock)} disponibles</span>
              ) : (
                <span className="badge badge-red">Rupture de stock</span>
              )}
            </div>

            {/* Quantité + Ajout panier */}
            {inStock && (
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--divider)", borderRadius: 2, overflow: "hidden" }}>
                  <button onClick={() => setQty((q) => Math.max(0.5, +(q - 0.5).toFixed(1)))} style={{ width: 40, height: 48, background: "var(--bg-secondary)", border: "none", cursor: "pointer", fontSize: "1.125rem", color: "var(--text)" }} aria-label="Réduire">−</button>
                  <span style={{ minWidth: 60, textAlign: "center", fontWeight: 500 }}>{qty} m</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, +(q + 0.5).toFixed(1)))} style={{ width: 40, height: 48, background: "var(--bg-secondary)", border: "none", cursor: "pointer", fontSize: "1.125rem", color: "var(--text)" }} aria-label="Augmenter">+</button>
                </div>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={handleAdd} disabled={added} id="add-to-cart-btn" aria-label={`Ajouter ${product.name} au panier`}>
                  <ShoppingBag size={16} />
                  {added ? "Ajouté !" : "Ajouter au panier"}
                </button>
                <button className="btn btn-secondary" style={{ padding: "0 1rem", height: 48 }} aria-label="Ajouter aux favoris" id="wishlist-btn">
                  <Heart size={18} />
                </button>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid var(--divider)" }}>
              <a href={images[0]} download className="btn btn-ghost btn-sm" aria-label="Télécharger l'image">
                <Download size={14} /> Image
              </a>
              {product.pdfUrl && (
                <a href={product.pdfUrl} download className="btn btn-ghost btn-sm" aria-label="Télécharger la fiche produit PDF">
                  <Download size={14} /> Fiche produit
                </a>
              )}
              <Link href={`/${locale}/contact`} className="btn btn-ghost btn-sm">
                Sur-mesure
              </Link>
            </div>

            {/* Description */}
            <div style={{ paddingTop: "0.5rem" }}>
              <h2 style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem", fontFamily: "var(--font-body)" }}>Description</h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.9375rem" }}>{product.description}</p>
            </div>

            {/* Caractéristiques */}
            {Object.keys(product.metadata).length > 0 && (
              <div>
                <h2 style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.75rem", fontFamily: "var(--font-body)" }}>Caractéristiques</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {metaRows.filter((r) => product.metadata[r.key]).map((r) => (
                      <tr key={r.key} style={{ borderBottom: "1px solid var(--divider)" }}>
                        <td style={{ padding: "0.625rem 0", fontSize: "0.8125rem", color: "var(--text-muted)", width: "40%" }}>{r.label}</td>
                        <td style={{ padding: "0.625rem 0", fontSize: "0.8125rem", color: "var(--text)", fontWeight: 500 }}>{product.metadata[r.key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Designer */}
            {product.collection?.designers?.length && (
              <div style={{ background: "var(--bg-secondary)", borderRadius: 4, padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.25rem" }}>Designer</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem" }}>{product.collection.designers[0].designer.name}</p>
                </div>
                <Link href={`/${locale}/designers/${product.collection.designers[0].designer.slug}`} className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}>
                  Voir profil <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <section style={{ marginTop: "5rem" }} aria-labelledby="suggestions-title">
            <p className="section-subtitle">Recommandations</p>
            <h2 id="suggestions-title" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 300, marginBottom: "2rem" }}>
              Vous aimerez aussi
            </h2>
            <div className="products-grid">
              {suggestions.map((s) => <ProductCard key={s.id} product={s} locale={locale} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
