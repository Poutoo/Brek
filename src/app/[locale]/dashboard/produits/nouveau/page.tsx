import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <header style={{ marginBottom: "2rem" }}>
          <Link href={`/${locale}/dashboard/produits`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: "0.5rem" }}>
            <ChevronLeft size={16} /> Retour à la liste
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Ajouter un produit</h1>
        </header>

        <ProductForm locale={locale} />
      </div>
    </div>
  );
}
