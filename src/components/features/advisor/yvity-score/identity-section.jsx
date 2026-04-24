import { IdCard } from "lucide-react";
import { InfoBox, ProgressRow, SectionWrapper } from "./score-components";

export default function IdentitySection({ identity }) {
  return (
    <SectionWrapper
      title="Identity"
      icon={IdCard}
      score={identity.total}
      max={identity.max}
    >
      <ProgressRow
        label="Selfie Verification"
        icon="🤳"
        score={identity.selfie}
        max={10}
      />
      <ProgressRow
        label="Mobile Verification"
        icon="📱"
        score={identity.mobile}
        max={5}
      />
      <ProgressRow
        label="IRDAI License"
        icon="🏛️"
        score={identity.irda}
        max={5}
      />
      <ProgressRow
        label="Intro Video"
        icon="🎥"
        score={identity.introVideo}
        max={10}
      />

      {identity.missingIntroVideoPoints > 0 && (
        <div className="pl-8 pr-2 mt-4">
          <InfoBox
            title="Add intro video to earn full points"
            subtitle="Upload a short intro video on your profile to unlock the remaining identity score."
            badge={`+${identity.missingIntroVideoPoints} pts available`}
          />
        </div>
      )}
    </SectionWrapper>
  );
}
