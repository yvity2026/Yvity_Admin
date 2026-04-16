import { AlertTriangle } from "lucide-react";

export default function DangerZone() {
  return (
    <div className="rounded-2xl p-6 border border-[#E2E1DC] bg-[#FEF2F2] shadow-none">
      
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-[#BF1313]" />
        <h2 className="text-base font-bold text-[#BF1313]">Danger Zone</h2>
      </div>

      <div className="flex flex-col">
        {/* Deactivate Row */}
        <div className="flex items-center justify-between py-4 border-b border-[#FEE2E2] first:pt-0">
          <div>
            <h3 className="text-[clamp(10px,1vw,14px)] font-bold text-[#374151]">Deactivate Account</h3>
            <p className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium mt-0.5">Temporarily hide your profile from public view</p>
          </div>
          <button className="px-4 py-1.5 bg-white border border-[#FECACA] rounded-md text-[clamp(8px,1vw,12px)] font-bold text-[#D32323] transition-colors cursor-pointer">
            Deactivate
          </button>
        </div>

        {/* Delete Row */}
        <div className="flex items-center justify-between py-4 last:pb-0">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Delete Account</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Permanently delete your profile and all data</p>
          </div>
          <button className="text-[clamp(8px,1vw,12px)] px-4 py-1.5 bg-white border border-[#FECACA] rounded-md font-bold text-[#D32323] transition-colors cursor-pointer">
            Delete
          </button>
        </div>
      </div>

    </div>
  );
}