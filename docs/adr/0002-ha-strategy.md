# ADR-002 : Réponse à la contrainte de Disponibilité Critique

## État
Accepté

## Contexte
La marque Brek exige une disponibilité sans faille pour préserver son image de luxe. Cependant, le budget initial de MVP (< 200€/an) limite la mise en place d'une infrastructure Haute Disponibilité (HA) multi-zone complexe qui coûterait plus de 500€/mois.

## Décision
Pour le MVP, nous acceptons un **SPOF (Single Point of Failure)** au niveau du serveur physique, compensé par une **stratégie de résilience agressive** et un plan de reprise d'activité (DRP) automatisé.

## Détails de la stratégie
1. **Single VPS Optimisé** : Utilisation d'une instance Hetzner CPX21 (3 vCPU, 4GB RAM) capable de gérer 2500 req/s sur les pages cachées.
2. **DRP 3-2-1** :
    - Sauvegardes automatisées toutes les 15 minutes.
    - Export vers AWS S3 dans une région géographique différente.
3. **Monitoring en Temps Réel** : Notification instantanée (< 45s) via Telegram et escalade Twilio en cas d'indisponibilité.

## Compromis Identifiés (SPOF)
| Risque | Impact | Mitigation (MVP) | Solution Long Terme (Scaling) |
| :--- | :--- | :--- | :--- |
| **Panne Hardware VPS** | Arrêt total | RTO de 30 min (Redéploiement via Docker). | Cluster K3s multi-instances. |
| **Corruption DB** | Perte de données | RPO de 15 min (Point de restauration WAL). | DB managée avec réplication synchrone. |
| **Panne Cloudflare** | Site inaccessible | Très faible probabilité. | DNS secondaire (AWS Route53). |

## Architecture Cible (Phase 2)
Dès que le budget le permettra (> 1000€/mois), l'infrastructure évoluera vers :
- **Compute** : 2+ instances applicatives sans état (stateless).
- **Load Balancer** : Load Balancer matériel redondant ou Cloudflare Load Balancing.
- **Database** : Passage à PostgreSQL managé (AWS RDS ou Supabase) avec failover automatique.
- **Cache** : Redis managé en cluster.

## Conséquences
- **Avantages** : Respect strict du budget MVP tout en garantissant un temps de rétablissement (RTO) très court pour un serveur unique.
- **Inconvénients** : Indisponibilité totale possible pendant 30 minutes en cas de sinistre majeur au centre de données.
