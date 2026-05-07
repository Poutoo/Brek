import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { isDefault: "desc" }
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { label, firstName, lastName, line1, line2, city, postalCode, country, isDefault } = body;

    // Si la nouvelle adresse est par défaut, on met à jour les autres
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: (session.user as any).id },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: (session.user as any).id,
        label: label || "Domicile",
        firstName,
        lastName,
        line1,
        line2,
        city,
        postalCode,
        country: country || "France",
        isDefault: isDefault || false
      }
    });

    return NextResponse.json({ address });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'ajout de l'adresse" }, { status: 500 });
  }
}
