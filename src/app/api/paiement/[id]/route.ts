import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;

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
