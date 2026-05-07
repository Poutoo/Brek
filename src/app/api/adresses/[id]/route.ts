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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const address = await prisma.address.findUnique({
      where: { id }
    });

    if (!address || address.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Adresse introuvable ou non autorisée" }, { status: 404 });
    }

    // Si on met cette adresse par défaut, on enlève le défaut des autres
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: address.userId },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        label: body.label,
        firstName: body.firstName,
        lastName: body.lastName,
        line1: body.line1,
        line2: body.line2,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        isDefault: body.isDefault
      }
    });

    return NextResponse.json({ address: updated });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'adresse" }, { status: 500 });
  }
}
