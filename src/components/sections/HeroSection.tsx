"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLoadingStore } from "@/store/loadingStore";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  videoUrl?: string | null;
}

interface HeroSectionProps {
  locale: string;
  collections: Collection[];
}

export function HeroSection({ locale, collections }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isLoading, setIsLoading } = useLoadingStore();
  const [mounted, setMounted] = useState(false);
  const [loadedMedia, setLoadedMedia] = useState<Set<string>>(new Set());

  useEffect(() => {
    setMounted(true);
    setIsLoading(true);
  }, [setIsLoading]);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [setIsLoading]);

  const handleMediaLoad = useCallback((id: string) => {
    setLoadedMedia((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      
      if (id === collections[0]?.id) {
        setTimeout(() => setIsLoading(false), 800);
      }
      return next;
    });
  }, [collections, setIsLoading]);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % collections.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [collections.length, isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + collections.length) % collections.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [collections.length, isAnimating]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!collections.length) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black" aria-label="Collections Phares">
      {/* Loader Luxe - Styles Tailwind */}
      <div 
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f0c0a] transition-all duration-1000 ease-[var(--ease-luxury)] ${!isLoading ? "invisible opacity-0 pointer-events-none" : "visible opacity-100"}`}
      >
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-[2.5rem] font-medium tracking-[0.4em] text-white animate-[loaderPulse_2.5s_infinite_var(--ease-luxury)]">BREK</span>
            <span className="text-[0.6rem] tracking-[0.5em] text-[var(--gold)] uppercase opacity-80">PARIS</span>
          </div>
          <div className="relative h-px w-[180px] overflow-hidden bg-white/10">
            <div className="absolute inset-y-0 left-0 w-[60px] bg-[var(--gold)] blur-[1px] animate-[loaderProgress_2s_infinite_ease-in-out]" />
          </div>
        </div>
      </div>

      {collections.map((col, index) => (
        <div 
          key={col.id} 
          className={`absolute inset-0 transition-all duration-800 ease-[var(--ease-luxury)] ${index === current ? "z-[2] visible opacity-100" : "z-[1] invisible opacity-0"}`}
          aria-hidden={index !== current}
        >
          {/* Background Image/Video */}
          <div className="absolute inset-0 z-[1]">
            {col.videoUrl ? (
              <video
                src={col.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[7000ms] linear ${index === current ? "scale-100" : "scale-110"}`}
                onCanPlayThrough={() => handleMediaLoad(col.id)}
              />
            ) : (
              <div className={`relative h-full w-full transition-transform duration-[7000ms] linear ${index === current ? "scale-100" : "scale-110"}`}>
                <Image
                  src={col.coverImage || "/assets/placeholder.png"}
                  alt={col.name}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  onLoadingComplete={() => handleMediaLoad(col.id)}
                />
              </div>
            )}
            <div className="absolute inset-0 z-[2] bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-[10] flex h-full items-center justify-center">
            <div className="container-brek flex flex-col items-center gap-8 text-center">
              <h1 className={`font-serif text-[clamp(3rem,10vw,8rem)] font-light leading-none tracking-[0.1em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-all duration-1000 ease-[var(--ease-luxury)] delay-300 ${index === current ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
                {col.name.toUpperCase()}
              </h1>
              
              <div className={`transition-all duration-1000 ease-[var(--ease-luxury)] delay-500 ${index === current ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
                <Button 
                  href={`/${locale}/collections/${col.slug}`} 
                  variant="invert"
                  className="px-8 py-3"
                  withLine
                >
                  DÉCOUVRIR LA COLLECTION
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Flèches */}
      <button 
        className="absolute left-4 top-1/2 z-[20] -translate-y-1/2 p-8 text-white/40 transition-all hover:translate-x-[-5px] hover:text-white" 
        onClick={prevSlide} 
        aria-label="Collection précédente"
      >
        <ChevronLeft size={32} strokeWidth={1} />
      </button>
      <button 
        className="absolute right-4 top-1/2 z-[20] -translate-y-1/2 p-8 text-white/40 transition-all hover:translate-x-[5px] hover:text-white" 
        onClick={nextSlide} 
        aria-label="Collection suivante"
      >
        <ChevronRight size={32} strokeWidth={1} />
      </button>

      {/* Pagination / Dots */}
      <div className="absolute bottom-12 left-1/2 z-[20] flex -translate-x-1/2 gap-4">
        {collections.map((_, i) => (
          <button
            key={i}
            className={`h-[2px] w-10 transition-colors duration-300 ${i === current ? "bg-white" : "bg-white/20"}`}
            onClick={() => {
              if (i !== current && !isAnimating) {
                setIsAnimating(true);
                setCurrent(i);
                setTimeout(() => setIsAnimating(false), 800);
              }
            }}
            aria-label={`Aller à la collection ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
