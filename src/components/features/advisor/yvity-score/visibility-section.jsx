import { Eye, CheckCircle2, Globe, Share, RefreshCw, Zap } from "lucide-react";
import { SectionWrapper, ProgressRow, InfoBox } from "./score-components";

export default function VisibilitySection() {
  return (
    <SectionWrapper title="Visibility" icon={Eye} score={25} max={30}>

      {/* 1. Public Profile Active */}
      <ProgressRow
        label="Public Profile Active"
        icon={<Globe className="w-5 h-5 text-blue-500" />}
        score={10}
        max={10}
        colorClass="bg-[#0A4A4A]"
        textClass="text-[#0A4A4A]"
      />

      {/* 2. Profile Sharing (self) */}
      <ProgressRow
        label="Profile Sharing (self)"
        icon={<Share className="w-5 h-5 text-gray-700" />}
        score={3}
        max={5}
        colorClass="bg-[#F59E0B]"
        textClass="text-[#F59E0B]"
      />
      <InfoBox className="ml-8 mt-3 mb-7">
        <div className="flex justify-between w-full items-start">
          <div>
            <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]"></div>
                <span>Every 5 shares → 1 point</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]"></div>
                <span>25 total shares → 5 points</span>
              </li>
            </ul>
            <div className="text-[clamp(8px,1vw,12px)] text-[#6B7280] mt-1.5 ml-3 font-normal">
              Share your profile 10 more times to earn full 5 points
            </div>
          </div>
          <div className="text-right text-[13px] font-bold text-[#0A4A4A] flex flex-col gap-1 ">
            <div>Max : 5 pts</div>
            <div>Current : 15 shares</div>
          </div>
        </div>
      </InfoBox>

      {/* 3. Profile Sharing (client) */}
      <ProgressRow
        label="Profile Sharing (client)"
        icon={<RefreshCw className="w-5 h-5 text-purple-500" />}
        score={2}
        max={5}
        colorClass="bg-[#F59E0B]"
        textClass="text-[#F59E0B]"
      />
      <InfoBox className="ml-8 mt-3 mb-7">
        <div className="flex justify-between items-start w-full">
          <div>
            <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]"></div>
                <span>Every user share → 1 point</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]"></div>
                <span>Current : 2 users shared your profile</span>
              </li>
            </ul>
            <div className="text-[clamp(8px,1vw,12px)] text-[#6B7280] mt-1.5 ml-3 font-normal">
              Encourage clients to share your profile link to earn more points
            </div>
          </div>
          <div className="text-right text-[13px] font-bold text-[#0A4A4A] flex flex-col gap-1">
            <div>Max : 5 pts</div>
            <div>+3 more needed</div>
          </div>
        </div>
      </InfoBox>

      {/* 4. Profile Strength */}
      <ProgressRow
        label="Profile Strength"
        icon={<span className="text-[18px]">💪</span>}
        score={5}
        max={5}
        colorClass="bg-[#0A4A4A]"
        textClass="text-[#0A4A4A]"
      />
      <InfoBox className="ml-8 mt-3 mb-7">
        <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-2.5 font-medium w-full">
          {[
            "Professional Journey added",
            "Services added",
            "Achievements added",
            "Gallery photos added",
            "Testimonials received",
          ].map((item, i) => (
            <li key={i} className="flex justify-between items-center pr-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]"></div>
                <span>{item}</span>
              </div>
              <span className="flex items-center gap-1.5 text-[#0A4A4A] font-bold">
                <CheckCircle2 className="w-[18px] h-[18px] text-[#0A4A4A]" /> 1 pt
              </span>
            </li>
          ))}
        </ul>
      </InfoBox>

      {/* 5. Activity */}
      <ProgressRow
        label="Activity"
        icon={<Zap className="w-5 h-5 fill-orange-500 text-orange-500" />}
        score={5}
        max={5}
        colorClass="bg-[#0A4A4A]"
        textClass="text-[#0A4A4A]"
      />
      <InfoBox className="ml-8 mt-3 mb-2">
        <div className="flex justify-between items-start pr-1 w-full">
          <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-1.5 font-medium">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]"></div>
              <span>Each active day → 1 point</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]"></div>
              <span>Active last 6 of 7 days</span>
            </li>
          </ul>
          <div className="text-right text-[13px] font-bold text-[#0A4A4A] flex flex-col gap-1">
            <div>Max : 5 pts</div>
            <div className="flex items-center gap-1.5 justify-end">
              <CheckCircle2 className="w-[18px] h-[18px]" /> Full score
            </div>
          </div>
        </div>
      </InfoBox>

    </SectionWrapper>
  );
}