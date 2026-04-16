export default function Analytics() {
  const data = [
    { label: "Views", value: "1,247", width: "90%", color: "bg-[#124B48]" },
    { label: "Shares", value: "156", width: "75%", color: "bg-[#F59E0B]" },
    { label: "Contacts", value: "38", width: "40%", color: "bg-[#10B981]" },
    { label: "Saves", value: "24", width: "25%", color: "bg-[#4F46E5]" },
  ];

  return (
    <div className="bg-white px-6 pt-4 pb-4 rounded-2xl  flex flex-col border border-[#E2E1DC] shadow-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#111827] text-[clamp(12px,1.5vw,16px)]">Analytics</h3>
        <span className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium">Last 30 days</span>
      </div>

      <div className="space-y-1 mt-2 flex-1 justify-center flex flex-col">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3 mb-2">
            <span className="text-[clamp(8px,1vw,12px)] text-[#6B7280] font-medium w-16 flex-shrink-0">
              {item.label}
            </span>
            <div className="flex-1 h-2 bg-[#E8F4F4] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: item.width }}
              />
            </div>
            <span className="text-[clamp(10px,1vw,14px)] font-bold text-[#374151] w-10 text-right flex-shrink-0">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
