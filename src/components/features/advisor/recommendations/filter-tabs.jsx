import { BadgeCheck } from "lucide-react";

export default function FilterTabs() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="bg-[#124B48] text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm">
        All (32)
      </button>

      <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
        <BadgeCheck className="w-4 h-4 text-[#1E7145]" />
        Verified
      </button>

      <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">
        This month
      </button>
    </div>
  );
}
