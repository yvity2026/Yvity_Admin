import { Bell } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-gray-200 w-full sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-900 font-cormorant">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-full bg-[#FCF8F3] border border-[#F3E8D6] flex items-center justify-center hover:bg-[#f2eadc] transition-colors">
          <Bell className="w-5 h-5 text-gray-700" strokeWidth={1.5} />

          <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#EAB308] rounded-full border border-white"></span>
        </button>

        <button className="w-10 h-10 rounded-full bg-[#F59E0B] flex items-center justify-center text-white text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
          KM
        </button>
      </div>
    </div>
  );
}
