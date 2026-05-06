import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Questions fréquentes (FAQ)",
  description: "Trouvez rapidement les réponses à vos questions sur Brek.",
};

export default async function FaqPage() {
  const items = await prisma.faqItem.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div className="container-brek" style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-subtitle">Support</p>
          <h1 className="section-title">Questions fréquentes</h1>
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {categories.map((cat) => (
            <section key={cat} aria-labelledby={`faq-${cat}`}>
              <h2 id={`faq-${cat}`} style={{
                fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--gold)", fontWeight: 500, marginBottom: "1rem",
                fontFamily: "var(--font-body)", textAlign: "left",
              }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {items.filter((i) => i.category === cat).map((item) => (
                  <FaqItem key={item.id} question={item.question} answer={item.answer} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="faq-item">
      <summary className="faq-question">
        {question}
        <span className="faq-icon" aria-hidden="true">+</span>
      </summary>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </details>
  );
}
