"use client";

export const STATUS_STYLES = {
  open: "bg-[#FFF6E8] text-[#B45309]",
  in_review: "bg-[#E8F4F3] text-[#0A4A4A]",
  resolved: "bg-[#E8F5F0] text-[#1A7A5A]",
  dismissed: "bg-[#F8FAFC] text-[#475569]",
};

export const PRIORITY_STYLES = {
  low: "bg-[#F8FAFC] text-[#64748B]",
  medium: "bg-[#F4F8F7] text-[#0A4A4A]",
  high: "bg-[#FFF6E8] text-[#B45309]",
  urgent: "bg-[#FFF1F0] text-[#DC2626]",
};

export function formatCaseDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RowActions({ item, onOpen, onAssign, onResolve, isProcessing, stacked = false }) {
  const canAssign = item.isActive && !item.assignedAdminId;
  const canResolve = item.isActive;

  return (
    <div className={`flex gap-1.5 ${stacked ? "flex-col" : "items-center justify-end"}`}>
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
      >
        View
      </button>
      {canAssign && (
        <button
          type="button"
          onClick={() => onAssign(item)}
          disabled={isProcessing}
          className="rounded-xl border border-[#D7E5E1] bg-white px-3 py-2 text-[11px] font-semibold text-[#0A4A4A] disabled:opacity-60"
        >
          Assign
        </button>
      )}
      {canResolve && (
        <button
          type="button"
          onClick={() => onResolve(item)}
          disabled={isProcessing}
          className="rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-3 py-2 text-[11px] font-semibold text-[#1A7A5A] disabled:opacity-60"
        >
          Resolve
        </button>
      )}
    </div>
  );
}
