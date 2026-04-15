// const actions = [
//   "View Profile",
//   "Share Profile",
//   "Testimonials",
//   "Add Intro Video",
//   "Download QR",
// ];

// export default function QuickActions() {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//       {actions.map((action, i) => (
//         <button
//           key={i}
//           className="bg-white p-4 rounded-xl text-sm shadow-sm hover:bg-gray-50"
//         >
//           {action}
//         </button>
//       ))}
//     </div>
//   );
// }


import { Eye, Share2, MessageSquare, Film, SmartphoneNfc } from "lucide-react";

const actions = [
  { label: "View Profile", icon: Eye },
  { label: "Share Profile", icon: Share2 },
  { label: "Testimonials", icon: MessageSquare },
  { label: "Add Intro Video", icon: Film },
  { label: "Download QR", icon: SmartphoneNfc },
];

export default function QuickActions() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900 text-lg">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              className="bg-white py-6 px-4 rounded-2xl shadow-sm border border-gray-100 hover:border-[#124B48] hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group"
            >
              <Icon className="w-6 h-6 text-gray-700 group-hover:text-[#124B48] transition-colors" strokeWidth={1.5} />
              <span className="text-xs font-bold text-gray-800">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}