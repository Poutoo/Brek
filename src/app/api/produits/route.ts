import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * limit;
  const collection = searchParams.get("collection") || "";
  const featured = searchParams.get("featured") === "true";
  const inStock = searchParams.get("inStock") === "true";
  const sort = searchParams.get("sort") || "createdAt_desc";

  const [field, dir] = sort.split("_");
  const orderBy = { [field]: dir as "asc" | "desc" };

  const where = {
    active: true,
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { ref: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ],
    }),
    ...(collection && { collection: { slug: collection } }),
    ...(featured && { featured: true }),
    ...(inStock && { stock: { gt: 0 } }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      take: limit,
      skip,
      include: {
        collection: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      ...p,
      collectionName: p.collection?.name,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();

  try {
    const product = await prisma.product.create({
      data: body,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}
