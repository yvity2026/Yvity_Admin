import Sidebar from "@/components/Sidebar/Sidebar";
import { navItems } from "@/lib/Types/NavItems/Navitems";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}