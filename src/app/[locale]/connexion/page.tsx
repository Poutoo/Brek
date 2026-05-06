import { AuthForm } from "@/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Brek.",
};

export default async function ConnexionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AuthForm locale={locale} mode="login" />;
}
