export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-5 p-6 animate-pulse">
      <div className="h-32 rounded-[24px] bg-[#E8F4F3]" />
      <div className="h-20 rounded-[26px] bg-white/80" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-white/80" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-64 rounded-[26px] bg-white/80" />
        <div className="h-64 rounded-[26px] bg-white/80" />
      </div>
    </div>
  );
}
