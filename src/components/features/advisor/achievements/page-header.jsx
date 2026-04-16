import { Plus } from "lucide-react";

export default function PageHeader({ onAddClick }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
      <h1 className="text-[clamp(12px,1.5vw,16px)] font-bold text-[#000] tracking-wide">
        Achievements
      </h1>
      <button 
        onClick={onAddClick}
        className="bg-[#0A4A4A] transition-colors text-[#F8F6F1] px-5 py-2 rounded-lg text-[clamp(8px,1vw,12px)] font-medium flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Achievement
      </button>
    </div>
  );
}
