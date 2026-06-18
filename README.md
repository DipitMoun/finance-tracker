# Finance Tracker

Application web de gestion de transactions financières (revenus, dépenses, solde, filtre).

## Stack technique

- Frontend / Backend : Next.js v16.2.9 (App Router)
- Base de données : PostgreSQL via Neon
- ORM : Prisma 5
- UI : Tailwind CSS + shadcn/ui
- Validation : Zod

## Prérequis

- Node.js 20
- Un compte [Neon](https://neon.tech) pour la base de données

## Installation

git clone https://github.com/DipitMoun/finance-tracker.git
cd finance-tracker
npm install

## Configuration

Crée un fichier .env à la racine :

DATABASE_URL="postgresql://..." conection string pooled
DIRECT_URL="postgresql://..." connection string no pooled

## Lancement

npx prisma db push
npx prisma generate
npm run dev

L'application tourne sur [http://localhost:3000](http://localhost:3000).

## Endpoints API

- Méthode | GET | Endpoint /api/transaction | Liste toutes les transactions |

- Méthode | POST | Endpoint /api/transaction | Créer une transaction |

- Méthode | PUT | Endpoint /api/transaction/:id | Modifier une transaction par son id |

- Méthode | DELETE | Endpoint /api/transaction/:id | Supprimer une transaction par son id |

- Méthode | GET | Endpoint /api/summary | Résumé financier (revenus, dépenses, solde) |

## Fonctionnalités

- CRUD complet des transactions
- Résumé financier en temps réel
- Filtre par type (Revenus / Dépenses)
- Validation des données côté serveur