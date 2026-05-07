# Brek — Plateforme E-commerce Luxe

> Excellence en passementerie et tissus haut de gamme. Une expérience numérique sur-mesure pour les architectes d'intérieur et designers de renom.

## 👥 Groupe 4
- **Thibault DEHU** : Lead & BackEnd
- **Elea YA** : FrontEnd

---

## 🏛️ Architecture & Choix Techniques 
- **Schéma complet** : [Consulter docs/architecture.md](docs/architecture.md)
- **ADR-001** : [Arbitrage Vendor Lock-in & Stratégie de sortie](docs/adr/0001-choix-cloud.md) 
- **ADR-002** : [Réponse à la contrainte de Disponibilité Critique](docs/adr/0002-ha-strategy.md) 

## 🎯 Contraintes du Brief 
- **Contrainte 1 (MVP)** : Livraison d'un tunnel d'achat complet (Catalogue -> Panier -> Commande/Devis).
- **Contrainte 2 (Budget)** : Infrastructure optimisée pour un coût < 200€/an (Hébergement Vercel Free + DB Dockerized ou Neon).
- **Contrainte 3 (Design)** : Esthétique "Luxe" avec animations fluides, typographies premium (Cormorant Garamond) et mode sombre profond.

## 📊 État du projet & MVP 
- ✅ **Story Critique** : Consultation catalogue, filtres dynamiques et ajout au panier (100% Fonctionnel). 
- ✅ **Gestion Devis** : Système de demande de devis pour les professionnels intégré au checkout.
- ⚠️ **Paiement** : Simulation Stripe Elements intégrée (Mode test uniquement).
- ❌ **Monitoring** : Alerting Telegram et Logging centralisé en cours de configuration.

---

## 🚀 Démarrage rapide (Local)

### 1. Prérequis
- [Node.js](https://nodejs.org/) 20+ (Recommandé pour Next.js 16)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- npm v10+

### 2. Installation
```bash
# Cloner le projet
git clone <url-du-repo>
cd Brek

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
```

### 3. Initialisation de la Base de Données
Le projet utilise **Prisma 7** avec un adaptateur driver pour PostgreSQL.
```bash
# Démarrer les conteneurs (PostgreSQL 16 + pgAdmin)
npm run db:start

# Initialiser le schéma et les données (Designers, Collections, Produits)
npm run setup
```

### 4. Lancement
```bash
npm run dev
```
Accès : **http://localhost:3000**

---

## 🐳 Docker & Outils

| Service | Accès | Identifiants |
| :--- | :--- | :--- |
| **App Next.js** | `localhost:3000` | - |
| **pgAdmin** | `localhost:5050` | `admin@brek.fr` / `admin` |
| **Prisma Studio** | `npx prisma studio` | Interface graphique BDD |

---

## 📋 Comptes de test

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@brek.fr` | `admin1234` |
| **Client (Marie)** | `marie.dupont@example.com` | `user1234` |
| **Client (Jean)** | `jean.martin@example.com` | `user1234` |

---

## 🗂️ Structure du projet

```text
src/
├── app/[locale]/      # Routage i18n (Next.js 16 App Router)
│   ├── dashboard/     # Espace Administration (CRUD, Commandes)
│   ├── compte/        # Espace Client (Profil, Adresses, Commandes)
│   ├── produits/      # Catalogue & Détails produits
│   └── checkout/      # Tunnel de commande & Devis
├── components/
│   ├── layout/        # Navigation (TopBar, Sidebar, Footer)
│   ├── ui/            # Composants atomiques (Button, Modal, Toast)
│   └── sections/      # Blocs de construction Homepage (Hero, Featured)
├── lib/               # Config Prisma 7, NextAuth & Utils
├── store/             # État global (Zustand: Panier, Thème)
└── messages/          # Dictionnaires de traduction (FR, EN, ES)
```

---

## ⚙️ Scripts utiles

- `npm run dev` : Lancement en mode développement.
- `npm run setup` : Reset complet de la base + Migration + Seed.
- `npm run db:start` / `db:stop` : Gestion des conteneurs Docker.
- `npm run build` : Compilation pour production.

---

## 📦 Stack technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/) + Custom Properties Luxe
- **Base de données** : [PostgreSQL 16](https://www.postgresql.org/) via Docker
- **ORM** : [Prisma v7](https://www.prisma.io/) (WASM engine ready)
- **Authentification** : [NextAuth.js v4](https://next-auth.js.org/)
- **Gestion d'état** : [Zustand](https://github.com/pmndrs/zustand) (Persistance locale)
- **Internationalisation** : [next-intl](https://next-intl-docs.vercel.app/)

---

## 📅 Planification (Sprint MVP)

| Lot | Responsable | Statut |
| :--- | :--- | :--- |
| **Infra & Database Schema** | Thibault | ✅ Terminé |
| **Design System & Components** | Elea | 🚧 Partiel |
| **Catalogue & Filtres API** | Thibault | ✅ Terminé |
| **Tunnel Checkout & Stripe** | Thibault| ✅ Terminé |
| **Dashboard Admin CRUD** | Thibault | ✅ Terminé |
| **Optimisation SEO & i18n** | Elea | ✅ Terminé |

---

## 🗺️ Roadmap

- [x] Implémentation du système de Newsletter.
- [ ] Support multilingue complet (FR/EN/ES).
- [ ] Finalisation du Dashboard Admin (Gestion des stocks et messages).
- [ ] Déploiement sur infrastructure HA (High Availability).