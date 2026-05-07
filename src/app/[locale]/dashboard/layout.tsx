import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "./admin.css";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
  const { locale } = await params;

  if (!session || !isAdmin) {
    redirect(`/${locale}/admin`);
  }

  return (
    <div className="admin-layout">
      <AdminSidebar locale={locale} />
      
      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
