"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("home");

  const scrollToCollections = () => {
    document.getElementById("collections-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero" aria-label="Hero Brek">
      {/* Background */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-img" />
        <div className="hero__bg-overlay" />
        {/* Motif géométrique */}
        <div className="hero__pattern" aria-hidden="true" />
      </div>

      <div className="hero__content container-brek">
        {/* Badge */}
        <div className="hero__badge animate-fade-in-up">
          <span className="divider-gold">
            <span className="hero__badge-text">Maison de Passementerie</span>
          </span>
        </div>

        {/* Titre */}
        <h1 className="hero__title animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {t("hero_title")}
        </h1>

        {/* Sous-titre */}
        <p className="hero__subtitle animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {t("hero_subtitle")}
        </p>

        {/* CTAs */}
        <div className="hero__ctas animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <Link href={`/${locale}/collections`} className="btn btn-primary btn-lg">
            {t("hero_cta")}
            <ArrowRight size={16} />
          </Link>
          <Link href={`/${locale}/designers`} className="btn btn-secondary btn-lg hero__cta-secondary">
            {t("hero_cta_secondary")}
          </Link>
        </div>

        {/* Stats */}
        <div className="hero__stats animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="hero__stat">
            <span className="hero__stat-num">1987</span>
            <span className="hero__stat-label">Fondée en</span>
          </div>
          <div className="hero__stat-divider" aria-hidden="true" />
          <div className="hero__stat">
            <span className="hero__stat-num">3</span>
            <span className="hero__stat-label">Collections</span>
          </div>
          <div className="hero__stat-divider" aria-hidden="true" />
          <div className="hero__stat">
            <span className="hero__stat-num">3</span>
            <span className="hero__stat-label">Designers</span>
          </div>
          <div className="hero__stat-divider" aria-hidden="true" />
          <div className="hero__stat">
            <span className="hero__stat-num">100%</span>
            <span className="hero__stat-label">Français</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        className="hero__scroll"
        onClick={scrollToCollections}
        aria-label="Défiler vers les collections"
      >
        <ChevronDown size={20} />
      </button>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: calc(100vh - var(--nav-height));
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero__bg {
          position: absolute;
          inset: 0;
        }
        .hero__bg-img {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--dark-brown) 0%, var(--charcoal) 50%, #0d0b09 100%);
        }
        .hero__bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 50%, rgba(201,168,76,0.08) 0%, transparent 60%);
        }
        .hero__pattern {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: repeating-linear-gradient(
            45deg,
            var(--gold) 0,
            var(--gold) 1px,
            transparent 0,
            transparent 50%
          );
          background-size: 30px 30px;
        }
        .hero__content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          padding-top: 4rem;
          padding-bottom: 8rem;
          color: var(--cream);
        }
        .hero__badge {
          width: 100%;
          max-width: 400px;
        }
        .hero__badge-text {
          font-size: 0.6875rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .hero__title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 300;
          color: var(--cream);
          max-width: 800px;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }
        .hero__subtitle {
          font-size: clamp(0.875rem, 2vw, 1rem);
          color: rgba(255,253,247,0.6);
          max-width: 500px;
          line-height: 1.7;
        }
        .hero__ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero__cta-secondary {
          color: var(--cream);
          border-color: rgba(255,253,247,0.3);
        }
        .hero__cta-secondary:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        .hero__stats {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 1rem;
        }
        .hero__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }
        .hero__stat-num {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 300;
          color: var(--gold);
          line-height: 1;
        }
        .hero__stat-label {
          font-size: 0.625rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,253,247,0.4);
        }
        .hero__stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255,253,247,0.15);
        }
        .hero__scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,253,247,0.2);
          border-radius: 50%;
          background: transparent;
          color: rgba(255,253,247,0.5);
          cursor: pointer;
          animation: bounce 2s infinite;
          transition: all 0.2s;
          z-index: 10;
        }
        .hero__scroll:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
