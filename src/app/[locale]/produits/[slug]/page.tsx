import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produit introuvable" };
  return { title: product.name, description: product.description.substring(0, 160) };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: { collection: { include: { designers: { include: { designer: true } } } } },
  });

  if (!product) notFound();

  const suggestions = await prisma.product.findMany({
    where: { active: true, id: { not: product.id }, collectionId: product.collectionId ?? undefined },
    take: 4,
    include: { collection: { select: { name: true } } },
  });

  const metadata = product.metadata as Record<string, string>;

  return (
    <ProductDetailClient
      product={{ ...product, metadata }}
      suggestions={suggestions.map((s) => ({ ...s, collectionName: s.collection?.name }))}
      locale={locale}
    />
  );
}
