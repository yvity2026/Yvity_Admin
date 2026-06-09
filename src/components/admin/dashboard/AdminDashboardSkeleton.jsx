"use client";

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-[#E6ECEA] ${className}`} />;
}

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
      <Pulse className="h-36 w-full rounded-[28px]" />
      <div className="flex flex-col gap-5 xl:flex-row">
        <div className="flex-1 space-y-5">
          <Pulse className="h-44" />
          <Pulse className="h-96" />
          <Pulse className="h-40" />
          <Pulse className="h-64" />
        </div>
        <Pulse className="hidden h-[480px] w-[300px] shrink-0 xl:block" />
      </div>
    </div>
  );
}
