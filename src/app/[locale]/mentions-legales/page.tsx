import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de la plateforme Brek.",
};

export default function MentionsLegalesPage() {
  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek" style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 className="section-title" style={{ marginBottom: "2rem" }}>Mentions légales</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.75rem" }}>
              Éditeur du site
            </h2>
            <p><strong>Brek Paris SAS</strong><br />
            12 rue de la Soie, 69001 Lyon, France<br />
            RCS Lyon : 123 456 789<br />
            TVA intracommunautaire : FR12 123456789<br />
            Tél. : +33 (0)4 72 XX XX XX<br />
            Email : contact@brek.fr</p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.75rem" }}>
              Directeur de la publication
            </h2>
            <p>M. Jean-Pierre Durand, Président de Brek Paris SAS</p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.75rem" }}>
              Hébergement
            </h2>
            <p>Hébergement local — environnement de démonstration académique.<br />
            En production : Vercel Inc., 340 Pine Street, 5th Floor, San Francisco, CA 94104, USA</p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.75rem" }}>
              Propriété intellectuelle
            </h2>
            <p>L'ensemble des éléments constituant le site Brek (textes, images, graphismes, logo, etc.) est la propriété exclusive de Brek Paris SAS. Toute reproduction ou utilisation sans autorisation expresse est strictement interdite.</p>
          </section>
          <section>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.75rem" }}>
              Cookies
            </h2>
            <p>Ce site utilise uniquement des cookies fonctionnels strictement nécessaires au fonctionnement de la plateforme (session d'authentification, préférences). Aucun cookie publicitaire ou de tracking n'est utilisé.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
