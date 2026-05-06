import { AuthForm } from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte Brek pour accéder à toutes les fonctionnalités.",
};

export default async function InscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AuthForm locale={locale} mode="register" />;
}
