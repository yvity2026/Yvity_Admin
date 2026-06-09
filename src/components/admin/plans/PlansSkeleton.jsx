"use client";

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-[#E6ECEA] ${className}`} />;
}

export default function PlansSkeleton() {
  return (
    <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
      <Pulse className="h-32 rounded-[24px]" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Pulse key={index} className="h-24 rounded-[24px]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Pulse key={index} className="h-96 rounded-[24px]" />
        ))}
      </div>
      <Pulse className="h-80 rounded-[24px]" />
    </div>
  );
}
