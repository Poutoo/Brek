"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  Search,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useLoadingStore } from "@/store/loadingStore";
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
  const { getTotalItems, openCart } = useCartStore();
  const { isLoading } = useLoadingStore();

  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [showCountryOptions, setShowCountryOptions] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);

  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      window.scrollTo(0, 0);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [locale, pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        className={`fixed top-6 left-8 right-8 z-[500] h-[var(--nav-height)] rounded-lg transition-all duration-500 ease-[var(--ease-luxury)] ${
          scrolled ? "bg-white text-[#533b3b] shadow-lg" : 
          isTransparent ? "bg-transparent text-white shadow-none" : 
          "bg-white text-[#533b3b] shadow-md"
        } ${isLoading ? "-translate-y-[200%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}
        role="banner"
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-32">
          {/* GAUCHE : Menu hamburger */}
          <div className="flex flex-1 items-center gap-2">
            <button
              className="flex items-center gap-4 bg-transparent border-none cursor-pointer text-current p-2"
              onClick={() => setSidebarOpen(true)}
              aria-label={t("collections")}
            >
              <div className="flex flex-col gap-1">
                <span className="h-px w-6 bg-current" />
                <span className="h-px w-6 bg-current" />
              </div>
              <span className="text-[0.75rem] tracking-[0.15em] font-normal">MENU</span>
            </button>
          </div>

          {/* CENTRE : Logo */}
          <Link href={`/${locale}`} className="flex flex-col items-center leading-none justify-self-center shrink-0" aria-label="Brek — Accueil">
            <span className="font-serif text-2xl font-medium tracking-[0.3em] text-current">BREK</span>
            <span className="text-[0.5rem] tracking-[0.4em] uppercase text-current mt-0.5 opacity-80">PARIS</span>
          </Link>

          {/* DROITE : Actions */}
          <div className="flex flex-1 items-center gap-1 justify-end">
            {/* Langue */}
            <div className="relative" ref={langMenuRef}>
              <button
                className="flex items-center gap-2 p-2 text-[0.75rem] tracking-[0.05em] text-current bg-transparent border-none cursor-pointer font-medium"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Changer de langue"
              >
                <span className="flex items-center rounded-sm overflow-hidden shadow-sm">
                  {LOCALES.find((l) => l.code === locale)?.flag}
                </span>
                <span>{locale.toUpperCase()}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 opacity-60 ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute top-[calc(100%+1.5rem)] right-[-4rem] w-[320px] bg-white text-[#533b3b] p-8 rounded-lg border border-[#e5e1da] shadow-2xl animate-[fadeInUp_0.15s_var(--ease-luxury)]">
                  <div className="flex flex-col gap-6">
                    {/* Country Section */}
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[0.7rem] font-bold tracking-widest uppercase">COUNTRY *</label>
                      <div
                        className="flex items-center gap-3 p-3.5 border border-[#533b3b]/20 rounded-lg bg-white cursor-pointer transition-colors hover:border-[#533b3b]"
                        onClick={() => {
                          setShowCountryOptions(!showCountryOptions);
                          setShowLangOptions(false);
                        }}
                      >
                        <span className="flex items-center">
                          {LOCALES.find((l) => l.code === selectedLocale)?.flag}
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {selectedLocale === 'fr' ? 'France' : selectedLocale === 'en' ? 'United Kingdom' : 'Spain'}
                        </span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${showCountryOptions ? "rotate-180" : ""}`} />
                      </div>

                      {showCountryOptions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e1da] rounded-lg shadow-xl overflow-hidden z-10">
                          {LOCALES.map((l) => (
                            <div
                              key={l.code}
                              className={`p-3 text-sm cursor-pointer flex items-center gap-3 transition-colors hover:bg-[#fcf9f2] ${selectedLocale === l.code ? 'bg-[#fcf9f2] font-semibold' : ''}`}
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
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[0.7rem] font-bold tracking-widest uppercase">LANGUAGE</label>
                      <div
                        className="flex items-center gap-3 p-3.5 border border-[#533b3b]/20 rounded-lg bg-white cursor-pointer transition-colors hover:border-[#533b3b]"
                        onClick={() => {
                          setShowLangOptions(!showLangOptions);
                          setShowCountryOptions(false);
                        }}
                      >
                        <span className="flex-1 text-sm font-medium">
                          {selectedLocale === 'fr' ? 'Français' : selectedLocale === 'en' ? 'English' : 'Español'}
                        </span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${showLangOptions ? "rotate-180" : ""}`} />
                      </div>

                      {showLangOptions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e1da] rounded-lg shadow-xl overflow-hidden z-10">
                          {LOCALES.map((l) => (
                            <div
                              key={l.code}
                              className={`p-3 text-sm cursor-pointer flex items-center gap-3 transition-colors hover:bg-[#fcf9f2] ${selectedLocale === l.code ? 'bg-[#fcf9f2] font-semibold' : ''}`}
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

                    <div className="mt-4">
                      <Link
                        href={getLocalePath(selectedLocale)}
                        className="group relative flex w-full items-center justify-center bg-[#533b3b] text-white p-4.5 rounded-lg no-underline transition-all hover:bg-[#3d2b2b] hover:-translate-y-0.5 overflow-hidden"
                        onClick={() => setLangMenuOpen(false)}
                      >
                        <span className="h-px w-8 bg-white mr-4 transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] group-hover:w-0 group-hover:opacity-0 group-hover:mr-0 group-hover:translate-x-5" />
                        <span className="text-[0.8125rem] font-bold tracking-widest transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] group-hover:-translate-x-2.5">APPLY</span>
                        <span className="h-px w-0 bg-white ml-0 opacity-0 translate-x-[-20px] transition-all duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] group-hover:w-8 group-hover:ml-4 group-hover:opacity-100 group-hover:translate-x-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <button className="flex items-center justify-center w-10 h-10 bg-transparent border-none cursor-pointer text-current transition-opacity hover:opacity-70">
              <MapPin size={18} strokeWidth={1.5} />
            </button>

            {/* Recherche */}
            <button
              className="flex items-center justify-center w-10 h-10 bg-transparent border-none cursor-pointer text-current transition-opacity hover:opacity-70"
              onClick={() => setSearchOpen(true)}
              aria-label={t("search")}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Trade Access */}
            <Link href={`/${locale}/compte`} className="hidden lg:flex items-center gap-2 text-current text-[0.65rem] tracking-widest font-medium mx-4 uppercase">
              <span className={`w-2 h-2 rounded-full transition-all duration-500 ease-[var(--ease-luxury)] ${mounted && session ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_10px_rgba(255,77,77,0.6)]'}`} />
              <span>Espace Pro</span>
            </Link>

            {/* Panier */}
            <button
              className="group relative flex items-center justify-center w-10 h-10 bg-transparent border-none cursor-pointer text-current"
              onClick={openCart}
              aria-label={`${t("cart")} (${mounted ? totalItems : 0} article${(mounted ? totalItems : 0) !== 1 ? "s" : ""})`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {mounted && (
                <span className={`absolute -top-0.5 -right-0.5 w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--gold)] text-black text-[0.625rem] font-bold shadow-md border-2 transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-115 ${isTransparent ? 'border-[#533b3b]' : 'border-white'}`}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer pour éviter le chevauchement */}
      {(!scrolled && isHomePage) ? null : (
        <div className="h-[var(--nav-height)]" aria-hidden="true" />
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
    </>
  );
}
