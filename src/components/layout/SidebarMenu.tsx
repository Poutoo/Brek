"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { X, Plus } from "lucide-react";

interface SidebarMenuProps {
  locale: string;
  onClose: () => void;
}

export function SidebarMenu({ locale, onClose }: SidebarMenuProps) {
  const t = useTranslations("nav");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: "passementerie", title: "TRIMMINGS", href: `/${locale}/produits?category=passementerie`, image: "/assets/menu/menu_passementerie.jpg" },
    // { id: "tringlerie", title: "HARDWARE", href: `/${locale}/produits?category=tringlerie`, image: "/assets/menu/menu_tringlerie.jpg" },
    { id: "tissus", title: "FABRICS", href: `/${locale}/produits?category=tissus`, image: "/assets/menu/menu_tissu.jpg" },
    //{ id: "fournitures", title: "SUPPLIES", href: `/${locale}/produits?category=fournitures`, image: "/assets/menu/menu_fournitures.jpg" },
    { id: "designers", title: "OUR DESIGNERS", href: `/${locale}/designers`, image: "/assets/menu/menu_designer.png" },
    { id: "sur-mesure", title: "CUSTOM", href: `/${locale}/contact`, image: "/assets/menu/menu_surmesure.jpg" },
  ];

  const footerLinksLeft = [
    { title: "À PROPOS", href: `/${locale}/a-propos` },
    { title: "PROJETS", href: `/${locale}/projets` },
    //{ title: "SHOWROOMS", href: `/${locale}/contact` },
    //{ title: "BREK DANS LE MONDE", href: `/${locale}/contact` },
  ];

  const footerLinksRight = [
    { title: "ACTUALITÉS", href: `/${locale}/newsletter` },
    //{ title: "PRESSE", href: `/${locale}/contact` },
    { title: "NOUS CONTACTER", href: `/${locale}/contact` },
  ];

  return (
    <>
      <div className="megamenu" role="dialog" aria-modal="true">
        {/* Background Images */}
        <div className="megamenu__backgrounds">
          <img src="/assets/menu/menu_principal.jpg" alt="" className="megamenu__bg-img megamenu__bg-img--default" />
          {sections.map((section) => (
            <img
              key={section.id}
              src={section.image}
              alt=""
              className={`megamenu__bg-img ${activeSection === section.id ? "megamenu__bg-img--active" : ""}`}
            />
          ))}
        </div>

        {/* Menu Panel */}
        <div className="megamenu__panel">
          <div className="megamenu__header">
            <button className="megamenu__close-btn" onClick={onClose}>
              <Plus size={48} strokeWidth={1} style={{ transform: "rotate(45deg)" }} />
              <span className="megamenu__close-text">FERMER</span>
            </button>
          </div>

          <div className="megamenu__content">
            <ul className="megamenu__list">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className="megamenu__item"
                  onMouseEnter={() => setActiveSection(section.id)}
                  onMouseLeave={() => setActiveSection(null)}
                >
                  <Link href={section.href} className="megamenu__link" onClick={onClose}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span className="megamenu__link-text">{section.title}</span>
                      {["passementerie", "tringlerie", "tissus", "fournitures"].includes(section.id) && (
                        <Plus size={24} strokeWidth={1} className="megamenu__plus" />
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="megamenu__footer">
            <div className="megamenu__footer-grid">
              <div className="megamenu__footer-col">
                {footerLinksLeft.map((link) => (
                  <Link key={link.title} href={link.href} className="megamenu__footer-link" onClick={onClose}>
                    {link.title}
                  </Link>
                ))}
              </div>
              <div className="megamenu__footer-col">
                {footerLinksRight.map((link) => (
                  <Link key={link.title} href={link.href} className="megamenu__footer-link" onClick={onClose}>
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .megamenu {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: #000; /* dark fallback */
          animation: megamenuFadeIn 0.5s var(--ease-luxury);
          display: flex;
        }

        .megamenu__backgrounds {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          display: none;
        }
        @media (min-width: 768px) {
          .megamenu__backgrounds { display: block; }
        }

        .megamenu__bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: all 0.7s ease-in-out;
          transform: scale(1.1);
        }
        .megamenu__bg-img--default {
          opacity: 0.1;
          transform: scale(1);
        }
        .megamenu__bg-img--active {
          opacity: 1;
          transform: scale(1);
        }

        .megamenu__panel {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 500px;
          height: 100dvh;
          background: #7a6a64; /* brown like reference */
          display: flex;
          flex-direction: column;
          padding: 2rem;
          transform: translateX(-100%);
          animation: panelSlideIn 0.6s var(--ease-luxury) forwards;
        }
        @media (min-width: 1200px) {
          .megamenu__panel { max-width: 700px; padding: 4rem; }
        }

        .megamenu__header {
          margin-bottom: 2rem;
        }
        .megamenu__close-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        .megamenu__close-text {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .megamenu__close-btn:hover { opacity: 0.7; }

        .megamenu__content {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .megamenu__list {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .megamenu__item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .megamenu__link {
          display: flex;
          align-items: center;
          padding: 1.5rem 0;
          font-family: var(--font-display);
          font-size: 2.2rem;
          text-transform: uppercase;
          color: #fff;
          transition: all 0.3s;
          line-height: 1;
        }
        .megamenu__link-text {
          white-space: nowrap;
        }
        .megamenu__plus {
          opacity: 0.6;
        }
        @media (min-width: 768px) {
          .megamenu__link { font-size: 2.5rem; }
        }
        .megamenu__link:hover {
          color: #fff;
          opacity: 0.8;
        }

        .megamenu__footer {
          margin-top: 4rem;
        }
        .megamenu__footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .megamenu__footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .megamenu__footer-link {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          transition: color 0.3s;
        }
        .megamenu__footer-link:hover {
          color: #fff;
        }

        @keyframes megamenuFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes panelSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
