import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/sections/HeroSection";
import { CollectionsSection } from "@/components/sections/CollectionsSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { DesignersPreviewSection } from "@/components/sections/DesignersPreviewSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: "Brek — Passementerie & Tissus de Luxe",
    description: t("hero_subtitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch data en parallèle
  const [collections, featuredProducts, designers] = await Promise.all([
    prisma.collection.findMany({
      include: { designers: { include: { designer: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { featured: true, active: true },
      take: 8,
      include: { collection: { select: { name: true, slug: true } } },
    }),
    prisma.designer.findMany({
      take: 3,
      include: { collections: { include: { collection: true } } },
    }),
  ]);

  return (
    <>
      <HeroSection locale={locale} collections={collections.slice(0, 3)} />
      <CollectionsSection collections={collections} locale={locale} />
      <FeaturedProductsSection products={featuredProducts} locale={locale} />
      <DesignersPreviewSection designers={designers} locale={locale} />
      <NewsletterSection locale={locale} />
    </>
  );
}
