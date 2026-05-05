# Brek, c'est QUOI ?

Brek est une plateforme e-commerce de luxe pour de la passementerie et des tissus haut de gamme, avec une expérience utilisateur premium et des fonctionnalités avancées, conçue pour répondre aux besoins des professionnels et des particuliers.

---

# Objectif & Contexte

Etudiant en développement, je dois livrer un git démo de cette plateforme fictive avec un maximum de fonctionnalités que je pourrai présenter.

---

## Fonctionnalité de Brek

1. **Enregistrement** : L'utilisateur peut s'inscrire et se connecter
2. **Mise en avant de produits** : Mise en avant de produits avec un système de filtre et de recherche.
3. **Panier** : L'utilisateur peut ajouter des produits à son panier.
4. **Paiement** : L'utilisateur peut payer ses produits (Simulation de paiement).
5. **Gestion des commandes** : L'utilisateur peut suivre ses commandes, annuler ses commandes, modifier ses commandes.
6. **Favoris** : L'utilisateur peut ajouter des produits à ses favoris (wishlist).
7. **Système de notification** : L'utilisateur peut recevoir des notifications (avancement commande, rappel panier).
8. **Langues** : La plateforme est multilingue (Français, Anglais, Espagnol).
9. **Mode sombre / clair** : L'utilisateur peut choisir entre le mode sombre et le mode clair.
10. **Recherche** : L'utilisateur peut rechercher des produits par réf ou nom du produit.
11. **Contact** : L'utilisateur peut contacter le support.
12. **Réseaux sociaux** : Liste de liens statiques en footer.
13. **FAQ** : L'utilisateur peut consulter la FAQ.
14. **Les mentions légales** : L'utilisateur peut consulter les mentions légales.
15. **Les conditions générales de vente** : L'utilisateur peut consulter les conditions générales de vente.
16. **Politique de confidentialité** : L'utilisateur peut consulter la politique de confidentialité.
17. **Newsletter** : L'utilisateur peut s'inscrire à la newsletter et consulter les newsletters.
18. **Personnalisation** : Possibilité de faire des produits personnalisés/sur-mesure.
19. **Stocks** : L'utilisateur peut visualiser les stocks du produit (Exemple : 12 mètres restants). En cas de rupture, il peut faire une demande de réassort.
20. **Produit** : Chaque produit est accompagné de sa référence unique.
21. **Page produit** : L'utilisateur peut consulter les caractéristiques du produit, télécharger l'image du produit, la fiche produit (PDF), " produit que vous aimerez aussi".
22. **Collection** : Les produits sont regroupé par collection. Chaque collection est réalisé avec un designer
23. **Designers** : Catégorie regroupant l’ensemble des designers avec lequel Brek à collaborer 

---

# Fonctionnalités Admin

1. **Gestion des produits** : L'admin peut ajouter, modifier, supprimer des produits.
2. **Gestion des commandes** : L'admin peut suivre les commandes (avec les détails) pour chaque utilisateur
3. **Gestion des utilisateurs** : L'admin peut gérer les utilisateurs.
4. **Gestion des langues** : L'admin peut gérer les langues.
5. **Gestion de la newsletter** : L'admin peut gérer la newsletter (ajout d'article, modification...).

# A savoir

Objectif de score SEO avec Lighthouse : 100
Objectif de score d’accessibilité : 100
Objectif de score bonne pratiques : 100
Objectif de score de performance mobile : 100

# Organisation des pages

**TopBar** (sur mobile, on réduira le nombre d’infos pour avoir uniquement le menu, le logo, icone recherche, icone connexion et icone panier) : 
- Coté gauche —> Menu (ouvre une sidebar sur la gauche)
- Millieu —> Logo/Nom entreprise
- Coté droit —> Choix langue (menu déroulant) ; Icone Search (ouvre barre de recherche) ; Icone connexion ; Panier

**Page designers** : 
- Photo de profil
- Nom Prénom
- Petite présentation
- Collaboration réalisé avec brek (avec bouton vers chaque collection)

src/
├── app/              # Next.js App Router (Pages & API)
├── components/       # UI Reutilisable (atoms, molecules)
├── features/         # Logique métier (cart, auth, products)
├── lib/              # Configuration (prisma, auth, utils)
├── store/            # Zustand stores
└── types/            # Interfaces TypeScript

**Instructions d'exécution par étapes :**

1. **Phase 1 (Architecture) :** Propose une structure de dossiers modulaire (Clean Architecture) et le schéma Prisma/SQL complet.
2. **Phase 2 (UI Kit) :** Définit les variables CSS pour la palette luxe (#fffdf7, #7d6363, etc.) et crée les composants de base (Bouton, Input, Card) avec les animations subtiles demandées.
3. **Phase 3 (Core Features) :** Implémente la navigation (TopBar/Sidebar) et la page "Collection" pour tester l'affichage des produits.
4. **Phase 4 (Mock Data) :** Génère un script de "Seeding" avec 10 produits de passementerie réalistes, 2 designers et 2 collections.

### Directives SEO & Accessibilité

- **Sémantique :** Utilisation stricte des balises `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`.
- **Images :** Utilisation de composants d'optimisation (ex: `next/image`) avec attributs `alt` obligatoires.
- **ARlabels :** Ajout de `aria-label` sur tous les boutons iconographiques (Panier, Recherche).

### Schéma de données (Le squelette)

> Génère un schéma de base de données incluant les relations : Designer <-> Collection <-> Produit.
> 

| **Table** | **Spécificité à demander** |
| --- | --- |
| **Product** | Champ `metadata` (JSON) pour les caractéristiques techniques (poids du tissu, composition). |
| **Designer** | Relation `Many-to-Many` avec **Collection**. |
| **Order** | Table de liaison `OrderItem` incluant le prix au moment de l'achat (pour l'historique). |
| **Customization** | Table pour stocker les demandes de "sur-mesure" liées à un utilisateur. |

## Stack Technique

React & Next.js & Tailwind CSS & PostgreSQL
Icons : LucideReact
• **Gestion d'état :** Zustand  pour le panier et le mode sombre.
Utilise **Auth.js (NextAuth)** pour la gestion des sessions, avec des rôles `USER` et `ADMIN` protégés par Middleware.
Utilise **next-intl** ou **next-i18next** avec un routage par sous-répertoire (ex: `/fr/produit`, `/es/producto`) pour garantir que chaque langue est indexable par Google.

****