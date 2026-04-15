import { BadgeCheck, Eye, Trophy } from "lucide-react";

export default function ScoreHero() {
  return (
    <div className="bg-[#124B48] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-8 shadow-sm">
      {/* Circular Score */}
      <div className="flex items-center gap-6">
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
          <h2 className="text-2xl font-bold tracking-wide">YVITY Score</h2>
          <p className="text-sm opacity-80 mt-1 max-w-xs leading-relaxed">
            Your professional trust score based on Identity, Visibility, and
            Credibility
          </p>
        </div>
      </div>

      {/* Mini Stat Cards */}
      <div className="flex-1 flex flex-wrap gap-3 md:justify-end">
        <HeroStatCard icon={BadgeCheck} score="28" max="30" label="Identity" />
        <HeroStatCard icon={Eye} score="26" max="30" label="Visibility" />
        <HeroStatCard icon={Trophy} score="33" max="40" label="Trust" />
      </div>
    </div>
  );
}

function HeroStatCard({ icon: Icon, score, max, label }) {
  return (
    <div className="bg-white/10 rounded-xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 backdrop-blur-sm border border-white/10">
      <Icon className="w-5 h-5 text-[#EAB308]" />
      <div>
        <div className="text-white font-bold leading-tight text-lg">
          {score}
          <span className="text-sm opacity-70">/{max}</span>
        </div>
        <div className="text-white/80 text-xs font-medium">{label}</div>
      </div>
    </div>
  );
}
