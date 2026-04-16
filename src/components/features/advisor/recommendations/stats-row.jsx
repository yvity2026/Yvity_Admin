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
    <div className="rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-[#E2E1DC] bg-white shadow-none">
      <span className={`text-[clamp(20px,3.5vw,28px)] font-bold ${valueColor}`}>{value}</span>
      <span className="text-[clamp(12px,1.5vw,16px)] font-medium text-gray-500 mt-1">{label}</span>
    </div>
  );
}
