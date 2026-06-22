//Composant pour afficher les cartes de résumé des revenus(vert), dépenses(rouge) et solde(bleu)
type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export function SummaryCards({ summary }: { summary: Summary }) {
  //valeur par defaut des 3 cartes 0
  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const balance = summary?.balance ?? 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-600 font-medium">Revenus</p>
        <p className="text-2xl font-bold text-green-700">
          +{totalIncome.toLocaleString()} Fcfa
        </p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-600 font-medium">Dépenses</p>
        <p className="text-2xl font-bold text-red-700">
          -{totalExpense.toLocaleString()} Fcfa
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-600 font-medium">Solde</p>
        <p
          className={`text-2xl font-bold ${balance >= 0 ? "text-blue-700" : "text-red-700"}`}
        >
          {balance.toLocaleString()} Fcfa
        </p>
      </div>
    </div>
  );
}
