export default function StatsRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard value="32" label="Total" />
      <StatCard value="2" label="Pending" valueColor="text-[#F59E0B]" />
      <StatCard value="30" label="Verified" />
      <StatCard value="11" label="Score pts" />
    </div>
  );
}

function StatCard({ value, label, valueColor = "text-gray-900" }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
      <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
      <span className="text-sm font-medium text-gray-500 mt-1">{label}</span>
    </div>
  );
}
