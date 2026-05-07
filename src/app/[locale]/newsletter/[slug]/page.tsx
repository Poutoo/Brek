import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import type { Metadata } from "next";

const dateLocales: Record<string, any> = { fr, en: enUS, es };

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await prisma.newsletterArticle.findUnique({
        where: { slug },
    });

    if (!article) return { title: "Article non trouvé" };

    return {
        title: `${article.title} — La Gazette Brek`,
        description: article.excerpt,
    };
}

export default async function ArticlePage({
    params
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { locale, slug } = await params;

    const article = await prisma.newsletterArticle.findUnique({
        where: { slug, published: true },
    });

    if (!article) notFound();

    const dateLocale = dateLocales[locale] || fr;

    return (
        <article style={{ paddingBottom: "8rem" }}>
            {/* Header / Hero */}
            <div style={{ position: "relative", height: "60vh", minHeight: 400, background: "var(--charcoal)", marginBottom: "4rem" }}>
                <Image
                    src={article.coverImage || "/assets/placeholder.png"}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover", opacity: 0.7 }}
                    priority
                />
                <div className="container-brek" style={{ position: "relative", height: "100%", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "4rem", color: "white" }}>
                    <Link
                        href={`/${locale}/newsletter`}
                        className="btn btn-ghost btn-sm"
                        style={{ color: "white", alignSelf: "flex-start", marginBottom: "2rem", paddingLeft: 0 }}
                    >
                        <ArrowLeft size={16} /> Retour à la Gazette
                    </Link>

                    <div style={{ maxWidth: 800 }}>
                        <time style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gold)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "1rem" }}>
                            <Calendar size={16} />
                            {article.publishedAt ? format(new Date(article.publishedAt), "dd MMMM yyyy", { locale: dateLocale }) : "Non publié"}
                        </time>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "1.5rem" }}>
                            {article.title}
                        </h1>
                        <p style={{ fontSize: "1.25rem", opacity: 0.9, lineHeight: 1.6, fontStyle: "italic", borderLeft: "2px solid var(--gold)", paddingLeft: "1.5rem" }}>
                            {article.excerpt}
                        </p>
                    </div>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to top, var(--bg), transparent)", pointerEvents: "none" }} />
            </div>

            {/* Content */} 
            <div className="container-brek">
                <div className="newsletter-article-body" style={{ maxWidth: 800, margin: "0 auto", fontSize: "1.125rem", lineHeight: 1.8, color: "var(--text)" }}>
                    {article.content.split('\n\n').map((paragraph, i) => (
                        <p key={i} style={{ marginBottom: "2rem" }}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Footer of article */}
                <footer style={{ maxWidth: 800, margin: "6rem auto 0", padding: "4rem 0", borderTop: "1px solid var(--divider)", textAlign: "center" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 300, marginBottom: "1.5rem" }}>
                        Inscrit à notre gazette ?
                    </h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                        Rejoignez notre communauté pour recevoir en exclusivité nos portraits de designers et nos actualités.
                    </p>
                    <Link href={`/${locale}/newsletter`} className="btn btn-primary">
                        S'abonner à la gazette
                    </Link>
                </footer>
            </div>
        </article>
    );
}
