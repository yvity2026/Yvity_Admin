import IdentitySection from "@/components/features/advisor/yvity-score/identity-section";
import ImproveScoreDark from "@/components/features/advisor/yvity-score/improve-score-dark";
import ScoreHero from "@/components/features/advisor/yvity-score/score-hero";
import TrustSection from "@/components/features/advisor/yvity-score/trust-section";
import VisibilitySection from "@/components/features/advisor/yvity-score/visibility-section";
import { getAdvisorScorePageData } from "@/lib/advisor-score/getAdvisorScorePageData";

export const dynamic = "force-dynamic";

export default async function YvityScorePage() {
  const scoreData = await getAdvisorScorePageData();

  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        {scoreData.isAuthenticated ? (
          <>
            <ScoreHero score={scoreData.score} />
            <IdentitySection identity={scoreData.identity} />
            <VisibilitySection visibility={scoreData.visibility} />
            <TrustSection trust={scoreData.trust} />
            <ImproveScoreDark
              improvements={scoreData.improvements}
              score={scoreData.score}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-[#E2E1DC] bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-[#111827]">YVITY Score</h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Sign in as an advisor to view your live score details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
