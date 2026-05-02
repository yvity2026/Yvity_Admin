import { ArrowRight } from "lucide-react";

export default function ImproveScore() {
  const items = [
    { icon: "🎥", title: "Add 1 Video testimonial", pts: "+3 pts" },
    { icon: "👍", title: "Get 2 more recommendations", pts: "+4 pts" },
    { icon: "🎬", title: "Add intro video", pts: "+2 pts" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-bold text-[#111827] text-[clamp(12px,1.5vw,16px)] mb-6 flex items-center gap-2">
        💡 Improve Your Score
      </h3>

      <div className="space-y-3 flex-1">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3.5 rounded-xl border border-[#E2E1DC] bg-[#F7F6F1] shadow-none"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[clamp(12px,1.5vw,16px)] font-medium text-[#374151]">
                {item.title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[clamp(10px,1vw,14px)] font-bold text-[#2E7D32]">
                {item.pts}
              </span>
              <button className="bg-[#0A4A4A] hover:bg-[#076868] hover:shadow-[0_0_8px_2px_rgba(13,96,96,0.25)] transition-colors text-[#F59E0B] px-4 py-2 rounded-lg text-[clamp(10px,1vw,14px)] font-semibold flex items-center gap-1.5 cursor-pointer">
                Add <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
