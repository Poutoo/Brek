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

    // Vérifier que l'adresse appartient bien à l'utilisateur
    const address = await prisma.address.findUnique({
      where: { id }
    });

    if (!address || address.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Adresse introuvable ou non autorisée" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression de l'adresse" }, { status: 500 });
  }
}
