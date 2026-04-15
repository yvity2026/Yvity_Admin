export default function ProfileProgressShimmer() {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0"></div>
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-100 rounded"></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-6 w-full md:w-auto">
        <div className="w-full sm:w-64">
          <div className="flex justify-between items-baseline mb-2">
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
            <div className="h-3 w-12 bg-gray-100 rounded"></div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full"></div>
        </div>
        <div className="bg-gray-200 h-10 w-32 rounded-lg shrink-0"></div>
      </div>
    </div>
  );
}