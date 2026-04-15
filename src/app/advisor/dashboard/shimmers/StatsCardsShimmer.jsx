export default function StatsCardsShimmer() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-[134px] animate-pulse">
          <div className="mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          
          <div className="flex items-end gap-3 mb-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-12 bg-gray-100 rounded-full mb-1.5"></div>
          </div>
          <div className="h-4 w-24 bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}