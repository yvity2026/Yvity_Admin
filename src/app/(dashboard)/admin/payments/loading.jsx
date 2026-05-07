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

export default function PaymentsSkeleton() {
  return (
    <>
      <style>{skeletonStyle}</style>

      <div className="flex min-h-screen font-sans bg-[#EDEEE6]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-[22px_26px] max-md:p-3.5">

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-[16px_18px] border border-[#E3E6DC] flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    {i === 0 && <Sk w={50} h={20} r={999} />}
                    {i !== 0 && <div style={{ height: 22 }} />}
                    <Sk w={90} h={26} />
                    <Sk w={130} h={12} />
                  </div>
                  <Sk w={38} h={38} r={12} />
                </div>
              ))}
            </div>

            {/* Transactions Panel */}
            <div className="bg-white rounded-2xl border border-[#E3E6DC] p-[18px_22px]">

              {/* Panel title */}
              <div className="flex items-center gap-2 mb-3.5">
                <Sk w={16} h={16} r={4} />
                <Sk w={160} h={14} />
              </div>

              {/* Search */}
              <div className="flex gap-3 mb-4 items-center">
                <Sk w="100%" h={48} r={999} />
              </div>

              {/* Table header */}
              <div className="flex gap-4 pb-2.5 border-b border-[#E3E6DC]">
                {[100, 60, 60, 70, 70, 110, 60, 60].map((w, i) => (
                  <Sk key={i} w={w} h={11} />
                ))}
              </div>

              {/* Table rows */}
              <div className="flex flex-col">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-2.5 border-b border-[#F3F6F0] last:border-0"
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-2" style={{ minWidth: 130 }}>
                      <Sk w={30} h={30} r={999} />
                      <div className="flex flex-col gap-1.5">
                        <Sk w={80} h={12} />
                        <Sk w={60} h={10} />
                      </div>
                    </div>

                    {/* Plan badge */}
                    <Sk w={60} h={20} r={999} />

                    {/* Amount */}
                    <Sk w={55} h={12} />

                    {/* Method */}
                    <Sk w={70} h={12} />

                    {/* Date */}
                    <Sk w={70} h={12} />

                    {/* Txn ID */}
                    <Sk w={110} h={12} />

                    {/* Status badge */}
                    <Sk w={65} h={22} r={999} />

                    {/* Action button */}
                    <Sk w={48} h={28} r={6} />
                  </div>
                ))}
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}