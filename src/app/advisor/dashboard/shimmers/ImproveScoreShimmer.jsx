export default function  ImproveScoreShimmer() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="mb-6 flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-40 bg-gray-200 rounded"></div>
      </div>

      <div className="space-y-3 flex-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-[#F8F9FA] p-3.5 rounded-xl border border-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 sm:w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-4 w-10 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}