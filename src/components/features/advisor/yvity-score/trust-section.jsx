import { Trophy } from "lucide-react";
import { SectionWrapper, ProgressRow, InfoBox } from "./score-components";
import { MdVerifiedUser } from "react-icons/md";

export default function TrustSection({ trust }) {
  const achievementLabel = trust.latestAchievement
    ? `${trust.latestAchievement.type} ${trust.latestAchievement.year}`
    : "No achievement added";

  return (
    <SectionWrapper title="Trust" icon={Trophy} score={trust.total} max={trust.max}>
      <ProgressRow
        label="Testimonials"
        icon="💬"
        score={trust.testimonials}
        max={15}
      />
      <div className="pl-8 pr-2 mt-3 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TestimonialBox
          icon="📝"
          title="Text"
          score={`${trust.testimonialBreakdown.text.points}/${trust.testimonialBreakdown.text.max}`}
          max="Max : 2 pts"
          status={
            trust.testimonialBreakdown.text.points === trust.testimonialBreakdown.text.max
              ? "Full score"
              : `+${trust.testimonialBreakdown.text.max - trust.testimonialBreakdown.text.points} pts available`
          }
          isFull={
            trust.testimonialBreakdown.text.points === trust.testimonialBreakdown.text.max
          }
          sub="1 text = 1 pt"
        />
        <TestimonialBox
          icon="🎵"
          title="Audio"
          score={`${trust.testimonialBreakdown.audio.points}/${trust.testimonialBreakdown.audio.max}`}
          max="Max : 4 pts"
          status={
            trust.testimonialBreakdown.audio.points === trust.testimonialBreakdown.audio.max
              ? "Full score"
              : `+${trust.testimonialBreakdown.audio.max - trust.testimonialBreakdown.audio.points} pts available`
          }
          isFull={
            trust.testimonialBreakdown.audio.points === trust.testimonialBreakdown.audio.max
          }
          sub="1 audio = 2 pts"
        />
        <TestimonialBox
          icon="🎥"
          title="Video"
          score={`${trust.testimonialBreakdown.video.points}/${trust.testimonialBreakdown.video.max}`}
          max="Max : 9 pts"
          status={
            trust.testimonialBreakdown.video.points === trust.testimonialBreakdown.video.max
              ? "Full score"
              : `+${trust.testimonialBreakdown.video.max - trust.testimonialBreakdown.video.points} pts available`
          }
          isFull={
            trust.testimonialBreakdown.video.points === trust.testimonialBreakdown.video.max
          }
          sub="1 video = 3 pts"
        />
      </div>

      <ProgressRow
        label="Recommendations"
        icon="👍"
        score={trust.recommendations}
        max={15}
      />
      <div className="pl-8 pr-2 mt-2 mb-4">
        <InfoBox>
          <div className="flex justify-between items-start text-sm w-full gap-4">
            <ul className="text-[#4B5563] space-y-2 font-medium list-disc ml-4">
              <li>Each recommendation -&gt; 2 points</li>
              <li>Current : {trust.recommendationCount} recommendations received</li>
            </ul>
            <div className="text-right font-bold text-[#0A7B61] shrink-0">
              <div>Max: 14 pts</div>
              <div>{trust.recommendationBasePoints}pts</div>
            </div>
          </div>
        </InfoBox>
      </div>

      <div className="pl-8 pr-2 space-y-3 mb-6">
        <div className="bg-[#F2F7F4] border border-[#D1E5D8] rounded-xl p-4">
          <h4 className="text-[clamp(10px,1vw,14px)] font-bold text-[#065F46] flex items-center gap-2 mb-1">
            🌟 Continuity Bonus
          </h4>
          <p className="text-[clamp(10px,1vw,14px)] text-[#374151] font-medium mb-2">
            Receive at least 1 recommendation every month, or within the last 6
            months, to earn <span className="font-bold">1 bonus point</span>.
          </p>
          <p className="text-[clamp(10px,1vw,14px)] font-bold text-[#065F46] flex items-center gap-1">
            <MdVerifiedUser className="w-3.5 h-3.5" />
            {trust.hasContinuityBonus
              ? "Currently active - bonus applied!"
              : "No recent recommendation yet - bonus not applied."}
          </p>
        </div>

        <div className="bg-[#FEF2F2] border border-[#DADEDE] rounded-[16px] p-4">
          <h4 className="text-[clamp(10px,1vw,14px)] font-bold text-[#C42F2F] flex items-center gap-2 mb-1">
            ⚠️ Negative Rule
          </h4>
          <p className="text-[clamp(10px,1vw,14px)] text-[#374151] font-medium leading-relaxed">
            If no recommendation is received in a month, 1 point can be lost
            until activity resumes. Keep collecting recommendations to protect
            your score.
          </p>
        </div>
      </div>

      <ProgressRow
        label="Achievements"
        icon="🎖️"
        score={trust.achievements}
        max={10}
      />
      <div className="pl-8 pr-2 mt-2">
        <InfoBox>
          <div className="flex justify-between items-center w-full font-medium text-[#374151]">
            <p className="text-[clamp(10px,1vw,14px)]">
              Latest year achievement considered
            </p>
            <p className="font-bold text-[#124B48]">Current : {achievementLabel}</p>
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

function TestimonialBox({ icon, title, score, max, status, isFull, sub }) {
  return (
    <div className="bg-[#F0F8F8] border border-[#DADEDE] rounded-[16px] p-4 text-center flex flex-col items-center justify-center">
      <span className="text-[clamp(10px,1vw,14px)] font-bold text-[#111827] flex items-center gap-1.5 mb-2">
        {icon} {title}
      </span>
      <span className="text-[clamp(14px,2vw,18px)] font-bold text-[#0A4A4A]">{score}</span>
      <span className="text-[clamp(10px,1vw,14px)] text-[#6B7280] font-medium mb-1">{max}</span>
      <span
        className={`text-[clamp(10px,1vw,14px)] font-bold flex items-center gap-1 ${
          isFull ? "text-[#065F46]" : "text-[#F59E0B]"
        }`}
      >
        {isFull && <MdVerifiedUser className="w-3.5 h-3.5" />} {status}
      </span>
      <span className="text-[clamp(10px,1vw,14px)] text-[#374151] mt-1">{sub}</span>
    </div>
  );
}

function AchievementBox({ icon, title, points, sub }) {
  return (
    <div className="bg-[#F0F8F8] border border-[#DADEDE] rounded-xl p-4 text-center flex flex-col items-center justify-center">
      <span className="mb-1">{icon}</span>
      <span className="text-[clamp(14px,2vw,18px)] font-bold text-[#374151]">{title}</span>
      <span className="text-[clamp(16px,2.5vw,20px)] font-bold text-[#F59E0B]">{points}</span>
      <span className="text-[clamp(10px,1vw,14px)] text-[#6B7280] mt-1 leading-tight">
        {sub}
      </span>
    </div>
  );
}
