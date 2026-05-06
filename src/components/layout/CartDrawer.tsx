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
        className="cart-overlay"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className="cart-drawer"
        aria-label="Panier"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={18} />
            <h2 className="cart-title">Panier</h2>
            {items.length > 0 && (
              <span className="cart-count">{items.length}</span>
            )}
          </div>
          <button
            className="cart-close"
            onClick={closeCart}
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} strokeWidth={1} className="cart-empty-icon" />
            <p className="cart-empty-text">Votre panier est vide</p>
            <Link href="/fr/produits" className="btn btn-primary btn-sm" onClick={closeCart}>
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item">
                  <div className="cart-item-img-wrapper">
                    <Image
                      src={product.images[0] || "/assets/placeholder.png"}
                      alt={product.name}
                      fill
                      className="cart-item-img"
                      sizes="72px"
                    />
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{product.name}</p>
                    <p className="cart-item-ref">Réf. {product.ref}</p>
                    <div className="cart-item-controls">
                      <div className="cart-qty">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(product.id, +(quantity - 0.5).toFixed(1))}
                          aria-label="Réduire la quantité"
                          disabled={quantity <= 0.5}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="cart-qty-value">{quantity}m</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(product.id, +(quantity + 0.5).toFixed(1))}
                          aria-label="Augmenter la quantité"
                          disabled={quantity >= product.stock}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="cart-item-price">{formatPrice(product.price * quantity)}</span>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Supprimer ${product.name} du panier`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <div className="cart-subtotal">
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="cart-shipping">
                <span>Livraison</span>
                <span className="cart-shipping-free">Offerte</span>
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link
                href="/fr/checkout"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={closeCart}
              >
                Passer la commande
              </Link>
              <button
                className="cart-continue"
                onClick={closeCart}
              >
                Continuer les achats
              </button>
            </div>
          </>
        )}
      </aside>

      <style jsx>{`
        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--divider);
        }
        .cart-header-title {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          color: var(--text);
        }
        .cart-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 400;
        }
        .cart-count {
          background: var(--gold);
          color: var(--charcoal);
          font-size: 0.6875rem;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid var(--divider);
          border-radius: 2px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .cart-close:hover {
          color: var(--text);
          border-color: var(--gold);
        }
        .cart-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          padding: 2rem;
          text-align: center;
        }
        .cart-empty-icon { color: var(--text-muted); opacity: 0.4; }
        .cart-empty-text { font-size: 0.9375rem; color: var(--text-muted); }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .cart-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--divider);
        }
        .cart-item:last-child { border-bottom: none; }
        .cart-item-img-wrapper {
          position: relative;
          width: 72px;
          height: 90px;
          flex-shrink: 0;
          border-radius: 2px;
          overflow: hidden;
          background: var(--bg-secondary);
        }
        :global(.cart-item-img) {
          object-fit: cover;
        }
        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 2px;
        }
        .cart-item-ref {
          font-size: 0.6875rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
        .cart-item-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.625rem;
        }
        .cart-qty {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--divider);
          border-radius: 2px;
          overflow: hidden;
        }
        .cart-qty-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: var(--bg-secondary);
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.15s;
        }
        .cart-qty-btn:hover:not(:disabled) { color: var(--text); background: var(--divider); }
        .cart-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .cart-qty-value {
          font-size: 0.8125rem;
          min-width: 36px;
          text-align: center;
          color: var(--text);
        }
        .cart-item-price {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
        }
        .cart-item-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .cart-item-remove:hover { color: #c83c3c; background: rgba(200,60,60,0.08); }
        .cart-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid var(--divider);
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .cart-subtotal, .cart-shipping, .cart-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
        }
        .cart-subtotal, .cart-shipping { color: var(--text-muted); }
        .cart-total {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text);
          padding-top: 0.5rem;
          border-top: 1px solid var(--divider);
          margin-bottom: 0.5rem;
        }
        .cart-shipping-free { color: #16a34a; font-weight: 500; }
        .cart-continue {
          background: transparent;
          border: none;
          font-size: 0.8125rem;
          color: var(--text-muted);
          cursor: pointer;
          text-align: center;
          padding: 0.5rem;
          transition: color 0.15s;
        }
        .cart-continue:hover { color: var(--text); }
      `}</style>
    </>
  );
}
