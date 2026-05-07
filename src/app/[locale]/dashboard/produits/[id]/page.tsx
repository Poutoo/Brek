import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ locale: string, id: string }> 
}) {
  const { locale, id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  return (
    <div style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <header style={{ marginBottom: "2rem" }}>
          <Link href={`/${locale}/dashboard/produits`} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: "0.5rem" }}>
            <ChevronLeft size={16} /> Retour à la liste
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 300 }}>Modifier le produit</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Référence : {product.ref}</p>
        </header>

        <ProductForm initialData={product} locale={locale} />
      </div>
    </div>
  );
}
