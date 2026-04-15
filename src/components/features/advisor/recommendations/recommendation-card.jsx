import { BadgeCheck } from "lucide-react";

export default function RecommendationCard({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col sm:flex-row p-5 gap-5 hover:shadow-md transition-shadow">
      {/* Left Thick Border Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#124B48]" />

      <div className="w-12 h-12 rounded-full bg-[#124B48] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 ml-2">
        {data.initials}
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">{data.name}</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
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
              className="flex items-center gap-1.5 bg-[#F0F7F6] text-[#124B48] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide"
            >
              <span>{tag.icon}</span>
              {tag.label}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-medium w-1/3">
            {data.date}
          </span>

          <span className="text-xs font-bold text-[#1E7145] text-center w-1/3">
            {data.pointsAdded}
          </span>

          <div className="w-1/3 flex justify-end">
            <button className="bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-xs font-bold transition-colors">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
