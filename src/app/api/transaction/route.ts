import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transactionSchema } from "@/lib/validations";

// GET — Liste toutes les transactions par ordre decroissant de creation
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — Créer une transaction apres validation des données d'entrée par le zod
export async function POST(req: Request) {
  try {
    const body = await req.json();
    //validation des données d'entrée par le zod
    const parsed = transactionSchema.safeParse(body);

    //si la validation échoue, retourne une réponse d'erreur avec les détails de l'erreur
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    //creation de la transaction en base de donnees
    const transaction = await prisma.transaction.create({
      data: {
        ...parsed.data,
        date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      },
    });
    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
