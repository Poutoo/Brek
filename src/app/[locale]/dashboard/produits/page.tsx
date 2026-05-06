import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { formatPrice, formatStock } from "@/lib/utils";

export default async function AdminProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const { locale } = await params;

  if (!session || !isAdmin) redirect(`/${locale}/connexion`);

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { collection: { select: { name: true } } },
  });

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <Link href={`/${locale}/dashboard`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: "0.5rem" }}>
              ← Retour au Dashboard
            </Link>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Gestion des produits</h1>
          </div>
          <button className="btn btn-primary">
            <Plus size={18} /> Nouveau produit
          </button>
        </div>

        {/* Barre de recherche/filtres */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", background: "var(--bg-secondary)", padding: "1rem", borderRadius: 4, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, référence..." 
              style={{ width: "100%", padding: "0.625rem 1rem 0.625rem 2.5rem", borderRadius: 2, border: "1px solid var(--divider)", background: "var(--bg)" }}
            />
          </div>
          <select style={{ padding: "0.625rem 1rem", borderRadius: 2, border: "1px solid var(--divider)", background: "var(--bg)" }}>
            <option>Toutes les collections</option>
          </select>
          <select style={{ padding: "0.625rem 1rem", borderRadius: 2, border: "1px solid var(--divider)", background: "var(--bg)" }}>
            <option>Tous les statuts</option>
          </select>
        </div>

        <div style={{ border: "1px solid var(--divider)", borderRadius: 4, overflow: "hidden", background: "var(--bg-card)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--divider)" }}>
                <th style={{ padding: "1rem", textAlign: "left", width: 60 }}>Image</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Produit</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Collection</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Prix</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Stock</th>
                <th style={{ padding: "1rem", textAlign: "center" }}>Statut</th>
                <th style={{ padding: "1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: "1px solid var(--divider)" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ position: "relative", width: 48, height: 48, borderRadius: 2, overflow: "hidden", background: "var(--bg-secondary)" }}>
                      <Image 
                        src={product.images[0] || "/assets/placeholder.png"} 
                        alt="" 
                        fill 
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{product.ref}</div>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-muted)" }}>
                    {product.collection?.name || "—"}
                  </td>
                  <td style={{ padding: "1rem" }}>{formatPrice(product.price)}</td>
                  <td style={{ padding: "1rem" }}>
                    {product.stock <= 5 ? (
                      <span style={{ color: "var(--red)", fontWeight: 500 }}>{formatStock(product.stock)} {product.unit}</span>
                    ) : (
                      <span>{formatStock(product.stock)} {product.unit}</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    {product.active ? (
                      <span className="badge badge-green">Actif</span>
                    ) : (
                      <span className="badge">Inactif</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} title="Modifier">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} title={product.active ? "Désactiver" : "Activer"}>
                        {product.active ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ padding: 8, color: "var(--red)" }} title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
