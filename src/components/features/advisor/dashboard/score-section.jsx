import { ArrowRight, BadgeCheck, Eye, Trophy } from "lucide-react";

export default function ScoreSection() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900 text-lg">YVITY Score</h3>
        <button className="text-[#124B48] text-sm font-semibold flex items-center gap-1 hover:underline">
          View Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 flex-1">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            {/* Background Circle */}
            <path
              className="text-gray-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress Circle */}
            <path
              className="text-[#124B48]"
              strokeWidth="3"
              strokeDasharray="87, 100"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#124B48]">87</span>
            <span className="text-xs text-gray-500 font-medium border-t border-gray-200 pt-0.5 mt-0.5 w-8 text-center">
              100
            </span>
          </div>
        </div>

        {/* Linear Progress Bars */}
        <div className="flex-1 w-full space-y-5">
          <ProgressRow
            icon={BadgeCheck}
            label="Identity"
            value={28}
            max={30}
            color="bg-[#124B48]"
          />
          <ProgressRow
            icon={Eye}
            label="Visibility"
            value={26}
            max={30}
            color="bg-[#F59E0B]"
          />
          <ProgressRow
            icon={Trophy}
            label="Trust"
            value={33}
            max={30}
            color="bg-[#124B48]"
          />
        </div>
      </div>
    </div>
  );
}

// Strictly JSX - No Types
function ProgressRow({ icon: Icon, label, value, max, color }) {
  const percentage = (value / max) * 100;
  const displayPercentage = value > max ? 100 : percentage;

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-2 w-28 flex-shrink-0 text-sm text-gray-600 font-medium">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      <div className="w-12 text-right flex-shrink-0 text-sm font-bold text-gray-900">
        {value}/{max}
      </div>
    </div>
  );
}
