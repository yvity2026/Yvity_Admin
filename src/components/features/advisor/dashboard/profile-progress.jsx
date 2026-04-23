import { useRouter } from "next/navigation";

export default function ProfileProgress() {
  const router = useRouter();
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-gray-100 font-poppins">
      <div className="flex items-center gap-4">
        <div className="text-2xl">💪</div>
        <div>
          <p className="font-bold text-[#111827] text-[clamp(12px,1.5vw,16px)]">
            Profile is 87% Complete
          </p>
          <p className="text-[clamp(10px,1vw,14px)] text-[#6B7280] mt-1">
            Add intro video to reach 95% and earn +2 score points
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row sm:items-end gap-6 w-full md:w-auto">
        <div className="w-full sm:w-64">
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-bold text-[#0A4A4A] text-[clamp(12px,1.5vw,16px)]">87%</span>
            <span className="text-[clamp(10px,1vw,14px)] font-medium text-[#6B7280]">+8% to go</span>
          </div>
          <div className="w-full h-2 bg-[#E8F4F4] rounded-full overflow-hidden">
            <div className="w-[87%] h-full bg-[#124B48] rounded-full" />
          </div>
        </div>
        <button className="bg-[#0A4A4A] hover:bg-[#076868] hover:shadow-[0_0_8px_2px_rgba(13,96,96,0.25)] transition-colors text-[#F59E0B] px-6 py-2.5 rounded-lg font-medium whitespace-nowrap text-[clamp(10px,1vw,14px)] cursor-pointer" onClick={() => router.push("/advisor/profile")}>
          Complete Now
        </button>
      </div>
    </div>
  );
}
