import { Eye, CheckCircle2 } from "lucide-react";
import { SectionWrapper, ProgressRow, InfoBox } from "./score-components";

export default function VisibilitySection() {
  return (
    <SectionWrapper title="Visibility" icon={Eye} score={26} max={30}>
      <ProgressRow label="Public Profile Active" icon="🌐" score={10} max={10} />
      
      <ProgressRow label="Profile Sharing (self)" icon="📤" score={3} max={5} />
      <div className="pl-8 pr-2 mt-2 mb-6">
        <InfoBox>
          <div className="flex justify-between items-start">
            <ul className="text-sm text-gray-600 space-y-1 font-medium list-disc ml-4">
              <li>Every 5 shares → 1 point</li>
              <li>25 total shares → 5 points</li>
              <li className="text-xs text-gray-400 list-none -ml-4 mt-1">Share your profile 10 more times to earn full 5 points</li>
            </ul>
            <div className="text-right text-sm font-bold text-[#124B48]">
              <div>Max : 5 pts</div>
              <div>Current : 15 shares</div>
            </div>
          </div>
        </InfoBox>
      </div>

      <ProgressRow label="Profile Sharing (client)" icon="🔄" score={2} max={5} />
      <div className="pl-8 pr-2 mt-2 mb-6">
        <InfoBox>
          <div className="flex justify-between items-start">
            <ul className="text-sm text-gray-600 space-y-1 font-medium list-disc ml-4">
              <li>Every user share → 1 point</li>
              <li>Current : 2 users shared your profile</li>
              <li className="text-xs text-gray-400 list-none -ml-4 mt-1">Encourage clients to share your profile link to earn more points</li>
            </ul>
            <div className="text-right text-sm font-bold text-[#1E7145]">
              <div>Max : 5 pts</div>
              <div>+3 more needed</div>
            </div>
          </div>
        </InfoBox>
      </div>

      <ProgressRow label="Profile Strength" icon="💪" score={5} max={5} />
      <div className="pl-8 pr-2 mt-2 mb-6">
        <InfoBox>
          <ul className="text-sm text-gray-600 space-y-2 font-medium">
            {['Professional Journey added', 'Services added', 'Achievements added', 'Gallery photos added', 'Testimonials received'].map((item, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>• {item}</span>
                <span className="flex items-center gap-1 text-[#1E7145] font-bold"><CheckCircle2 className="w-4 h-4" /> 1 pt</span>
              </li>
            ))}
          </ul>
        </InfoBox>
      </div>

      <ProgressRow label="Activity" icon="⚡" score={5} max={5} />
      <div className="pl-8 pr-2 mt-2">
        <InfoBox>
          <div className="flex justify-between items-start">
            <ul className="text-sm text-gray-600 space-y-1 font-medium list-disc ml-4">
              <li>Each active day → 1 point</li>
              <li>Active last 6 of 7 days</li>
            </ul>
            <div className="text-right text-sm font-bold text-[#1E7145]">
              <div>Max : 5 pts</div>
              <div className="flex items-center gap-1 justify-end"><CheckCircle2 className="w-4 h-4" /> Full score</div>
            </div>
          </div>
        </InfoBox>
      </div>
    </SectionWrapper>
  );
}