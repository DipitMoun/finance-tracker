//schema de validations zod
import { z } from "zod";
//utilisation de zod pour valider les données d'une transaction POST et PUT
export const transactionSchema = z.object({
  //le titre est obligatoire et une chaine non vide
  title: z.string().min(1, "Le titre est requis"),
  //le monant doit etre un nombre positif
  amount: z.number().positive("Le montant doit être positif"),
  //le type doit etre soit INCOME(revenu) ou EXPENSE(depense)
  type: z.enum(["INCOME", "EXPENSE"]),
  //la categorie est optionnelle et doit etre une chaine de caracteres
  category: z.string().optional(),
  //la date est enregistrer a la creation d'une transaction
  date: z.string().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
