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

    const quotes = await prisma.quote.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
      include: { items: true }
    });

    return NextResponse.json({ quotes });
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

    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    // Récupérer les détails des produits pour les snapshots
    const productIds = items.map((i: any) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let totalAmount = 0;
    const quoteItems = items.map((item: any) => {
      const product = dbProducts.find(p => p.id === item.productId);
      if (!product) throw new Error(`Produit non trouvé: ${item.productId}`);
      
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      return {
        productId: product.id,
        productName: product.name,
        productRef: product.ref,
        quantity: item.quantity,
        unitPrice: product.price
      };
    });

    const quote = await prisma.quote.create({
      data: {
        userId: (session.user as any).id,
        totalAmount,
        status: "PENDING",
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Valide 15 jours
        items: {
          create: quoteItems
        }
      },
      include: { items: true }
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json({ error: "Erreur lors de la création du devis" }, { status: 500 });
  }
}
