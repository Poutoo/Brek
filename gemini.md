# gemini.md — Suivi du projet Brek

## Dernière mise à jour : 2026-05-07 (CRUD Admin & Layout Dashboard)

## État du projet : Phase 1-6 ✅ Complétées | Phase 7 en cours...

---

## Stack technique
- **Framework** : Next.js 16 (App Router)
- **Styling** : Tailwind CSS v4 + CSS custom properties (palette luxe)
- **BDD** : PostgreSQL 16 via Docker + Prisma ORM v7
- **Auth** : NextAuth v4 (credentials, JWT, roles USER/ADMIN)
- **i18n** : next-intl (fr/en/es, sous-répertoire)
- **État** : Zustand (cartStore persistant, themeStore persistant)
- **Icons** : LucideReact (+ SVG inline pour icons non exportées)
- **Fonts** : Cormorant Garamond (display) + Inter (body)

## Infrastructure
- `docker-compose.yml` → PostgreSQL 16 + pgAdmin
- `.env` → Configuré avec `DATABASE_URL` et `NEXTAUTH_SECRET`
- `prisma/schema.prisma` → schéma complet (User, Product, Designer, Collection, Order, Quote, PaymentMethod, etc.)
- `prisma/seed.ts` → 3 designers, 3 collections, 10 produits, 3 users, FAQ, newsletter, devis, cartes bancaires
- `prisma.config.ts` → datasource URL (Prisma 7 convention)
- `@prisma/adapter-pg` + `pg` → adaptateur requis par Prisma 7 wasm engine

## Notes importantes (Prisma 7)
- La `url` n'est plus dans `schema.prisma` mais dans `prisma.config.ts`
- `PrismaClient` **requiert** un adaptateur driver : `@prisma/adapter-pg` + `Pool`
- Le script `seed.ts` et `src/lib/prisma.ts` utilisent tous les deux cet adaptateur

## Composants créés
- `TopBar` : navigation responsive (mobile: hamburger / desktop: nav inline)
- `SidebarMenu` : menu mobile avec catégories
- `SearchOverlay` : recherche live (debounce 300ms)
- `CartDrawer` : panier latéral avec quantités en mètres
- `Footer` : colonnes + réseaux sociaux (SVG inline pour Instagram/LinkedIn)
- `ProductCard` : carte produit avec overlay actions
- `HeroSection` : hero dark avec support vidéo background, stats animées et **loader Luxe** (détection chargement média)
- `CollectionsSlider` : slider horizontal premium pour les collections
- `FeaturedProductsSection` : produits phares fond sombre
- `DesignersPreviewSection` : cartes designers
- `NewsletterSection` : formulaire inscription
- `AuthForm` : formulaire connexion/inscription réutilisable
- `ToastContainer` : système de notifications

## Pages créées
| Route | Statut |
|---|---|
| `/[locale]` | ✅ |
| `/[locale]/collections` | ✅ |
| `/[locale]/collections/[slug]` | ✅ |
| `/[locale]/designers` | ✅ |
| `/[locale]/designers/[slug]` | ✅ |
| `/[locale]/produits` | ✅ (avec filtres dynamiques) |
| `/[locale]/produits/[slug]` | ✅ (galerie, détail, suggestions) |
| `/[locale]/connexion` | ✅ |
| `/[locale]/inscription` | ✅ |
| `/[locale]/faq` | ✅ |
| `/[locale]/contact` | ✅ |
| `/[locale]/mentions-legales` | ✅ |
| `/[locale]/cgv` | ✅ |
| `/[locale]/confidentialite` | ✅ |
| `/[locale]/checkout` | ✅ (simulation paiement) |
| `/[locale]/commandes` | ✅ (liste + annulation) |
| `/[locale]/favoris` | ✅ |
| `/[locale]/compte` | ✅ (Dashboard) |
| `/[locale]/compte/adresses` | ✅ |
| `/[locale]/compte/paiement` | ✅ |
| `/[locale]/compte/commandes` | ✅ (Commandes & devis) |
| `/[locale]/compte/parametres`| ✅ |
| `/[locale]/dashboard` | ✅ (Dashboard principal) |
| `/[locale]/dashboard/produits` | ✅ (Listing) |
| `/[locale]/dashboard/produits/nouveau` | ✅ (Création) |
| `/[locale]/dashboard/produits/[id]` | ✅ (Édition) |
| `/[locale]/dashboard/commandes` | ✅ (Listing) |
| `/[locale]/dashboard/commandes/[id]` | ✅ (Détails) |
| `/[locale]/dashboard/utilisateurs` | ✅ |
| `/[locale]/dashboard/messages` | ✅ |
| `/[locale]/admin` | ✅ (Login Admin) |

## APIs créées
- `GET/POST /api/produits` — liste + filtres
- `GET /api/produits/search` — recherche rapide
- `GET/POST /api/commandes` — liste + création (transactionnel)
- `GET/PATCH /api/commandes/[id]` — détail + annulation
- `POST /api/auth/register` — inscription
- `GET/POST /api/newsletter` — abonnement + articles
- `POST /api/contact` — messages contact
- `GET/POST /api/favoris` — toggle favoris
- `GET/POST /api/adresses` — gestion adresses
- `GET/POST /api/paiement` — gestion cartes bancaires
- `GET /api/devis` — liste des devis en cours
- `PUT /api/user` — mise à jour infos/sécurité
- NextAuth `/api/auth/[...nextauth]`

## Assets
- `/public/assets/placeholder.png`
- `/public/assets/collection/imperiale/` (3 photos + 1 principale)
- `/public/assets/collection/leopard/` (3 photos + 1 principale)
- `/public/assets/collection/salone/` (3 photos + 1 vidéo)
- `/public/assets/designers/bambi_sloan.png`
- `/public/assets/designers/eric_egan.png`
- `/public/assets/designers/michael_aiduss.png`

## Commandes utiles
```bash
npm run dev           # Démarrer le serveur Next.js
npm run db:start      # Lancer Docker (PostgreSQL + pgAdmin)
npm run db:migrate    # Appliquer migrations Prisma
npm run db:seed       # Seeder la BDD
npm run setup         # Tout en une commande (1ère fois)
```

## Comptes de test
| Role | Email | Mot de passe |
|---|---|---|
| Admin | admin@brek.fr | admin1234 |
| User | marie.dupont@example.com | user1234 |
| User | jean.martin@example.com | user1234 |

## Prochaines étapes
1. Pages admin détaillées (CRUD produits, gestion commandes, utilisateurs, messages)
2. Page newsletter `/[locale]/newsletter`
3. Vérification exhaustive des formulaires et UX
4. Build production `npm run build`
5. Tests E2E basiques
