"use client";

import Link from "next/link";
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

export default function ApprovalRequestModal({
  approval,
  onClose,
  onApprove,
  onReject,
  isProcessing = false,
  quickActions = null,
}) {
  if (!approval) return null;

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Request details"
      title={approval.name}
      size="md"
      footer={
        approval.canReview ? (
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
              Approve
            </button>
          </div>
        ) : null
      }
    >
      <p className="mb-5 text-sm text-[#5C7571]">
        {approval.requestTypeLabel} · {approval.statusLabel}
      </p>

      <div className="space-y-5">
        {quickActions}

        <div className="grid gap-3 rounded-2xl bg-[#F8FBFA] p-4 sm:grid-cols-2">
          <InfoField label="Profile name" value={approval.name} />
          <InfoField label="Industry" value={approval.industry} />
          <InfoField label="Category" value={approval.category} />
          <InfoField label="Service" value={approval.service} />
          <InfoField label="Submitted" value={formatDate(approval.submittedAt)} />
          <InfoField label="License no." value={approval.licenseNo} />
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Submitted information
          </div>
          <div className="mt-2 rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]">
            {approval.submittedInformation || "—"}
          </div>
        </div>

        {approval.serviceDetails?.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Services to verify
            </div>
            <p className="mt-1 text-[12px] text-[#7A928D]">
              Check each uploaded document against the service before approving — the profile goes
              live once approved.
            </p>
            <div className="mt-3 space-y-3">
              {approval.serviceDetails.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#183534]">{service.title}</p>
                      <p className="mt-1 text-[12px] text-[#5C7571]">
                        {service.provider}{service.roleLabel && service.roleLabel !== "—" ? ` · ${service.roleLabel}` : ""}
                      </p>
                      {service.licenseNumber && (
                        <p className="mt-0.5 text-[11px] text-[#5C7571]">
                          Licence: <span className="font-semibold text-[#183534]">{service.licenseNumber}</span>
                        </p>
                      )}
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        service.verificationStatus === "verified"
                          ? "bg-[#E8F5F0] text-[#1A7A5A]"
                          : "bg-[#FFF6E8] text-[#B45309]"
                      }`}
                    >
                      {service.verificationStatus === "verified" ? "Verified" : "Pending review"}
                    </span>
                  </div>
                  {service.documents?.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.documents.map((doc) => (
                        <a
                          key={doc.id || doc.url}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#D7E5E1] bg-white px-3 py-2 text-[11px] font-semibold text-[#0A4A4A]"
                        >
                          <FiFileText size={12} aria-hidden="true" />
                          {doc.label}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-[12px] text-[#7A928D]">No documents uploaded for this service.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            <FiFileText size={12} aria-hidden="true" />
            Uploaded proofs
          </div>
          {approval.uploadedProofs?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {approval.uploadedProofs.map((url, index) => (
                <a
                  key={url || index}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[#D7E5E1] bg-white px-3 py-2 text-[12px] font-semibold text-[#0A4A4A] underline-offset-2 hover:underline"
                >
                  Document {index + 1}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#7A928D]">No documents uploaded.</p>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Verification notes
          </div>
          <div className="mt-2 rounded-2xl border border-[#E6ECEA] bg-[#F8FBFA] px-4 py-4 text-sm leading-7 text-[#35504C]">
            {approval.verificationNotes || approval.rejectionReason || "No notes yet."}
          </div>
        </div>

        {approval.profileHref && (
          <p className="text-[12px] text-[#7A928D]">
            Advisor profile:{" "}
            <Link href={approval.profileHref} className="font-semibold text-[#0A4A4A] underline">
              Open in admin
            </Link>
          </p>
        )}
      </div>
    </AdminModal>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[#173736]">{value || "—"}</div>
    </div>
  );
}
