"use client";

import { useState, useEffect } from "react";
//Composant qui genere une modal pour les formulaires de creation et de modification des transaction
//Si une transaction est fournie (id): le formulaire est pré-rempli pour la modification, sinon il est vide pour la création
type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: string | null;
  date: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  transaction?: Transaction | null;
};

export function TransactionModal({
  open,
  onClose,
  onSave,
  transaction,
}: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Pre-rempli les info en cas de modifiacation
  //Reinitialise les infos en cas de creation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(transaction?.title ?? "");

    setAmount(transaction ? String(transaction.amount) : "");

    setType(transaction?.type ?? "INCOME");

    setCategory(transaction?.category ?? "");

    setError("");
  }, [transaction, open]);

  //validation cote client que le titre et le montant sont fournis avant d'envoyer la requete
  async function handleSubmit() {
    setError("");
    if (!title || !amount) {
      setError("Le titre et le montant sont requis.");
      return;
    }

    setLoading(true);
    const payload = {
      title,
      amount: parseFloat(amount),
      type,
      category: category || undefined,
    };

    //si la transaction existe : PUT, sinon POST
    const url = transaction
      ? `/api/transaction/${transaction.id}`
      : "/api/transaction";
    const method = transaction ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Une erreur est survenue.");
      return;
    }

    //Apres la creation ou la modification, on rafraichit la liste des transactions et on ferme la modal
    onSave();
    onClose();
  }

  //Ne rend rien si la modal n'est pas ouverte
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-green-500">
          {transaction ? "Modifier la transaction" : "Nouvelle transaction"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-900">Titre</label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Salaire, Loyer..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">
              Montant (FCFA)
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-700"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">Type</label>
            <select
              id="type"
              aria-label="Type de transaction"
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-700"
              value={type}
              onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}
            >
              <option value="INCOME">Revenu</option>
              <option value="EXPENSE">Dépense</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900">
              Catégorie <span className="text-gray-400">(optionnel)</span>
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm text-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Alimentation, Transport..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border bg-red-400 hover:bg-red-500"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
