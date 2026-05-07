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

export default function SubscriptionsSkeleton() {
  return (
    <>
      <style>{skeletonStyle}</style>

      <div className="flex min-h-screen font-sans bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-6 max-md:p-3.5 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm">

              {/* Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <Sk w={24} h={24} r={4} />
                <Sk w={170} h={16} />
              </div>

              {/* Search */}
              <div className="flex gap-3 mb-5 items-center">
                <Sk w="100%" h={48} r={999} />
              </div>

              {/* Subscription rows */}
              <div className="flex flex-col gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-[#f5f7f5] rounded-xl px-4 py-3.5"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <Sk w={40} h={40} r={999} />
                      <div className="flex flex-col gap-1.5">
                        <Sk w={120} h={13} />
                        <Sk w={210} h={11} />
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3.5">
                      <Sk w={70} h={26} r={999} />
                      <Sk w={48} h={14} r={4} />
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