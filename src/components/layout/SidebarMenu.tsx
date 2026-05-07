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
    { title: "À PROPOS", href: `/${locale}/apropos` },
    { title: "PROJETS", href: `/${locale}/projet` },
    //{ title: "SHOWROOMS", href: `/${locale}/contact` },
    //{ title: "BREK DANS LE MONDE", href: `/${locale}/contact` },
  ];

  const footerLinksRight = [
    { title: "ACTUALITÉS", href: `/${locale}/newsletter` },
    //{ title: "PRESSE", href: `/${locale}/contact` },
    { title: "NOUS CONTACTER", href: `/${locale}/contact` },
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm animate-sidebar-fade flex" role="dialog" aria-modal="true">
      {/* Background Images */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block">
        <img
          src="/assets/menu/menu_principal.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10 transition-all duration-700 ease-in-out scale-100"
        />
        {sections.map((section) => (
          <img
            key={section.id}
            src={section.image}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${activeSection === section.id ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
          />
        ))}
      </div>

      {/* Menu Panel */}
      <div className="relative z-10 w-full max-w-[400px] md:max-w-[480px] h-full bg-[#7a6a64] flex flex-col p-8 md:p-12 shadow-2xl animate-sidebar-panel">
        <div className="mb-12">
          <button className="flex items-center gap-4 bg-transparent border-none text-white cursor-pointer transition-opacity hover:opacity-70" onClick={onClose}>
            <Plus size={32} strokeWidth={1} className="rotate-45" />
            <span className="text-[0.7rem] tracking-[0.2em] uppercase font-medium">FERMER</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <nav>
            <ul className="list-none p-0 m-0 w-full flex flex-col gap-1">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className="border-b border-white/10"
                  onMouseEnter={() => setActiveSection(section.id)}
                  onMouseLeave={() => setActiveSection(null)}
                >
                  <Link href={section.href} className="flex items-center justify-between py-5 font-serif text-[1.8rem] md:text-[2rem] uppercase text-white transition-all hover:pl-2 leading-none no-underline" onClick={onClose}>
                    {section.title}
                    {["passementerie", "tringlerie", "tissus", "fournitures"].includes(section.id) && (
                      <Plus size={18} strokeWidth={1} className="opacity-40" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Link href={`/${locale}/a-propos`} className="text-[0.65rem] tracking-widest uppercase text-white/50 transition-colors hover:text-white no-underline" onClick={onClose}>
              L'HISTOIRE
            </Link>
            <Link href={`/${locale}/contact`} className="text-[0.65rem] tracking-widest uppercase text-white/50 transition-colors hover:text-white no-underline" onClick={onClose}>
              SHOWROOMS
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/${locale}/newsletter`} className="text-[0.65rem] tracking-widest uppercase text-white/50 transition-colors hover:text-white no-underline" onClick={onClose}>
              ACTUALITÉS
            </Link>
            <Link href={`/${locale}/contact`} className="text-[0.65rem] tracking-widest uppercase text-white/50 transition-colors hover:text-white no-underline" onClick={onClose}>
              CONTACT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
