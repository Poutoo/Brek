import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Globe } from "lucide-react";
import type { Metadata } from "next";

const InstagramIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const designer = await prisma.designer.findUnique({ where: { slug } });
  if (!designer) return { title: "Designer introuvable" };
  return { title: designer.name, description: designer.bio.substring(0, 160) };
}

export default async function DesignerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const designer = await prisma.designer.findUnique({
    where: { slug },
    include: {
      collections: {
        include: {
          collection: {
            include: { _count: { select: { products: true } } },
          },
        },
      },
    },
  });

  if (!designer) notFound();

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
          {/* Sidebar designer */}
          <aside style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.25rem" }}>
            <div style={{ position: "relative", width: 220, height: 280, borderRadius: 4, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
              <Image
                src={designer.image}
                alt={`Portrait de ${designer.name}`}
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
                priority
                sizes="220px"
              />
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 400 }}>{designer.name}</h1>
              <p style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--gold)", marginTop: "0.25rem" }}>
                Designer Collaborateur Brek
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {designer.instagram && (
                <a href={`https://instagram.com/${designer.instagram.replace("@", "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm" aria-label={`Instagram de ${designer.name}`}>
                  <InstagramIcon /> Instagram
                </a>
              )}
              {designer.website && (
                <a href={designer.website} target="_blank" rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm" aria-label={`Site web de ${designer.name}`}>
                  <Globe size={14} /> Site web
                </a>
              )}
            </div>
          </aside>

          {/* Content */}
          <main>
            <section aria-labelledby="bio-title">
              <h2 id="bio-title" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.25rem" }}>
                Biographie
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.9 }}>{designer.bio}</p>
            </section>

            {designer.collections.length > 0 && (
              <section aria-labelledby="collab-title" style={{ marginTop: "3rem" }}>
                <h2 id="collab-title" style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.25rem" }}>
                  Collaborations avec Brek
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
                  {designer.collections.map(({ collection }) => (
                    <Link key={collection.id} href={`/${locale}/collections/${collection.slug}`}
                      className="card" style={{ display: "block" }}
                      aria-label={`Collection ${collection.name}`}>
                      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                        <Image src={collection.coverImage || "/assets/placeholder.png"}
                          alt={collection.name} fill style={{ objectFit: "cover" }} sizes="300px" />
                      </div>
                      <div style={{ padding: "1rem" }}>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", fontWeight: 400, marginBottom: "0.375rem" }}>
                          {collection.name}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {collection._count.products} produit{collection._count.products !== 1 ? "s" : ""}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--gold)", fontWeight: 500 }}>
                            Voir <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
