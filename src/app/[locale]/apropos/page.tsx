import Image from "next/image";

export default function AproposPage() {
    return (
        <div className="apropos">
            {/* Hero Section */}
            <section className="apropos-hero">
                <div className="apropos-hero-img">
                    <Image
                        src="/assets/menu/menu_principal.jpg"
                        alt="Maison Brek Workshop"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                </div>
                <div className="container-brek apropos-hero-content">
                    <p className="text-gold uppercase tracking-widest text-sm mb-4">Depuis 1987</p>
                    <h1 className="text-white text-5xl md:text-7xl font-display mb-6">L&apos;Excellence de la <br /> Passementerie</h1>
                    <p className="text-white/80 max-w-xl text-lg leading-relaxed">
                        Située au cœur de Paris, la Maison Brek perpétue un savoir-faire artisanal unique, mêlant tradition séculaire et audace contemporaine.
                    </p>
                </div>
            </section>

            {/* Histoire Section */}
            <section className="section-padding bg-cream">
                <div className="container-brek">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="section-subtitle">Notre Histoire</p>
                            <h2 className="section-title">Un Héritage au service <br /> de la Beauté</h2>
                            <div className="space-y-6 text-text-muted leading-relaxed">
                                <p>
                                    Fondée il y a plus de trois décennies, la Maison Brek est née d&apos;une passion pour les détails qui font les grands intérieurs. Nous avons commencé par restaurer des pièces historiques, ce qui nous a permis de comprendre l&apos;âme des fibres et l&apos;architecture des ornements.
                                </p>
                                <p>
                                    Aujourd&apos;hui, nous collaborons avec les plus grands décorateurs internationaux pour créer des pièces uniques qui habillent les plus belles demeures, palais et yachts à travers le monde.
                                </p>
                            </div>
                        </div>
                        <div className="relative aspect-square bg-[#7a6a64] flex items-center justify-center">
                            <span className="text-white/20 font-display text-2xl">Maison Brek Paris</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Savoir Faire Section */}
            <section className="section-padding bg-charcoal text-white">
                <div className="container-brek text-center mb-16">
                    <p className="text-gold tracking-widest uppercase text-sm mb-2">Le Geste Parfait</p>
                    <h2 className="text-4xl md:text-5xl font-display">Notre Savoir-Faire</h2>
                </div>
                <div className="container-brek grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <h3 className="text-xl font-display text-gold mb-4">La Main de l&apos;Homme</h3>
                        <p className="text-white/60 text-sm leading-loose">
                            Chaque pompon, chaque frange est réalisé à la main dans notre atelier, garantissant une qualité et une finesse inégalées.
                        </p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-display text-gold mb-4">Matières Nobles</h3>
                        <p className="text-white/60 text-sm leading-loose">
                            Nous sélectionnons les meilleures soies, lins et cotons pour offrir des textures riches et des reflets profonds.
                        </p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-display text-gold mb-4">Sur-Mesure Pur</h3>
                        <p className="text-white/60 text-sm leading-loose">
                            Notre bureau d&apos;études développe des solutions techniques et esthétiques sur-mesure pour chaque projet spécifique.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
