"use client";

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-[#E6ECEA] ${className}`} />;
}

export default function ProfilesSkeleton() {
  return (
    <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
      <Pulse className="h-32 rounded-[24px]" />
      <Pulse className="h-40 rounded-[26px]" />
      <Pulse className="h-24 rounded-[24px]" />
      <Pulse className="h-36 rounded-[24px]" />
      <Pulse className="h-80 rounded-[24px]" />
    </div>
  );
}
