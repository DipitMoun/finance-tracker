import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

//PUT - met a jour une transaction existantepar son id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    //validation des donnees avec zod
    const parsed = transactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Mise a jour la transaction dans la base de données
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...parsed.data,
        date: parsed.data.date ? new Date(parsed.data.date) : undefined,
      },
    });
    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json(
      { error: "Transaction introuvable" },
      { status: 404 },
    );
  }
}

//DELETE - supprime une transaction existante par son id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.transaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Transaction introuvable" },
      { status: 404 },
    );
  }
}
