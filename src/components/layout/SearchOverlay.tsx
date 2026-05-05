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
        className="search-overlay-bg"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Recherche">
        <form onSubmit={handleSubmit} className="search-form">
          <Search size={20} className="search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom ou référence…"
            className="search-input"
            aria-label="Rechercher des produits"
            id="search-input"
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQuery("")}
              aria-label="Effacer la recherche"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Résultats */}
        {loading && (
          <div className="search-results">
            {[1, 2, 3].map((i) => (
              <div key={i} className="search-result-skeleton">
                <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 11, width: "30%" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="search-results">
            {results.map((product) => (
              <button
                key={product.id}
                className="search-result-item"
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
                  className="search-result-img"
                />
                <div className="search-result-info">
                  <p className="search-result-name">{product.name}</p>
                  <p className="search-result-ref">Réf. {product.ref}</p>
                </div>
                <ArrowRight size={14} className="search-result-arrow" />
              </button>
            ))}
            <button
              className="search-see-all"
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
          <div className="search-empty">
            <p>Aucun résultat pour « <strong>{query}</strong> »</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .search-overlay-bg {
          position: fixed;
          inset: 0;
          background: rgba(26, 22, 20, 0.6);
          z-index: 700;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s var(--ease-luxury);
        }
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: var(--bg-card);
          z-index: 701;
          box-shadow: var(--shadow-lg);
          animation: slideInLeft 0.25s var(--ease-luxury);
          max-height: 80vh;
          overflow-y: auto;
        }
        .search-form {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--divider);
        }
        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .search-input {
          flex: 1;
          font-family: var(--font-body);
          font-size: 1.0625rem;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text);
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--bg-secondary);
          border: none;
          border-radius: 50%;
          color: var(--text-muted);
          cursor: pointer;
        }
        .search-results {
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .search-result-skeleton {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
          width: 100%;
        }
        .search-result-item:hover {
          background: var(--bg-secondary);
        }
        .search-result-img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .search-result-info { flex: 1; }
        .search-result-name {
          font-size: 0.875rem;
          color: var(--text);
          font-weight: 500;
        }
        .search-result-ref {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .search-result-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .search-see-all {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          font-size: 0.8125rem;
          color: var(--gold);
          font-weight: 500;
          background: transparent;
          border: none;
          border-top: 1px solid var(--divider);
          cursor: pointer;
          width: 100%;
          transition: background 0.15s;
          margin-top: 0.25rem;
        }
        .search-see-all:hover { background: var(--bg-secondary); }
        .search-empty {
          padding: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      `}</style>
    </>
  );
}
