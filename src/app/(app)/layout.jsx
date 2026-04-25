import AppShell from "../components/layout/Sidebar";

export default function AppLayout({ children }) {
  return (
    <AppShell>
      <main className="flex-1 flex flex-col">{children}</main>
    </AppShell>
  );
}
