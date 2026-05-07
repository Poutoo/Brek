import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function ProjetPage() {
    const projects = await (prisma as any).project.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
    });

    return (
        <div className="projet-page" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
            <div className="container-brek">
                <header style={{ marginBottom: "5rem", textAlign: "center" }}>
                    <p className="section-subtitle">Portfolio</p>
                    <h1 className="section-title">Nos Réalisations</h1>
                    <p style={{ marginTop: "1.5rem", color: "var(--text-muted)", maxWidth: "600px", margin: "1.5rem auto 0" }}>
                        Découvrez une sélection de projets prestigieux où la passementerie Brek a apporté la touche finale d&apos;élégance et de distinction.
                    </p>
                </header>

                <div className="projects-grid">
                    {projects.map((project: any) => (
                        <div key={project.id} className="project-card">
                            <div className="project-img-wrapper">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="project-img"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="project-overlay">
                                    <div className="project-info">
                                        <p className="project-type">{project.type}</p>
                                        <h3 className="project-name">{project.title}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
