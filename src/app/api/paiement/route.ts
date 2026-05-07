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

    const cards = await prisma.paymentMethod.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { isDefault: "desc" }
    });

    return NextResponse.json({ cards });
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
    const { cardNumber, expMonth, expYear, isDefault } = body;

    // Déterminer la marque grossièrement et les 4 derniers chiffres
    const last4 = cardNumber.slice(-4);
    const firstDigit = cardNumber.charAt(0);
    let brand = "Autre";
    if (firstDigit === "4") brand = "Visa";
    else if (firstDigit === "5") brand = "MasterCard";
    else if (firstDigit === "3") brand = "Amex";

    // Si la nouvelle carte est par défaut, on met à jour les autres
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: (session.user as any).id },
        data: { isDefault: false }
      });
    }

    const card = await prisma.paymentMethod.create({
      data: {
        userId: (session.user as any).id,
        brand,
        last4,
        expMonth: parseInt(expMonth, 10),
        expYear: parseInt(expYear, 10),
        isDefault: isDefault || false
      }
    });

    return NextResponse.json({ card });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'ajout de la carte" }, { status: 500 });
  }
}
