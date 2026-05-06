import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscriber.update({ where: { email }, data: { active: true } });
        return NextResponse.json({ message: "Réabonnement effectué" });
      }
      return NextResponse.json({ message: "Déjà inscrit" });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });
    return NextResponse.json({ message: "Inscription réussie" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const articles = await prisma.newsletterArticle.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, excerpt: true, coverImage: true, publishedAt: true },
  });
  return NextResponse.json({ articles });
}
