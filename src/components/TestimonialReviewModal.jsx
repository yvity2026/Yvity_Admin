"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiClock, FiMapPin, FiPhone, FiStar, FiX } from "react-icons/fi";

function StatusBadge({ status }) {
  const variants = {
    approved: "bg-[#E8F5F0] text-[#1A7A5A]",
    rejected: "bg-[#FFF1F1] text-[#CC3333]",
    pending: "bg-[#FFF6E8] text-[#C57A00]",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${variants[status] || variants.pending}`}>
      {status || "pending"}
    </span>
  );
}

export default function TestimonialReviewModal({
  testimonial,
  onClose,
  onApprove,
  onReject,
  onSendReply,
  isProcessing = false,
}) {
  const [reply, setReply] = useState("");

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  if (!testimonial) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.98 }}
        className="w-full max-w-xl max-h-[90vh] overflow-hidden rounded-[26px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.18)] flex flex-col"
      >
        <div className="flex items-start justify-between border-b border-[#EDF1F0] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6A807C]">
              Testimonial Review
            </p>
            <h3 className="mt-2 text-xl font-bold text-[#183534]">{testimonial.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-full bg-[#F5F7F7] p-2 text-[#4A6460] transition-colors hover:bg-[#EBF0EF] disabled:opacity-60"
          >
            <FiX />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={testimonial.status} />
            <span className="inline-flex items-center gap-1 text-sm text-[#5C7571]">
              <FiMapPin size={14} />
              {testimonial.location}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-[#5C7571]">
              <FiPhone size={14} />
              {testimonial.phone || "Not available"}
            </span>
          </div>

          <div className="grid gap-3 rounded-2xl bg-[#F8FBFA] p-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                Advisor
              </div>
              <div className="mt-1 text-sm font-semibold text-[#173736]">
                {testimonial.advisor || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                Type
              </div>
              <div className="mt-1 text-sm font-semibold capitalize text-[#173736]">
                {testimonial.type}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                Submitted
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#173736]">
                <FiClock size={14} />
                {testimonial.submitted}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                Rating
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#173736]">
                <FiStar size={14} className="text-[#E8A020]" />
                {testimonial.rating}/5
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Review
            </div>
            <div className="mt-2 rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C]">
              {testimonial.type === "text" ? (
                testimonial.content || testimonial.review || "No review provided."
              ) : testimonial.media_url ? (
                <a
                  href={testimonial.media_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#0A4A4A] underline underline-offset-4"
                >
                  Open {testimonial.type} file
                </a>
              ) : (
                "No media attached."
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Reply
            </div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Enter your reply..."
              className="mt-2 w-full rounded-2xl border border-[#E6ECEA] bg-white px-4 py-4 text-sm leading-7 text-[#35504C] resize-none"
              rows={3}
            />
            <button
              type="button"
              onClick={() => onSendReply(reply)}
              disabled={isProcessing || !reply.trim()}
              className="mt-2 w-full rounded-xl bg-[#1A7A5A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
            >
              Send Reply
            </button>
          </div>
        </div>

        <div className="flex gap-3 border-t border-[#EDF1F0] px-6 py-5">
          <button
            type="button"
            onClick={onReject}
            disabled={isProcessing || testimonial.status === "rejected"}
            className="flex-1 rounded-xl border border-[#FFD7D7] bg-[#FFF5F5] px-4 py-3 text-sm font-semibold text-[#CC3333] disabled:opacity-60 cursor-pointer"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => onApprove(reply)}
            disabled={isProcessing || testimonial.status === "approved"}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#CFE6DA] bg-[#E8F5F0] px-4 py-3 text-sm font-semibold text-[#1A7A5A] disabled:opacity-60 cursor-pointer"
          >
            <FiCheck />
            {isProcessing ? "Updating..." : "Approve"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
