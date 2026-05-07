"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Maximize2, HelpCircle, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, formatStock } from "@/lib/utils";
import { ProductCard } from "@/components/molecules/ProductCard";
import { Button } from "@/components/ui/Button";

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
  const [qty, setQty] = useState(1.00);
  const [added, setAdded] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inStock = product.stock > 0;
  const images = product.images.length ? product.images : ["/assets/placeholder.png"];

  // Simulation de variantes de couleurs pour le design luxe
  const colors = [
    { id: "9710", name: "Sauge", img: images[0] },
    { id: "9711", name: "Poudré", img: images[1] || images[0] },
    { id: "9712", name: "Or", img: images[2] || images[0] },
    { id: "9713", name: "Terre", img: images[0] },
    { id: "9714", name: "Noir", img: images[0] },
    { id: "9715", name: "Gris", img: images[0] },
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleAdd = () => {
    addItem({ 
      id: product.id, 
      ref: product.ref, 
      name: product.name, 
      price: product.price, 
      images: product.images, 
      stock: product.stock, 
      unit: product.unit 
    }, qty);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  if (!isMounted) return null;
  return (
    <div className="pt-8 pb-24 bg-[var(--bg)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 xl:px-32">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-[11px] tracking-widest text-[var(--text-muted)] mb-12 uppercase" aria-label="Breadcrumb">
          <Link href={`/${locale}/produits`} className="text-inherit no-underline hover:text-[var(--gold)] transition-colors">PRODUITS</Link>
          <span className="opacity-50">/</span>
          {product.collection && (
            <>
              <Link href={`/${locale}/collections/${product.collection.slug}`} className="text-inherit no-underline hover:text-[var(--gold)] transition-colors">{product.collection.name}</Link>
              <span className="opacity-50">/</span>
            </>
          )}
          <span className="text-[var(--text)] font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
          
          {/* LEFT: GALLERY */}
          <div className="flex gap-6">
            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  className={`w-20 h-20 relative border bg-[#f7f6f2] cursor-pointer overflow-hidden transition-all duration-300 rounded-sm ${activeImg === i ? "border-[var(--gold)]" : "border-transparent"}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Voir l'image ${i + 1}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
            
            <div className="flex-1 relative bg-[#f7f6f2] aspect-[1/0.85] flex items-center justify-center rounded overflow-hidden group">
              {product.featured && (
                <span className="absolute top-6 left-6 bg-white py-1.5 px-3 text-[10px] tracking-widest text-[var(--text)] z-10 font-semibold shadow-sm">
                  NOUVEAUTÉ
                </span>
              )}
              <button 
                className="absolute top-6 right-6 w-11 h-11 bg-white border-none rounded-full flex items-center justify-center cursor-pointer text-[var(--text)] shadow-sm z-10 transition-all duration-300 hover:bg-[var(--gold)] hover:text-white hover:scale-110" 
                aria-label="Ajouter aux favoris"
              >
                <Heart size={20} />
              </button>
              
              <div className="w-full h-full relative">
                <Image 
                  src={images[activeImg]} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                  priority 
                  sizes="(max-width:1024px) 100vw, 50vw" 
                />
              </div>
              
              <button 
                className="absolute bottom-6 right-6 w-10 h-10 bg-white/80 border-none rounded flex items-center justify-center cursor-pointer text-[var(--text)] z-10 backdrop-blur-sm" 
                aria-label="Agrandir l'image"
              >
                <Maximize2 size={20} />
              </button>

              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => setActiveImg((p) => (p - 1 + images.length) % images.length)} className="w-10 h-10 bg-white border-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto shadow-md">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setActiveImg((p) => (p + 1) % images.length)} className="w-10 h-10 bg-white border-none rounded-full flex items-center justify-center cursor-pointer pointer-events-auto shadow-md">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-[11px] tracking-[0.2em] text-[var(--gold)] block mb-3 font-semibold uppercase">
                {product.collection?.name || "BREK COLLECTION"}
              </span>
              <h1 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-none font-normal text-[var(--text)] uppercase m-0">
                {product.name}
              </h1>
              
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="line-through text-[var(--text-muted)] text-sm">{formatPrice(product.price * 1.8)} HT</span>
                  <span className="bg-[#f1f1f1] py-0.5 px-2 rounded-sm text-[11px] font-bold text-[var(--text)]">45.00 %</span>
                  <button className="bg-none border-none text-[#ccc] cursor-pointer p-0 flex" title="Informations prix"><HelpCircle size={14} /></button>
                </div>
                <div className="font-body text-[1.25rem] font-semibold text-[var(--text)]">
                  {formatPrice(product.price)} HT / {product.unit.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="flex gap-10 text-[12px] text-[var(--text)] pt-6 border-t border-[var(--divider)]">
              <span className="uppercase tracking-wider opacity-60">REF: {product.ref}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${inStock ? "bg-[#22c55e]" : "bg-[#ef4444]"}`}></span>
                <span className="uppercase tracking-wider">STOCK : {formatStock(product.stock)} ({product.unit.toUpperCase()})</span>
                <button className="bg-none border-none text-[#ccc] cursor-pointer p-0 flex" title="Informations stock"><HelpCircle size={14} /></button>
              </div>
            </div>

            <div className="mt-2">
              <div className="text-[12px] font-semibold text-[var(--text-muted)] mb-5 tracking-wider uppercase">
                COULEUR <span className="text-[var(--text)] ml-2">{selectedColor.id} - {selectedColor.name.toUpperCase()}</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {colors.map((color) => (
                  <button 
                    key={color.id} 
                    className={`w-14 h-14 rounded-full border-2 p-0.5 cursor-pointer bg-white transition-all duration-300 ${selectedColor.id === color.id ? "border-[var(--text)]" : "border-transparent"}`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Couleur ${color.name}`}
                  >
                    <div className="w-full h-full relative rounded-full overflow-hidden">
                      <Image src={color.img} alt={color.name} fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="w-[90px]">
                <input 
                  type="number" 
                  value={qty} 
                  onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                  className="w-full h-[56px] border border-[var(--divider)] text-center text-base font-medium bg-white outline-none focus:border-[var(--text)] transition-colors"
                  step="0.5"
                  min="0.5"
                />
              </div>
              <button 
                className="flex-1 h-[56px] bg-[#4a3b3b] text-white border-none flex items-center justify-center gap-3 text-[13px] font-semibold tracking-widest cursor-pointer transition-all duration-300 hover:bg-[#1a1614] disabled:bg-[#ccc] disabled:cursor-not-allowed" 
                onClick={handleAdd} disabled={!inStock}
              >
                <ShoppingBag size={20} />
                {!inStock ? "ÉPUISÉ" : added ? "AJOUTÉ !" : "AJOUTER AU PANIER"}
              </button>
            </div>

            <div className="border-t border-b border-[var(--divider)]">
              <button 
                className="w-full py-6 flex justify-between items-center bg-none border-none cursor-pointer text-[12px] font-bold tracking-widest text-[var(--text)] text-left uppercase" 
                onClick={() => setShowFeatures(!showFeatures)}
                aria-expanded={showFeatures}
              >
                CARACTÉRISTIQUES
                <span className="relative w-2.5 h-2.5">
                  <span className={`absolute bg-[var(--text)] transition-transform duration-300 w-full h-[1.5px] top-[4px] left-0`}></span>
                  <span className={`absolute bg-[var(--text)] transition-all duration-300 w-[1.5px] h-full top-0 left-[4px] ${showFeatures ? "rotate-90 opacity-0" : ""}`}></span>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-[var(--ease-luxury)] ${showFeatures ? "max-h-[500px] pb-8 opacity-100" : "max-h-0 opacity-0"}`}>
                <table className="w-full text-[13px] leading-[2.2]">
                  <tbody>
                    {Object.entries(product.metadata).map(([key, val]) => (
                      <tr key={key}>
                        <td className="text-[var(--text-muted)] w-[40%]">{key}</td>
                        <td className="text-[var(--text)] font-medium">{val}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="text-[var(--text-muted)] w-[40%]">Référence</td>
                      <td className="text-[var(--text)] font-medium">{product.ref}</td>
                    </tr>
                    <tr>
                      <td className="text-[var(--text-muted)] w-[40%]">Unité</td>
                      <td className="text-[var(--text)] font-medium">{product.unit}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Designer Section */}
            {product.collection?.designers?.[0] && (
              <div className="p-6 bg-[var(--bg-secondary)] flex justify-between items-center rounded-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] tracking-wider text-[var(--gold)] font-semibold mb-1 uppercase">DESIGNER</span>
                  <span className="font-serif text-[1.125rem] text-[var(--text)]">{product.collection.designers[0].designer.name}</span>
                </div>
                <Link 
                  href={`/${locale}/designers/${product.collection.designers[0].designer.slug}`} 
                  className="text-[11px] tracking-wider text-[var(--text)] font-bold no-underline flex items-center gap-2"
                >
                  VOIR LE PROFIL <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <section className="mt-32">
            <h2 className="font-serif text-[2.5rem] font-light mb-16 text-center">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {suggestions.map((s) => <ProductCard key={s.id} product={s} locale={locale} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
