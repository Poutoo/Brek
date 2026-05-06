import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designers",
  description: "Découvrez les designers avec lesquels Brek a collaboré pour créer ses collections exclusives.",
};

export default async function DesignersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const designers = await prisma.designer.findMany({
    include: {
      collections: { include: { collection: true } },
    },
  });

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-subtitle">Collaborations</p>
          <h1 className="section-title">Nos designers</h1>
          <p style={{ marginTop: "1rem", color: "var(--text-muted)", maxWidth: 500, margin: "1rem auto 0" }}>
            Brek collabore avec des designers de renom du monde entier pour créer des collections qui mêlent tradition et modernité.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {designers.map((designer) => (
            <Link key={designer.id} href={`/${locale}/designers/${designer.slug}`}
              className="card" style={{ display: "block" }}
              aria-label={`Voir le profil de ${designer.name}`}>
              <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
                <Image
                  src={designer.image}
                  alt={`Portrait de ${designer.name}`}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top", transition: "transform 0.5s var(--ease-luxury)" }}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div style={{ padding: "1.25rem" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400, marginBottom: "0.5rem" }}>
                  {designer.name}
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "0.875rem" }}>
                  {designer.bio.substring(0, 120)}…
                </p>
                {designer.collections.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.875rem" }}>
                    {designer.collections.map((dc) => (
                      <span key={dc.collection.id} className="badge badge-gold">
                        {dc.collection.name}
                      </span>
                    ))}
                  </div>
                )}
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--gold)", fontWeight: 500 }}>
                  Voir le profil <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
