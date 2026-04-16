import { Info } from "lucide-react";

export default function InfoBanner() {
  return (
    <div className="bg-[#E2F1F0] border border-[#B2DFDB] rounded-xl p-3 lg:p-4 flex text-center items-center gap-3">
      <Info className="w-5 h-5 text-[#00695C] mt-0.5 flex-shrink-0" />
      <p className="text-[clamp(10px,1vw,14px)] text-[#0A4A4A] font-medium">
        Showcase your awards, certifications and milestones. Gold plan allows
        unlimited achievements.
      </p>
    </div>
  );
}
