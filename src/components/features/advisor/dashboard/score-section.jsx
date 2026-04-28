"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, Eye, Trophy } from "lucide-react";

const DEFAULT_SCORE = {
  total: 0,
  max: 100,
  identity: 0,
  visibility: 0,
  trust: 0,
};

function getCircleProgress(score, max) {
  if (!max) return "0, 100";
  return `${Math.max(0, Math.min((score / max) * 100, 100))}, 100`;
}

export default function ScoreSection() {
  const router = useRouter();
  const [score, setScore] = useState(DEFAULT_SCORE);

  useEffect(() => {
    let isMounted = true;

    async function fetchScoreSummary() {
      try {
        const response = await fetch("/api/advisor/yvity-score-summary", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result?.success || !isMounted) {
          return;
        }

        setScore({
          total: result.data?.total ?? 0,
          max: result.data?.max ?? 100,
          identity: result.data?.identity ?? 0,
          visibility: result.data?.visibility ?? 0,
          trust: result.data?.trust ?? 0,
        });
      } catch (error) {
        console.error("Failed to load YVITY score summary:", error);
      }
    }

    fetchScoreSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white px-6 pt-4 pb-4 rounded-2xl border border-red flex flex-col border-[#E2E1DC] shadow-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#111827] text-[clamp(12px,1.5vw,16px)]">
          YVITY Score
        </h3>
        <button
          className="text-[#124B48] text-[clamp(8px,1vw,12px)] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          onClick={() => router.push("/advisor/yvity-score")}
        >
          View Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-20 h-20 md:w-26 md:h-26 xl:w-32 xl:h-32 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-gray-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#124B48]"
              strokeWidth="3"
              strokeDasharray={getCircleProgress(score.total, score.max)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[clamp(18px,3vw,24px)] font-bold text-[#0A4A4A]">
              
              {score.total}
            </span>
            <span className="text-[clamp(12px,1.5vw,16px)] text-[#6B7280] font-medium border-gray-200 pt-0.5 mt-0.5 w-8 text-center">
              /{score.max}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-5">
          <ProgressRow
            icon={BadgeCheck}
            label="Identity"
            value={score.identity}
            max={30}
            color="bg-[#0A4A4A]"
          />
          <ProgressRow
            icon={Eye}
            label="Visibility"
            value={score.visibility}
            max={30}
            color="bg-[#F59E0B]"
          />
          <ProgressRow
            icon={Trophy}
            label="Trust"
            value={score.trust}
            max={40}
            color="bg-[#0A4A4A]"
          />
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ icon: Icon, label, value, max, color }) {
  const percentage = (value / max) * 100;
  const displayPercentage = value > max ? 100 : percentage;

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-2 w-28 flex-shrink-0 text-sm text-gray-600 font-medium">
        <Icon className="w-4 h-4" />
        <span className="text-[#6B7280] text-[clamp(8px,1vw,12px)]">
          {label}
        </span>
      </div>
      <div className="flex-1 h-2 bg-[#E8F4F4] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      <div className="w-12 text-right flex-shrink-0 text-sm font-bold text-[#0A4A4A]">
        {value}/{max}
      </div>
    </div>
  );
}
