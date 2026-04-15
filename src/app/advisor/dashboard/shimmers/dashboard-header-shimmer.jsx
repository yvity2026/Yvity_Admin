export default function DashboardHeaderShimmer() {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-gray-200 w-full sticky top-0 z-10 animate-pulse">
      {/* Page Title Shimmer */}
      <div className="w-32 h-7 bg-gray-200 rounded"></div>

      {/* Right Side Actions Shimmer */}
      <div className="flex items-center gap-4">
        {/* Notification Bell Shimmer */}
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>

        {/* User Avatar Shimmer */}
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      </div>
    </div>
  );
}