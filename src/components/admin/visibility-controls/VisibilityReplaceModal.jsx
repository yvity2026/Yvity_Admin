"use client";

import AdminModal from "@/components/admin/ui/AdminModal";

export default function VisibilityReplaceModal({
  open = true,
  slotLabel,
  members = [],
  onReplace,
  onClose,
  isProcessing = false,
}) {
  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={`${slotLabel} slots full`}
      size="md"
      footer={
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="w-full rounded-xl bg-[#F3F4F6] py-3 text-sm font-semibold text-[#35504C] disabled:opacity-60"
        >
          Cancel
        </button>
      }
    >
      <p className="mb-4 text-sm text-[#5C7571]">
        Replace an existing featured profile to add this one.
      </p>

      <div className="max-h-[360px] space-y-3 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-[#E6ECEA] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#183534]">{member.name}</p>
              <p className="truncate text-[12px] text-[#7A928D]">{member.city}</p>
            </div>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onReplace(member.id)}
              className="shrink-0 rounded-xl bg-[#0A4A4A] px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              Replace
            </button>
          </div>
        ))}
      </div>
    </AdminModal>
  );
}
