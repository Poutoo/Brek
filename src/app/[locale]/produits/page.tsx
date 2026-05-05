import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { ProduitsClient } from "./ProduitsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produits",
  description: "Découvrez notre catalogue complet de passementerie et tissus haut de gamme.",
};

export default async function ProduitsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const collections = await prisma.collection.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <Suspense>
      <ProduitsClient locale={locale} collections={collections} />
    </Suspense>
  );
}
