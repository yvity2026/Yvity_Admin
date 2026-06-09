"use client";

import {
  FiMessageSquare,
  FiMic,
  FiStar,
  FiVideo,
} from "react-icons/fi";
import { AdminEmptyState } from "@/components/admin/ui";

const VISIBILITY_STYLES = {
  public: "bg-[#E8F5F0] text-[#1A7A5A]",
  hidden: "bg-[#F8FAFC] text-[#64748B]",
  pending: "bg-[#FFF6E8] text-[#B45309]",
};

const TYPE_ICONS = {
  text: FiMessageSquare,
  audio: FiMic,
  video: FiVideo,
};

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

function Avatar({ name }) {
  const initials = (name || "R")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A4A4A] text-sm font-bold text-white">
      {initials}
    </div>
  );
}

export default function PlatformReviewsTable({ reviews = [], onInspect }) {
  if (!reviews.length) {
    return (
      <AdminEmptyState
        title="No platform testimonials found"
        description="Try adjusting search or filters."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="hidden lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Reviewer</th>
              <th className="px-5 py-4">About</th>
              <th className="px-5 py-4">User type</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Platform reply</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Submitted</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const TypeIcon = TYPE_ICONS[review.type] || FiMessageSquare;

              return (
                <tr key={review.id} className="border-b border-[#F3F6F5] last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={review.reviewerName} />
                      <div>
                        <p className="text-sm font-semibold text-[#183534]">{review.reviewerName}</p>
                        <p className="text-[12px] text-[#7A928D]">{review.profession || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#183534]">{review.subjectLabel}</p>
                    <p className="line-clamp-1 text-[12px] text-[#7A928D]">{review.preview}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#35504C]">{review.userType}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F8F7] px-2.5 py-1 text-[11px] font-semibold capitalize text-[#0A4A4A]">
                      <TypeIcon size={12} />
                      {review.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#183534]">
                      <FiStar size={13} className="text-[#F59E0B]" />
                      {review.rating}/5
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        review.hasPlatformReply
                          ? "bg-[#E8F5F0] text-[#1A7A5A]"
                          : "bg-[#F8FAFC] text-[#64748B]"
                      }`}
                    >
                      {review.hasPlatformReply ? "Replied" : "Awaiting"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${VISIBILITY_STYLES[review.visibility] || VISIBILITY_STYLES.pending}`}
                    >
                      {review.statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5C7571]">{formatDate(review.submittedAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onInspect(review)}
                      className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#F3F6F5] lg:hidden">
        {reviews.map((review) => {
          const TypeIcon = TYPE_ICONS[review.type] || FiMessageSquare;

          return (
            <div key={review.id} className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <Avatar name={review.reviewerName} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#183534]">{review.reviewerName}</p>
                  <p className="text-[12px] text-[#7A928D]">
                    about {review.subjectLabel} · {review.userType}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${VISIBILITY_STYLES[review.visibility] || VISIBILITY_STYLES.pending}`}
                >
                  {review.statusLabel}
                </span>
              </div>

              <p className="line-clamp-2 text-[13px] leading-6 text-[#35504C]">{review.preview}</p>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5C7571]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F8F7] px-2 py-1 font-semibold capitalize text-[#0A4A4A]">
                  <TypeIcon size={11} />
                  {review.type}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FiStar size={11} className="text-[#F59E0B]" />
                  {review.rating}/5
                </span>
                <span className={review.hasPlatformReply ? "text-[#1A7A5A] font-semibold" : "text-[#64748B]"}>
                  {review.hasPlatformReply ? "YVITY replied" : "Awaiting reply"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onInspect(review)}
                className="w-full rounded-xl bg-[#0A4A4A] px-3 py-2.5 text-[12px] font-semibold text-white"
              >
                Inspect
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
