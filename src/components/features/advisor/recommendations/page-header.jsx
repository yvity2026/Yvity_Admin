import { Share2 } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-900 tracking-wide">
        Recommendations
      </h1>
      <button className="bg-[#124B48] hover:bg-[#0a2e2c] transition-colors text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
        <Share2 className="w-4 h-4" />
        Share Profile
      </button>
    </div>
  );
}
