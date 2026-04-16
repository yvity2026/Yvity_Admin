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
      <h3 className="font-bold text-[#111827] text-[clamp(12px,1.5vw,16px)]">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 ">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              className="bg-white py-6 px-4 rounded-2xl hover:border-[#124B48] hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer border border-[#E2E1DC] shadow-none"
            >
              <Icon
                className="text-gray-700 group-hover:text-[#124B48] transition-colors"
                strokeWidth={1.5}
              />
              <span className="text-[clamp(8px,1vw,12px)] font-bold text-[#374151]">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
