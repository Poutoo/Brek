# Brek — Plateforme E-commerce Luxe

> Passementerie & Tissus haut de gamme — Démo académique

## 🚀 Démarrage rapide

### Prérequis
- [Node.js](https://nodejs.org/) 18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- npm

### Installation (première fois)

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd Brek

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# (les valeurs par défaut fonctionnent avec docker-compose)

# 4. Lancer la BDD + migrer + seeder en une commande
npm run setup
```

### Démarrage quotidien

```bash
# Si la BDD n'est pas démarrée
npm run db:start

# Lancer le serveur de développement
npm run dev
```

Accès : **http://localhost:3000**

---

## 🐳 Docker

| Commande | Description |
|---|---|
| `npm run db:start` | Démarrer PostgreSQL + pgAdmin |
| `npm run db:stop` | Arrêter les conteneurs |
| `npm run db:studio` | Ouvrir Prisma Studio |

**pgAdmin** : http://localhost:5050  
Login : `admin@brek.fr` / `admin`

---

## 📋 Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@brek.fr` | `admin1234` |
| Utilisateur | `marie.dupont@example.com` | `user1234` |
| Utilisateur | `jean.martin@example.com` | `user1234` |

---

## 🗂️ Structure du projet

```
src/
├── app/
│   ├── [locale]/          # Pages i18n (fr, en, es)
│   │   ├── page.tsx       # Accueil
│   │   ├── collections/   # Collections
│   │   ├── produits/      # Catalogue produits
│   │   ├── designers/     # Page designers
│   │   ├── panier/        # Panier
│   │   ├── checkout/      # Paiement simulé
│   │   ├── commandes/     # Suivi commandes
│   │   ├── favoris/       # Wishlist
│   │   ├── compte/        # Profil utilisateur
│   │   ├── connexion/     # Authentification
│   │   ├── contact/       # Formulaire contact
│   │   ├── faq/           # FAQ
│   │   ├── newsletter/    # Newsletter
│   │   ├── admin/         # Dashboard admin
│   │   └── ...            # Pages légales
│   └── api/               # API Routes
├── components/
│   ├── layout/            # TopBar, Footer, CartDrawer
│   ├── molecules/         # ProductCard
│   ├── sections/          # Sections homepage
│   ├── providers/         # SessionProvider, ThemeProvider
│   └── ui/                # ToastContainer
├── lib/
│   ├── prisma.ts          # Client Prisma singleton
│   ├── auth.ts            # Config NextAuth
│   └── utils.ts           # Utilitaires
├── store/
│   ├── cartStore.ts       # Zustand panier
│   └── themeStore.ts      # Zustand thème
└── messages/              # Traductions fr/en/es
```

---

## ⚙️ Scripts npm

| Script | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run db:start` | Démarrer Docker |
| `npm run db:migrate` | Appliquer les migrations Prisma |
| `npm run db:seed` | Remplir la BDD avec les données de démo |
| `npm run db:studio` | Interface graphique Prisma |

---

## 🌐 Internationalisation

La plateforme supporte 3 langues avec routage par sous-répertoire :
- 🇫🇷 Français : `/fr/`
- 🇬🇧 Anglais : `/en/`
- 🇪🇸 Espagnol : `/es/`

---

## 📦 Stack technique

- **Next.js 14** (App Router)
- **Tailwind CSS** (styling)
- **Prisma + PostgreSQL** (BDD)
- **NextAuth v4** (auth)
- **next-intl** (i18n)
- **Zustand** (état global)
- **LucideReact** (icônes)
