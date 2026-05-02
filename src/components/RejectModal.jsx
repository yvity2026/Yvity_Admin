"use client";
import { X } from "lucide-react";

export default function RejectModal({ open, setOpen }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[580px] rounded-2xl shadow-xl p-10 relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
            ⚠️ Reject IRDAI Submission
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Alert Banner */}
        <div className="border border-red-400 bg-red-50 text-red-600 text-sm font-medium text-center rounded-xl px-5 py-4 mb-7">
          This will mark the advisor&apos;s profile as &quot;Action Required&quot;
        </div>

        {/* Reason for Rejection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2.5">
            Reason for Rejection
          </label>
          <input
            type="text"
            placeholder="License number mismatch"
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-400 focus:outline-none focus:border-gray-400 transition"
          />
        </div>

        {/* Additional Note */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-2.5">
            Additional Note (shown to advisor)
          </label>
          <textarea
            placeholder="Explain what the advisor needs to fix...."
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-400 h-28 resize-none focus:outline-none focus:border-gray-400 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-base font-semibold transition">
            Confirm Reject
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 bg-[#1a4a3a] hover:bg-[#163327] text-[#c8b46a] py-4 rounded-xl text-base font-semibold transition"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}