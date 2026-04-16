import PageHeader from "@/components/features/advisor/professional-journey/page-header";
import IdentitySection from "@/components/features/advisor/yvity-score/identity-section";
import ImproveScoreDark from "@/components/features/advisor/yvity-score/improve-score-dark";
import ScoreHero from "@/components/features/advisor/yvity-score/score-hero";
import TrustSection from "@/components/features/advisor/yvity-score/trust-section";
import VisibilitySection from "@/components/features/advisor/yvity-score/visibility-section";


export default function YvityScorePage() {
  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      {/* <PageHeader /> */}
      
      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12 ">
        <ScoreHero />
        <IdentitySection />
        <VisibilitySection />
        <TrustSection />
        <ImproveScoreDark />
      </div>
    </div>
  );
}