export default function ProfileProgress() {
  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="text-3xl">💪</div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">
            Profile is 87% Complete
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Add intro video to reach 95% and earn +2 score points
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end gap-6 w-full md:w-auto">
        <div className="w-full sm:w-64">
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-bold text-gray-900">87%</span>
            <span className="text-xs font-medium text-gray-400">+8% to go</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="w-[87%] h-full bg-[#124B48] rounded-full" />
          </div>
        </div>
        <button className="bg-[#124B48] hover:bg-[#0a2e2c] transition-colors text-white px-6 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap">
          Complete Now
        </button>
      </div>
    </div>
  );
}
