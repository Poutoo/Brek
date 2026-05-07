"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

const InstagramIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const LinkedinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const collections = [
    { href: `/${locale}/collections/isoria`, label: "Isoria" },
    { href: `/${locale}/collections/porta`, label: "Porta" },
    { href: `/${locale}/collections/salone`, label: "Salone" },
  ];

  const designers = [
    { href: `/${locale}/designers/bambi-sloan`, label: "Bambi Sloan" },
    { href: `/${locale}/designers/eric-egan`, label: "Éric Egan" },
    { href: `/${locale}/designers/michael-aiduss`, label: "Michael Aiduss" },
  ];

  const company = [
    { href: `/${locale}/contact`, label: "Contact" },
    { href: `/${locale}/faq`, label: "FAQ" },
    { href: `/${locale}/newsletter`, label: "Newsletter" },
  ];

  const legal = [
    { href: `/${locale}/mentions-legales`, label: "Mentions légales" },
    { href: `/${locale}/cgv`, label: "Conditions générales de vente" },
    { href: `/${locale}/confidentialite`, label: "Politique de confidentialité" },
  ];

  return (
    <footer className="footer" role="contentinfo">
      {/* Top section */}
      <div className="footer__top container-brek">
        {/* Brand */}
        <div className="footer__brand">
          <Link href={`/${locale}`} className="footer__logo">
            <span className="footer__logo-text">BREK</span>
            <span className="footer__logo-sub">PARIS</span>
          </Link>
          <p className="footer__tagline">
            L&apos;excellence de la passementerie française depuis 1987
          </p>
          <div className="footer__social">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Suivez Brek sur Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Suivez Brek sur LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a
              href={`/${locale}/contact`}
              className="footer__social-link"
              aria-label="Contacter Brek par email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Colonnes */}
        <div className="footer__col">
          <h3 className="footer__col-title">Collections</h3>
          <ul className="footer__links" role="list">
            {collections.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer__link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Designers</h3>
          <ul className="footer__links" role="list">
            {designers.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer__link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">La Maison</h3>
          <ul className="footer__links" role="list">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer__link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__col-title">Informations</h3>
          <ul className="footer__links" role="list">
            {legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer__link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gold divider */}
      <div className="footer__divider" aria-hidden="true" />

      {/* Bottom */}
      <div className="footer__bottom container-brek">
        <p className="footer__copy">
          © {currentYear} Brek Paris. Tous droits réservés.
        </p>
        <p className="footer__made">
          Passementerie & Tissus de Luxe — France
        </p>
      </div>
    </footer>
  );
}

// Styles intégrés pour éviter les conflits avec les CSS modules
const footerStyles = `
  .footer {
    background: var(--charcoal);
    color: var(--cream);
    margin-top: 6rem;
  }
  .footer__top {
    padding-top: 4rem;
    padding-bottom: 3rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  @media (min-width: 640px) {
    .footer__top { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .footer__top { grid-template-columns: 2fr 1fr 1fr 1fr 1fr; }
  }
  .footer__brand {}
  .footer__logo {
    display: inline-flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  .footer__logo-text {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.25em;
    color: var(--cream);
    line-height: 1;
  }
  .footer__logo-sub {
    font-size: 0.5rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 2px;
  }
  .footer__tagline {
    font-size: 0.8125rem;
    color: rgba(255,253,247,0.5);
    line-height: 1.6;
    max-width: 240px;
    margin-bottom: 1.25rem;
  }
  .footer__social {
    display: flex;
    gap: 0.625rem;
  }
  .footer__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid rgba(255,253,247,0.15);
    border-radius: 2px;
    color: rgba(255,253,247,0.5);
    transition: all 0.2s;
  }
  .footer__social-link:hover {
    border-color: var(--gold);
    color: var(--gold);
  }
  .footer__col {}
  .footer__col-title {
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 1rem;
    font-weight: 500;
    font-family: var(--font-body);
  }
  .footer__links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }
  .footer__link {
    font-size: 0.8125rem;
    color: rgba(255,253,247,0.55);
    transition: color 0.2s;
    line-height: 1.4;
  }
  .footer__link:hover { color: var(--cream); }
  .footer__divider {
    height: 1px;
    background: linear-gradient(to right, transparent 0%, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.3) 70%, transparent 100%);
  }
  .footer__bottom {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    align-items: center;
    text-align: center;
  }
  @media (min-width: 768px) {
    .footer__bottom {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }
  .footer__copy {
    font-size: 0.75rem;
    color: rgba(255,253,247,0.35);
  }
  .footer__made {
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
    color: rgba(201,168,76,0.5);
    text-transform: uppercase;
  }
`;

// Injecter les styles dans le head via un style tag
if (typeof document !== "undefined") {
  const existing = document.getElementById("footer-styles");
  if (!existing) {
    const style = document.createElement("style");
    style.id = "footer-styles";
    style.textContent = footerStyles;
    document.head.appendChild(style);
  }
}
