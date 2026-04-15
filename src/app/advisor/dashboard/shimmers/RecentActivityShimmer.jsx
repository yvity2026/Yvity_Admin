export default function RecentActivityShimmer() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
      <div className="mb-6 flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-36 bg-gray-200 rounded"></div>
      </div>

      <div className="relative pl-4 border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative">
            {/* Timeline Node Shimmer */}
            <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-gray-200 border-4 border-white"></div>

            <div className="pl-2">
              <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-32 bg-gray-100 rounded mb-3"></div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-16 bg-gray-100 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}