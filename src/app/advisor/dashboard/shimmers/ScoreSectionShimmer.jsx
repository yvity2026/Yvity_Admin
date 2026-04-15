export default function ScoreSectionShimmer() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col animate-pulse h-[236px]">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-100 rounded"></div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
        {/* Circular Progress Shimmer */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center rounded-full border-[10px] border-gray-100">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="h-8 w-12 bg-gray-200 rounded"></div>
            <div className="h-3 w-8 bg-gray-100 rounded mt-1"></div>
          </div>
        </div>

        {/* Linear Progress Bars Shimmer */}
        <div className="flex-1 w-full space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-2 w-28 flex-shrink-0">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-100 rounded"></div>
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full"></div>
              <div className="w-12 flex-shrink-0 flex justify-end">
                <div className="h-4 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}