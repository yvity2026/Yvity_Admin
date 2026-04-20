export default function JourneyTimelineItem({
  entry,
  themeColor,
  textColor,
  isLast,
  onEditClick,
  onDeleteClick,
  showActions,
}) {
  return (
    <div className="relative pl-6 sm:pl-8">
      {/* Timeline Dot */}
      <div
        className={`absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-[#0A4A4A] border-4 border-[#A6CECE] shadow-sm`}
      />

      {/* Content Card */}
      <div className="bg-[#F0F8F8] border border-[#DADEDE] rounded-xl p-5 ">
        {/* Top Section: Period and Actions separated from the rest */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[clamp(8px,1vw,12px)] font-bold text-[#065F46] tracking-wider uppercase">
            {entry.period}
          </span>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center gap-2">
              <button
                onClick={onEditClick}
                className="px-4 py-1.5 bg-white border border-[#D5D5D5] rounded-md text-[clamp(8px,1vw,12px)] font-bold text-[#0A4A4A] hover:border-gray-300 transition-all cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={onDeleteClick}
                className="px-4 py-1.5 bg-white border border-[#F7C6C6] rounded-md text-[clamp(8px,1vw,12px)] font-bold text-[#D32323] hover:border-red-200 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
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
