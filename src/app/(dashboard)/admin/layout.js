import AppShell from "@/components/Sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { validateAdmin } from "@/lib/auth/validateAdmin";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await validateAdmin();

  if (!session) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppShell>
        {children}
      </AppShell>
    </SidebarProvider>
  );
}