"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RejectModal({ onClose, onConfirm, isSubmitting = false }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${poppins.className} fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        className="w-full max-w-[430px] overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.16)]"
      >
        <div className="flex items-center justify-between border-b border-[#EFEFEF] px-[18px] pb-[14px] pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[17px] leading-none">!</span>
            <span className="text-[15px] font-bold text-gray-900">
              Reject IRDAI Submission
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[13px] text-gray-500 disabled:opacity-60"
          >
            x
          </button>
        </div>

        <div className="mx-[18px] mt-[14px] rounded-lg border border-red-200 bg-red-50 px-[14px] py-[9px] text-center">
          <span className="text-[12.5px] font-medium text-red-600">
            This will mark the advisor&apos;s profile as &quot;Action Required&quot;
          </span>
        </div>

        <div className="px-[18px] pt-4">
          <div className="mb-2 text-[13.5px] font-bold text-gray-900">
            Reason for Rejection
          </div>

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="License number mismatch"
            className="w-full border-0 border-b border-gray-200 bg-transparent py-2 pb-[10px] text-[13.5px] text-gray-700 outline-none placeholder:text-gray-400"
          />

          <div className="mb-2 mt-[18px] text-[13.5px] font-bold text-gray-900">
            Additional Note{" "}
            <span className="font-normal text-gray-500">(shown to advisor)</span>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain what the advisor needs to fix..."
            rows={4}
            className="w-full resize-none border-0 bg-transparent py-2 text-[13px] leading-relaxed text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mt-[10px] flex gap-3 border-t border-[#F0F0F0] px-[18px] pb-[18px] pt-[14px]">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-[#F3F4F6] py-[15px] text-[14px] font-bold text-gray-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm?.({ reason, note })}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-[#0A4A4A] py-[15px] text-[14px] font-bold text-[#C9A227] disabled:opacity-60"
          >
            {isSubmitting ? "Rejecting..." : "Confirm Reject"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
