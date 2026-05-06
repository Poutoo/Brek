"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    ref: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    unit: string;
    images: string[];
    collectionName?: string;
    featured?: boolean;
  };
  locale: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ProductCard({
  product,
  locale,
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(
      {
        id: product.id,
        ref: product.ref,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        unit: product.unit,
        collectionName: product.collectionName,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.();
  };

  return (
    <article className="card card-product" style={{ position: "relative" }}>

        {/* Image */}
        <div className="product-image-wrapper">
          <Image
            src={product.images[0] || "/assets/placeholder.png"}
            alt={product.name}
            fill
            className="product-img"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Badges */}
          <div className="product-badges">
            {product.featured && (
              <span className="badge badge-gold">Sélection</span>
            )}
            {!inStock && (
              <span className="badge badge-red">Rupture</span>
            )}
          </div>

          {/* Overlay actions */}
          <div className="product-overlay" style={{ zIndex: 10 }}>
            <div className="product-actions">
              <button
                className="product-action-btn"
                onClick={handleAddToCart}
                aria-label={`Ajouter ${product.name} au panier`}
                disabled={!inStock}
                title={inStock ? "Ajouter au panier" : "Rupture de stock"}
              >
                <ShoppingBag size={16} />
              </button>
              {onToggleFavorite && (
                <button
                  className={`product-action-btn ${isFavorite ? "product-action-btn--active" : ""}`}
                  onClick={handleToggleFav}
                  aria-label={isFavorite ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
                  title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          {product.collectionName && (
            <p className="product-collection">{product.collectionName}</p>
          )}
          <h3 className="product-name">{product.name}</h3>
          <div className="product-footer">
            <span className="product-price">
              {formatPrice(product.price)}
              <span className="product-unit"> / {product.unit}</span>
            </span>
            {inStock ? (
              <span className="product-stock">{product.stock} m</span>
            ) : (
              <span className="product-stock product-stock--empty">Épuisé</span>
            )}
          </div>
          <p className="product-ref">Réf. {product.ref}</p>
        </div>

        {/* Lien global (Overlay Link) */}
        <Link 
          href={`/${locale}/produits/${product.slug}`} 
          className="product-full-link"
          aria-label={`Voir les détails de ${product.name}`}
        />

      {/* Add to cart feedback */}
      {added && (
        <div className="product-added" aria-live="polite">
          ✓ Ajouté au panier
        </div>
      )}

      <style jsx>{`
        .product-badges {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          z-index: 2;
        }
        .product-actions {
          display: flex;
          gap: 0.5rem;
        }
        .product-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255,253,247,0.9);
          border: none;
          border-radius: 2px;
          color: var(--charcoal);
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
        }
        .product-action-btn:hover {
          background: var(--gold);
          color: var(--charcoal);
        }
        .product-action-btn--active {
          background: var(--gold);
          color: var(--charcoal);
        }
        .product-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .product-info {
          padding: 0.875rem;
        }
        .product-collection {
          font-size: 0.6875rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.25rem;
        }
        .product-name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 0.5rem;
          line-height: 1.3;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .product-price {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text);
        }
        .product-unit {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 400;
        }
        .product-stock {
          font-size: 0.75rem;
          color: #16a34a;
        }
        .product-stock--empty {
          color: #c83c3c;
        }
        .product-ref {
          font-size: 0.6875rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
        .product-added {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--gold);
          color: var(--charcoal);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-align: center;
          padding: 0.5rem;
          animation: fadeInUp 0.2s var(--ease-luxury);
          z-index: 15;
        }
        .product-full-link {
          position: absolute;
          inset: 0;
          z-index: 5;
        }
        :global(.product-img) { object-fit: cover; }
      `}</style>
    </article>
  );
}
