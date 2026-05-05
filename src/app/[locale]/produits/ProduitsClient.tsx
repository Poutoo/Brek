"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface Product {
  id: string;
  ref: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  unit: string;
  images: string[];
  featured: boolean;
  collectionName?: string;
  collection?: { name: string; slug: string } | null;
}

interface ProduitsClientProps {
  locale: string;
  collections: { id: string; name: string; slug: string }[];
}

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Nouveautés" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "name_asc", label: "Nom A-Z" },
];

export function ProduitsClient({ locale, collections }: ProduitsClientProps) {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useState(initialQ);
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get("collection") || "");
  const [sort, setSort] = useState("createdAt_desc");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchProducts = async (pageNum = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: "12",
      sort,
      ...(query && { q: query }),
      ...(selectedCollection && { collection: selectedCollection }),
      ...(inStockOnly && { inStock: "true" }),
    });

    try {
      const res = await fetch(`/api/produits?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedCollection, sort, inStockOnly]);

  useEffect(() => {
    if (page > 1) fetchProducts(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p className="section-subtitle">Catalogue</p>
          <h1 className="section-title">Nos produits</h1>
        </div>

        {/* Barre de recherche + filtres */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom ou référence…"
              style={{
                width: "100%",
                padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                border: "1px solid var(--divider)",
                borderRadius: 2,
                background: "var(--bg-card)",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                outline: "none",
              }}
              aria-label="Rechercher des produits"
              id="product-search"
            />
          </div>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              border: "1px solid var(--divider)",
              borderRadius: 2,
              background: "var(--bg-card)",
              color: "var(--text)",
              fontSize: "0.875rem",
              outline: "none",
              cursor: "pointer",
            }}
            aria-label="Filtrer par collection"
            id="collection-filter"
          >
            <option value="">Toutes les collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              border: "1px solid var(--divider)",
              borderRadius: 2,
              background: "var(--bg-card)",
              color: "var(--text)",
              fontSize: "0.875rem",
              outline: "none",
              cursor: "pointer",
            }}
            aria-label="Trier les produits"
            id="sort-select"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              id="in-stock-filter"
            />
            En stock uniquement
          </label>
        </div>

        {/* Résultats count */}
        {!loading && (
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            {total} produit{total !== 1 ? "s" : ""}
            {query && ` pour « ${query} »`}
          </p>
        )}

        {/* Grille */}
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: "3/4", marginBottom: "0.875rem" }} />
                <div className="skeleton" style={{ height: 16, width: "70%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: "40%" }} />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={{ ...product, collectionName: product.collection?.name }} locale={locale} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={page === i + 1 ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                    aria-label={`Page ${i + 1}`}
                    aria-current={page === i + 1 ? "page" : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>Aucun produit trouvé</p>
            <button className="btn btn-ghost" onClick={() => { setQuery(""); setSelectedCollection(""); }}>
              <X size={14} /> Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
