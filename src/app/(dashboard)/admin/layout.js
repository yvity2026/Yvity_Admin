import AppShell from "@/components/Sidebar/Sidebar";
import { validateAdmin } from "@/lib/auth/validateAdmin";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }) {
  const session = await validateAdmin();

  if (!session) {
    redirect("/");
  }

  return <AppShell>{children}</AppShell>;
}
