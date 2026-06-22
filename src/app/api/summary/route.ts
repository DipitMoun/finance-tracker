import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//GET- Calcule le resume financier (revenu, depense, solde)
export async function GET() {
  try {
    //On lance les deux requetes en parallele pour calculer le revenu et la depense
    const [income, expense] = await Promise.all([
      //somme de tous les revenus
      prisma.transaction.aggregate({
        where: { type: "INCOME" },
        _sum: { amount: true },
      }),
      //somme de toutes les depenses
      prisma.transaction.aggregate({
        where: { type: "EXPENSE" },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount ?? 0;
    const totalExpense = expense._sum.amount ?? 0;

    return NextResponse.json({
      totalIncome,
      totalExpense,
      //calcul du solde en soustrayant la depense du revenu
      balance: totalIncome - totalExpense,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
