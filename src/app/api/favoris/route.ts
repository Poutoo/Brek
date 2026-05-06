import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { product: { include: { collection: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { productId } = await req.json();
  const existing = await prisma.favorite.findUnique({ where: { userId_productId: { userId, productId } } });
  if (existing) {
    await prisma.favorite.delete({ where: { userId_productId: { userId, productId } } });
    return NextResponse.json({ favorited: false });
  }
  await prisma.favorite.create({ data: { userId, productId } });
  return NextResponse.json({ favorited: true });
}
