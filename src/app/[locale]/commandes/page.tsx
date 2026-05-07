import { redirect } from "next/navigation";

export default async function OldCommandesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/compte/commandes`);
}
