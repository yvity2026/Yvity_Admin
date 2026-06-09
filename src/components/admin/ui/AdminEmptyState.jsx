"use client";

export default function AdminEmptyState({
  title = "No results",
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-[#E6ECEA] bg-[#FCFDFC] px-6 py-12 text-center ${className}`}
    >
      <p className="font-cormorant text-xl font-bold text-[#0A4A4A]">{title}</p>
      {description ? <p className="max-w-md text-sm text-[#5C7571]">{description}</p> : null}
      {action}
    </div>
  );
}
