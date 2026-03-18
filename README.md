# Bible Commerciale — Incubateur UPVD

Application de formation commerciale pour les startups de l'incubateur UPVD. Les fondateurs apprennent à construire leur bible commerciale à travers 4 modules interactifs.

## Fonctionnalités

- **Inscription / Connexion** : chaque fondateur inscrit sa startup avec un mot de passe, puis se reconnecte avec le nom de sa startup + mot de passe
- **Module 1** : Cartographie des parties prenantes (accompagnateurs, équipe, clients, financeurs, partenaires, écosystème)
- **Module 2** : Matrice des enjeux (enjeu apparent, enjeu profond, pont)
- **Module 3** : Application des biais cognitifs aux parties prenantes
- **Module 4** : Quiz de validation des compétences
- **Dashboard** : suivi de progression par module

## Stack technique

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Drizzle ORM** + **Neon PostgreSQL**
- **bcryptjs** pour le hachage des mots de passe
- **jose** pour les tokens JWT (session cookie)
- Déployé sur **Vercel**

## Installation locale

```bash
npm install
```

Créer un fichier `.env.local` :

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=une-cle-secrete-de-32-caracteres
```

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Initialisation de la base de données

Ouvrir `/api/setup` dans le navigateur pour créer automatiquement les tables et enums PostgreSQL.

## Déploiement

L'application est déployée sur Vercel. Chaque push sur la branche principale déclenche un déploiement automatique.

Variables d'environnement à configurer sur Vercel :
- `DATABASE_URL` — URL de connexion Neon PostgreSQL
- `AUTH_SECRET` — Clé secrète pour les tokens JWT
