import { Info } from "lucide-react";

export default function InfoBanner() {
  return (
    <div className="bg-[#E2F1F0] border border-[#B2DFDB] rounded-xl p-4 flex items-start gap-3">
      <Info className="w-5 h-5 text-[#00695C] mt-0.5 flex-shrink-0" />
      <p className="text-sm text-[#00695C] font-medium">
        This section appears on your public profile. Add your work history and education to build credibility.
      </p>
    </div>
  );
}