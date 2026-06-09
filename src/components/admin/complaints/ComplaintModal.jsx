"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiClock, FiEye, FiPaperclip, FiPhone } from "react-icons/fi";
import AdminModal from "@/components/admin/ui/AdminModal";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ComplaintModal({
  complaint,
  onClose,
  onTake,
  onStartReview,
  onResolve,
  onDismiss,
  onAddNote,
  onViewPii,
  revealedContact,
  isProcessing = false,
  canManage = true,
  canViewPii = false,
  quickActions = null,
}) {
  const [note, setNote] = useState(complaint?.resolutionNote || "");

  useEffect(() => {
    setNote(complaint?.resolutionNote || "");
  }, [complaint?.id, complaint?.resolutionNote]);

  if (!complaint) return null;

  return (
    <AdminModal
      open={Boolean(complaint)}
      onClose={onClose}
      eyebrow="Case details"
      title={complaint.caseNumber}
      size="md"
      footer={
        canManage && complaint.isActive ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {!complaint.assignedAdminId && (
              <button
                type="button"
                onClick={onTake}
                disabled={isProcessing}
                className="rounded-xl border border-[#D7E5E1] bg-white px-4 py-3 text-sm font-semibold text-[#0A4A4A] disabled:opacity-60"
              >
                Assign case
              </button>
            )}
            {complaint.status === "open" && (
              <button
                type="button"
                onClick={onStartReview}
                disabled={isProcessing}
                className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-sm font-semibold text-[#B45309] disabled:opacity-60"
              >
                Mark in progress
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              disabled={isProcessing}
              className="rounded-xl border border-[#FFD7D7] bg-[#FFF5F5] px-4 py-3 text-sm font-semibold text-[#CC3333] disabled:opacity-60"
            >
              Close case
            </button>
            <button
              type="button"
              onClick={onResolve}
              disabled={isProcessing}
              className="ml-auto rounded-xl bg-[#0A4A4A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              Resolve case
            </button>
          </div>
        ) : null
      }
    >
      <p className="mb-5 text-sm text-[#5C7571]">
        {complaint.caseKindLabel} ·{" "}
        {complaint.caseKind === "report"
          ? complaint.reportSubtypeLabel
          : complaint.complaintCategoryLabel}
      </p>

      <div className="no-scrollbar space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-[#FFF6E8] px-3 py-1 text-xs font-semibold text-[#B45309]">
            {complaint.statusLabel}
          </span>
          <span className="inline-flex rounded-full bg-[#F4F8F7] px-3 py-1 text-xs font-semibold text-[#0A4A4A]">
            {complaint.priorityLabel} priority
          </span>
        </div>

        {quickActions}

        <div className="grid gap-3 rounded-2xl bg-[#F8FBFA] p-4 sm:grid-cols-2">
          <InfoField label="Case ID" value={complaint.caseNumber} />
          <InfoField label="Type" value={complaint.caseKindLabel} />
          <InfoField label="User" value={complaint.reporterName} />
          <InfoField label="Status" value={complaint.statusLabel} />
          <InfoField label="Assigned to" value={complaint.assignedToLabel} />
          <InfoField label="Created date" value={formatDate(complaint.createdAt)} />
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            Description
          </div>
          <div className="mt-2 rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]">
            {complaint.description || "No description provided."}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
            <FiPaperclip size={12} />
            Attachments
          </div>
          {complaint.attachments?.length > 0 ? (
            <ul className="space-y-2">
              {complaint.attachments.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.url || file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#0A4A4A] underline underline-offset-4"
                  >
                    {file.name || `Attachment ${index + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#7A928D]">No attachments uploaded.</p>
          )}
        </div>

        <div className="grid gap-3 rounded-2xl border border-[#E6ECEA] bg-white p-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Reporter contact
            </div>
            <div className="mt-1 text-sm font-semibold text-[#173736]">{complaint.reporterName}</div>
            <div className="mt-1 text-sm text-[#5C7571]">{complaint.reporterPhoneMasked}</div>
            <div className="text-sm text-[#5C7571]">{complaint.reporterEmailMasked}</div>
            {canViewPii && (
              <button
                type="button"
                onClick={onViewPii}
                disabled={isProcessing}
                className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[#D7E5E1] px-3 py-1.5 text-[11px] font-semibold text-[#0A4A4A] disabled:opacity-60"
              >
                <FiEye size={12} />
                Reveal contact (audited)
              </button>
            )}
            {revealedContact && (
              <div className="mt-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[12px] text-[#92400E]">
                <div className="inline-flex items-center gap-1 font-semibold">
                  <FiPhone size={12} />
                  {revealedContact.phone}
                </div>
                {revealedContact.email && <div className="mt-1">{revealedContact.email}</div>}
              </div>
            )}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Linked target
            </div>
            {complaint.entityHref ? (
              <Link
                href={complaint.entityHref}
                className="mt-1 inline-block text-sm font-semibold text-[#0A4A4A] underline underline-offset-2"
              >
                {complaint.reportedItemLabel || complaint.entityTypeLabel}
              </Link>
            ) : (
              <p className="mt-1 text-sm text-[#5C7571]">{complaint.reportedItemLabel || "—"}</p>
            )}
            <div className="mt-3 inline-flex items-center gap-1 text-sm text-[#5C7571]">
              <FiClock size={14} />
              {formatDate(complaint.createdAt)}
            </div>
          </div>
        </div>

        {complaint.events?.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Case timeline
            </div>
            <div className="mt-2 space-y-2">
              {complaint.events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-[#E6ECEA] bg-white px-3 py-2.5 text-[12px] text-[#35504C]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold capitalize text-[#0A4A4A]">
                      {(event.event_type || "event").replace(/_/g, " ")}
                    </span>
                    <span className="text-[#7A928D]">{formatDate(event.created_at)}</span>
                  </div>
                  {event.message && <p className="mt-1 leading-6">{event.message}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {canManage && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Resolution notes
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Document what action was taken…"
              disabled={!complaint.isActive}
              className="mt-2 w-full resize-none rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C] disabled:bg-[#F8FAFC]"
              rows={3}
            />
            {complaint.isActive && (
              <button
                type="button"
                onClick={() => onAddNote(note)}
                disabled={isProcessing || !note.trim()}
                className="mt-2 rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-4 py-2 text-sm font-semibold text-[#1A7A5A] disabled:opacity-60"
              >
                Save resolution notes
              </button>
            )}
          </div>
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
