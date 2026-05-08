import AppShell from "@/components/Sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";


export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppShell>
        {children}
      </AppShell>
    </SidebarProvider>
  );
}