import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Designer {
  id: string; slug: string; name: string; bio: string; image: string;
  collections: { collection: { id: string; name: string; slug: string } }[];
}

interface DesignersPreviewSectionProps {
  designers: Designer[];
  locale: string;
}

export function DesignersPreviewSection({ designers, locale }: DesignersPreviewSectionProps) {
  if (designers.length === 0) return null;

  return (
    <section className="section-designers" aria-labelledby="designers-title">
      <div className="container-brek">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-subtitle">Collaborations</p>
          <h2 id="designers-title" className="section-title">Nos designers</h2>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", maxWidth: 500, margin: "1rem auto 0", lineHeight: 1.7 }}>
            Brek collabore avec des designers de renom pour créer des collections exclusives alliant tradition et modernité.
          </p>
        </div>

        <div className="designers-grid">
          {designers.map((designer) => (
            <Link
              key={designer.id}
              href={`/${locale}/designers/${designer.slug}`}
              className="designer-card-preview"
              aria-label={`Voir le profil de ${designer.name}`}
            >
              <div className="designer-img-wrapper">
                <Image
                  src={designer.image}
                  alt={`Portrait de ${designer.name}`}
                  fill
                  className="designer-img"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="designer-img-overlay" aria-hidden="true" />
              </div>
              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 400, color: "var(--text)" }}>
                  {designer.name}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {designer.bio.substring(0, 100)}…
                </p>
                {designer.collections.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {designer.collections.map((dc) => (
                      <span key={dc.collection.id} className="badge badge-gold">{dc.collection.name}</span>
                    ))}
                  </div>
                )}
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 500, marginTop: "0.25rem" }}>
                  Voir le profil <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href={`/${locale}/designers`} className="btn btn-secondary">
            Tous les designers <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
