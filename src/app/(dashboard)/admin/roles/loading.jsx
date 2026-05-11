function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />;
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-8 gap-3 border-b border-gray-100 px-4 py-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-5 animate-pulse rounded bg-gray-200" />
      ))}
    </div>
  );
}

export default function RolesPermissionsLoading() {
  return (
    <div className="min-h-screen bg-[#EEF2F0] p-4 md:p-6">
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="h-11 w-32 animate-pulse rounded-xl bg-gray-200" />
        </div>

        <div className="mb-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="grid grid-cols-8 gap-3 bg-gray-50 px-4 py-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-4 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
