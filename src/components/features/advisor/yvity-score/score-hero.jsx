
import { BadgeCheck, Eye, Trophy } from "lucide-react";

export default function ScoreHero() {
  return (
    <div className="w-full rounded-[16px] bg-gradient-to-r from-[#094C4B] to-[#0A6A69] shadow-[0_0_2px_0_rgba(0,0,0,0.20)] p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
      
      {/* Circular Score & Text */}
      {/* Changed to flex-col on mobile/tablet, switching to row only on large screens (lg) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
        
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-white/20"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-white"
              strokeWidth="2.5"
              strokeDasharray="87, 100"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-white">
            <span className="text-3xl font-bold">87</span>
            <span className="text-[10px] font-medium border-t border-white/30 pt-0.5 mt-0.5 w-8 text-center opacity-80">
              /100
            </span>
          </div>
        </div>

        <div className="text-white">
          <h2 className="text-[#F8F6F1] text-[clamp(16px,2.5vw,20px)] font-bold">YVITY Score</h2>
          <p className="text-[clamp(10px,1vw,14px)] opacity-80 mt-1 max-w-xs leading-relaxed text-[#E8F4F4]">
            Your professional trust score based on Identity, Visibility, and
            Credibility
          </p>
        </div>
      </div>

      {/* Mini Stat Cards - Unchanged as requested */}
      <div className="flex flex-wrap gap-3 md:justify-end">
        <HeroStatCard icon={BadgeCheck} score="28" max="30" label="Identity" />
        <HeroStatCard icon={Eye} score="26" max="30" label="Visibility" />
        <HeroStatCard icon={Trophy} score="33" max="40" label="Trust" />
      </div>
    </div>
  );
}

// Strictly JSX - No Types
function HeroStatCard({ icon: Icon, score, max, label }) {
  return (
    <div className="bg-white/10 rounded-xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 backdrop-blur-sm border border-white/10">
      <Icon className=" text-[#EAB308]" />
      <div className="text-[#F8F6F1]">
        <div className="text-[#F8F6F1] font-bold leading-tight text-[clamp(14px,2vw,18px)]">
          {score}
          <span className="text-[clamp(14px,2vw,18px)]">/{max}</span>
        </div>
        <div className="text-[#F8F6F1] text-[clamp(10px,1vw,14px)] font-medium">{label}</div>
      </div>
    </div>
  );
}