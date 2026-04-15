import { Trophy, CheckCircle2 } from "lucide-react";
import { SectionWrapper, ProgressRow, InfoBox } from "./score-components";

export default function TrustSection() {
  return (
    <SectionWrapper title="Trust" icon={Trophy} score={33} max={40}>
      {/* Testimonials */}
      <ProgressRow label="Testimonials" icon="💬" score={12} max={15} />
      <div className="pl-8 pr-2 mt-3 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TestimonialBox
          icon="📝"
          title="Text"
          score="2/2"
          max="Max : 2 pts"
          status="Full score"
          isFull={true}
          sub="1 text = 1 pt"
        />
        <TestimonialBox
          icon="🎵"
          title="Audio"
          score="4/4"
          max="Max : 4 pts"
          status="Full score"
          isFull={true}
          sub="1 audio = 2 pts"
        />
        <TestimonialBox
          icon="🎥"
          title="Video"
          score="6/9"
          max="Max : 9 pts"
          status="+3 pts available"
          isFull={false}
          sub="1 video = 3 pts"
        />
      </div>

      {/* Recommendations */}
      <ProgressRow label="Recommendations" icon="👍" score={11} max={15} />
      <div className="pl-8 pr-2 mt-2 mb-4">
        <InfoBox>
          <div className="flex justify-between items-start text-sm">
            <ul className="text-gray-600 space-y-1 font-medium list-disc ml-4">
              <li>Each recommendation → 2 points</li>
              <li>Current : 5 recommendations received</li>
            </ul>
            <div className="text-right font-bold text-[#124B48]">
              <div>Max : 14 pts</div>
              <div>10pts</div>
            </div>
          </div>
        </InfoBox>
      </div>

      {/* Bonuses */}
      <div className="pl-8 pr-2 space-y-3 mb-6">
        <div className="bg-[#F2F7F4] border border-[#D1E5D8] rounded-xl p-4">
          <h4 className="text-sm font-bold text-[#1E7145] flex items-center gap-2 mb-1">
            🌟 Continuity Bonus
          </h4>
          <p className="text-xs text-gray-600 font-medium mb-2">
            Receive at least 1 recommendation every month (or within last 6
            months continuity) →{" "}
            <span className="font-bold">1 bonus point</span>
          </p>
          <p className="text-xs font-bold text-[#1E7145] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Currently active - bonus
            applied!
          </p>
        </div>

        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
          <h4 className="text-sm font-bold text-[#DC2626] flex items-center gap-2 mb-1">
            ⚠️ Negative Rule
          </h4>
          <p className="text-xs text-gray-600 font-medium leading-relaxed">
            If no recommendation received in a month →{" "}
            <span className="font-bold">-1 point</span> per month, continues
            until activity resumes.
            <br />
            Keep collecting recommendations to maintain your score!
          </p>
        </div>
      </div>

      {/* Achievements */}
      <ProgressRow label="Achievements" icon="🎖️" score={10} max={10} />
      <div className="pl-8 pr-2 mt-2">
        <InfoBox>
          <div className="flex justify-between text-sm font-medium text-gray-600">
            <span>• Latest year achievement considered</span>
            <span className="font-bold text-[#124B48]">
              Current : MDRT 2024
            </span>
          </div>
        </InfoBox>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AchievementBox
            icon="🏆"
            title="MDRT"
            points="2 pts / year"
            sub="Million Dollar Round Table"
          />
          <AchievementBox
            icon="🏅"
            title="COT"
            points="6 pts"
            sub="Court of the Table"
          />
          <AchievementBox
            icon="💎"
            title="TOT"
            points="10 pts"
            sub="Top of the Table"
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

// Sub-components specific to Trust
function TestimonialBox({ icon, title, score, max, status, isFull, sub }) {
  return (
    <div className="bg-[#F8FBFA] border border-gray-100 rounded-xl p-4 text-center flex flex-col items-center justify-center">
      <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5 mb-2">
        {icon} {title}
      </span>
      <span className="text-xl font-bold text-gray-900">{score}</span>
      <span className="text-xs text-gray-400 font-medium mb-1">{max}</span>
      <span
        className={`text-xs font-bold flex items-center gap-1 ${isFull ? "text-[#1E7145]" : "text-[#F59E0B]"}`}
      >
        {isFull && <CheckCircle2 className="w-3.5 h-3.5" />} {status}
      </span>
      <span className="text-[10px] text-gray-400 mt-1">{sub}</span>
    </div>
  );
}

function AchievementBox({ icon, title, points, sub }) {
  return (
    <div className="bg-[#F8FBFA] border border-gray-100 rounded-xl p-4 text-center flex flex-col items-center justify-center">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-sm font-bold text-gray-900">{title}</span>
      <span className="text-sm font-bold text-[#F59E0B]">{points}</span>
      <span className="text-[10px] text-gray-400 mt-1 leading-tight">
        {sub}
      </span>
    </div>
  );
}
