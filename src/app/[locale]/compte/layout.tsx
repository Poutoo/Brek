import Link from "next/link";
import { User, Package, MapPin, CreditCard, Heart, Settings, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export default async function CompteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const menuItems = [
    { href: `/${locale}/compte`, label: "Tableau de bord", icon: <User size={20} />, exact: true },
    { href: `/${locale}/compte/commandes`, label: "Commandes & devis", icon: <Package size={20} /> },
    { href: `/${locale}/compte/adresses`, label: "Mes adresses", icon: <MapPin size={20} /> },
    { href: `/${locale}/compte/paiement`, label: "Mes cartes bancaires", icon: <CreditCard size={20} /> },
    { href: `/${locale}/compte/favoris`, label: "Liste d'envies", icon: <Heart size={20} /> },
    { href: `/${locale}/compte/parametres`, label: "Paramètres du compte", icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ paddingTop: "2rem", paddingBottom: "6rem", minHeight: "80vh" }}>
      <div className="container-brek">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300, marginBottom: "2rem" }}>
          Mon espace
        </h1>

        <div style={{ display: "flex", gap: "3rem", flexDirection: "row", flexWrap: "wrap" }}>
          {/* Sidebar */}
          <aside style={{ flex: "0 0 250px", width: "100%" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    borderRadius: "4px",
                    color: "var(--text)",
                    textDecoration: "none",
                    transition: "background-color 0.2s, color 0.2s",
                  }}
                  className="sidebar-link"
                >
                  <span style={{ color: "var(--gold)" }}>{item.icon}</span>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: "300px" }}>
            {children}
          </main>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-link:hover {
          background-color: var(--bg-secondary);
        }
      `}} />
    </div>
  );
}
