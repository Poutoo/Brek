import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Gazette Brek",
  description: "Découvrez les dernières tendances, collaborations et secrets de fabrication de la maison Brek.",
};

const dateLocales: Record<string, any> = { fr, en: enUS, es };

export default async function NewsletterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const articles = await prisma.newsletterArticle.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  const dateLocale = dateLocales[locale] || fr;

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek">
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p className="section-subtitle">Gazette & Inspirations</p>
          <h1 className="section-title">L'Art du Détail</h1>
          <p style={{ maxWidth: 600, margin: "1rem auto", color: "var(--text-muted)", lineHeight: 1.8 }}>
            Plongez dans l'univers de Brek. Découvrez nos nouvelles collections, les portraits de nos designers partenaires et l'excellence de notre savoir-faire artisanal.
          </p>
        </header>

        {/* Liste des articles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2.5rem" }}>
          {articles.map((article: any) => (
            <article key={article.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                <Image
                  src={article.coverImage || "/assets/placeholder.png"}
                  alt={article.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <time style={{ fontSize: "0.75rem", color: "var(--gold)", fontWeight: 500, marginBottom: "0.5rem" }}>
                  {article.publishedAt ? format(new Date(article.publishedAt), "MMMM yyyy", { locale: dateLocale }) : ""}
                </time>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400, marginBottom: "1rem", lineHeight: 1.2 }}>
                  {article.title}
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  {article.excerpt}
                </p>
                <Link
                  href={`/${locale}/newsletter/${article.slug}`}
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: "auto", alignSelf: "flex-start", paddingLeft: 0 }}
                >
                  Lire l'article <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Section inscription */}
        <section style={{ marginTop: "6rem", background: "var(--charcoal)", borderRadius: 4, padding: "4rem 2rem", textAlign: "center", color: "var(--cream)" }}>
          <Mail size={32} style={{ color: "var(--gold)", marginBottom: "1.5rem" }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>
            Ne manquez aucune édition
          </h2>
          <p style={{ maxWidth: 500, margin: "0 auto 2rem", opacity: 0.8, fontSize: "0.9375rem" }}>
            Inscrivez-vous pour recevoir nos invitations aux ventes privées et nos inspirations décoration directement dans votre boîte mail.
          </p>
          <form style={{ display: "flex", maxWidth: 400, margin: "0 auto", gap: "0.5rem", flexDirection: "column" }}>
            <input
              type="email"
              placeholder="Brek@email.com"
              style={{ padding: "0.875rem 1.25rem", borderRadius: 2, border: "1px solid rgba(255,253,247,0.2)", background: "rgba(255,253,247,0.05)", color: "var(--cream)" }}
            />
            <button type="submit" className="btn btn-primary" style={{ justifyContent: "center" }}>
              S'abonner à la gazette
            </button>
          </form>
          <p style={{ marginTop: "1rem", fontSize: "0.6875rem", opacity: 0.5 }}>
            En vous inscrivant, vous acceptez notre politique de confidentialité. Désinscription possible à tout moment.
          </p>
        </section>
      </div>
    </div>
  );
}
