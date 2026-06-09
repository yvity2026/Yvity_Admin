export default function AmbassadorsSkeleton() {
  return (
    <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
      <div className="h-36 animate-pulse rounded-[24px] bg-[#E8F4F3]/70" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[20px] bg-white" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-[26px] bg-white" />
    </div>
  );
}
