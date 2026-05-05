"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useThemeStore } from "@/store/themeStore";
import { SidebarMenu } from "./SidebarMenu";
import { SearchOverlay } from "./SearchOverlay";

interface TopBarProps {
  locale: string;
}

const LOCALES = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "es", label: "ES", flag: "🇪🇸" },
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

  const totalItems = getTotalItems();
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer menus au click extérieur
  useEffect(() => {
    const handleClick = () => {
      setUserMenuOpen(false);
      setLangMenuOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
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

  const navLinks = [
    { href: `/${locale}/collections`, label: t("collections") },
    { href: `/${locale}/designers`, label: t("designers") },
    { href: `/${locale}/produits`, label: t("products") },
  ];

  return (
    <>
      <header
        className={`topbar ${scrolled ? "topbar--scrolled" : ""}`}
        role="banner"
      >
        <div className="topbar__inner container-brek">
          {/* GAUCHE : Menu hamburger + Nav desktop */}
          <div className="topbar__left">
            <button
              className="topbar__icon-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label={t("collections")}
              id="menu-btn"
            >
              <Menu size={20} />
            </button>
            {/* Nav desktop uniquement */}
            <nav className="topbar__nav" aria-label="Navigation principale">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`topbar__nav-link ${pathname === link.href ? "topbar__nav-link--active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTRE : Logo */}
          <Link href={`/${locale}`} className="topbar__logo" aria-label="Brek — Accueil">
            <span className="topbar__logo-text">BREK</span>
            <span className="topbar__logo-sub">PARIS</span>
          </Link>

          {/* DROITE : Actions */}
          <div className="topbar__right">
            {/* Langue — desktop only */}
            <div className="topbar__lang-wrapper" onClick={(e) => e.stopPropagation()}>
              <button
                className="topbar__lang-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Changer de langue"
                id="lang-btn"
              >
                {LOCALES.find((l) => l.code === locale)?.flag}{" "}
                {locale.toUpperCase()}
                <ChevronDown size={12} className={`transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {langMenuOpen && (
                <div className="topbar__dropdown">
                  {LOCALES.map((l) => (
                    <Link
                      key={l.code}
                      href={getLocalePath(l.code)}
                      className={`topbar__dropdown-item ${locale === l.code ? "topbar__dropdown-item--active" : ""}`}
                    >
                      {l.flag} {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Thème */}
            <button
              className="topbar__icon-btn"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Mode sombre" : "Mode clair"}
              id="theme-btn"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Recherche */}
            <button
              className="topbar__icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
              id="search-btn"
            >
              <Search size={18} />
            </button>

            {/* Connexion / Compte */}
            {session ? (
              <div className="topbar__user-wrapper" onClick={(e) => e.stopPropagation()}>
                <button
                  className="topbar__icon-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label={t("account")}
                  id="user-menu-btn"
                >
                  <User size={18} />
                </button>
                {userMenuOpen && (
                  <div className="topbar__dropdown topbar__dropdown--right">
                    <div className="topbar__dropdown-header">
                      <p className="topbar__dropdown-name">
                        {session.user?.name || session.user?.email}
                      </p>
                      {isAdmin && (
                        <span className="badge badge-gold" style={{ fontSize: "0.6rem" }}>Admin</span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link href={`/${locale}/admin`} className="topbar__dropdown-item">
                        <Settings size={14} /> {t("admin")}
                      </Link>
                    )}
                    <Link href={`/${locale}/compte`} className="topbar__dropdown-item">
                      <User size={14} /> {t("account")}
                    </Link>
                    <Link href={`/${locale}/commandes`} className="topbar__dropdown-item">
                      <Package size={14} /> {t("orders")}
                    </Link>
                    <Link href={`/${locale}/favoris`} className="topbar__dropdown-item">
                      <Heart size={14} /> {t("wishlist")}
                    </Link>
                    <button
                      className="topbar__dropdown-item topbar__dropdown-item--danger"
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                    >
                      <LogOut size={14} /> {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/${locale}/connexion`}
                className="topbar__icon-btn"
                aria-label={t("login")}
                id="login-btn"
              >
                <User size={18} />
              </Link>
            )}

            {/* Favoris — desktop only */}
            {session && (
              <Link
                href={`/${locale}/favoris`}
                className="topbar__icon-btn topbar__icon-btn--desktop"
                aria-label={t("wishlist")}
                id="wishlist-btn"
              >
                <Heart size={18} />
              </Link>
            )}

            {/* Panier */}
            <button
              className="topbar__cart-btn"
              onClick={openCart}
              aria-label={`${t("cart")} (${mounted ? totalItems : 0} article${(mounted ? totalItems : 0) !== 1 ? "s" : ""})`}
              id="cart-btn"
            >
              <ShoppingBag size={18} />
              {mounted && totalItems > 0 && (
                <span className="topbar__cart-badge" aria-live="polite">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barre de progression dorée */}
        <div className="topbar__gold-line" aria-hidden="true" />
      </header>

      {/* Spacer pour éviter le chevauchement */}
      <div style={{ height: "var(--nav-height)" }} aria-hidden="true" />

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
          top: 0;
          left: 0;
          right: 0;
          height: var(--nav-height);
          background: var(--bg);
          border-bottom: 1px solid var(--divider);
          z-index: 500;
          transition: background 0.3s var(--ease-luxury), box-shadow 0.3s var(--ease-luxury);
        }
        .topbar--scrolled {
          background: color-mix(in srgb, var(--bg) 95%, transparent);
          backdrop-filter: blur(8px);
          box-shadow: var(--shadow-sm);
        }
        .topbar__inner {
          height: 100%;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
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
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          color: var(--text);
          line-height: 1;
        }
        .topbar__logo-sub {
          font-size: 0.55rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--gold);
          margin-top: 1px;
        }
        .topbar__right {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          justify-content: flex-end;
        }
        .topbar__icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          border-radius: 2px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
        }
        .topbar__icon-btn:hover {
          color: var(--text);
          background: var(--bg-secondary);
        }
        .topbar__icon-btn--desktop {
          display: none;
        }
        @media (min-width: 768px) {
          .topbar__icon-btn--desktop { display: flex; }
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
          color: var(--text-muted);
          border-radius: 2px;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
        }
        .topbar__cart-btn:hover {
          color: var(--text);
          background: var(--bg-secondary);
        }
        .topbar__cart-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 16px;
          height: 16px;
          background: var(--gold);
          color: var(--charcoal);
          font-size: 0.6rem;
          font-weight: 700;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 3px;
          animation: pulse-gold 2s infinite;
        }
        .topbar__lang-wrapper,
        .topbar__user-wrapper {
          position: relative;
        }
        .topbar__lang-btn {
          display: none;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.625rem;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          font-weight: 500;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid var(--divider);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.2s;
        }
        @media (min-width: 768px) {
          .topbar__lang-btn { display: flex; }
        }
        .topbar__lang-btn:hover {
          color: var(--text);
          border-color: var(--gold);
        }
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
