import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    // Vérifier que la carte appartient bien à l'utilisateur
    const card = await prisma.paymentMethod.findUnique({
      where: { id }
    });

    if (!card || card.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Carte introuvable ou non autorisée" }, { status: 404 });
    }

    await prisma.paymentMethod.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression de la carte" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const card = await prisma.paymentMethod.findUnique({
      where: { id }
    });

    if (!card || card.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Carte introuvable ou non autorisée" }, { status: 404 });
    }

    if (body.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: card.userId },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.paymentMethod.update({
      where: { id },
      data: {
        expMonth: parseInt(body.expMonth),
        expYear: parseInt(body.expYear),
        isDefault: body.isDefault
      }
    });

    return NextResponse.json({ card: updated });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la carte" }, { status: 500 });
  }
}
