import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/molecules/ProductCard";

interface Product {
  id: string; ref: string; name: string; slug: string; price: number;
  stock: number; unit: string; images: string[]; featured: boolean;
  collection: { name: string; slug: string } | null;
}

interface FeaturedProductsSectionProps {
  products: Product[];
  locale: string;
}

export function FeaturedProductsSection({ products, locale }: FeaturedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-featured" aria-labelledby="featured-title">
      <div className="section-featured-bg" aria-hidden="true" />
      <div className="container-brek" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-subtitle" style={{ color: "rgba(201,168,76,0.8)" }}>Sélection</p>
          <h2 id="featured-title" className="section-title" style={{ color: "var(--cream)" }}>
            Nos produits phares
          </h2>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, collectionName: product.collection?.name }}
              locale={locale}
            />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href={`/${locale}/produits`} className="btn btn-secondary"
            style={{ color: "var(--cream)", borderColor: "rgba(255,253,247,0.3)" }}>
            Voir tous les produits <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
