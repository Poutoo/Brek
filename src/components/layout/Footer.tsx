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
    <footer className="bg-[var(--charcoal)] text-[var(--cream)] mt-24" role="contentinfo">
      {/* Top section */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-32 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10">
        {/* Brand */}
        <div className="flex flex-col">
          <Link href={`/${locale}`} className="inline-flex flex-col mb-4 no-underline group">
            <span className="font-serif text-2xl font-semibold tracking-[0.25em] text-[var(--cream)] leading-none transition-colors group-hover:text-[var(--gold)]">BREK</span>
            <span className="text-[0.5rem] tracking-[0.35em] uppercase text-[var(--gold)] mt-0.5">PARIS</span>
          </Link>
          <p className="text-[0.8125rem] text-[var(--cream)]/50 leading-relaxed max-w-[240px] mb-5">
            L&apos;excellence de la passementerie française depuis 1987
          </p>
          <div className="flex gap-2.5">
            {[
              { icon: <InstagramIcon />, label: "Instagram", href: "https://instagram.com" },
              { icon: <LinkedinIcon />, label: "LinkedIn", href: "https://linkedin.com" },
              { icon: <Mail size={18} />, label: "Email", href: `/${locale}/contact` }
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center justify-center w-9 h-9 border border-[var(--cream)]/15 rounded-sm text-[var(--cream)]/50 transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Colonnes */}
        {[
          { title: "Collections", links: collections },
          { title: "Designers", links: designers },
          { title: "La Maison", links: company },
          { title: "Informations", links: legal }
        ].map((col) => (
          <div key={col.title} className="flex flex-col">
            <h3 className="text-[0.6875rem] tracking-widest uppercase text-[var(--gold)] mb-4 font-medium">{col.title}</h3>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.8125rem] text-[var(--cream)]/55 no-underline transition-colors hover:text-[var(--cream)] leading-tight">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.3)] to-transparent" aria-hidden="true" />

      {/* Bottom */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-32 py-6 flex flex-col md:flex-row items-center justify-between gap-1.5 text-center md:text-left">
        <p className="text-[0.75rem] text-[var(--cream)]/35 m-0">
          © {currentYear} Brek Paris. Tous droits réservés.
        </p>
        <p className="text-[0.6875rem] tracking-widest text-[var(--gold)]/50 uppercase m-0">
          Passementerie & Tissus de Luxe — France
        </p>
      </div>
    </footer>
  );
}
