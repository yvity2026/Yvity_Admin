export default function AnalyticsShimmer() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col animate-pulse h-[236px]">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-20 bg-gray-100 rounded"></div>
      </div>

      <div className="space-y-6 mt-2 flex-1 justify-center flex flex-col">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-16 flex-shrink-0">
              <div className="h-4 w-12 bg-gray-100 rounded"></div>
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full"></div>
            <div className="w-10 flex-shrink-0 flex justify-end">
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}