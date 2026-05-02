"use client";

import { usePathname } from "next/navigation";
import CollapseButton from "./CollapseButton";
import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar({ children }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
const isAdvisorPages = pathname?.startsWith("/advisor") || pathname?.startsWith("/advisors");
   if (!isAdvisorPages) {
    return <>{children}</>;
  }

  const sidebarWidth = collapsed ? 80 : 260;

  return (
    <div className="flex min-h-screen">

      {/* ✅ Sidebar */}
      <aside
        style={{ width: sidebarWidth }}
        className="bg-[#0A4A4A] text-white transition-all duration-300"
      >
        <div className="p-4 font-bold text-lg">
          Sidebar
        </div>
<ul className="p-4 space-y-2">
    <li className="hover:bg-white/10 p-2 rounded cursor-pointer">Dashboard</li>
    <li className="hover:bg-white/10 p-2 rounded cursor-pointer">Advisors</li>
    <li className="hover:bg-white/10 p-2 rounded cursor-pointer">Customers</li>
    <li className="hover:bg-white/10 p-2 rounded cursor-pointer">Payments</li>
  </ul> 
      </aside>

      {/* ✅ Collapse Button */}
      <CollapseButton sidebarWidth={sidebarWidth} />

      {/* ✅ Main Content */}
      <div className="flex-1 bg-gray-50">
        {children}
      </div>
    </div>
  );
}