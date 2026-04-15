export default function JourneyTimelineItem({
  entry,
  themeColor,
  textColor,
  isLast,
}) {
  return (
    <div className="relative pl-6 sm:pl-8">
      <div
        className={`absolute -left-[9px] top-4 w-4 h-4 rounded-full ${themeColor} border-4 border-white shadow-sm`}
      />

      <div className="bg-[#F8FBFA] border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <span
              className={`text-xs font-bold ${textColor} tracking-wider uppercase`}
            >
              {entry.period}
            </span>
            <h3 className="text-base font-bold text-gray-900">{entry.title}</h3>
            <p className="text-sm text-gray-500 font-medium">
              {entry.subtitle}
            </p>

            {entry.description && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
                {entry.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
              Edit
            </button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-all">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
