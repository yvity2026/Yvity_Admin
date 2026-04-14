// const stats = [
//   { label: "Profile Views", value: "1,247", growth: "+12%" },
//   { label: "Testimonials", value: "50", growth: "+3" },
//   { label: "Recommendations", value: "32", growth: "+2" },
//   { label: "Profile Shares", value: "156", growth: "+8%" },
// ];

// export default function StatsCards() {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {stats.map((item, i) => (
//         <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
//           <p className="text-xl font-semibold">{item.value}</p>
//           <p className="text-sm text-gray-500">{item.label}</p>
//           <span className="text-green-600 text-xs">{item.growth}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

import { Eye, MessageSquare, ThumbsUp, Share } from "lucide-react";

const stats = [
  { label: "Profile Views", value: "1,247", growth: "12%", icon: Eye, type: "percent" },
  { label: "Testimonials", value: "50", growth: "3", icon: MessageSquare, type: "number" },
  { label: "Recommendations", value: "32", growth: "2", icon: ThumbsUp, type: "number" },
  { label: "Profile Shares", value: "156", growth: "8%", icon: Share, type: "percent" },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full">
            <div className="mb-4">
              <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            </div>
            
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-gray-900">{item.value}</span>
              <span className="flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full text-xs font-semibold mb-1.5">
                ↑ {item.growth}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}