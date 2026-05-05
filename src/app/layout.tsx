import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Brek — Passementerie & Tissus de Luxe",
    template: "%s | Brek",
  },
  description:
    "Brek, maison de passementerie française depuis 1987. Découvrez nos collections de rubans, galons, tissus et ornements haut de gamme, conçus avec les plus grands designers.",
  keywords: [
    "passementerie",
    "tissus luxe",
    "rubans",
    "galons",
    "décoration intérieure",
    "tissus haut de gamme",
    "brek",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "http://localhost:3000",
    siteName: "Brek",
    title: "Brek — Passementerie & Tissus de Luxe",
    description:
      "Maison de passementerie française depuis 1987. Collections haut de gamme.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
