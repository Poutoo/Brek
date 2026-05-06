import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  designers: { designer: { name: string } }[];
}

interface CollectionsSectionProps {
  collections: Collection[];
  locale: string;
}

export function CollectionsSection({ collections, locale }: CollectionsSectionProps) {
  return (
    <section id="collections-section" className="section-collections">
      <div className="container-brek">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-subtitle">Nos collections</p>
          <h2 className="section-title">Collections vedettes</h2>
        </div>

        {collections.length > 0 ? (
          <div className="collections-grid">
            {collections.map((col, index) => (
              <Link
                key={col.id}
                href={`/${locale}/collections/${col.slug}`}
                className={`collection-card ${index === 0 ? "collection-card--large" : ""}`}
                aria-label={`Voir la collection ${col.name}`}
              >
                <div className="collection-img-wrapper">
                  <Image
                    src={col.coverImage || "/assets/placeholder.png"}
                    alt={col.name}
                    fill
                    className="collection-img"
                    sizes={index === 0 ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 50vw, 30vw"}
                    priority={index === 0}
                  />
                  <div className="collection-overlay">
                    <div className="collection-info">
                      {col.designers.length > 0 && (
                        <p className="collection-designer">
                          {col.designers.map((d) => d.designer.name).join(", ")}
                        </p>
                      )}
                      <h3 className="collection-name">{col.name}</h3>
                      <p className="collection-desc">{col.description.substring(0, 80)}…</p>
                      <span className="collection-cta">
                        Découvrir <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem 0" }}>Aucune collection pour le moment.</p>
        )}

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href={`/${locale}/collections`} className="btn btn-secondary">
            Voir toutes les collections
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
