export default function JourneyTimelineItem({ entry, themeColor, textColor, isLast, onEditClick, onDeleteClick }) {
  return (
    <div className="relative pl-6 sm:pl-8">
      {/* Timeline Dot */}
      <div className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full ${themeColor} border-4 border-white shadow-sm`} />

      {/* Content Card */}
      <div className="bg-[#F8FBFA] border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">

        {/* Top Section: Period and Actions separated from the rest */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[clamp(8px,1vw,12px)] font-bold text-[#065F46] tracking-wider uppercase">
            {entry.period}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onEditClick}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-md text-[clamp(8px,1vw,12px)] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
            >
              Edit
            </button>
            <button 
              onClick={onDeleteClick}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-md text-[clamp(8px,1vw,12px)] font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Bottom Section: Title, Subtitle, Description taking full width */}
        <div className="space-y-1.5">
          <h3 className="text-[clamp(10px,1vw,14px)] font-bold text-[#111827]">
            {entry.title}
          </h3>
          <p className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium">
            {entry.subtitle}
          </p>

          {entry.description && (
            <p className="text-[clamp(10px,1vw,14px)] text-[#374151] mt-2 leading-relaxed max-w-2xl">
              {entry.description}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
