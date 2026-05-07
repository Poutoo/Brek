import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des collections" }, { status: 500 });
  }
}
