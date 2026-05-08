// ── Skeleton pulse base ───────────────────────────────────────────
function Sk({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
    />
  );
}

// ── Skeleton: Stat Card ───────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between mb-2">
        <Sk className="w-8 h-8 rounded-lg" />
        <Sk className="w-16 h-4 rounded-full" />
      </div>
      <Sk className="w-24 h-7 rounded" />
      <Sk className="w-32 h-3 rounded" />
    </div>
  );
}

// ── Skeleton: Bar Chart ───────────────────────────────────────────
function BarChartSkeleton() {
  return (
    <div className="flex items-end gap-3 h-[120px] px-2">
      {[42, 58, 42, 58, 38, 90].map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse bg-gray-200 rounded-md"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ── Skeleton: Line Chart ──────────────────────────────────────────
function LineChartSkeleton() {
  return (
    <div className="w-full h-[120px] flex items-end">
      <Sk className="w-full h-full rounded-lg opacity-50" />
    </div>
  );
}

// ── Skeleton: City Row ────────────────────────────────────────────
function CityRowSkeleton() {
  return (
    <div className="flex items-center gap-2 px-1.5 py-[3px]">
      <Sk className="w-[76px] h-3 rounded" />
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
        <Sk className="h-full rounded-full w-3/4" />
      </div>
      <Sk className="w-6 h-3 rounded" />
    </div>
  );
}

// ── Skeleton: Company Card ────────────────────────────────────────
function CompanyCardSkeleton() {
  return (
    <div className="rounded-xl p-3 border border-gray-100 bg-gray-50">
      <div className="flex items-center gap-3 mb-2">
        <Sk className="w-9 h-9 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Sk className="w-10 h-4 rounded" />
          <Sk className="w-20 h-3 rounded" />
          <Sk className="w-full h-1.5 rounded-full" />
          <Sk className="w-12 h-2.5 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Skeleton: Mini Donut ──────────────────────────────────────────
function MiniDonutSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Sk className="w-14 h-14 rounded-full" />
      <Sk className="w-8 h-3 rounded" />
      <Sk className="w-14 h-2.5 rounded" />
    </div>
  );
}

// ── Skeleton: Plan Donut ──────────────────────────────────────────
function PlanDonutSkeleton() {
  return (
    <div className="flex items-center gap-5">
      <Sk className="w-[97px] h-[97px] rounded-full flex-shrink-0" />
      <div className="space-y-3 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sk className="w-2.5 h-2.5 rounded-full" />
              <Sk className="w-10 h-3 rounded" />
            </div>
            <Sk className="w-16 h-3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Skeleton Dashboard ───────────────────────────────────────
export default function AdminDashboardSkeleton() {
  return (
    <div className="flex min-h-screen text-gray-800 bg-[#EEF2F0]">
      <main className="flex-1 flex flex-col bg-[#EEF2F0]">
        <div className="p-4 space-y-3">

          {/* ── ROW 1: 4 Stat Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* ── ROW 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">

            {/* Subscription Revenue */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
              <div className="flex justify-between items-center mb-3">
                <Sk className="w-40 h-4 rounded" />
                <Sk className="w-24 h-4 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-2 flex flex-col items-center gap-1">
                    <Sk className="w-12 h-5 rounded" />
                    <Sk className="w-10 h-3 rounded" />
                    <Sk className="w-16 h-3 rounded" />
                  </div>
                ))}
              </div>
              <Sk className="w-32 h-3 rounded mb-2" />
              <BarChartSkeleton />
            </div>

            {/* Right col: Platform Growth + Plan Split */}
            <div className="col-span-2 flex flex-col gap-3">

              {/* Platform Growth */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1.5">
                    <Sk className="w-32 h-4 rounded" />
                    <Sk className="w-48 h-3 rounded" />
                  </div>
                  <Sk className="w-12 h-5 rounded" />
                </div>
                <LineChartSkeleton />
              </div>

              {/* Plan Split */}
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="mb-3 space-y-1">
                  <Sk className="w-24 h-4 rounded" />
                  <Sk className="w-36 h-3 rounded" />
                </div>
                <PlanDonutSkeleton />
              </div>
            </div>
          </div>

          {/* ── ROW 3 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* City-wise */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Sk className="w-40 h-4 rounded mb-3" />
              <div className="space-y-2.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CityRowSkeleton key={i} />
                ))}
              </div>
            </div>

            {/* Service-wise */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Sk className="w-44 h-4 rounded mb-3" />
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex gap-4 pb-1 border-b border-gray-100">
                  {["SERVICE", "LIFE", "HEALTH", "TOTAL"].map((h) => (
                    <Sk key={h} className="flex-1 h-3 rounded" />
                  ))}
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <Sk key={j} className="flex-1 h-3 rounded" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── ROW 4 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">

            {/* Company-wise */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Sk className="w-44 h-4 rounded mb-3" />
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <CompanyCardSkeleton key={i} />
                ))}
              </div>
              {/* Others card */}
              <div className="rounded-xl p-3 flex items-center gap-3 border border-gray-100 bg-gray-50">
                <Sk className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="w-8 h-4 rounded" />
                  <Sk className="w-12 h-3 rounded" />
                  <Sk className="w-full h-1.5 rounded-full" />
                  <Sk className="w-32 h-2.5 rounded" />
                </div>
              </div>
            </div>

            {/* Role-wise */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Sk className="w-36 h-4 rounded mb-3" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <MiniDonutSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}