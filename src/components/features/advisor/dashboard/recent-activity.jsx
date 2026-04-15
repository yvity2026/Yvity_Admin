import {
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon,
  Trophy,
} from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      title: "New Testimonial Received",
      subtext: "Ravi Shankar • ⭐⭐⭐⭐⭐ • Text",
      time: "10 mins ago",
      badge: "Pending Review",
      badgeColor: "bg-[#D1FAE5] text-[#065F46]",
      icon: MessageSquare,
      iconBg: "bg-[#D1FAE5]",
      iconColor: "text-[#059669]",
    },
    {
      title: "Recommendation Received",
      subtext: "Priya Devi • Verified",
      time: "2 hours ago",
      badge: "+2 pts",
      badgeColor: "bg-[#FEF3C7] text-[#B45309]",
      icon: ThumbsUp,
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
    },
    {
      title: "Gallery Photo Added",
      subtext: "Team meeting photo",
      time: "Yesterday",
      badge: "+1 pt",
      badgeColor: "bg-[#D1FAE5] text-[#065F46]",
      icon: ImageIcon,
      iconBg: "bg-[#FFEDD5]",
      iconColor: "text-[#EA580C]",
    },
    {
      title: "Achievement Added",
      subtext: "MDRT 2024 Qualification",
      time: "3 days ago",
      badge: "+2 pts",
      badgeColor: "bg-[#FEF3C7] text-[#B45309]",
      icon: Trophy,
      iconBg: "bg-[#FEF08A]",
      iconColor: "text-[#CA8A04]",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
        <span className="text-xl">🕒</span> Recent Activity
      </h3>

      <div className="relative pl-4 border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
        {activities.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="relative">
              <div
                className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full ${item.iconBg} flex items-center justify-center border-4 border-white`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
              </div>

              <div className="pl-2">
                <h4 className="text-sm font-bold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {item.subtext}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-gray-400 font-medium">
                    {item.time}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
