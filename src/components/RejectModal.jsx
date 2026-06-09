"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import AdminModal from "@/components/admin/ui/AdminModal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RejectModal({
  open = true,
  onClose,
  onConfirm,
  isSubmitting = false,
  title = "Reject IRDAI Submission",
  warningText = 'This will mark the advisor\'s profile as "Action Required"',
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      className={poppins.className}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-[#F3F4F6] py-[15px] text-[14px] font-bold text-gray-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.({ reason, note })}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-[#0A4A4A] py-[15px] text-[14px] font-bold text-[#C9A227] disabled:opacity-60"
          >
            {isSubmitting ? "Rejecting..." : "Confirm Reject"}
          </button>
        </div>
      }
    >
      <div className="rounded-lg border border-red-200 bg-red-50 px-[14px] py-[9px] text-center">
        <span className="text-[12.5px] font-medium text-red-600">{warningText}</span>
      </div>

      <div className="pt-4">
        <label htmlFor="reject-reason" className="mb-2 block text-[13.5px] font-bold text-gray-900">
          Reason for Rejection
        </label>
        <input
          id="reject-reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="License number mismatch"
          className="w-full border-0 border-b border-gray-200 bg-transparent py-2 pb-[10px] text-[13.5px] text-gray-700 outline-none placeholder:text-gray-400"
        />

        <label htmlFor="reject-note" className="mb-2 mt-[18px] block text-[13.5px] font-bold text-gray-900">
          Additional Note{" "}
          <span className="font-normal text-gray-500">(shown to advisor)</span>
        </label>
        <textarea
          id="reject-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Explain what the advisor needs to fix..."
          rows={4}
          className="w-full resize-none border-0 bg-transparent py-2 text-[13px] leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>
    </AdminModal>
  );
}
