import { redirect } from "next/navigation";

export default async function OldFavorisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/compte/favoris`);
}
