"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowRight,
  FiCheckCircle,
  FiHeadphones,
  FiMapPin,
  FiMessageSquare,
  FiRefreshCw,
  FiStar,
  FiUser,
  FiVideo,
} from "react-icons/fi";

const TESTIMONIAL_TYPES = [
  { key: "text", label: "Text", icon: FiMessageSquare },
  { key: "audio", label: "Audio", icon: FiHeadphones },
  { key: "video", label: "Video", icon: FiVideo },
];

const RESPONDENT_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "advisor", label: "Professional" },
];

const initialForm = {
  name: "",
  profession: "",
  city: "",
  respondent_type: "customer",
  mobile_number: "",
  testimonial_rating: 0,
  content: "",
};

export default function GivePlatformTestimonialForm() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("text");
  const [form, setForm] = useState(initialForm);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: searchParams.get("name") || current.name,
      mobile_number:
        (searchParams.get("mobile") || current.mobile_number).replace(/\D/g, "").slice(-10),
    }));
  }, [searchParams]);

  useEffect(() => {
    if (!otpSent || otpSecondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setOtpSecondsLeft((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [otpSent, otpSecondsLeft]);

  const currentFile = activeTab === "audio" ? audioFile : activeTab === "video" ? videoFile : null;

  const previewUrl = useMemo(() => {
    if (!currentFile) return "";
    return URL.createObjectURL(currentFile);
  }, [currentFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "mobile_number") {
      setOtpSent(false);
      setOtp("");
      setOtpSecondsLeft(0);
    }
  };

  const handleFileChange = (type, file) => {
    if (type === "audio") {
      setAudioFile(file);
      setVideoFile(null);
      return;
    }
    setVideoFile(file);
    setAudioFile(null);
  };

  const resetUploads = () => {
    setAudioFile(null);
    setVideoFile(null);
  };

  const sendOtp = async () => {
    const mobile = form.mobile_number.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Enter a valid 10-digit mobile number first");
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch("/api/platform-testimonials/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Could not send OTP");
      setOtpSent(true);
      setOtpSecondsLeft(60);
      toast.success(json?.message || "OTP sent");
    } catch (error) {
      toast.error(error.message || "Could not send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async () => {
    const mobile = form.mobile_number.replace(/\D/g, "").slice(-10);

    if (!otpSent || otp.trim().length < 6) {
      toast.error("Verify your mobile with OTP before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("name", form.name.trim());
      formData.set("profession", form.profession.trim());
      formData.set("city", form.city.trim());
      formData.set("respondent_type", form.respondent_type);
      formData.set("mobile_number", mobile);
      formData.set("testimonial_type", activeTab);
      formData.set("testimonial_rating", String(form.testimonial_rating));
      formData.set("content", form.content.trim());
      formData.set("otp", otp.trim());

      if (activeTab === "audio" && audioFile) formData.set("media", audioFile);
      if (activeTab === "video" && videoFile) formData.set("media", videoFile);

      const response = await fetch("/api/platform-testimonials", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json?.error || "Failed to submit testimonial");

      toast.success(json?.message || "Testimonial submitted successfully");
      setIsSubmitted(true);
      setForm((current) => ({ ...current, testimonial_rating: 0, content: "" }));
      resetUploads();
      setOtp("");
      setOtpSent(false);
    } catch (error) {
      toast.error(error.message || "Failed to submit testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(10,74,74,0.18),_transparent_45%),linear-gradient(180deg,_#f9faf8_0%,_#eef6f4_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:w-[42%]"
        >
          <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[#0B3B3B] p-8 text-white shadow-[0_20px_80px_rgba(10,74,74,0.22)]">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              About YVITY
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Share how YVITY helped you
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/76 sm:text-base">
              Same format as advisor testimonials — text, audio, or video — but your review is about
              the YVITY platform itself. Submissions are reviewed before appearing on the landing page.
            </p>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <div className="rounded-[30px] border border-[#DBE7E4] bg-white/95 p-5 shadow-[0_16px_70px_rgba(24,57,49,0.12)] md:p-7">
            {isSubmitted ? (
              <div className="rounded-[28px] border border-[#D3E9E3] bg-[linear-gradient(180deg,_#F7FCFB_0%,_#ECF7F4_100%)] p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0A4A4A] text-white">
                  <FiCheckCircle size={30} />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-[#123433]">Thank you for your review</h3>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#456664]">
                  Your {activeTab} testimonial about YVITY was submitted and is pending admin approval.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A4A4A] px-6 py-3 text-sm font-semibold text-white"
                >
                  Submit another format
                  <FiArrowRight />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0A4A4A]/55">
                    Give testimonial
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#113131]">Tell us about YVITY</h2>
                </div>

                <div className="rounded-2xl bg-[#F4F7F6] p-1.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    {TESTIMONIAL_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isActive = activeTab === type.key;
                      return (
                        <button
                          key={type.key}
                          type="button"
                          onClick={() => {
                            setActiveTab(type.key);
                            resetUploads();
                          }}
                          className={`inline-flex items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-white text-[#0A4A4A] shadow-sm"
                              : "text-[#506260] hover:text-[#0A4A4A]"
                          }`}
                        >
                          <Icon size={14} />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Name" value={form.name} onChange={(v) => updateField("name", v)} icon={<FiUser />} />
                  <Field label="Profession" value={form.profession} onChange={(v) => updateField("profession", v)} />
                  <Field label="City" value={form.city} onChange={(v) => updateField("city", v)} icon={<FiMapPin />} />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#183A39]">You are a</label>
                    <select
                      value={form.respondent_type}
                      onChange={(e) => updateField("respondent_type", e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#D6E2DF] bg-white px-4 text-sm text-[#234040] outline-none focus:border-[#0A4A4A]"
                    >
                      {RESPONDENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="Mobile number"
                    value={form.mobile_number}
                    onChange={(v) => updateField("mobile_number", v.replace(/\D/g, "").slice(0, 10))}
                  />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#183A39]">Rating</label>
                    <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#D6E2DF] bg-white px-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => updateField("testimonial_rating", star)}
                          className={`text-xl ${star <= form.testimonial_rating ? "text-[#F4B400]" : "text-[#D0D6D4]"}`}
                        >
                          <FiStar className={star <= form.testimonial_rating ? "fill-[#F4B400]" : ""} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#D6E2DF] bg-[#FAFCFB] p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={sendingOtp}
                      className="rounded-full bg-[#0A4A4A] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {sendingOtp ? "Sending…" : otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                    {otpSent && otpSecondsLeft > 0 && (
                      <span className="text-xs text-[#5C7571]">Resend in {otpSecondsLeft}s</span>
                    )}
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit OTP"
                      className="h-10 w-36 rounded-xl border border-[#D6E2DF] px-3 text-sm outline-none focus:border-[#0A4A4A]"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#7A928D]">Dev mode accepts OTP 123456.</p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                    {activeTab === "text" ? (
                      <textarea
                        rows={6}
                        value={form.content}
                        onChange={(e) => updateField("content", e.target.value)}
                        placeholder="What has YVITY helped you with?"
                        className="w-full rounded-[22px] border border-[#D6E2DF] bg-white px-4 py-4 text-sm text-[#234040] outline-none focus:border-[#0A4A4A] resize-none"
                      />
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-[#BFD1CD] bg-[#F7FAF9] p-5">
                        <input
                          type="file"
                          accept={activeTab === "audio" ? "audio/*" : "video/*"}
                          onChange={(e) => handleFileChange(activeTab, e.target.files?.[0] ?? null)}
                          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#0A4A4A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                        />
                        {currentFile && (
                          <div className="mt-4 rounded-2xl border border-[#D6E2DF] bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-sm font-medium">{currentFile.name}</p>
                              <button type="button" onClick={resetUploads} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold">
                                <FiRefreshCw size={12} />
                                Replace
                              </button>
                            </div>
                            {activeTab === "audio" ? (
                              <audio controls src={previewUrl} className="w-full" />
                            ) : (
                              <video controls src={previewUrl} className="max-h-[280px] w-full rounded-2xl bg-black object-cover" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0A4A4A] px-6 py-3 text-sm font-semibold text-white disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting ? "Submitting…" : "Submit testimonial"}
                  <FiArrowRight />
                </button>
              </>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, icon = null }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#183A39]">{label}</label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#64807B]">
            {icon}
          </span>
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-[#D6E2DF] bg-white px-4 text-sm text-[#234040] outline-none focus:border-[#0A4A4A] ${icon ? "pl-11" : ""}`}
        />
      </div>
    </div>
  );
}
