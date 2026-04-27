import {
  CheckCircle2,
  Circle,
  Eye,
  Globe,
  RefreshCw,
  Share,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { InfoBox, ProgressRow, SectionWrapper } from "./score-components";

const DEFAULT_PROFILE_STRENGTH_CHECKS = [
  { label: "Professional journey added", complete: false },
  { label: "Services added", complete: false },
  { label: "Achievements added", complete: false },
  { label: "Testimonials received", complete: false },
  { label: "Gallery photos added", complete: false },
];

export default function VisibilitySection({ visibility }) {
  const hasFullActivityScore = visibility.loginActivity >= 5;
  const profileStrengthChecks =
    visibility.profileStrengthChecks?.length > 0
      ? visibility.profileStrengthChecks
      : DEFAULT_PROFILE_STRENGTH_CHECKS;

  return (
    <SectionWrapper
      title="Visibility"
      icon={Eye}
      score={visibility.total}
      max={visibility.max}
    >
      <ProgressRow
        label="Public Profile Active"
        icon={<Globe className="w-5 h-5 text-blue-500" />}
        score={visibility.publicProfile}
        max={10}
      />

      <ProgressRow
        label="Profile Sharing (self)"
        icon={<Share className="w-5 h-5 text-gray-700" />}
        score={visibility.selfShare}
        max={5}
      />
      <InfoBox className="mt-3 mb-7">
        <div className="flex justify-between w-full items-start">
          <div>
            <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
                <span>Every 5 shares -&gt; 1 point</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
                <span>25 total shares -&gt; 5 points</span>
              </li>
            </ul>
            <div className="text-[clamp(8px,1vw,12px)] text-[#6B7280] mt-1.5 ml-3 font-normal">
              Share your profile {visibility.remainingSelfShares} more time
              {visibility.remainingSelfShares === 1 ? "" : "s"} to earn full
              score.
            </div>
          </div>
          <div className="text-right text-[13px] font-bold text-[#0A4A4A] flex flex-col gap-1">
            <div>Max : 5 pts</div>
            <div>Current : {visibility.selfShareCount} shares</div>
          </div>
        </div>
      </InfoBox>

      <ProgressRow
        label="Profile Sharing (client)"
        icon={<RefreshCw className="w-5 h-5 text-purple-500" />}
        score={visibility.clientShare}
        max={5}
      />
      <InfoBox className=" mt-3 mb-7">
        <div className="flex justify-between items-start w-full">
          <div>
            <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
                <span>Every user share -&gt; 1 point</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
                <span>
                  Current : {visibility.clientShareCount} users shared your
                  profile
                </span>
              </li>
            </ul>
            <div className="text-[clamp(8px,1vw,12px)] text-[#6B7280] mt-1.5 ml-3 font-normal">
              Encourage clients to share your profile link to earn more points.
            </div>
          </div>
          <div className="text-right text-[13px] font-bold text-[#0A4A4A] flex flex-col gap-1">
            <div>Max : 5 pts</div>
            <div>+{visibility.remainingClientShares} more needed</div>
          </div>
        </div>
      </InfoBox>

      <ProgressRow
        label="Profile Strength"
        icon={<span className="text-[18px]">💪</span>}
        score={visibility.profileStrength}
        max={5}
      />
      <InfoBox className=" mt-3 mb-7">
        <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-2.5 font-medium w-full">
          {profileStrengthChecks.map((item) => (
            <li key={item.label} className="flex justify-between items-center pr-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
                <span>{item.label}</span>
              </div>
              <span className="flex items-center gap-1.5 text-[#0A4A4A] font-bold">
                {item.complete ? (
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#0A4A4A]" />
                ) : (
                  <Circle className="w-[18px] h-[18px] text-[#9CA3AF]" />
                )}
                1 pt
              </span>
            </li>
          ))}
        </ul>
      </InfoBox>

      <ProgressRow
        label="Activity"
        icon={<Zap className="w-5 h-5 fill-orange-500 text-orange-500" />}
        score={visibility.loginActivity}
        max={5}
      />
      <InfoBox className=" mt-3 mb-2">
        <div className="flex justify-between items-start pr-1 w-full">
          <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] space-y-1.5 font-medium">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
              <span className="flex items-center gap-1.5">
                <span>Each active day</span>
                <FaArrowRight className="w-3 h-3" />
                <span>1 point</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A4A4A]" />
              <span>Active {visibility.activeDays} day{visibility.activeDays === 1 ? "" : "s"} this month</span>
            </li>
          </ul>
          <div className="text-right text-[13px] font-bold text-[#0A4A4A] flex flex-col gap-1">
            <div>Max : 5 pts</div>
            {hasFullActivityScore ? (
              <div className="flex items-center gap-1.5 justify-end">
                <ShieldCheck className="w-[18px] h-[18px] text-[#0A7B61]" />{" "}
                Full score
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </InfoBox>
      <div className="bg-[#FEF2F2] border border-[#DADEDE] rounded-[16px] p-4 mt-6">
        <h4 className="text-[clamp(10px,1vw,14px)] font-bold text-[#C42F2F] flex items-center gap-2 mb-3">
          ⚠️ Negative Rule
        </h4>

        <ul className="text-[clamp(10px,1vw,14px)] text-[#374151] font-medium leading-relaxed list-disc pl-5 space-y-3">
          <li>
            <strong>Profile Views:</strong> Every 5 unique views = 1 pt (Max: 10
            pts). <br />
            <span className="text-[#C42F2F]">Decay:</span> 0 views in a month
            results in -1 pt/month (Max: -10 pts).
          </li>
          <li>
            <strong>Self-Share:</strong> Every 5 shares = 1 pt (Max: 5 pts).{" "}
            <br />
            <span className="text-[#C42F2F]">Decay:</span> &lt; 5 shares/month
            results in -1 pt/month (Max: -5 pts).
          </li>
          <li>
            <strong>Others-Share:</strong> 1 logged-in customer share = 1 pt
            (Max: 5 pts). <br />
            <span className="text-[#C42F2F]">Decay:</span> 0 customer
            shares/month results in -1 pt/month (Max: -5 pts).
          </li>
          <li>
            <strong>Login Activity:</strong> 5 logins in a month = 5 pts (Max: 5
            pts). <br />
            <span className="text-[#C42F2F]">Decay:</span> 0 logins in a month
            results in -1 pt/month (Max: -5 pts).
          </li>
        </ul>
      </div>
    </SectionWrapper>
  );
}
