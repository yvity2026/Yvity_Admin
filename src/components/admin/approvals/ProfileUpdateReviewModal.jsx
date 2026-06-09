"use client";

import { FiFileText } from "react-icons/fi";
import AdminModal from "@/components/admin/ui/AdminModal";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProfileUpdateReviewModal({
  request,
  onClose,
  onApprove,
  onReject,
  isProcessing = false,
}) {
  if (!request) return null;

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Profile update request"
      title={request.name}
      size="md"
      footer={
        request.canReview ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReject}
              disabled={isProcessing}
              className="flex-1 rounded-xl border border-[#FFD7D7] bg-[#FFF5F5] px-4 py-3 text-sm font-semibold text-[#DC2626] disabled:opacity-60"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={isProcessing}
              className="flex-1 rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isProcessing ? "Processing…" : "Approve"}
            </button>
          </div>
        ) : null
      }
    >
      <p className="mb-5 text-sm text-[#5C7571]">
        {request.changeTypeLabel} · {request.statusLabel}
      </p>

      <div className="space-y-4">
        <div className="grid gap-3 rounded-2xl bg-[#F8FBFA] p-4 sm:grid-cols-2">
          <Field label="Change type" value={request.changeTypeLabel} />
          <Field label="Submitted" value={formatDate(request.submittedAt)} />
          <Field label="Industry" value={request.industry} />
          <Field label="Service" value={request.service} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">Summary</p>
          <p className="mt-2 rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]">
            {request.summary || "—"}
          </p>
        </div>

        {(request.verificationNotes || request.rejectionReason) && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              {request.rejectionReason ? "Rejection reason" : "Verification notes"}
            </p>
            <p className="mt-2 rounded-2xl border border-[#E6ECEA] bg-[#F8FBFA] px-4 py-4 text-sm leading-7 text-[#35504C]">
              {request.rejectionReason || request.verificationNotes}
            </p>
          </div>
        )}

        {request.documentUrls?.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <FiFileText size={12} aria-hidden="true" />
              Documents
            </p>
            <div className="flex flex-wrap gap-2">
              {request.documentUrls.map((url, index) => (
                <a
                  key={url || index}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[#D7E5E1] px-3 py-2 text-[12px] font-semibold text-[#0A4A4A]"
                >
                  Document {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminModal>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#173736]">{value || "—"}</p>
    </div>
  );
}
