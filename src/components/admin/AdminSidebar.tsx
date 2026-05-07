"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  MessageSquare, 
  ExternalLink,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminSidebarProps {
  locale: string;
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: `/${locale}/dashboard`, icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: `/${locale}/dashboard/produits`, icon: <ShoppingBag size={20} />, label: "Produits" },
    { href: `/${locale}/dashboard/commandes`, icon: <Package size={20} />, label: "Commandes" },
    { href: `/${locale}/dashboard/utilisateurs`, icon: <Users size={20} />, label: "Utilisateurs" },
    { href: `/${locale}/dashboard/messages`, icon: <MessageSquare size={20} />, label: "Messages" },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/dashboard`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <Link href={`/${locale}`} className="admin-logo">
          <span className="admin-logo-text">BREK</span>
          <span className="admin-logo-sub">ADMIN</span>
        </Link>
      </div>

      <nav className="admin-nav">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`admin-nav-item ${isActive(link.href) ? "admin-nav-item--active" : ""}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <Link href={`/${locale}`} className="admin-nav-item">
          <ExternalLink size={20} />
          <span>Voir le site</span>
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: `/${locale}/admin` })}
          className="admin-nav-item admin-nav-item--logout w-full text-left"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
