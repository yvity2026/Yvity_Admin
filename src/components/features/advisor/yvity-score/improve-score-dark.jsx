import { ArrowRight } from "lucide-react";

const improvements = [
  {
    icon: "🎥",
    title: "Add 1 video testimonial",
    pts: "+3 pts",
    btn: "Request",
  },
  {
    icon: "👍",
    title: "Get 2 more recommendations",
    pts: "+4 pts",
    btn: "Share",
  },
  {
    icon: "🌟",
    title: "Maintain monthly recommendation",
    pts: "+1 bonus",
    btn: "Keep it up",
  },
  {
    icon: "🎬",
    title: "Add intro video to your profile",
    pts: "+2 pts",
    btn: "Add now",
  },
  {
    icon: "📤",
    title: "Share profile 10 more times",
    pts: "+2 pts",
    btn: "Share",
  },
];

export default function ImproveScoreDark() {
  return (
    <div className="rounded-2xl p-6 md:p-8 border border-[#E2E1DC] bg-gradient-to-r from-[#091D26] to-[#0C2C3B] shadow-none">
      <h3 className="text-[#F8F6F1] font-bold text-[clamp(12px,1.5vw,16px)] mb-6 flex items-center gap-2">
        <span className="text-[#EAB308]">💡</span> Improve Your Score
      </h3>

      <div className="space-y-3">
        {improvements.map((item, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#18303B] p-4 rounded-xl border border-[#1A3344] gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[clamp(10px,1vw,14px)] font-medium text-[#F8F6F1]">
                {item.title}
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5">
              <span className="text-[clamp(10px,1vw,14px)] font-bold text-[#F59E0B]">
                {item.pts}
              </span>
              <button className="bg-white/10 hover:bg-white/20 transition-colors text-[#F8F6F1] px-4 py-2 rounded-lg text-[clamp(8px,1vw,12px)] font-medium flex items-center gap-1.5 border border-white/5 cursor-pointer">
                {item.btn} <ArrowRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          </div>
        ))}

        {/* Total Potential Bar */}
        <div className="flex items-center justify-between bg-[#1A2E2A] p-5 rounded-xl border border-[#23443B] mt-6">
          <span className="text-sm font-medium text-gray-300">
            Potential score with all improvements
          </span>
          <div className="flex items-center gap-3 text-lg font-bold text-[#EAB308]">
            87 <ArrowRight className="w-4 h-4 text-gray-400" /> 99/100
          </div>
        </div>
      </div>
    </div>
  );
}
