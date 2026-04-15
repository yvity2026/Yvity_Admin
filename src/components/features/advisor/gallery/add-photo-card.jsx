import { Plus } from "lucide-react";

export default function AddPhotoCard() {
  return (
    <button className="bg-white aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-[#8B5CF6] transition-all group w-full">
      <Plus 
        className="w-10 h-10 text-[#8B5CF6] group-hover:scale-110 transition-transform duration-300" 
        strokeWidth={3} 
      />
      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
        Add Photos
      </span>
    </button>
  );
}