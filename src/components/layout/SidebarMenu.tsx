"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { X, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface SidebarMenuProps {
  locale: string;
  onClose: () => void;
}

export function SidebarMenu({ locale, onClose }: SidebarMenuProps) {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  // Fermer avec Escape
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

  const categories = [
    {
      title: t("collections"),
      links: [
        { href: `/${locale}/collections/imperiale`, label: "Impériale" },
        { href: `/${locale}/collections/leopard`, label: "Léopard" },
        { href: `/${locale}/collections/salone`, label: "Salone" },
        { href: `/${locale}/collections`, label: `Voir toutes les collections →` },
      ],
    },
    {
      title: t("designers"),
      links: [
        { href: `/${locale}/designers/bambi-sloan`, label: "Bambi Sloan" },
        { href: `/${locale}/designers/eric-egan`, label: "Éric Egan" },
        { href: `/${locale}/designers/michael-aiduss`, label: "Michael Aiduss" },
        { href: `/${locale}/designers`, label: `Voir tous les designers →` },
      ],
    },
    {
      title: t("products"),
      links: [
        { href: `/${locale}/produits?type=galon`, label: "Galons" },
        { href: `/${locale}/produits?type=frange`, label: "Franges" },
        { href: `/${locale}/produits?type=ruban`, label: "Rubans" },
        { href: `/${locale}/produits?type=tissu`, label: "Tissus" },
        { href: `/${locale}/produits`, label: "Tous les produits →" },
      ],
    },
  ];

  const infoLinks = [
    { href: `/${locale}/faq`, label: t("faq") },
    { href: `/${locale}/contact`, label: t("contact") },
    { href: `/${locale}/mentions-legales`, label: tf("legal") },
    { href: `/${locale}/cgv`, label: tf("cgv") },
  ];

  return (
    <>
      <div
        className="sidebar-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav className="sidebar-menu" aria-label="Menu principal" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-logo">BREK <small>PARIS</small></span>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="sidebar-content">
          {categories.map((cat) => (
            <div key={cat.title} className="sidebar-section">
              <p className="sidebar-section-title">{cat.title}</p>
              <ul className="sidebar-links" role="list">
                {cat.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="sidebar-link"
                      onClick={onClose}
                    >
                      {link.label}
                      <ChevronRight size={14} className="sidebar-link-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="sidebar-divider" />

          <ul className="sidebar-links sidebar-links--muted" role="list">
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="sidebar-link sidebar-link--muted" onClick={onClose}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="sidebar-footer-text">© 2024 Brek Paris — Tous droits réservés</p>
        </div>
      </nav>

      <style jsx>{`
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--divider);
        }
        .sidebar-logo {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.2em;
        }
        .sidebar-logo small {
          display: block;
          font-size: 0.5rem;
          letter-spacing: 0.35em;
          color: var(--gold);
          font-style: normal;
          margin-top: 1px;
          font-family: var(--font-body);
        }
        .sidebar-close {
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
        .sidebar-close:hover {
          color: var(--text);
          border-color: var(--gold);
        }
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .sidebar-section {}
        .sidebar-section-title {
          font-size: 0.6875rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 500;
          margin-bottom: 0.625rem;
        }
        .sidebar-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0;
          font-size: 0.9375rem;
          color: var(--text);
          border-bottom: 1px solid var(--divider);
          transition: color 0.2s, padding-left 0.2s;
        }
        .sidebar-link:hover {
          color: var(--gold);
          padding-left: 0.25rem;
        }
        .sidebar-link-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .sidebar-link:hover .sidebar-link-arrow {
          transform: translateX(3px);
          color: var(--gold);
        }
        .sidebar-link--muted {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .sidebar-divider {
          height: 1px;
          background: var(--divider);
          margin: 0 -1.5rem;
        }
        .sidebar-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--divider);
        }
        .sidebar-footer-text {
          font-size: 0.6875rem;
          color: var(--text-muted);
          text-align: center;
        }
      `}</style>
    </>
  );
}
