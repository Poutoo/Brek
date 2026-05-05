import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Découvrez toutes les collections de passementerie et tissus haut de gamme Brek.",
};

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const collections = await prisma.collection.findMany({
    include: {
      designers: { include: { designer: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-subtitle">Notre univers</p>
          <h1 className="section-title">Toutes les collections</h1>
          <p style={{ marginTop: "1rem", color: "var(--text-muted)", maxWidth: 500, margin: "1rem auto 0" }}>
            Chaque collection est le fruit d'une collaboration unique entre Brek et des designers de renom.
          </p>
        </div>

        {/* Grille */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/${locale}/collections/${col.slug}`}
              className="card"
              aria-label={`Collection ${col.name}`}
              style={{ display: "block" }}
            >
              <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
                <Image
                  src={col.coverImage || "/assets/placeholder.png"}
                  alt={col.name}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.5s var(--ease-luxury)" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div style={{ padding: "1.25rem" }}>
                <p style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.375rem" }}>
                  {col.designers.map((d) => d.designer.name).join(", ") || "Brek"}
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, marginBottom: "0.5rem" }}>
                  {col.name}
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {col.description.substring(0, 100)}…
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {col._count.products} produit{col._count.products !== 1 ? "s" : ""}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--gold)", fontWeight: 500 }}>
                    Découvrir <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
