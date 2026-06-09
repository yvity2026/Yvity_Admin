"use client";

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-[#E6ECEA] ${className}`} />;
}

export default function UsersSkeleton({ detail = false }) {
  if (detail) {
    return (
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <Pulse className="h-10 w-32" />
        <div className="flex flex-col gap-5 xl:flex-row">
          <div className="flex-1 space-y-5">
            <Pulse className="h-28" />
            <Pulse className="h-72" />
            <Pulse className="h-56" />
            <Pulse className="h-48" />
          </div>
          <Pulse className="hidden h-[420px] w-[300px] xl:block" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
      <Pulse className="h-32 rounded-[24px]" />
      <Pulse className="h-40 rounded-[26px]" />
      <Pulse className="h-36 rounded-[24px]" />
      <Pulse className="h-80 rounded-[24px]" />
    </div>
  );
}
