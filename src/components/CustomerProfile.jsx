import React from "react";

export default function CustomerProfile({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50">

      {/* Modal */}
      <div className="bg-white w-[400px] rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-[18px] border-b border-gray-100">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <span className="text-gray-400 text-base">👤</span>
            Customer Details
          </h2>
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-[13px]"
          >
            ✕
          </button>
        </div>

        {/* Top Profile */}
        <div className="px-6 py-5 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-teal-900 text-white flex items-center justify-center font-bold text-[13px] tracking-wide flex-shrink-0">
            KM
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-[15px] mb-1.5">
              Priya Devi
            </h3>
            <div className="flex gap-1.5">
              <span className="bg-green-100 text-green-700 text-[11px] font-medium px-3 py-0.5 rounded-full">
                ✔ Mobile
              </span>
              <span className="bg-green-100 text-green-700 text-[11px] font-medium px-3 py-0.5 rounded-full">
                ✔ Email
              </span>
            </div>
          </div>
        </div>

        {/* Divider — inset on sides */}
        <div className="border-t border-gray-100 mx-6" />

        {/* Details */}
        <div className="px-6 pb-5 pt-3">
          {[
            { label: "Mobile", value: "+91 9876543210" },
            { label: "Email", value: "priya@email.com" },
            { label: "City", value: "Nellore, AP" },
            { label: "Profession", value: "Teacher" },
            { label: "Reviews Given", value: "3 reviews • 1 audio" },
            { label: "Last Login", value: "2 hrs ago" },
            { label: "Registered", value: "Jan 10, 2026" },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex justify-between items-center py-[11px] text-[13px] ${
                i < arr.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-gray-400">{label}</span>
              <span className="text-gray-800 pl-4">{value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}