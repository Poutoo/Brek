"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  videoUrl?: string;
}

interface HeroSectionProps {
  locale: string;
  collections: Collection[];
}

export function HeroSection({ locale, collections }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    <section className="hero" aria-label="Collections Phares">
      {collections.map((col, index) => (
        <div 
          key={col.id} 
          className={`hero__slide ${index === current ? "hero__slide--active" : ""}`}
          aria-hidden={index !== current}
        >
          {/* Background Image/Video */}
          <div className="hero__image-wrapper">
            {col.videoUrl ? (
              <video
                src={col.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="hero__video"
              />
            ) : (
              <Image
                src={col.coverImage || "/assets/placeholder.png"}
                alt={col.name}
                fill
                priority={index === 0}
                className="hero__image"
                style={{ objectFit: "cover" }}
              />
            )}
            <div className="hero__overlay" />
          </div>

          {/* Content */}
          <div className="hero__content">
            <div className="container-brek hero__content-inner">
              <h1 className="hero__title">
                {col.name.toUpperCase()}
              </h1>
              
              <Button 
                href={`/${locale}/collections/${col.slug}`} 
                variant="invert"
                className="hero__cta-btn"
                withLine
              >
                DÉCOUVRIR LA COLLECTION
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Flèches */}
      <button className="hero__nav-btn hero__nav-btn--prev" onClick={prevSlide} aria-label="Collection précédente">
        <ChevronLeft size={32} strokeWidth={1} />
      </button>
      <button className="hero__nav-btn hero__nav-btn--next" onClick={nextSlide} aria-label="Collection suivante">
        <ChevronRight size={32} strokeWidth={1} />
      </button>

      {/* Pagination / Dots */}
      <div className="hero__dots">
        {collections.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? "hero__dot--active" : ""}`}
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

      <style jsx>{`
        .hero {
          position: relative;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .hero__slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.8s var(--ease-luxury), visibility 0.8s;
          z-index: 1;
        }

        .hero__slide--active {
          opacity: 1;
          visibility: visible;
          z-index: 2;
        }

        .hero__image-wrapper {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero__image,
        .hero__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.1);
          transition: transform 7s linear;
        }

        .hero__slide--active .hero__image,
        .hero__slide--active .hero__video {
          transform: scale(1);
        }

        .hero__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 2;
        }

        .hero__content {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero__content-inner {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .hero__title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 10vw, 8rem);
          font-weight: 300;
          color: #fff;
          letter-spacing: 0.1em;
          line-height: 1;
          margin: 0;
          text-shadow: 0 4px 30px rgba(0,0,0,0.3);
          transform: translateY(20px);
          opacity: 0;
          transition: transform 1s var(--ease-luxury), opacity 1s var(--ease-luxury);
          transition-delay: 0.3s;
        }

        .hero__slide--active .hero__title {
          transform: translateY(0);
          opacity: 1;
        }

        .hero__cta-btn {
          transform: translateY(20px);
          opacity: 0;
          transition: transform 1s var(--ease-luxury), opacity 1s var(--ease-luxury) !important;
          transition-delay: 0.5s !important;
        }

        .hero__slide--active .hero__cta-btn {
          transform: translateY(0);
          opacity: 1;
        }

        /* Navigation */
        .hero__nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          z-index: 20;
          padding: 2rem;
          transition: color 0.3s, transform 0.3s;
        }

        .hero__nav-btn:hover {
          color: #fff;
        }

        .hero__nav-btn--prev { left: 1rem; }
        .hero__nav-btn--prev:hover { transform: translateY(-50%) translateX(-5px); }
        .hero__nav-btn--next { right: 1rem; }
        .hero__nav-btn--next:hover { transform: translateY(-50%) translateX(5px); }

        /* Pagination */
        .hero__dots {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          z-index: 20;
        }

        .hero__dot {
          width: 40px;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }

        .hero__dot--active {
          background: #fff;
        }

        @media (max-width: 768px) {
          .hero__title { font-size: 4rem; }
          .hero__nav-btn { display: none; }
          .hero__cta { padding: 1rem 1.5rem; }
        }
      `}</style>
    </section>
  );
}
