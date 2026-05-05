import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente de la plateforme Brek.",
};

export default function CgvPage() {
  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek" style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 className="section-title" style={{ marginBottom: "2rem" }}>Conditions Générales de Vente</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "0.875rem" }}>
          Version en vigueur au 1er janvier 2024
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
          {[
            ["Article 1 — Objet", "Les présentes CGV régissent les ventes de produits de passementerie et tissus réalisées par Brek Paris SAS aux acheteurs professionnels et particuliers via la plateforme brek.fr."],
            ["Article 2 — Produits", "Les produits sont vendus au mètre. La commande minimum est de 0,5 mètre par référence. Brek se réserve le droit de modifier son catalogue sans préavis. Les photos des produits sont contractuelles concernant les motifs, mais peuvent varier légèrement en matière de coloris."],
            ["Article 3 — Prix", "Les prix sont indiqués en euros TTC. Brek se réserve le droit de modifier ses prix à tout moment. Les commandes sont facturées au tarif en vigueur lors de la validation de la commande."],
            ["Article 4 — Commandes", "La commande est définitive après confirmation de paiement. Tout ou partie d'une commande peut être annulé avant expédition depuis l'espace client. Passée l'expédition, aucune annulation n'est possible."],
            ["Article 5 — Livraison", "Délai standard : 5 à 10 jours ouvrés. Brek ne peut être tenu responsable des retards dus au transporteur. La livraison est offerte pour toute commande supérieure à 150€ en France métropolitaine."],
            ["Article 6 — Retours", "Étant donné la nature des produits (vendus au mètre, découpés à la commande), les retours ne sont acceptés qu'en cas de défaut avéré signalé dans les 48h suivant la réception."],
            ["Article 7 — Paiement (démonstration)", "Ce site est un environnement de démonstration. Le paiement est simulé et aucune transaction financière réelle n'est effectuée."],
          ].map(([title, content]) => (
            <section key={title as string}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--text)", marginBottom: "0.75rem" }}>
                {title}
              </h2>
              <p>{content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
