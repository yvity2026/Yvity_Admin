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

export default function SettingsSkeleton() {
  return (
    <>
      <style>{skeletonStyle}</style>

      <div className="flex min-h-screen font-sans bg-gray-100">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">

            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

              {/* Platform Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <Sk w={160} h={16} className="mb-5" />

                {/* 3 toggle rows */}
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`flex items-center gap-3.5 ${i < 2 ? "mb-5" : ""}`}>
                    <Sk w={38} h={38} r={12} />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <Sk w={130} h={13} />
                      <Sk w={200} h={11} />
                    </div>
                    {/* Toggle */}
                    <Sk w={44} h={24} r={999} />
                  </div>
                ))}
              </div>

              {/* Admin Account */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Sk w={18} h={18} r={4} />
                  <Sk w={140} h={16} />
                </div>

                {/* Admin Name field */}
                <div className="mb-4">
                  <Sk w={80} h={12} className="mb-1.5" />
                  <Sk w="100%" h={40} r={8} />
                </div>

                {/* Email field */}
                <div className="mb-5">
                  <Sk w={50} h={12} className="mb-1.5" />
                  <Sk w="100%" h={40} r={8} />
                </div>

                {/* Save button */}
                <Sk w={120} h={38} r={8} />
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-[18px]">
                <Sk w={18} h={18} r={4} />
                <Sk w={110} h={16} />
              </div>

              {/* Deactivate row */}
              <div className="flex items-center justify-between pb-4 border-b border-red-200 mb-4">
                <div className="flex flex-col gap-1.5">
                  <Sk w={150} h={13} />
                  <Sk w={230} h={11} />
                </div>
                <Sk w={90} h={32} r={8} />
              </div>

              {/* Delete row */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <Sk w={120} h={13} />
                  <Sk w={210} h={11} />
                </div>
                <Sk w={80} h={32} r={8} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}