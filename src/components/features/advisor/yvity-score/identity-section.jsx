import { IdCard } from "lucide-react";
import { SectionWrapper, ProgressRow, InfoBox } from "./score-components";

export default function IdentitySection() {
  return (
    <SectionWrapper title="Identity" icon={IdCard} score={28} max={30}>
      <ProgressRow label="Selfie Verification" icon="🤳" score={10} max={10} />
      <ProgressRow label="Mobile Verification" icon="📱" score={5} max={5} />
      <ProgressRow label="IRDAI License" icon="🏛️" score={5} max={5} />
      <ProgressRow label="Intro Video" icon="🎥" score={8} max={10} />
      
      <div className="pl-8 pr-2 mt-4">
        <InfoBox 
          title="Add intro video to earn full points" 
          subtitle="Upload a short intro video on your profile to earn maximum score"
          badge="+2 pts available"
        />
      </div>
    </SectionWrapper>
  );
}