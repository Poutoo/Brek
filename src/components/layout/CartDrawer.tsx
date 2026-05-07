"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();
  const total = getTotalPrice();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-[#1a1614]/60 backdrop-blur-sm z-[1000] animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-[var(--bg-card)] z-[1001] shadow-2xl flex flex-col animate-slide-in-right"
        aria-label="Panier"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--divider)]">
          <div className="flex items-center gap-2.5 text-[var(--text)]">
            <ShoppingBag size={18} />
            <h2 className="font-serif text-xl font-normal">Panier</h2>
            {items.length > 0 && (
              <span className="bg-[var(--gold)] text-[var(--charcoal)] text-[0.6875rem] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <button
            className="flex items-center justify-center w-9 h-9 bg-transparent border border-[var(--divider)] rounded-sm text-[var(--text-muted)] cursor-pointer transition-all hover:text-[var(--text)] hover:border-[var(--gold)]"
            onClick={closeCart}
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
            <ShoppingBag size={48} strokeWidth={1} className="text-[var(--text-muted)] opacity-40" />
            <p className="text-[0.9375rem] text-[var(--text-muted)]">Votre panier est vide</p>
            <Link href="/fr/produits" className="btn btn-primary btn-sm" onClick={closeCart}>
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-start gap-3.5 pb-4 border-b border-[var(--divider)] last:border-b-0">
                  <div className="relative w-[72px] h-[90px] shrink-0 rounded-sm overflow-hidden bg-[var(--bg-secondary)]">
                    <Image
                      src={product.images[0] || "/assets/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate mb-0.5">{product.name}</p>
                    <p className="text-[0.6875rem] text-[var(--text-muted)] tracking-wider">Réf. {product.ref}</p>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-2 border border-[var(--divider)] rounded-sm overflow-hidden">
                        <button
                          className="flex items-center justify-center w-7 h-7 bg-[var(--bg-secondary)] border-none cursor-pointer text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:bg-[var(--divider)] disabled:opacity-40 disabled:cursor-not-allowed"
                          onClick={() => updateQuantity(product.id, +(quantity - 0.5).toFixed(1))}
                          aria-label="Réduire la quantité"
                          disabled={quantity <= 0.5}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[0.8125rem] min-w-[36px] text-center text-[var(--text)] font-medium">{quantity}m</span>
                        <button
                          className="flex items-center justify-center w-7 h-7 bg-[var(--bg-secondary)] border-none cursor-pointer text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:bg-[var(--divider)] disabled:opacity-40 disabled:cursor-not-allowed"
                          onClick={() => updateQuantity(product.id, +(quantity + 0.5).toFixed(1))}
                          aria-label="Augmenter la quantité"
                          disabled={quantity >= product.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-[var(--text)]">{formatPrice(product.price * quantity)}</span>
                    </div>
                  </div>
                  <button
                    className="flex items-center justify-center w-7 h-7 bg-transparent border-none text-[var(--text-muted)] cursor-pointer rounded-sm transition-all hover:text-[#c83c3c] hover:bg-[#c83c3c]/10 shrink-0"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Supprimer ${product.name} du panier`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-5 md:p-6 border-t border-[var(--divider)] flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                <span>Livraison</span>
                <span className="text-[#16a34a] font-medium">Offerte</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-base text-[var(--text)] pt-2 border-t border-[var(--divider)] mb-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link
                href="/fr/checkout"
                className="btn btn-primary w-full justify-center"
                onClick={closeCart}
              >
                Passer la commande
              </Link>
              <button
                className="bg-transparent border-none text-[0.8125rem] text-[var(--text-muted)] cursor-pointer text-center p-2 transition-colors hover:text-[var(--text)]"
                onClick={closeCart}
              >
                Continuer les achats
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
