"use client";
import { useEffect, useState, useCallback } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionModal } from "@/components/TransactionModal";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: string | null;
  date: string;
};

type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

// Nombre de transactions affichées par page
const PAGE_SIZE = 5;

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  // Filtre actif : ALL, INCOME ou EXPENSE
  const [filter, setFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  // Recherche par titre ou catégorie
  const [search, setSearch] = useState("");
  // Page courante (commence à 1)
  const [page, setPage] = useState(1);

  // 1. Filtre par type
  // 2. Filtre par recherche (titre ou catégorie)
  const filtered = transactions
    .filter((t) => (filter === "ALL" ? true : t.type === filter))
    .filter((t) => {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.category ?? "").toLowerCase().includes(q)
      );
    });

  // Calcul de la pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Récupère les transactions et le résumé en parallèle
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [txRes, sumRes] = await Promise.all([
      fetch("/api/transaction"),
      fetch("/api/summary"),
    ]);
    const [txData, sumData] = await Promise.all([txRes.json(), sumRes.json()]);

    // Garantit que transactions est toujours un tableau
    setTransactions(Array.isArray(txData) ? txData : []);
    setSummary(sumData);
    setLoading(false);
  }, []);

  // Chargement initial des données
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // Remet la page à 1 quand le filtre ou la recherche change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [filter, search]);

  // Ouvre la modal en mode édition avec la transaction sélectionnée
  function handleEdit(t: Transaction) {
    setSelected(t);
    setModalOpen(true);
  }

  // Demande confirmation puis supprime la transaction
  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette transaction ?")) return;
    await fetch(`/api/transaction/${id}`, { method: "DELETE" });
    fetchData();
  }

  // Ouvre la modal en mode création
  function handleAdd() {
    setSelected(null);
    setModalOpen(true);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Finance Tracker</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Nouvelle transaction
        </button>
      </div>

      {/* Cards résumé financier */}
      <SummaryCards summary={summary} />

      {/* Barre de recherche */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher par titre ou catégorie..."
        className="w-full border rounded-lg px-4 py-2 text-sm mb-4"
      />
      {/* Boutons de filtre */}
      <div className="flex gap-2 mb-4">
        {(["ALL", "INCOME", "EXPENSE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              filter === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
            }`}
          >
            {f === "ALL" ? "Tout" : f === "INCOME" ? "Revenus" : "Dépenses"}
          </button>
        ))}
      </div>

      {/* Tableau des transactions ou indicateur de chargement */}
      {loading ? (
        <p className="text-center text-gray-400 py-12">Chargement...</p>
      ) : (
        <TransactionTable
          transactions={paginated}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {page} sur {totalPages} — {filtered.length} transaction
            {filtered.length > 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border rounded-lg hover:text-white hover:bg-red-300 text-white disabled:opacity-40"
            >
              ← Précédent
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-green-300 hover:text-white disabled:opacity-40"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Modal d'ajout / modifications */}
      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={fetchData}
        transaction={selected}
      />
    </main>
  );
}
