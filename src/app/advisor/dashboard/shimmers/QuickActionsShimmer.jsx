export default function QuickActionsShimmer() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white py-6 px-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-3 w-20 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}