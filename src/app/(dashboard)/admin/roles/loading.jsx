function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />;
}

function SkeletonTableRow() {
  return (
    <div className="grid grid-cols-8 gap-3 border-b border-gray-100 px-4 py-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-5 animate-pulse rounded bg-gray-200" />
      ))}
    </div>
  );
}

function SkeletonMobileCard() {
  return (
    <div className="rounded-2xl bg-[#FCFCFB] p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-28 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-gray-100" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-gray-100" />
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-7 w-24 animate-pulse rounded-full bg-gray-100"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>
        <div>
          <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 sm:w-28" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 sm:w-24" />
      </div>
    </div>
  );
}

export default function RolesPermissionsLoading() {
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#EEF2F0] p-3 sm:p-4 lg:p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mb-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-52 max-w-full animate-pulse rounded bg-gray-100 sm:w-80" />
          </div>
          <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200 sm:w-32" />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="h-12 animate-pulse rounded-xl bg-gray-100 sm:col-span-2 xl:col-span-1" />
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
        </div>

        <div className="space-y-4 xl:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonMobileCard key={index} />
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-gray-100 xl:block">
          <div className="grid grid-cols-8 gap-3 bg-gray-50 px-4 py-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-4 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonTableRow key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
