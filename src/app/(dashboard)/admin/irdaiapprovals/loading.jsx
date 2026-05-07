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

export default function IRDAISkeleton() {
  return (
    <>
      <style>{skeletonStyle}</style>

      <div className="flex min-h-screen bg-[#f0f2ee] font-sans">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 max-md:p-3.5">

            {/* Stat Cards */}
            <div className="flex flex-wrap gap-4 mb-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-[18px_22px] shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
                  <div className="flex items-start justify-between mb-2.5">
                    <Sk w={38} h={38} r={12} />
                    <Sk w={80} h={22} r={999} />
                  </div>
                  <Sk w={80} h={28} className="mb-2" />
                  <Sk w={110} h={12} />
                </div>
              ))}
            </div>

            {/* Submissions Panel */}
            <div className="bg-white rounded-2xl p-[22px_24px] shadow-sm">

              {/* Panel header */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2.5">
                <div className="flex items-center gap-2.5">
                  <Sk w={26} h={26} r={8} />
                  <Sk w={150} h={16} />
                </div>
                {/* Filter pills */}
                <div className="flex items-center gap-2">
                  {[80, 90, 80].map((w, i) => (
                    <Sk key={i} w={w} h={32} r={999} />
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="flex gap-3 mb-5 items-center">
                <Sk w="100%" h={48} r={999} />
              </div>

              {/* Submission rows */}
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#f9fbf9] rounded-xl px-[18px] py-3.5 flex items-center gap-3.5 border border-[#eef0ee] flex-wrap"
                  >
                    {/* Avatar */}
                    <Sk w={40} h={40} r={999} />

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <Sk w={200} h={13} />
                      <Sk w={280} h={11} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Sk w={70} h={28} r={8} />
                      <Sk w={40} h={20} r={4} />
                      <Sk w={90} h={30} r={999} />
                      <Sk w={80} h={30} r={999} />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}