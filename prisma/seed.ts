import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Brek database...\n");

  // --- CLEANUP ---
  console.log("🧹 Cleaning up existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.restockRequest.deleteMany();
  await prisma.customization.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.product.deleteMany();
  await prisma.designerCollection.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.designer.deleteMany();
  await prisma.faqItem.deleteMany();
  await prisma.newsletterArticle.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.contactMessage.deleteMany();
  console.log("👤 Creating designers...");

  const bambi = await prisma.designer.upsert({
    where: { slug: "bambi-sloan" },
    update: {},
    create: {
      slug: "bambi-sloan",
      name: "Bambi Sloan",
      bio: "Bambi Sloan est une designer textile d'origine britannique, diplômée du Royal College of Art. Connue pour son travail sur les textures naturelles et les teintes terreuses, elle collabore avec les plus grandes maisons européennes depuis plus de 15 ans. Sa démarche artistique mêle influences botaniques et savoir-faire artisanal pour créer des pièces intemporelles.",
      image: "/assets/designers/bambi_sloan.png",
      website: "https://bambi-sloan.com",
      instagram: "@bambi.sloan",
    },
  });

  const eric = await prisma.designer.upsert({
    where: { slug: "eric-egan" },
    update: {},
    create: {
      slug: "eric-egan",
      name: "Éric Egan",
      bio: "Éric Egan, né à Lyon, a forgé son style au croisement de l'architecture et du textile. Après des études à l'École Supérieure des Arts Appliqués de Paris, il développe une signature unique : des géométries précises sublimées par des matières nobles. Ses collections chez Brek sont devenues des références dans le monde de la décoration intérieure de luxe.",
      image: "/assets/designers/eric_egan.png",
      instagram: "@eric.egan.design",
    },
  });

  const michael = await prisma.designer.upsert({
    where: { slug: "michael-aiduss" },
    update: {},
    create: {
      slug: "michael-aiduss",
      name: "Michael Aiduss",
      bio: "Michael Aiduss puise son inspiration dans les cultures du monde entier, de la soie coréenne aux motifs berbères d'Afrique du Nord. Basé à Paris depuis 2008, ce designer américain est reconnu pour sa capacité à transcender les frontières culturelles dans ses créations textiles. Sa collaboration avec Brek lui a permis d'explorer la tradition de la passementerie française avec un regard neuf et vibrant.",
      image: "/assets/designers/michael_aiduss.png",
      instagram: "@michael.aiduss",
    },
  });

  // ─── COLLECTIONS ───────────────────────────────────────────────────────────
  console.log("🎨 Creating collections...");

  const colPorta = await prisma.collection.upsert({
    where: { slug: "porta" },
    update: {},
    create: {
      slug: "porta",
      name: "Porta",
      description:
        "La collection Porta évoque la magnificence des palais européens du XVIIIe siècle. Galons brodés d'or, velours profonds et soieries chatoyantes composent un univers de grandeur absolue. Chaque pièce est pensée comme un objet de collection, destiné aux intérieurs les plus exigeants.",
      coverImage: "/assets/collection/porta/porta_principal.png",
      images: [
        "/assets/collection/porta/porta_1.png",
        "/assets/collection/porta/porta_2.png",
        "/assets/collection/porta/porta_3.png",
      ],
      videoUrl: "/assets/collection/porta/porta.mp4",
      featured: true,
    },
  });

  const colIsoria = await prisma.collection.upsert({
    where: { slug: "isoria" },
    update: {},
    create: {
      slug: "isoria",
      name: "Isoria",
      description:
        "La collection Léopard incarne l'audace et la sensualité. Inspirée des grandes savanes africaines et de l'élégance féline, cette ligne de passementerie joue sur les contrastes : douceur des velours et précision des motifs imprimés. Un hommage à la puissance naturelle, réinterprétée avec la finesse de l'artisanat français.",
      coverImage: "/assets/collection/isoria/isoria_principal.png",
      images: [
        "/assets/collection/isoria/isoria_1.png",
        "/assets/collection/isoria/isoria_2.png",
        "/assets/collection/isoria/isoria_3.png",
      ],
      videoUrl: "/assets/collection/isoria/isoria.mp4",
      featured: true,
    },
  });

  const colSalone = await prisma.collection.upsert({
    where: { slug: "salone" },
    update: {},
    create: {
      slug: "salone",
      name: "Salone",
      description:
        "Née de la rencontre entre Brek et le Salone del Mobile de Milan, cette collection capture l'esprit de l'innovation design contemporaine. Des lignes épurées, des textures modernes et une palette chromatique audacieuse font de Salone une collection résolument tournée vers l'avenir tout en préservant l'excellence artisanale de la maison.",
      coverImage: "/assets/collection/salone/salone_1.png",
      images: [
        "/assets/collection/salone/salone_1.png",
        "/assets/collection/salone/salone_2.png",
        "/assets/collection/salone/salone_3.png",
      ],
      videoUrl: "/assets/collection/salone/salone.mp4",
      featured: true,
    },
  });

  // Liaisons Designer <-> Collection
  await prisma.designerCollection.upsert({
    where: { designerId_collectionId: { designerId: bambi.id, collectionId: colPorta.id } },
    update: {},
    create: { designerId: bambi.id, collectionId: colPorta.id },
  });
  await prisma.designerCollection.upsert({
    where: { designerId_collectionId: { designerId: eric.id, collectionId: colIsoria.id } },
    update: {},
    create: { designerId: eric.id, collectionId: colIsoria.id },
  });
  await prisma.designerCollection.upsert({
    where: { designerId_collectionId: { designerId: michael.id, collectionId: colSalone.id } },
    update: {},
    create: { designerId: michael.id, collectionId: colSalone.id },
  });
  // Bambi aussi sur Salone
  await prisma.designerCollection.upsert({
    where: { designerId_collectionId: { designerId: bambi.id, collectionId: colSalone.id } },
    update: {},
    create: { designerId: bambi.id, collectionId: colSalone.id },
  });

  // ─── PRODUCTS ──────────────────────────────────────────────────────────────
  console.log("🧵 Creating products...");

  const products = [
    {
      ref: "BRK-IMP-001",
      slug: "galon-or-porta",
      name: "Galon Brodé Or Impérial",
      description: "Galon de haute couture brodé à la main avec des fils d'or 24 carats. Inspiré des ornements architecturaux des palais versaillais, ce galon apporte une touche de magnificence incomparable à vos projets de décoration.",
      price: 285,
      stock: 47.5,
      unit: "m",
      images: ["/assets/collection/porta/porta_1.png", "/assets/placeholder.png"],
      featured: true,
      collectionId: colPorta.id,
      metadata: {
        weight: "180g/m",
        composition: "60% soie, 30% fils d'or, 10% lin",
        width: "6 cm",
        origin: "Lyon, France",
        care: "Nettoyage à sec uniquement",
      },
    },
    {
      ref: "BRK-IMP-002",
      slug: "frange-velours-imperial",
      name: "Frange Velours Impérial",
      description: "Frange en velours de soie aux reflets profonds, ornée de pompons tressés à la main. Cette frange royale est idéale pour les rideaux de scène, coussins de prestige et garnitures de canapés haute gamme.",
      price: 340,
      stock: 23,
      unit: "m",
      images: ["/assets/collection/porta/porta_2.png", "/assets/placeholder.png"],
      featured: true,
      collectionId: colPorta.id,
      metadata: {
        weight: "220g/m",
        composition: "100% soie",
        width: "12 cm (frange : 8 cm)",
        origin: "Lyon, France",
        care: "Nettoyage à sec uniquement",
      },
    },
    {
      ref: "BRK-IMP-003",
      slug: "passement-damas-or",
      name: "Passement Damas Or & Ivoire",
      description: "Passement aux motifs damassés en or et ivoire, tisé sur métier Jacquard selon les techniques du XVIIIe siècle. Un chef-d'œuvre de l'artisanat lyonnais, disponible en longueurs personnalisées.",
      price: 195,
      stock: 0,
      unit: "m",
      images: ["/assets/collection/porta/porta_3.png", "/assets/placeholder.png"],
      featured: false,
      collectionId: colPorta.id,
      metadata: {
        weight: "150g/m",
        composition: "70% soie, 30% fil métallique doré",
        width: "4 cm",
        origin: "Lyon, France",
        care: "Nettoyage à sec uniquement",
      },
    },
    {
      ref: "BRK-LEO-001",
      slug: "ruban-isoria-velours",
      name: "Ruban Léopard Velours Moka",
      description: "Ruban en velours ras imprimé motif léopard dans une palette de moka et caramel. La douceur du velours contraste avec l'audace du motif pour un résultat résolument contemporain et luxueux.",
      price: 128,
      stock: 85,
      unit: "m",
      images: ["/assets/collection/isoria/isoria_1.png", "/assets/placeholder.png"],
      featured: true,
      collectionId: colIsoria.id,
      metadata: {
        weight: "210g/m",
        composition: "80% polyester, 20% viscose",
        width: "3 cm",
        origin: "Paris, France",
        care: "Lavable à 30°C à l'envers",
      },
    },
    {
      ref: "BRK-LEO-002",
      slug: "tissu-isoria-satin",
      name: "Tissu Léopard Satin Naturel",
      description: "Tissu satiné à motif léopard dans des tons naturels et dorés. Idéal pour la confection de housses de coussin, nappes de prestige et applications de mode. La qualité du satin apporte une brillance subtile qui sublime chaque motif.",
      price: 245,
      stock: 31.5,
      unit: "m",
      images: ["/assets/collection/isoria/isoria_2.png", "/assets/collection/isoria/isoria_3.png"],
      featured: true,
      collectionId: colIsoria.id,
      metadata: {
        weight: "165g/m",
        composition: "95% soie, 5% élasthanne",
        width: "140 cm",
        origin: "Paris, France",
        care: "Nettoyage à sec recommandé",
      },
    },
    {
      ref: "BRK-LEO-003",
      slug: "cordon-tresse-isoria",
      name: "Cordon Tressé Léopard Caramel",
      description: "Cordon rond tressé à la main dans une palette léopard caramel et chocolat. Ce cordon polyvalent se prête aussi bien aux applications d'ameublement qu'aux créations de bijoux et accessoires de mode.",
      price: 89,
      stock: 120,
      unit: "m",
      images: ["/assets/collection/isoria/isoria_3.png", "/assets/placeholder.png"],
      featured: false,
      collectionId: colIsoria.id,
      metadata: {
        weight: "45g/m",
        composition: "60% coton, 40% polyester",
        width: "0.8 cm (diamètre)",
        origin: "Aubenas, France",
        care: "Lavable à 40°C",
      },
    },
    {
      ref: "BRK-SAL-001",
      slug: "galon-graphique-salone",
      name: "Galon Graphique Salone Noir",
      description: "Galon aux motifs géométriques contemporains en noir et blanc, signature de la collection Salone. Inspiré des lignes épurées du design milanais, ce galon apporte une touche d'avant-garde à tout projet de décoration intérieure.",
      price: 175,
      stock: 56,
      unit: "m",
      images: ["/assets/collection/salone/salone_1.png", "/assets/placeholder.png"],
      featured: true,
      collectionId: colSalone.id,
      metadata: {
        weight: "120g/m",
        composition: "100% coton organique",
        width: "5 cm",
        origin: "Milan / Lyon",
        care: "Lavable à 40°C",
      },
    },
    {
      ref: "BRK-SAL-002",
      slug: "tissu-lin-salone",
      name: "Tissu Lin Naturel Salone",
      description: "Tissu de lin naturel au grammage supérieur, légèrement texturé pour un rendu artisanal raffiné. Ce lin de qualité supérieure est issu de filières responsables françaises et belges. Son veinage naturel en fait un tissu unique à chaque métrage.",
      price: 155,
      stock: 78,
      unit: "m",
      images: ["/assets/collection/salone/salone_2.png", "/assets/collection/salone/salone_3.png"],
      featured: true,
      collectionId: colSalone.id,
      metadata: {
        weight: "300g/m",
        composition: "100% lin OEKO-TEX",
        width: "150 cm",
        origin: "Normandie, France",
        care: "Lavable à 60°C, séchage à plat",
      },
    },
    {
      ref: "BRK-SAL-003",
      slug: "pompons-contemporains-salone",
      name: "Pompons Contemporains Salone",
      description: "Frange à pompons de taille variable dans une palette contemporaine de gris, beige et terracotta. Ces pompons réinterprètent le classique de la passementerie avec une esthétique résolument moderne, parfaits pour la décoration boho-chic haut de gamme.",
      price: 98,
      stock: 44,
      unit: "m",
      images: ["/assets/collection/salone/salone_3.png", "/assets/placeholder.png"],
      featured: false,
      collectionId: colSalone.id,
      metadata: {
        weight: "180g/m",
        composition: "70% laine mérinos, 30% soie",
        width: "8 cm (pompons : 4-6 cm)",
        origin: "Aubusson, France",
        care: "Nettoyage à sec recommandé",
      },
    },
    {
      ref: "BRK-CAP-001",
      slug: "ruban-capsule-soie-brute",
      name: "Ruban Soie Brute Capsule",
      description: "Ruban en soie brute non traitée, présentant des irrégularités naturelles caractéristiques de la soie artisanale. Chaque mètre est unique. Disponible en différentes largeurs sur demande. Une pièce d'exception pour les projets les plus exclusifs.",
      price: 390,
      stock: 12.5,
      unit: "m",
      images: ["/assets/placeholder.png"],
      featured: true,
      collectionId: null,
      metadata: {
        weight: "90g/m",
        composition: "100% soie grège",
        width: "2.5 cm",
        origin: "Cévennes, France",
        care: "Nettoyage à sec uniquement",
      },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { ref: product.ref },
      update: {},
      create: {
        ref: product.ref,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        images: product.images,
        featured: product.featured,
        active: true,
        collectionId: product.collectionId,
        metadata: product.metadata,
      },
    });
    console.log(`  ✓ ${product.name}`);
  }

  // ─── USERS ─────────────────────────────────────────────────────────────────
  console.log("\n👥 Creating users...");

  const adminPwd = await bcrypt.hash("admin1234", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@brek.fr" },
    update: {},
    create: {
      email: "admin@brek.fr",
      password: adminPwd,
      firstName: "Admin",
      lastName: "Brek",
      name: "Admin Brek",
      role: "ADMIN",
    },
  });

  const userPwd = await bcrypt.hash("user1234", 12);
  const user1 = await prisma.user.upsert({
    where: { email: "marie.dupont@example.com" },
    update: {},
    create: {
      email: "marie.dupont@example.com",
      password: userPwd,
      firstName: "Marie",
      lastName: "Dupont",
      name: "Marie Dupont",
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jean.martin@example.com" },
    update: {},
    create: {
      email: "jean.martin@example.com",
      password: userPwd,
      firstName: "Jean",
      lastName: "Martin",
      name: "Jean Martin",
      role: "USER",
    },
  });

  console.log(`  ✓ admin@brek.fr (admin / admin1234)`);
  console.log(`  ✓ marie.dupont@example.com (user / user1234)`);
  console.log(`  ✓ jean.martin@example.com (user / user1234)`);

  // ─── ADDRESSES ─────────────────────────────────────────────────────────────
  const addr1 = await prisma.address.upsert({
    where: { id: "addr-marie-1" },
    update: {},
    create: {
      id: "addr-marie-1",
      userId: user1.id,
      label: "Domicile",
      firstName: "Marie",
      lastName: "Dupont",
      line1: "12 rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      isDefault: true,
    },
  });

  // ─── ORDERS (DEMO) ──────────────────────────────────────────────────────────
  console.log("\n📦 Creating demo orders...");

  const galon = await prisma.product.findUnique({ where: { ref: "BRK-IMP-001" } });
  const frange = await prisma.product.findUnique({ where: { ref: "BRK-IMP-002" } });

  if (galon && frange) {
    await prisma.order.upsert({
      where: { orderNumber: "BRK-DEMO-001" },
      update: {},
      create: {
        orderNumber: "BRK-DEMO-001",
        userId: user1.id,
        addressId: addr1.id,
        status: "DELIVERED",
        totalAmount: galon.price * 3 + frange.price * 2,
        shippingAmount: 0,
        simulatedPayRef: "SIM-1715000001",
        items: {
          create: [
            {
              productId: galon.id,
              productName: galon.name,
              productRef: galon.ref,
              quantity: 3,
              unitPrice: galon.price,
            },
            {
              productId: frange.id,
              productName: frange.name,
              productRef: frange.ref,
              quantity: 2,
              unitPrice: frange.price,
            },
          ],
        },
      },
    });

    await prisma.order.upsert({
      where: { orderNumber: "BRK-DEMO-002" },
      update: {},
      create: {
        orderNumber: "BRK-DEMO-002",
        userId: user2.id,
        status: "SHIPPED",
        totalAmount: galon.price * 1.5,
        shippingAmount: 0,
        simulatedPayRef: "SIM-1715000002",
        items: {
          create: [
            {
              productId: galon.id,
              productName: galon.name,
              productRef: galon.ref,
              quantity: 1.5,
              unitPrice: galon.price,
            },
          ],
        },
      },
    });
    console.log("  ✓ Commande DELIVERED pour Marie Dupont");
    console.log("  ✓ Commande SHIPPED pour Jean Martin");
  }

  // ─── FAQ ───────────────────────────────────────────────────────────────────
  console.log("\n❓ Creating FAQ...");

  const faqItems = [
    {
      question: "Quelle est la quantité minimale de commande ?",
      answer: "La commande minimum est de 0,5 mètre par référence. Pour les tissus larges (>100 cm), nous recommandons de commander par mètre entier pour faciliter la coupe. Des devis peuvent être établis pour des quantités supérieures à 50 mètres.",
      category: "commandes",
      order: 1,
    },
    {
      question: "Comment sont calculés les délais de livraison ?",
      answer: "Les délais de livraison standard sont de 5 à 10 jours ouvrés pour la France métropolitaine. Pour les commandes sur-mesure ou les tissus nécessitant une découpe spéciale, comptez 2 à 3 semaines supplémentaires. Les commandes passées avant 14h sont expédiées le jour même.",
      category: "livraison",
      order: 2,
    },
    {
      question: "Les tissus peuvent-ils être personnalisés ?",
      answer: "Absolument ! Brek propose un service de personnalisation complète : couleurs sur demande (à partir de 30 mètres), dimensions spéciales, motifs exclusifs pour les clients professionnels. Utilisez le formulaire de demande sur-mesure disponible sur chaque fiche produit ou contactez directement notre atelier.",
      category: "personnalisation",
      order: 3,
    },
    {
      question: "Quelle est votre politique de retour ?",
      answer: "Étant donné la nature des produits vendus au mètre et découpés à la commande, les retours ne sont acceptés que pour les défauts de fabrication. En cas de problème, contactez-nous dans les 48h suivant la réception avec des photos du défaut. Nous procéderons à un remplacement ou remboursement selon votre préférence.",
      category: "retours",
      order: 4,
    },
    {
      question: "Proposez-vous des échantillons ?",
      answer: "Oui ! Des échantillons de 20 x 20 cm sont disponibles pour la plupart de nos références au prix de 5€ l'unité (déduit de votre prochaine commande de plus de 50€). Commandez vos échantillons depuis la fiche produit. Les professionnels (décorateurs, architectes d'intérieur) peuvent bénéficier d'un service d'échantillonnage gratuit sur demande.",
      category: "produits",
      order: 5,
    },
    {
      question: "Comment entretenir les produits de passementerie ?",
      answer: "L'entretien varie selon la composition. En règle générale : les galons et franges en soie nécessitent un nettoyage à sec professionnel. Les rubans en coton peuvent être lavés délicatement à 30°C. Évitez l'exposition prolongée au soleil direct pour préserver les couleurs. Stockez dans une housse en coton non blanchi pour éviter le jaunissement.",
      category: "entretien",
      order: 6,
    },
  ];

  for (const item of faqItems) {
    const existing = await prisma.faqItem.findFirst({
      where: { question: item.question },
    });
    if (!existing) {
      await prisma.faqItem.create({ data: item });
    }
    console.log(`  ✓ ${item.question.substring(0, 50)}...`);
  }

  // ─── NEWSLETTER ARTICLES ───────────────────────────────────────────────────
  console.log("\n📰 Creating newsletter articles...");

  const articles = [
    {
      slug: "nouvelle-collection-porta-2024",
      title: "La collection Impériale : un hommage aux palais d'Europe",
      excerpt: "Découvrez comment Bambi Sloan a puisé son inspiration dans les archives des Manufactures Royales pour créer la collection Impériale.",
      content: "La collection Impériale est née d'une passion commune pour l'histoire, l’architecture classique et le savoir-faire artisanal transmis à travers les siècles. Inspirée des grandes résidences européennes et des détails ornementaux qui ont traversé le temps, elle réinterprète l’élégance des décors anciens dans une écriture contemporaine, sobre et raffinée. Chaque pièce a été pensée comme un équilibre entre mémoire et modernité : des lignes sculptées avec précision, des matières nobles choisies pour leur profondeur, et des finitions réalisées à la main qui rendent chaque création singulière. Le marbre, le bois sombre et les métaux patinés dialoguent dans une palette intemporelle, conçue pour traverser les époques sans perdre de sa force. Au-delà de l’esthétique, la collection célèbre une certaine idée du luxe : un luxe silencieux, durable, fondé sur la qualité des proportions, le respect des matériaux et l’attention portée au moindre détail. Impériale ne cherche pas à reproduire le passé, mais à en prolonger l’esprit dans des intérieurs d’aujourd’hui.",
      published: true,
      publishedAt: new Date("2025-09-15"),
      coverImage: "/assets/collection/imperiale/imperiale_1.png",
    },
    {
      slug: "salone-del-mobile-2024-brek",
      title: "Brek au Salone del Mobile de Milan",
      excerpt: "Retour sur notre présence au Salone del Mobile 2024, où nous avons présenté en avant-première la collection Salone en collaboration avec Michael Aiduss.",
      content: "Milan, avril 2025. Le Salone del Mobile a accueilli cette année une génération de créateurs décidés à réinventer notre rapport aux objets, à la lumière et aux matières. Entre installations immersives, mobilier sculptural et expérimentations technologiques, la ville entière semblait vibrer au rythme d’un design plus sensoriel, plus durable et plus émotionnel. Dans les palais historiques comme dans les anciens entrepôts industriels reconvertis, les visiteurs passaient d’univers minimalistes baignés de silence à des scénographies spectaculaires où le son, la couleur et le mouvement devenaient partie intégrante de l’expérience. Le verre soufflé côtoyait l’aluminium recyclé, tandis que les textiles naturels revenaient au premier plan, portés par une volonté commune : ralentir, simplifier, donner du sens. Plus qu’un salon, cette édition 2025 s’est imposée comme un manifeste. Les grandes maisons italiennes y ont dialogué avec une nouvelle scène internationale audacieuse, brouillant les frontières entre artisanat, art contemporain et innovation numérique. Dans les rues de Milan, chaque cour intérieure, chaque galerie et chaque café semblait participer à cette célébration collective de la création.",
      published: true,
      publishedAt: new Date("2025-04-20"),
      coverImage: "/assets/collection/salone/salone_1.png",
    },
  ];

  for (const article of articles) {
    await prisma.newsletterArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
    console.log(`  ✓ ${article.title}`);
  }

  console.log("\n✅ Seeding complete!");
  console.log("\n📋 Comptes de test :");
  console.log("  Admin  : admin@brek.fr / admin1234");
  console.log("  User 1 : marie.dupont@example.com / user1234");
  console.log("  User 2 : jean.martin@example.com / user1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
