import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/molecules/ProductCard";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return { title: "Collection introuvable" };
  return {
    title: collection.name,
    description: collection.description.substring(0, 160),
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      designers: { include: { designer: true } },
      products: {
        where: { active: true },
        orderBy: { featured: "desc" },
      },
    },
  });

  if (!collection) notFound();

  return (
    <div>
      {/* Hero collection */}
      <section style={{ position: "relative", height: "min(70vh, 600px)", overflow: "hidden" }}>
        <Image
          src={collection.coverImage || "/assets/placeholder.png"}
          alt={collection.name}
          fill
          style={{ objectFit: "cover" }}
          priority
          sizes="100vw"
        />
        {/* Vidéo si disponible */}
        {collection.videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          >
            <source src={collection.videoUrl} type="video/mp4" />
          </video>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(26,22,20,0.8) 0%, rgba(26,22,20,0.2) 50%, transparent 100%)",
        }} />
        <div className="container-brek" style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", paddingBottom: "2rem", color: "var(--cream)"
        }}>
          {collection.designers.length > 0 && (
            <p style={{ fontSize: "0.6875rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
              {collection.designers.map((d) => d.designer.name).join(", ")}
            </p>
          )}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 300, lineHeight: 1.1 }}>
            {collection.name}
          </h1>
        </div>
      </section>

      <div className="container-brek" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        {/* Description + galerie */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem", marginBottom: "4rem" }}>
          <div style={{ maxWidth: 600 }}>
            <p style={{ fontSize: "1.0625rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
              {collection.description}
            </p>
            {collection.designers.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <p style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "1rem" }}>
                  Designers
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {collection.designers.map(({ designer }) => (
                    <Link key={designer.id} href={`/${locale}/designers/${designer.slug}`}
                      className="btn btn-secondary btn-sm">
                      {designer.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Galerie images */}
          {collection.images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
              {collection.images.slice(0, 3).map((img, i) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 2, overflow: "hidden" }}>
                  <Image src={img} alt={`${collection.name} ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="200px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Produits */}
        <div>
          <div style={{ marginBottom: "2rem" }}>
            <p className="section-subtitle">Produits</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 300 }}>
              {collection.products.length} produit{collection.products.length !== 1 ? "s" : ""} dans cette collection
            </h2>
          </div>
          {collection.products.length > 0 ? (
            <div className="products-grid">
              {collection.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{ ...product, collectionName: collection.name }}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>Aucun produit dans cette collection pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
