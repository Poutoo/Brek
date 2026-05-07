# Brek — Plateforme E-commerce Luxe

> Passementerie & Tissus haut de gamme — Démo académique

## 🚀 Démarrage rapide (Local)

Suivez ces étapes dans l'ordre pour installer et lancer le projet sur votre machine.

### 1. Prérequis
- [Node.js](https://nodejs.org/) 18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour la base de données PostgreSQL)
- npm (installé avec Node.js)

### 2. Installation et Configuration

```bash
# A. Cloner le dépôt
git clone <url-du-repo>
cd Brek

# B. Installer les dépendances
npm install

# C. Configurer l'environnement
cp .env.example .env
```

### 3. Configuration du fichier `.env`
Ouvrez le fichier `.env` et vérifiez les variables suivantes :
1. **DATABASE_URL** : Par défaut, elle est configurée pour fonctionner avec le `docker-compose.yml` du projet.
2. **NEXTAUTH_SECRET** : Indispensable pour l'authentification. Vous pouvez en générer un via la commande :
   ```bash
   npx auth secret
   # ou
   openssl rand -base64 32
   ```

### 4. Lancement de la Base de Données et Initialisation

```bash
# A. Démarrer les conteneurs Docker (PostgreSQL + pgAdmin)
npm run db:start

# B. Appliquer les migrations Prisma et seeder la base (en une commande)
npm run setup
```
*Note : La commande `npm run setup` exécute les migrations et remplit la base de données avec les données de test (designers, produits, collections).*

### 5. Lancer le serveur de développement

```bash
npm run dev
```
Accès : **http://localhost:3000**

---

## 🛠️ En cas de problème (Dépannage)

### Problème de connexion à la base de données
Si vous voyez une erreur `P1001: Can't reach database server` :
1. Vérifiez que Docker Desktop est bien lancé.
2. Relancez les conteneurs : `npm run db:stop && npm run db:start`.
3. Vérifiez que le port `5432` n'est pas déjà utilisé par une autre instance PostgreSQL locale.

### Erreur lors des migrations Prisma
Si les migrations échouent ou si le schéma est incohérent :
```bash
# Réinitialiser complètement la base de données (Attention : supprime les données !)
npx prisma migrate reset
```

### Problème de type Prisma Client
Si vous avez des erreurs TypeScript sur `prisma` :
```bash
npm run db:generate
```

### Problème de cache Next.js
Si des changements ne sont pas visibles ou si le build échoue bizarrement :
```bash
# Supprimer le dossier .next
rm -rf .next
npm run dev
```

---

## 🐳 Docker & Outils

| Commande | Description |
|---|---|
| `npm run db:start` | Démarrer PostgreSQL + pgAdmin |
| `npm run db:stop` | Arrêter les conteneurs |
| `npm run db:studio` | Interface graphique Prisma pour voir les données |

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
