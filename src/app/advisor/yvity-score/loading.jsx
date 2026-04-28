import Skeleton from "@/app/components/skeleton/Skeleton";

function ScoreHeroSkeleton() {
  return (
    <div className="w-full rounded-[16px] bg-gradient-to-r from-[#094C4B] to-[#0A6A69] shadow-[0_0_2px_0_rgba(0,0,0,0.20)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
        <Skeleton className="h-28 w-28 rounded-full bg-white/15" />

        <div className="space-y-3">
          <Skeleton className="h-7 w-40 rounded-md bg-white/20" />
          <Skeleton className="h-4 w-64 rounded-md bg-white/15" />
          <Skeleton className="h-4 w-52 rounded-md bg-white/15" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 md:justify-end">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`hero-stat-skeleton-${index}`}
            className="bg-white/10 rounded-xl p-3 sm:px-4 sm:py-3 lg:px-6 flex items-center gap-3 backdrop-blur-sm border border-white/10 min-w-[132px]"
          >
            <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-16 rounded-md bg-white/20" />
              <Skeleton className="h-4 w-14 rounded-md bg-white/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreSectionSkeleton({ rows = 4, infoBoxes = 1, extraGrid = 0 }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
      <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-md" />
        </div>

        <div className="flex items-center gap-4 w-32 sm:w-48">
          <Skeleton className="flex-1 h-2.5 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={`score-row-skeleton-${index}`}
            className="flex items-center justify-between gap-4 p-2 px-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-44 rounded-md" />
            </div>

            <div className="flex items-center gap-3 w-28 sm:w-36">
              <Skeleton className="flex-1 h-1.5 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
          </div>
        ))}

        {Array.from({ length: infoBoxes }).map((_, index) => (
          <div
            key={`info-box-skeleton-${index}`}
            className="bg-[#F0F8F8] border border-[#DADEDE] rounded-[16px] p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
          >
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-56 rounded-md" />
              <Skeleton className="h-3 w-[90%] rounded-md" />
              <Skeleton className="h-3 w-[70%] rounded-md" />
            </div>
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
        ))}

        {extraGrid > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({ length: extraGrid }).map((_, index) => (
              <div
                key={`grid-card-skeleton-${index}`}
                className="bg-[#F0F8F8] border border-[#DADEDE] rounded-[16px] p-4 flex flex-col items-center justify-center"
              >
                <Skeleton className="h-5 w-12 rounded-md mb-2" />
                <Skeleton className="h-6 w-16 rounded-md mb-2" />
                <Skeleton className="h-4 w-20 rounded-md mb-1" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ImproveScoreSkeleton() {
  return (
    <div className="rounded-2xl p-6 md:p-8 border border-[#E2E1DC] bg-gradient-to-r from-[#091D26] to-[#0C2C3B] shadow-none">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-5 w-5 rounded-full bg-white/15" />
        <Skeleton className="h-6 w-40 rounded-md bg-white/20" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`improvement-skeleton-${index}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#18303B] p-4 rounded-2xl border border-[#1A3344] gap-4 self-stretch"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded-full bg-white/15" />
              <Skeleton className="h-5 w-56 rounded-md bg-white/20" />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-5">
              <Skeleton className="h-5 w-20 rounded-md bg-white/20" />
              <Skeleton className="h-9 w-24 rounded-lg bg-white/15" />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between bg-[#1A2E2A] p-5 rounded-xl border border-[#23443B] mt-6">
          <Skeleton className="h-5 w-52 rounded-md bg-white/15" />
          <Skeleton className="h-6 w-16 rounded-md bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        <ScoreHeroSkeleton />
        <ScoreSectionSkeleton rows={4} infoBoxes={1} />
        <ScoreSectionSkeleton rows={4} infoBoxes={3} />
        <ScoreSectionSkeleton rows={3} infoBoxes={2} extraGrid={3} />
        <ImproveScoreSkeleton />
      </div>
    </div>
  );
}
