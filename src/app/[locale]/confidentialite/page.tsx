import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données personnelles Brek.",
};

export default function ConfidentialitePage() {
  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek" style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 className="section-title" style={{ marginBottom: "2rem" }}>Politique de confidentialité</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
          {[
            ["1. Données collectées", "Brek collecte les données suivantes : informations d'identification (nom, prénom, email), adresses de livraison, historique des commandes, et préférences de navigation (langue, thème). Aucune donnée bancaire n'est collectée (paiement simulé uniquement)."],
            ["2. Finalités du traitement", "Les données sont utilisées pour : la gestion des comptes clients, le traitement des commandes, l'envoi de la newsletter (avec consentement), et l'amélioration de nos services."],
            ["3. Conservation des données", "Les données sont conservées pendant la durée de la relation commerciale et 3 ans après la dernière commande, conformément à la réglementation française."],
            ["4. Droits des utilisateurs", "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, et de portabilité de vos données. Contactez-nous à privacy@brek.fr pour exercer ces droits."],
            ["5. Cookies", "Seuls des cookies fonctionnels strictement nécessaires sont utilisés (session d'authentification, préférences interface). Aucun cookie tiers ou publicitaire."],
            ["6. Sécurité", "Les mots de passe sont hachés (bcrypt). Les communications utilisent HTTPS. Les données sont hébergées sur des serveurs sécurisés."],
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
