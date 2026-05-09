"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
// import { FaMessage } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export function RequestTestimonialModal({ onClose }) {
  const [requestForm, setRequestForm] = useState({
    name: "",
    mobile: "",
    message: "",
  });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRequestChange = (key, value) => {
    setRequestForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRequestSubmit = async () => {
    setErrorMessage("");

    const name = String(requestForm.name || "").trim();
    const mobile = String(requestForm.mobile || "").replace(/\D/g, "").slice(-10);
    const message = String(requestForm.message || "").trim();

    if (!name) {
      setErrorMessage("Client name is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setErrorMessage("Enter valid 10-digit mobile number.");
      return;
    }

    setIsSubmittingRequest(true);

    try {
      const response = await fetch("/api/admin/testimonials/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          message,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setErrorMessage(json?.error || "Failed to send request.");
        toast.error(json?.error || "Failed to send request.");
        return;
      }

      toast.success("Testimonial request sent successfully.");
      onClose();
    } catch (error) {
      setErrorMessage(error?.message || "Failed to send request.");
      toast.error(error?.message || "Failed to send request.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#031818]/60 p-4 backdrop-blur-[3px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbfa_100%)] shadow-[0_30px_90px_rgba(8,51,51,0.22)] no-scrollbar"
      >
        <div className="relative overflow-hidden border-b border-[#E4ECEA] px-5 py-5 md:px-6">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(10,74,74,0.16),_transparent_70%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE1DC] bg-[#EEF7F4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A4A4A]">
                <FaComment className="text-xs" />
                WhatsApp Request
              </span>
              <h2 className="mt-3 text-[24px] font-bold text-[#143534]">
                Request a testimonial
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5B7571]">
                The WhatsApp message will open the public{" "}
                <span className="font-semibold text-[#0A4A4A]">/testimonial</span>{" "}
                page with the client details prefilled.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="relative z-10 rounded-full bg-white p-2 text-[#496562] shadow-sm ring-1 ring-[#D7E5E1] transition-colors hover:bg-[#F4F8F7]"
            >
              <MdClose className="text-lg" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 pt-5 md:px-6">
          <div className="mb-5 rounded-[22px] border border-[#DCE7E4] bg-[linear-gradient(135deg,_#F0FAF7_0%,_#E8F5F2_100%)] p-4 text-sm leading-6 text-[#315450]">
            Send a personalized testimonial request with a shareable WhatsApp link. Clients land directly on the public submission flow and can continue with text, audio, or video.
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[#183A39]">
                Client Name <span className="text-red-600">*</span>
              </label>
              <input
                className="h-12 rounded-2xl border border-[#D6E2DF] bg-white px-4 text-sm text-[#1E3E3C] outline-none transition-colors focus:border-[#0A4A4A]"
                placeholder="Enter client name"
                value={requestForm.name}
                onChange={(e) => handleRequestChange("name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[#183A39]">
                Client Mobile <span className="text-red-600">*</span>
              </label>
              <input
                className="h-12 rounded-2xl border border-[#D6E2DF] bg-white px-4 text-sm text-[#1E3E3C] outline-none transition-colors focus:border-[#0A4A4A]"
                placeholder="10-digit mobile number"
                value={requestForm.mobile}
                onChange={(e) =>
                  handleRequestChange(
                    "mobile",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-[#183A39]">
                Personal Message <span className="text-[#7E9490]">(Optional)</span>
              </label>
              <textarea
                rows={4}
                className="rounded-[22px] border border-[#D6E2DF] bg-white px-4 py-3 text-sm text-[#1E3E3C] outline-none transition-colors focus:border-[#0A4A4A] resize-none"
                placeholder="e.g. Hi Ravi, I hope your plan is helping. Your feedback would really mean a lot."
                value={requestForm.message}
                onChange={(e) => handleRequestChange("message", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-[#C8D9D5] bg-[#FAFDFC] px-4 py-3 text-xs leading-6 text-[#58726E]">
            Shared link preview:{" "}
            <span className="font-semibold text-[#0A4A4A]">/testimonial</span>
          </div>

          {errorMessage ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl border border-[#FFD7D7] bg-[#FFF5F5] px-4 py-3 text-sm text-[#C33A3A]"
            >
              {errorMessage}
            </motion.p>
          ) : null}

          <div className="mt-6 flex items-center justify-end">
            <button
              onClick={handleRequestSubmit}
              disabled={isSubmittingRequest}
              className="inline-flex items-center justify-center rounded-full bg-[#0A4A4A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#116060] hover:shadow-[0_14px_36px_rgba(10,74,74,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingRequest ? "Sending..." : "Request Testimonial"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
