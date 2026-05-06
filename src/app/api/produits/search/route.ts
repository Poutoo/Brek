import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "6"), 10);

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { ref: { contains: q, mode: "insensitive" } },
      ],
    },
    take: limit,
    select: {
      id: true,
      name: true,
      ref: true,
      slug: true,
      images: true,
      price: true,
    },
  });

  return NextResponse.json({ products });
}
