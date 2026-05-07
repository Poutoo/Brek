"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";

interface SearchOverlayProps {
  locale: string;
  onClose: () => void;
}

export function SearchOverlay({ locale, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ id: string; name: string; ref: string; slug: string; images: string[] }>>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/produits/search?q=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/produits?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-[#1a1614]/60 backdrop-blur-sm z-[700] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="fixed top-0 left-0 right-0 bg-[var(--bg-card)] z-[701] shadow-2xl animate-slide-in-left max-h-[80vh] overflow-y-auto" 
        role="dialog" 
        aria-modal="true" 
        aria-label="Recherche"
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-5 border-b border-[var(--divider)]">
          <Search size={20} className="text-[var(--text-muted)] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom ou référence…"
            className="flex-1 font-body text-[1.0625rem] bg-transparent border-none outline-none text-[var(--text)] placeholder:text-[var(--text-muted)]"
            aria-label="Rechercher des produits"
            id="search-input"
          />
          {query && (
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 bg-[var(--bg-secondary)] border-none rounded-full text-[var(--text-muted)] cursor-pointer"
              onClick={() => setQuery("")}
              aria-label="Effacer la recherche"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Résultats */}
        {loading && (
          <div className="p-3 flex flex-col gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="skeleton w-12 h-12 rounded-sm shrink-0" />
                <div className="flex-1">
                  <div className="skeleton h-3.5 w-[60%] mb-1.5" />
                  <div className="skeleton h-[11px] w-[30%]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="p-3 flex flex-col gap-1">
            {results.map((product) => (
              <button
                key={product.id}
                className="flex items-center gap-3 p-3 bg-transparent border-none rounded cursor-pointer text-left transition-colors hover:bg-[var(--bg-secondary)] w-full"
                onClick={() => {
                  router.push(`/${locale}/produits/${product.slug}`);
                  onClose();
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images[0] || "/assets/placeholder.png"}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-sm shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[0.875rem] text-[var(--text)] font-medium">{product.name}</p>
                  <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5">Réf. {product.ref}</p>
                </div>
                <ArrowRight size={14} className="text-[var(--text-muted)] shrink-0" />
              </button>
            ))}
            <button
              className="flex items-center justify-center gap-2 p-3 text-[0.8125rem] text-[var(--gold)] font-medium bg-transparent border-none border-t border-[var(--divider)] cursor-pointer w-full transition-colors hover:bg-[var(--bg-secondary)] mt-1"
              onClick={() => {
                router.push(`/${locale}/produits?q=${encodeURIComponent(query)}`);
                onClose();
              }}
            >
              Voir tous les résultats
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <div className="p-6 text-center text-[0.875rem] text-[var(--text-muted)]">
            <p>Aucun résultat pour « <strong>{query}</strong> »</p>
          </div>
        )}
      </div>
    </>
  );
}
