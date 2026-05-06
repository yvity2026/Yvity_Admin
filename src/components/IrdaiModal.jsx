"use client";

import { FiX, FiCheckCircle } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { MdCancel } from "react-icons/md";

export default function IrdaiModal({
  advisor,
  onClose,
  onApprove,
  onReject,
}) {
  if (!advisor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <span className="text-xl">👤</span>
            IRDAI License
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 text-sm">

          {[
            ["Advisor", advisor.name],
            ["License No.", advisor.license],
            ["Type", advisor.type],
            ["Authority", advisor.authority],
            ["Valid Until", advisor.validUntil],
            ["Submitted", advisor.submitted],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="flex justify-between border-b pb-2 text-gray-600"
            >
              <span className="font-medium text-gray-500">{label}</span>
              <span className="text-gray-800 text-right">{value}</span>
            </div>
          ))}

          {/* Plan */}
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Plan Paid</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
              🏅 {advisor.plan}
            </span>
          </div>

          {/* Certificate */}
          <div className="border-2 border-dashed rounded-xl p-6 text-center bg-gray-50">
            <HiOutlineDocumentText className="mx-auto text-3xl text-yellow-500 mb-2" />
            <p className="font-semibold text-gray-800">
              IRDAI Certificate
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {advisor.fileName}
            </p>

            <button className="text-green-600 font-medium hover:underline">
              View Document
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-4 px-6 py-4">
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition"
          >
            <FiCheckCircle />
            Approve
          </button>

          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition"
          >
            <MdCancel />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}