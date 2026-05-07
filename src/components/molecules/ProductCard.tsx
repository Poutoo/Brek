"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";

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
  const [mounted, setMounted] = useState(false);
  const inStock = product.stock > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // URL de sécurité
  const safeLocale = locale || "fr";
  const productUrl = `/${safeLocale}/produits/${product.slug || product.id}`;

  if (!mounted) return null;

  return (
    <div className="relative h-full">
      <article className="group relative bg-white border border-[var(--divider)] transition-all duration-400 ease-[var(--ease-luxury)] flex flex-col h-full rounded-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[var(--gold)]">
        {/* 1. Image Section */}
        <div className="relative aspect-[4/5] w-full bg-[var(--bg-secondary)] overflow-hidden z-[1]">
          <Image
            src={product.images[0] || "/assets/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-600 ease-[var(--ease-luxury)] group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-[2]">
            {product.featured && (
              <span className="text-[10px] tracking-widest px-2.5 py-1.5 font-bold rounded-sm bg-[var(--gold)] text-white">
                SÉLECTION
              </span>
            )}
            {!inStock && (
              <span className="text-[10px] tracking-widest px-2.5 py-1.5 font-bold rounded-sm bg-red-500 text-white">
                RUPTURE
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ease-[var(--ease-luxury)] translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 z-[30]">
            <button
              className="w-9 h-9 bg-white border-none flex items-center justify-center text-[var(--text)] cursor-pointer transition-colors shadow-md rounded hover:bg-[var(--gold)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={!inStock}
              title={inStock ? "Ajouter au panier" : "Épuisé"}
            >
              <ShoppingBag size={18} />
            </button>
            {onToggleFavorite && (
              <button
                className={`w-9 h-9 bg-white border-none flex items-center justify-center cursor-pointer transition-colors shadow-md rounded hover:bg-[var(--gold)] hover:text-white ${isFavorite ? "text-[var(--gold)] hover:text-white" : "text-[var(--text)]"}`}
                onClick={handleToggleFav}
                title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Info Section */}
        <div className="p-5 flex flex-col gap-2 flex-grow z-[1]">
          {product.collectionName && (
            <p className="text-[10px] tracking-[0.15em] uppercase text-[var(--gold)] font-semibold m-0">
              {product.collectionName}
            </p>
          )}
          <h3 className="font-serif text-lg leading-tight font-normal text-[var(--text)] m-0.5">
            {product.name}
          </h3>
          <div className="mt-auto flex items-baseline gap-1">
            <span className="text-base font-semibold text-[var(--text)]">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-[var(--text-muted)]"> / {product.unit}</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] tracking-wider m-1">
            REF. {product.ref}
          </p>
        </div>

        {/* 3. Global Overlay Link (Z-INDEX 20) */}
        <Link 
          href={productUrl} 
          className="absolute inset-0 z-[20] cursor-pointer block"
          aria-label={`Voir les détails de ${product.name}`}
        >
          <span className="sr-only">Détails</span>
          <div className="absolute bottom-4 left-4 bg-white px-2.5 py-1 text-[10px] font-bold tracking-widest text-[var(--text)] flex items-center gap-1 opacity-0 translate-y-2.5 transition-all duration-300 ease-[var(--ease-luxury)] rounded-sm shadow-md group-hover:opacity-100 group-hover:translate-y-0">
             VOIR <ArrowUpRight size={12} />
          </div>
        </Link>

        {/* Feedback Ajout */}
        {added && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center font-bold text-xs tracking-[0.2em] text-[var(--gold)] z-[40] animate-[fadeIn_0.3s_ease]">
            ✓ AJOUTÉ
          </div>
        )}
      </article>
    </div>
  );
}

