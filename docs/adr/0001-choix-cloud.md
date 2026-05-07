# ADR-001 : Arbitrage Vendor Lock-in & Stratégie de sortie

## État
Accepté

## Contexte
Pour le lancement de la plateforme Brek, nous devons choisir une infrastructure cloud offrant un équilibre entre performance brute, coût (budget < 200€/an) et souveraineté des données. Les options allaient des géants (AWS/GCP/Azure) aux fournisseurs plus spécialisés (Hetzner, OVH, DigitalOcean).

## Décision
Nous avons opté pour une **infrastructure hybride** :
1. **Hetzner Cloud (VPS CPX21)** pour le calcul (Compute) et la base de données locale.
2. **AWS S3 (Glacier)** pour le stockage des sauvegardes distantes.
3. **Cloudflare** pour le réseau (DNS, CDN, WAF).

## Rationale
- **Performance/Prix** : Hetzner propose des instances NVMe avec un rapport vCPU/RAM imbattable par rapport aux instances EC2 d'AWS pour un budget de ~10€/mois.
- **Trafic Sortant** : Hetzner inclut 20 To de trafic, évitant les coûts imprévisibles de transfert de données d'AWS vers l'extérieur.
- **Souveraineté** : Hébergement en Europe (Allemagne/Finlande) pour la conformité RGPD simplifiée.
- **Sécurité** : Cloudflare offre une protection WAF et DDoS gratuite de niveau entreprise, indispensable pour une image de marque de luxe.

## Gestion du Vendor Lock-in (Stratégie de sortie)
Bien que nous utilisions plusieurs fournisseurs, nous limitons la dépendance propriétaire :
- **Conteneurisation (Docker)** : L'ensemble de l'application et de ses services (PostgreSQL, Redis) est conteneurisé. Le passage à un autre fournisseur de VPS ou à un cluster Kubernetes peut se faire en moins de 2 heures.
- **Stockage S3-Compatible** : AWS S3 est utilisé, mais l'interface est standardisée (S3 API). Nous pouvons basculer vers Backblaze B2 ou un stockage MinIO sans modifier le code de backup.
- **Base de données Locale** : En évitant les bases de données managées (RDS), nous gardons le contrôle total sur nos données et évitons les coûts de migration élevés.

## Conséquences
- **Avantages** : Coût mensuel très bas (~19€), performances exceptionnelles (NVMe), portabilité totale.
- **Inconvénients** : Responsabilité accrue sur la gestion de la base de données (backups, patches) et dépendance DNS à Cloudflare.
