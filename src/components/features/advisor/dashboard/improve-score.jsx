import { ArrowRight } from "lucide-react";

export default function ImproveScore() {
  const items = [
    { icon: "🎥", title: "Add 1 Video testimonial", pts: "+3 pts" },
    { icon: "👍", title: "Get 2 more recommendations", pts: "+4 pts" },
    { icon: "🎬", title: "Add intro video", pts: "+2 pts" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
        💡 Improve Your Score
      </h3>

      <div className="space-y-3 flex-1">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-[#F8F9FA] p-3.5 rounded-xl border border-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium text-gray-700">
                {item.title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[#2E7D32]">
                {item.pts}
              </span>
              <button className="bg-[#124B48] hover:bg-[#0a2e2c] transition-colors text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                Add <ArrowRight className="w-3.5 h-3.5 text-[#EAB308]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
