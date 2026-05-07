"use client";

// Pulse animation style injected once
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

export default function AdvisorsSkeleton() {
  return (
    <>
      <style>{skeletonStyle}</style>

      <div className="flex min-h-screen font-poppins bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">

            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <Sk w={18} h={18} r={4} />
              <Sk w={120} h={18} />
            </div>
            <Sk w={200} h={12} className="mb-4 mt-1" />

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap mb-4">
              {[80, 100, 110, 90, 130, 110].map((w, i) => (
                <Sk key={i} w={w} h={28} r={999} />
              ))}
            </div>

            {/* Search bar */}
            <div className="flex gap-3 mb-5 items-center">
              <Sk w="100%" h={48} r={999} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="flex gap-3 px-3 py-2.5 bg-gray-50 border-b border-gray-200">
                {[90, 70, 80, 70, 60, 55, 60, 60, 70, 80].map((w, i) => (
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
                    <div className="flex flex-col gap-1.5">
                      <Sk w={90} h={12} />
                      <Sk w={70} h={10} />
                    </div>
                  </div>

                  {/* City */}
                  <Sk w={70} h={12} />

                  {/* Type */}
                  <Sk w={80} h={12} />

                  {/* IRDAI badge */}
                  <Sk w={70} h={22} r={999} />

                  {/* Plan badge */}
                  <Sk w={60} h={22} r={12} />

                  {/* Score */}
                  <div className="flex items-center gap-1.5">
                    <Sk w={24} h={14} />
                    <Sk w={40} h={6} r={999} />
                  </div>

                  {/* Reviews */}
                  <Sk w={16} h={12} />

                  {/* Joined */}
                  <Sk w={55} h={12} />

                  {/* Status badge */}
                  <Sk w={70} h={22} r={12} />

                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <Sk w={48} h={28} r={6} />
                    <Sk w={60} h={28} r={6} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}