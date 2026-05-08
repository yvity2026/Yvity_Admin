
"use client";
import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RejectModal({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  // ── Lock body scroll when modal is open ──
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className={`${poppins.className} fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 p-4`}
    >
      <div className="w-full max-w-[430px] bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.16)]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-[18px] pt-4 pb-[14px] border-b border-[#EFEFEF]">
          <div className="flex items-center gap-2">
            <span className="text-[17px] leading-none">⚠️</span>
            <span className="text-[15px] font-bold text-gray-900">
              Reject IRDAI Submission
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 border-none cursor-pointer text-[13px] text-gray-500 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* ── Warning Banner ── */}
        <div className="mx-[18px] mt-[14px] bg-red-50 border border-red-200 rounded-lg px-[14px] py-[9px] text-center">
          <span className="text-[12.5px] text-red-600 font-medium">
            This will mark the advisor's profile as "Action Required"
          </span>
        </div>

        {/* ── Form ── */}
        <div className="px-[18px] pt-4">

          <div className="text-[13.5px] font-bold text-gray-900 mb-2">
            Reason for Rejection
          </div>

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="License number mismatch"
            className="w-full box-border border-0 border-b border-gray-200 py-2 pb-[10px] text-[13.5px] text-gray-700 outline-none bg-transparent font-[inherit] placeholder:text-gray-400"
          />

          <div className="text-[13.5px] font-bold text-gray-900 mt-[18px] mb-2">
            Additional Note{" "}
            <span className="font-normal text-gray-500">(shown to advisor)</span>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Explain what the advisor needs to fix…."
            rows={4}
            className="w-full box-border border-0 resize-none py-2 text-[13px] text-gray-700 outline-none bg-transparent font-[inherit] leading-relaxed placeholder:text-gray-400"
          />
        </div>

        {/* ── Buttons ── */}
        <div className="flex border-t border-[#F0F0F0] mt-[10px] px-[18px] pb-[18px] pt-[14px] gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-[15px] rounded-xl bg-[#E43E3E] border-none text-[14px] font-bold text-white cursor-pointer"
          >
            Confirm Reject
          </button>
          <button
            onClick={() => onConfirm?.({ reason, note })}
            className="flex-1 py-[15px] rounded-xl bg-[#0A4A4A] border-none text-[14px] font-bold text-[#C9A227] cursor-pointer"
          >
            Confirm Reject
          </button>
        </div>

      </div>
    </div>
  );
}