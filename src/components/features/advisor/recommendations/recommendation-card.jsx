import { BadgeCheck } from "lucide-react";

export default function RecommendationCard({ data }) {
  return (
    <div className=" rounded-2xl border border-gray-100 overflow-hidden relative flex flex-col sm:flex-row p-5 gap-5 hover:shadow-md transition-shadow  border-l-4 border-l-[var(--gradients-hover-state,#0D6060)] bg-white shadow-none">
      {/* Left Thick Border Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#124B48]" />

      <div className="w-12 h-12 rounded-full bg-[#124B48] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 ml-2">
        {data.name.split(" ")
                    .map((n) => n[0])
                    .join("")}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <div>
            <h3 className="text-[clamp(12px,1.5vw,16px)] font-bold text-[#111827]">{data.name}</h3>
            <p className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium mt-0.5">
              {data.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#E8F5E9] text-[#1E7145] px-3 py-1 rounded-full text-xs font-bold w-fit">
            <BadgeCheck className="w-3.5 h-3.5" />
            {data.status}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          {data.tags.map((tag, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-[#F0F7F6] text-[#0A4A4A] px-3 py-1.5 rounded-full text-[clamp(8px,1vw,12px)] font-bold tracking-wide"
            >
              <span>{tag.icon}</span>
              {tag.label}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto p-1 lg:pt-2 border-t border-gray-50">
          <span className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium w-1/3">
            {data.date}
          </span>

          <span className="text-[clamp(8px,1vw,12px)] font-bold text-[#065F46] text-center w-1/3">
            {data.pointsAdded}
          </span>

          <div className="rounded-[6px] flex justify-end border border-[#D5D5D5]">
            <button className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
