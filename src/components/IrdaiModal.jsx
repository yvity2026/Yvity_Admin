"use client";

export default function IrdaiModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white min-w-[560px] rounded-2xl shadow-xl overflow-hidden font-sans">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-gray-800">
            <span>👤</span> IRDAI License
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 p-4">

          {/* Center vertical dotted line */}

          {/* Rows */}
          <div className="space-y-3">
            {[
              { label: "Advisor", value: "Rahul Kumar • Vijayawada" },
              { label: "License No.", value: "LIC-AP-2022-48291" },
              { label: "Type", value: "Life Insurance Agent" },
              { label: "Authority", value: "IRDAI - Andhra Pradesh" },
              { label: "Valid Until", value: "December 2026" },
              { label: "Submitted", value: "2 days ago" },
            ].map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-2 items-center py-3 border-b border-gray-100 text-sm"
              >
                <span className="text-gray-400">{row.label}</span>
                <span className="text-gray-900 font-medium text-right">
                  {row.value}
                </span>
              </div>
            ))}

            {/* Plan Paid */}
            <div className="grid grid-cols-2 items-center py-3 border-b border-gray-100 text-sm">
              <span className="text-gray-400">Plan Paid</span>
              <div className="flex justify-end">
                <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  🪙 Silver • 999
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Box */}
          <div className="mt-5 bg-gray-100 rounded-xl py-8 flex flex-col items-center justify-center text-center">
            <span className="text-4xl">🏆</span>
            <p className="text-[15px] font-semibold text-gray-800 mt-2">
              IRDAI Certificate
            </p>
            <p className="text-xs text-gray-500">
              LIC-AP-2022-48291 • certificate.jpg
            </p>
            <button className="text-sm font-medium text-teal-700 mt-2 hover:underline">
              View Document
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-4 px-6 pb-5 pt-3">
          <button className="flex-1 py-3 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200">
            ✔ Approve
          </button>
          <button className="flex-1 py-3 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200">
            ✖ Reject
          </button>
        </div>

      </div>
    </div>
  );
}