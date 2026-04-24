import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { BsLightbulbFill, BsStars } from "react-icons/bs";
import { FaThumbsUp } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { HiMiniGlobeAlt } from "react-icons/hi2";
import { MdGroups2, MdOutlineVideoCall } from "react-icons/md";
import { RiUserAddLine, RiVideoAddFill } from "react-icons/ri";

const IMPROVEMENT_META = {
  "video-testimonials": {
    icon: MdGroups2,
    iconClassName: "text-[#7DB7FF]",
  },
  recommendations: {
    icon: FaThumbsUp,
    iconClassName: "text-[#FFC533]",
  },
  "continuity-bonus": {
    icon: BsStars,
    iconClassName: "text-[#FFC533]",
  },
  "intro-video": {
    icon: RiVideoAddFill,
    iconClassName: "text-[#7C9CFF]",
  },
  "self-shares": {
    icon: FiShare,
    iconClassName: "text-[#F3F4F6]",
  },
  "client-shares": {
    icon: RiUserAddLine,
    iconClassName: "text-[#FFC533]",
  },
  "public-profile": {
    icon: HiMiniGlobeAlt,
    iconClassName: "text-[#FFC533]",
  },
  "all-done": {
    icon: CheckCircle2,
    iconClassName: "text-[#34D399]",
  },
};

export default function ImproveScoreDark({ improvements = [], score }) {
  const visibleImprovements = improvements.length
    ? improvements
    : [
        {
          key: "all-done",
          title: "Your profile already covers the current scoring inputs",
          points: 0,
          cta: "Done",
        },
      ];

  return (
    <div className="rounded-2xl p-6 md:p-8 border border-[#E2E1DC] bg-gradient-to-r from-[#091D26] to-[#0C2C3B] shadow-none">
      <h3 className="text-[#F8F6F1] font-bold text-[clamp(12px,1.5vw,16px)] mb-6 flex items-center gap-2">
        <BsLightbulbFill className="w-4 h-4 text-[#EAB308]" />
        Improve Your Score
      </h3>

      <div className="space-y-3">
        {visibleImprovements.map((item) => {
          const itemMeta = IMPROVEMENT_META[item.key] ?? {
            icon: MdOutlineVideoCall,
            iconClassName: "text-[#EAB308]",
          };
          const ItemIcon = itemMeta.icon;

          return (
            <div
              key={item.key}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#18303B] p-4 rounded-2xl border border-[#1A3344] gap-4 self-stretch"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 shrink-0">
                  <ItemIcon className={`w-4 h-4 ${itemMeta.iconClassName}`} />
                </span>
                <span className="text-[clamp(10px,1vw,14px)] font-medium text-[#F8F6F1]">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <span className="text-[clamp(10px,1vw,14px)] font-bold text-[#F59E0B]">
                  {item.points > 0 ? `+${item.points} pts` : "Complete"}
                </span>
                <button className="bg-white/10 hover:bg-white/20 transition-colors text-[#F8F6F1] px-4 py-2 rounded-lg text-[clamp(8px,1vw,12px)] font-medium flex items-center gap-1.5 border border-white/5 cursor-pointer">
                  {item.cta} <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between bg-[#1A2E2A] p-5 rounded-xl border border-[#23443B] mt-6">
          <span className="text-sm font-medium text-gray-300">
            Potential score with all improvements
          </span>
          <div className="flex items-center gap-3 text-lg font-bold text-[#EAB308]">
            {score.total}/{score.max}
          </div>
        </div>
      </div>
    </div>
  );
}
