import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Package, MapPin } from "lucide-react";

export default async function CompteDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/${locale}/connexion`);
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      addresses: {
        where: { isDefault: true },
        take: 1
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: true }
      },
      quotes: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: true }
      }
    }
  });

  if (!user) {
    redirect(`/${locale}/connexion`);
  }

  const defaultAddress = user.addresses[0];
  const clientNo = user.id.slice(-6).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <section style={{ border: "1px solid var(--divider)", borderRadius: "4px", padding: "1.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "1rem" }}>Tableau de bord</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div>
            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gold)", marginBottom: "0.5rem" }}>N° Client</p>
            <p style={{ fontWeight: 500, fontFamily: "monospace", fontSize: "1.125rem" }}>{clientNo}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gold)", marginBottom: "0.5rem" }}>Profil</p>
            <p>{user.firstName} {user.lastName}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{user.email}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gold)", marginBottom: "0.5rem" }}>Adresse par défaut</p>
            {defaultAddress ? (
              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                <p>{defaultAddress.line1}</p>
                {defaultAddress.line2 && <p>{defaultAddress.line2}</p>}
                <p>{defaultAddress.postalCode} {defaultAddress.city}</p>
                <p>{defaultAddress.country}</p>
              </div>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontStyle: "italic" }}>Aucune adresse renseignée</p>
            )}
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Dernières commandes */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Package size={20} color="var(--gold)" /> Dernières commandes
            </h3>
            <Link href={`/${locale}/compte/commandes`} style={{ fontSize: "0.875rem", color: "var(--gold)", textDecoration: "underline" }}>
              Tout voir
            </Link>
          </div>
          
          {user.orders.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {user.orders.map(order => (
                <div key={order.id} style={{ border: "1px solid var(--divider)", borderRadius: "4px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{order.orderNumber}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 600 }}>{order.totalAmount.toFixed(2)} €</p>
                    <span className="badge" style={{ fontSize: "0.6875rem", marginTop: "0.25rem", display: "inline-block" }}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontStyle: "italic", padding: "1rem", border: "1px dashed var(--divider)", borderRadius: "4px", textAlign: "center" }}>
              Aucune commande récente
            </p>
          )}
        </section>

        {/* Devis en cours */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={20} color="var(--gold)" /> Devis en cours
            </h3>
            <Link href={`/${locale}/compte/commandes`} style={{ fontSize: "0.875rem", color: "var(--gold)", textDecoration: "underline" }}>
              Tout voir
            </Link>
          </div>
          
          {user.quotes.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {user.quotes.map(quote => (
                <div key={quote.id} style={{ border: "1px solid var(--divider)", borderRadius: "4px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{quote.quoteNumber}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(quote.createdAt).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 600 }}>{quote.totalAmount.toFixed(2)} €</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{quote.items.length} article(s)</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontStyle: "italic", padding: "1rem", border: "1px dashed var(--divider)", borderRadius: "4px", textAlign: "center" }}>
              Aucun devis en cours
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
