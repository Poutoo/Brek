"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  X,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useThemeStore } from "@/store/themeStore";
import { SidebarMenu } from "./SidebarMenu";
import { SearchOverlay } from "./SearchOverlay";

interface TopBarProps {
  locale: string;
}

const LOCALES = [
  {
    code: "fr",
    label: "FR",
    flag: (
      <svg width="20" height="15" viewBox="0 0 3 2">
        <rect width="3" height="2" fill="#ED2939" />
        <rect width="2" height="2" fill="#fff" />
        <rect width="1" height="2" fill="#002395" />
      </svg>
    )
  },
  {
    code: "en",
    label: "EN",
    flag: (
      <svg width="20" height="15" viewBox="0 0 60 30">
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    )
  },
  {
    code: "es",
    label: "ES",
    flag: (
      <svg width="20" height="15" viewBox="0 0 750 500">
        <rect width="750" height="500" fill="#c60b1e" />
        <rect width="750" height="250" y="125" fill="#ffc400" />
      </svg>
    )
  },
];

export function TopBar({ locale }: TopBarProps) {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const pathname = usePathname();
  const { getTotalItems, openCart, isOpen } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();

  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [showCountryOptions, setShowCountryOptions] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = getTotalItems();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Forcer le scroll tout en haut au chargement (particulièrement sur la home)
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      window.scrollTo(0, 0);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [locale, pathname]);

  // Fermer menus au click extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Construire l'URL de changement de langue
  const getLocalePath = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] && LOCALES.some((l) => l.code === segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    return "/" + segments.join("/");
  };



  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isTransparent = isHomePage && !scrolled;

  return (
    <>
      <header
        className={`topbar ${scrolled ? "topbar--scrolled" : ""} ${isTransparent ? "topbar--transparent" : "topbar--solid"}`}
        role="banner"
      >
        <div className="topbar__inner">
          {/* GAUCHE : Menu hamburger */}
          <div className="topbar__left">
            <button
              className="topbar__menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label={t("collections")}
              id="menu-btn"
            >
              <div className="topbar__menu-icon">
                <span className="topbar__menu-line" />
                <span className="topbar__menu-line" />
              </div>
              <span className="topbar__menu-text">MENU</span>
            </button>
          </div>

          {/* CENTRE : Logo */}
          <Link href={`/${locale}`} className="topbar__logo" aria-label="Brek — Accueil">
            <span className="topbar__logo-text">BREK</span>
            <span className="topbar__logo-sub">PARIS</span>
          </Link>

          {/* DROITE : Actions */}
          <div className="topbar__right">
            {/* Langue */}
            <div className="topbar__lang-wrapper" ref={langMenuRef}>
              <button
                className="topbar__lang-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Changer de langue"
                id="lang-btn"
              >
                <span className="topbar__lang-flag">
                  {LOCALES.find((l) => l.code === locale)?.flag}
                </span>
                <span className="topbar__lang-label">
                  {locale.toUpperCase()}
                </span>
                <ChevronDown size={14} className={`topbar__lang-chevron ${langMenuOpen ? "topbar__lang-chevron--open" : ""}`} />
              </button>

              {langMenuOpen && (
                <div className="topbar__dropdown topbar__dropdown--lang-modal">
                  <div className="topbar__modal-content">
                    {/* Country Section */}
                    <div className="topbar__modal-section">
                      <label className="topbar__modal-label">COUNTRY *</label>
                      <div
                        className="topbar__modal-select"
                        onClick={() => {
                          setShowCountryOptions(!showCountryOptions);
                          setShowLangOptions(false);
                        }}
                      >
                        <span className="topbar__modal-flag">
                          {LOCALES.find((l) => l.code === selectedLocale)?.flag}
                        </span>
                        <span className="topbar__modal-val">
                          {selectedLocale === 'fr' ? 'France' : selectedLocale === 'en' ? 'United Kingdom' : 'Spain'}
                        </span>
                        <ChevronDown size={14} style={{ transform: showCountryOptions ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>

                      {showCountryOptions && (
                        <div className="topbar__modal-options">
                          {LOCALES.map((l) => (
                            <div
                              key={l.code}
                              className={`topbar__modal-option ${selectedLocale === l.code ? 'topbar__modal-option--active' : ''}`}
                              onClick={() => {
                                setSelectedLocale(l.code);
                                setShowCountryOptions(false);
                              }}
                            >
                              {l.flag} {l.code === 'fr' ? 'France' : l.code === 'en' ? 'United Kingdom' : 'Spain'}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Language Section */}
                    <div className="topbar__modal-section">
                      <label className="topbar__modal-label">LANGUAGE</label>
                      <div
                        className="topbar__modal-select"
                        onClick={() => {
                          setShowLangOptions(!showLangOptions);
                          setShowCountryOptions(false);
                        }}
                      >
                        <span className="topbar__modal-val">
                          {selectedLocale === 'fr' ? 'Français' : selectedLocale === 'en' ? 'English' : 'Español'}
                        </span>
                        <ChevronDown size={14} style={{ transform: showLangOptions ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>

                      {showLangOptions && (
                        <div className="topbar__modal-options">
                          {LOCALES.map((l) => (
                            <div
                              key={l.code}
                              className={`topbar__modal-option ${selectedLocale === l.code ? 'topbar__modal-option--active' : ''}`}
                              onClick={() => {
                                setSelectedLocale(l.code);
                                setShowLangOptions(false);
                              }}
                            >
                              {l.code === 'fr' ? 'Français' : l.code === 'en' ? 'English' : 'Español'}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="topbar__modal-actions">
                      <Link
                        href={getLocalePath(selectedLocale)}
                        className="topbar__modal-apply"
                        onClick={() => setLangMenuOpen(false)}
                      >
                        <span className="topbar__apply-line topbar__apply-line--start" />
                        <span className="topbar__apply-text">APPLY</span>
                        <span className="topbar__apply-line topbar__apply-line--end" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <button className="topbar__icon-btn">
              <MapPin size={18} strokeWidth={1.5} />
            </button>

            {/* Recherche */}
            <button
              className="topbar__icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              id="search-btn"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Trade Access */}
            <Link href={`/${locale}/compte`} className="topbar__trade-link">
              <span className={`topbar__trade-dot ${mounted && session ? 'topbar__trade-dot--online' : 'topbar__trade-dot--offline'}`} />
              <span className="topbar__trade-text">Espace Pro</span>
            </Link>

            {/* Panier */}
            <button
              className="topbar__cart-btn"
              onClick={openCart}
              aria-label={`${t("cart")} (${mounted ? totalItems : 0} article${(mounted ? totalItems : 0) !== 1 ? "s" : ""})`}
              id="cart-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {mounted && (
                <span className="topbar__cart-count">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer pour éviter le chevauchement (uniquement si pas sur la home ou si scrollé) */}
      {!scrolled && (pathname === `/${locale}` || pathname === `/${locale}/`) ? null : (
        <div style={{ height: "var(--nav-height)" }} aria-hidden="true" />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <SidebarMenu
          locale={locale}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Recherche */}
      {searchOpen && (
        <SearchOverlay
          locale={locale}
          onClose={() => setSearchOpen(false)}
        />
      )}

      <style jsx>{`
        .topbar {
          position: fixed;
          top: 1.5rem;
          left: 8rem;
          right: 8rem;
          height: var(--nav-height);
          background: #fff;
          color: #533b3b;
          z-index: 500;
          transition: all 0.5s var(--ease-luxury);
          border-radius: 0.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .topbar--transparent {
          background: transparent;
          color: #fff;
          box-shadow: none;
        }
        .topbar--scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .topbar__inner {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 1.5rem;
        }
        @media (min-width: 768px) {
          .topbar__inner { padding: 0 2.5rem; }
        }
        @media (min-width: 1200px) {
          .topbar__inner { padding: 0 8rem; }
        }
        .topbar__left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .topbar__nav {
          display: none;
          align-items: center;
          gap: 2rem;
          margin-left: 1rem;
        }
        @media (min-width: 1024px) {
          .topbar__nav { display: flex; }
        }
        .topbar__nav-link {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.2s;
          position: relative;
          padding-bottom: 2px;
        }
        .topbar__nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--gold);
          transform: scaleX(0);
          transition: transform 0.25s var(--ease-luxury);
        }
        .topbar__nav-link:hover,
        .topbar__nav-link--active {
          color: var(--text);
        }
        .topbar__nav-link:hover::after,
        .topbar__nav-link--active::after {
          transform: scaleX(1);
        }
        .topbar__logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1;
          justify-self: center;
        }
        .topbar__logo-text {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: currentColor;
          line-height: 1;
        }
        .topbar__logo-sub {
          font-size: 0.5rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: currentColor;
          margin-top: 2px;
          opacity: 0.8;
        }
        .topbar__right {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          justify-content: flex-end;
        }
        .topbar__menu-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: currentColor;
          padding: 0.5rem;
        }
        .topbar__menu-icon {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .topbar__menu-line {
          width: 24px;
          height: 1px;
          background: currentColor;
        }
        .topbar__menu-text {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          font-weight: 400;
        }
        .topbar__icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          color: currentColor;
          border-radius: 2px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .topbar__icon-btn:hover {
          opacity: 0.7;
        }
        .topbar__trade-link {
          display: none;
          align-items: center;
          gap: 0.5rem;
          color: currentColor;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          font-weight: 500;
          margin: 0 1rem;
        }
        @media (min-width: 1024px) {
          .topbar__trade-link { display: flex; }
        }
        .topbar__trade-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.4s var(--ease-luxury);
        }
        .topbar__trade-dot--offline {
          background: #ff4d4d;
          box-shadow: 0 0 10px rgba(255, 77, 77, 0.6);
        }
        .topbar__trade-dot--online {
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
        }
        .topbar__cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          color: currentColor;
          cursor: pointer;
        }
        .topbar__cart-count {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -5%);
          font-size: 0.55rem;
          font-weight: 600;
          color: currentColor;
        }
        .topbar__lang-wrapper {
          position: relative;
        }
        .topbar__lang-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          color: currentColor;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
        }
        .topbar__lang-flag {
          display: flex;
          align-items: center;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }
        .topbar__lang-chevron {
          transition: transform 0.3s ease;
          opacity: 0.6;
        }
        .topbar__lang-chevron--open {
          transform: rotate(180deg);
        }

        /* --- LANG MODAL SPECIFIC (MUST OVERRIDE GENERAL) --- */
        .topbar__dropdown.topbar__dropdown--lang-modal {
          min-width: 320px;
          width: 320px;
          top: calc(100% + 1.5rem);
          right: -1rem;
          left: auto;
          background: #fff !important;
          color: #533b3b !important;
          padding: 2rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e1da;
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
          display: block;
        }

        .topbar__modal-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .topbar__modal-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
        }

        .topbar__modal-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e5e1da;
          border-radius: 0.5rem;
          margin-top: 0.25rem;
          z-index: 10;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .topbar__modal-option {
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #533b3b;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .topbar__modal-option:hover {
          background: #fcf9f2;
        }

        .topbar__modal-option--active {
          background: #fcf9f2;
          font-weight: 600;
        }

        .topbar__modal-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #533b3b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .topbar__modal-select {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border: 1px solid rgba(83, 59, 59, 0.2);
          border-radius: 0.5rem;
          background: #fff;
          color: #533b3b;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .topbar__modal-select:hover {
          border-color: #533b3b;
        }

        .topbar__modal-flag {
          display: flex;
          align-items: center;
        }

        .topbar__modal-val {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .topbar__modal-actions {
          margin-top: 1rem;
        }

        :global(.topbar__modal-apply) {
          width: 100% !important;
          background: #533b3b !important;
          color: #fff !important;
          padding: 1.125rem !important;
          border-radius: 0.5rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0 !important; /* On gère l'espace via les marges des lignes */
          cursor: pointer !important;
          border: none !important;
          transition: all 0.3s ease !important;
          text-decoration: none !important;
          margin-top: 1rem !important;
          overflow: hidden !important;
        }

        :global(.topbar__modal-apply:hover) {
          background: #3d2b2b !important;
          transform: translateY(-2px) !important;
        }

        :global(.topbar__apply-text) {
          font-size: 0.8125rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.15em !important;
          color: #fff !important;
          transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1) !important;
          z-index: 2 !important;
        }

        :global(.topbar__apply-line) {
          height: 1px !important;
          background: #fff !important;
          transition: all 0.5s cubic-bezier(0.7, 0, 0.3, 1) !important;
        }

        :global(.topbar__apply-line--start) {
          width: 30px !important;
          margin-right: 1rem !important;
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        :global(.topbar__apply-line--end) {
          width: 0 !important;
          margin-left: 0 !important;
          opacity: 0 !important;
          transform: translateX(-20px) !important;
        }

        :global(.topbar__modal-apply:hover .topbar__apply-line--start) {
          opacity: 0 !important;
          transform: translateX(20px) !important;
          width: 0 !important;
          margin-right: 0 !important;
        }

        :global(.topbar__modal-apply:hover .topbar__apply-line--end) {
          opacity: 1 !important;
          transform: translateX(0) !important;
          width: 30px !important;
          margin-left: 1rem !important;
        }

        :global(.topbar__modal-apply:hover .topbar__apply-text) {
          transform: translateX(-10px) !important;
        }

        /* --- GENERAL DROPDOWN --- */
        .topbar__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 160px;
          background: var(--bg-card);
          border: 1px solid var(--divider);
          border-radius: 4px;
          box-shadow: var(--shadow-md);
          z-index: 600;
          animation: fadeInUp 0.15s var(--ease-luxury);
          overflow: hidden;
        }
        .topbar__dropdown--right {
          left: auto;
          right: 0;
          min-width: 200px;
        }
        .topbar__dropdown-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--divider);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .topbar__dropdown-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .topbar__dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 1rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          width: 100%;
          border: none;
          background: transparent;
          text-align: left;
        }
        .topbar__dropdown-item:hover {
          background: var(--bg-secondary);
          color: var(--text);
        }
        .topbar__dropdown-item--active {
          color: var(--gold);
          font-weight: 500;
        }
        .topbar__dropdown-item--danger:hover {
          background: rgba(200, 60, 60, 0.08);
          color: #c83c3c;
        }
        .topbar__gold-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 100%;
          background: linear-gradient(to right, transparent 0%, var(--gold) 30%, var(--gold) 70%, transparent 100%);
          opacity: 0.2;
        }
      `}</style>
    </>
  );
}
