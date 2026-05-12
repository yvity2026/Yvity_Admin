import React from "react";

const PaymentDetails = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg  w-[90%] md:w-[650px] p-8 font-sans">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-gray-900 font-semibold text-base">
              Payment Details
            </span>
          </div>
          <button 
  onClick={onClose}
  className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Detail Rows */}
        <div className="space-y-4">

          {/* Transaction ID */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Transaction ID</span>
            <span className="text-gray-800 text-sm font-medium">
              TXN2025010501
            </span>
          </div>

          {/* Advisor */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Advisor</span>
            <span className="text-gray-800 text-sm font-medium">
              Krishna Mohan
            </span>
          </div>

          {/* Plan */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Plan</span>
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
              Gold · ₹2,999/yr
            </span>
          </div>

          {/* Method */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Method</span>
            <span className="text-gray-800 text-sm font-medium">
              UPI – ICICI Bank
            </span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Date & Time</span>
            <span className="text-gray-800 text-sm font-medium">
              05/01/2026 · 10:32 AM
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Status</span>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Success
            </span>
          </div>

          {/* Next Renewal */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">Next Renewal</span>
            <span className="text-gray-800 text-sm font-medium">
              05/01/2026
            </span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-7">
          <button className="flex-1 py-2.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors">
            Send Receipt
          </button>
          <button className="flex-1 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors">
            Refund
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentDetails;