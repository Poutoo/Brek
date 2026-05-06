import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Seules les commandes PENDING ou CONFIRMED peuvent être annulées
  if (status === "CANCELLED" && !["PENDING", "CONFIRMED"].includes(order.status)) {
    return NextResponse.json(
      { error: "Cette commande ne peut plus être annulée" },
      { status: 400 }
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Remettre le stock si annulation
    if (status === "CANCELLED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      await tx.notification.create({
        data: {
          userId,
          type: "ORDER_CANCELLED",
          title: "Commande annulée",
          message: `Votre commande ${order.orderNumber} a été annulée.`,
        },
      });
    }
    return tx.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  });

  return NextResponse.json({ order: updated });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const isAdmin = (session.user as { role: string }).role === "ADMIN";
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, ...(isAdmin ? {} : { userId }) },
    include: { items: { include: { product: { select: { images: true, slug: true } } } }, address: true, user: { select: { name: true, email: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
