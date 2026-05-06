import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true, address: true },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  try {
    const body = await req.json();
    const { items, addressId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Vérifier les stocks
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const orderItems: { productId: string; productName: string; productRef: string; quantity: number; unitPrice: number }[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${product.name}` },
          { status: 400 }
        );
      }
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        productRef: product.ref,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // Créer la commande + décrémenter le stock
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId: addressId || null,
          status: "CONFIRMED",
          totalAmount,
          shippingAmount: 0,
          simulatedPayRef: `SIM-${Date.now()}`,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      // Notification
      await tx.notification.create({
        data: {
          userId,
          type: "ORDER_CONFIRMED",
          title: "Commande confirmée",
          message: `Votre commande ${newOrder.orderNumber} a été confirmée.`,
          link: `/fr/commandes/${newOrder.id}`,
        },
      });

      // Vider le panier BDD si besoin
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
