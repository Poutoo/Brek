"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Collection {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
}

interface CollectionsSliderProps {
  collections: Collection[];
  locale: string;
}

export function CollectionsSlider({ collections, locale }: CollectionsSliderProps) {
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateProgress = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(isNaN(progress) ? 0 : progress);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.6; // Scroll un peu moins d'un écran pour voir la suite
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateProgress);
      // Initial call
      updateProgress();
      return () => el.removeEventListener("scroll", updateProgress);
    }
  }, [collections]);

  if (!collections || collections.length === 0) return null;

  return (
    <section id="collections-slider" className="py-20 md:py-32 bg-white scroll-mt-20">
      {/* Header Section */}
      <div className="container-brek mb-12">
        <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tight text-charcoal">
          Nos Collections
        </h2>
      </div>

      {/* Slider Container */}
      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto slider-container-aligned scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/${locale}/collections/${collection.slug}`}
              className="flex-shrink-0 w-[80vw] md:w-[45vw] lg:w-[32vw] aspect-[4/5] relative group/card snap-start overflow-hidden"
            >
              <Image
                src={collection.coverImage || "/assets/placeholder.png"}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 45vw, 32vw"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/30 transition-colors duration-500 flex flex-col items-center justify-end pb-16 text-center px-6">
                <span className="bg-cream/95 text-charcoal text-[10px] tracking-[0.25em] uppercase px-5 py-2 rounded-sm mb-6 font-medium shadow-sm transform translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                  Trimmings
                </span>
                <h3 className="text-white font-display text-4xl md:text-5xl lg:text-6xl uppercase leading-none drop-shadow-md tracking-wider">
                  {collection.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation & Progress Bar */}
      <div className="container-brek mt-16 flex flex-col md:flex-row items-center gap-12">
        {/* Progress bar line */}
        <div className="flex-1 w-full h-[1px] bg-divider relative">
          <div 
            className="absolute top-[-1px] left-0 h-[3px] bg-charcoal transition-all duration-300 ease-out"
            style={{ 
              width: "15%", 
              left: `${(scrollProgress * 0.85)}%` 
            }}
          />
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-8 self-end md:self-auto">
          <button 
            onClick={() => scroll("left")}
            className="flex items-center gap-3 text-charcoal hover:text-gold transition-colors group uppercase text-[10px] tracking-[0.2em] font-medium"
            aria-label="Précédent"
          >
            <div className="relative w-12 h-[1px] bg-current overflow-hidden">
               <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </div>
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => scroll("right")}
            className="flex items-center gap-3 text-charcoal hover:text-gold transition-colors group uppercase text-[10px] tracking-[0.2em] font-medium"
            aria-label="Suivant"
          >
            <ArrowRight className="w-4 h-4" />
            <div className="relative w-12 h-[1px] bg-current overflow-hidden">
               <div className="absolute inset-0 bg-gold translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
