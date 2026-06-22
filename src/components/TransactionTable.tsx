//Composant de table pour afficher les transactions
//recoit les callbacks onEdit et onDelete depuis la page parent */page.tsx
type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: string | null;
  date: string;
};

type Props = {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
};

export function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left px-4 py-3">Titre</th>
            <th className="text-left px-4 py-3">Catégorie</th>
            <th className="text-left px-4 py-3">Date</th>
            <th className="text-left px-4 py-3">Type</th>
            <th className="text-right px-4 py-3">Montant</th>
            <th className="text-right px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500 font-medium">{t.title}</td>
              <td className="px-4 py-3 text-gray-500">{t.category ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(t.date).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    t.type === "INCOME"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.type === "INCOME" ? "Revenu" : "Dépense"}
                </span>
              </td>
              <td
                className={`px-4 py-3 text-right font-semibold ${
                  t.type === "INCOME" ? "text-green-600" : "text-red-600"
                }`}
              >
                {t.type === "INCOME" ? "+" : "-"}
                {t.amount.toLocaleString()} FCFA
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button
                  onClick={() => onEdit(t)}
                  className="text-blue-600 hover:text-shadow-white transition-colors duration-200 text-xs border-2 border-blue-600 px-2 py-1 rounded-full"
                >
                  Modifier
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-red-600 hover:text-shadow-white text-xs border-2 border-red-600 px-2 py-1 rounded-full"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center py-8 text-black font-semibold"
              >
                Aucune transaction
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
