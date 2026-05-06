"use client";

import { useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/molecules/ProductCard";

interface FavProduct {
  id: string; ref: string; name: string; slug: string; price: number;
  stock: number; unit: string; images: string[]; featured: boolean;
  collection?: { name: string } | null;
}
interface Favorite { id: string; product: FavProduct; }

export default function FavorisPage({ params }: { params: Promise<{ locale: string }> }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState("fr");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
    fetch("/api/favoris").then((r) => r.json()).then((d) => { setFavorites(d.favorites || []); setLoading(false); });
  }, [params]);

  const remove = async (productId: string) => {
    await fetch("/api/favoris", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) });
    setFavorites((prev) => prev.filter((f) => f.product.id !== productId));
  };

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "2rem" }}>
          Mes favoris {!loading && favorites.length > 0 && <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>({favorites.length})</span>}
        </h1>

        {loading ? (
          <div className="products-grid">{[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ aspectRatio: "3/4" }} />)}</div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
            <Heart size={48} strokeWidth={1} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <p style={{ marginBottom: "1.5rem" }}>Vous n'avez pas encore de favoris</p>
            <Link href={`/${locale}/produits`} className="btn btn-primary">Explorer nos produits</Link>
          </div>
        ) : (
          <div className="products-grid">
            {favorites.map(({ product }) => (
              <div key={product.id} style={{ position: "relative" }}>
                <ProductCard
                  product={{ ...product, collectionName: product.collection?.name }}
                  locale={locale}
                  isFavorite
                  onToggleFavorite={() => remove(product.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
