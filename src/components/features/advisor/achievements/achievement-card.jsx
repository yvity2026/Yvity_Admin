export default function AchievementCard({ data }) {
  return (
    <div className="bg-white border-2 border-[#124B48] rounded-2xl p-6 flex items-start gap-5 hover:shadow-md transition-shadow">
      
      {/* Icon Container */}
      <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-2xl ${data.iconBg}`}>
        {data.icon}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {data.title}
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-snug mt-1 max-w-[90%]">
            {data.description}
          </p>
        </div>

        {/* Highlighted Date/Status */}
        <p className="text-xs font-bold text-[#124B48] tracking-wide">
          {data.highlightText}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3">
          <button className="px-4 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Edit
          </button>
          <button className="px-4 py-1.5 bg-red-50 border border-red-100 rounded-md text-xs font-bold text-red-500 hover:bg-red-100 hover:border-red-200 transition-all">
            Delete
          </button>
        </div>
      </div>
      
    </div>
  );
}