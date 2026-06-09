"use client";

function Pulse({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-[#E6ECEA] ${className}`} />;
}

const LAYOUTS = {
  default: [
    { className: "h-32 rounded-[24px]" },
    { className: "h-40 rounded-[26px]" },
    { className: "h-36 rounded-[24px]" },
    { className: "h-80 rounded-[24px]" },
  ],
  compact: [
    { className: "h-28 rounded-[24px]" },
    { className: "h-64 rounded-[26px]" },
  ],
  settings: [
    { className: "h-32 rounded-[24px]" },
    { className: "h-[420px] rounded-[26px]" },
  ],
  detail: [
    { className: "h-10 w-32" },
    { className: "h-28" },
    { className: "h-72" },
    { className: "h-56" },
  ],
};

/**
 * Generic loading skeleton for admin pages.
 * layout: "default" | "compact" | "settings" | "detail"
 */
export default function AdminPageSkeleton({ layout = "default", className = "" }) {
  const blocks = LAYOUTS[layout] || LAYOUTS.default;

  return (
    <div className={`space-y-5 p-3 sm:p-4 md:p-5 lg:p-6 ${className}`} aria-busy="true" aria-label="Loading">
      {blocks.map((block, index) => (
        <Pulse key={index} className={block.className} />
      ))}
    </div>
  );
}
