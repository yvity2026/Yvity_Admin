"use client";

const skeletonStyle = `
  @keyframes shimmer {
    0% { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .sk {
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }
`;

function Sk({ w, h, r = 6, className = "" }) {
  return (
    <div
      className={`sk ${className}`}
      style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }}
    />
  );
}

export default function CustomersSkeleton() {
  return (
    <>
      <style>{skeletonStyle}</style>

      <div className="flex min-h-screen font-sans bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 max-md:p-3.5 overflow-y-auto flex-1">

            {/* Stat Cards */}
            <div className="flex flex-col md:flex-row gap-4 mb-5">
              {[0, 1].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm flex-1 max-w-[280px] max-md:max-w-full">
                  <div className="flex items-start justify-between mb-2">
                    <Sk w={40} h={40} r={12} />
                    <Sk w={50} h={22} r={999} />
                  </div>
                  <Sk w={100} h={28} className="mb-2" />
                  <Sk w={120} h={12} />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <Sk w={18} h={18} r={4} />
              <Sk w={130} h={18} />
            </div>
            <Sk w={180} h={12} className="mb-4 mt-1" />

            {/* Search bar */}
            <div className="flex gap-3 mb-5 items-center">
              <Sk w="100%" h={48} r={999} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="flex gap-3 px-3 py-2.5 bg-gray-50 border-b border-gray-200">
                {[90, 80, 110, 80, 100, 70, 75, 60, 70].map((w, i) => (
                  <Sk key={i} w={w} h={12} />
                ))}
              </div>

              {/* Table rows */}
              {Array.from({ length: 5 }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex items-center gap-3 px-3 py-3 border-b border-gray-100"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-2.5" style={{ minWidth: 140 }}>
                    <Sk w={32} h={32} r={999} />
                    <Sk w={90} h={13} />
                  </div>

                  {/* Mobile */}
                  <Sk w={80} h={12} />

                  {/* Email */}
                  <Sk w={110} h={12} />

                  {/* City */}
                  <Sk w={80} h={12} />

                  {/* Profession */}
                  <Sk w={100} h={12} />

                  {/* Reviews badge */}
                  <Sk w={70} h={22} r={999} />

                  {/* Last Login */}
                  <Sk w={75} h={12} />

                  {/* Joined */}
                  <Sk w={60} h={12} />

                  {/* Action button */}
                  <Sk w={48} h={28} r={6} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}