import { MdVerifiedUser } from "react-icons/md";

export default function FilterTabs() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="bg-white hover:bg-[#0A4A4A] text-[#111827] hover:text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm cursor-pointer">
        All (32)
      </button>

      <button className="bg-white hover:bg-[#0A4A4A] text-[#111827] hover:text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
        <MdVerifiedUser className="w-4 h-4" />
        Verified
      </button>

      <button className="bg-white hover:bg-[#0A4A4A] text-[#111827] hover:text-white px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer">
        This month
      </button>
    </div>
  );
}
