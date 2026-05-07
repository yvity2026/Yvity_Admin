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

export default function TestimonialsSkeleton() {
  return (
    <>
      <style>{skeletonStyle}</style>

      <div className="flex min-h-screen bg-gray-100 font-sans">
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-y-auto p-[22px_26px]">

            {/* Stat Cards */}
            <div className="flex gap-3.5 mb-5 flex-wrap">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-[14px] px-[22px] py-[18px] shadow-sm flex-1 min-w-[150px] max-w-[260px]">
                  <Sk w={36} h={36} r={9} className="mb-2.5" />
                  <Sk w={90} h={26} className="mb-1.5" />
                  <Sk w={110} h={12} />
                </div>
              ))}
            </div>

            {/* Panel */}
            <div className="bg-white rounded-2xl px-[22px] py-5 shadow-sm">

              {/* Panel header */}
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2.5">
                <div className="flex items-center gap-[9px]">
                  <Sk w={26} h={26} r={7} />
                  <div className="flex flex-col gap-1.5">
                    <Sk w={180} h={15} />
                    <Sk w={230} h={11} />
                  </div>
                </div>
                {/* Filter pills */}
                <div className="flex items-center gap-2">
                  {[80, 90, 80].map((w, i) => (
                    <Sk key={i} w={w} h={30} r={999} />
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="flex gap-3 mb-5 items-center">
                <Sk w="100%" h={48} r={999} />
              </div>

              {/* Table header */}
              <div className="flex gap-3 px-2.5 py-[7px] border-b border-gray-100">
                {[80, 90, 60, 70, 140, 50, 70, 80].map((w, i) => (
                  <Sk key={i} w={w} h={11} />
                ))}
              </div>

              {/* Table rows */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2.5 py-3 border-b border-gray-50">

                  {/* Client avatar + name */}
                  <div className="flex items-center gap-[9px]" style={{ minWidth: 130 }}>
                    <Sk w={34} h={34} r={999} />
                    <div className="flex flex-col gap-1.5">
                      <Sk w={80} h={13} />
                      <Sk w={60} h={11} />
                    </div>
                  </div>

                  {/* Advisor */}
                  <Sk w={90} h={12} />

                  {/* Type badge */}
                  <Sk w={60} h={22} r={7} />

                  {/* Stars */}
                  <Sk w={70} h={13} />

                  {/* Review */}
                  <Sk w={140} h={12} />

                  {/* OTP badge */}
                  <Sk w={50} h={22} r={999} />

                  {/* Submitted */}
                  <Sk w={70} h={11} />

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <Sk w={52} h={28} r={999} />
                    <Sk w={68} h={28} r={999} />
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