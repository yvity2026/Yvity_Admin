"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiArrowRight, FiCheckCircle, FiMapPin, FiRefreshCw, FiStar, FiUser } from "react-icons/fi";

const TESTIMONIAL_TYPES = [
  { key: "text", label: "Text", accent: "text-[#0A4A4A]" },
  { key: "audio", label: "Audio", accent: "text-[#9A6700]" },
  { key: "video", label: "Video", accent: "text-[#2346A0]" },
];

export const dynamic = "force-dynamic"  
const RESPONDENT_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "advisor", label: "Advisor" },
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

function getErrorMessage(message, fallback) {
  return message || fallback;
}

function TestimonialForm() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("text");
  const [form, setForm] = useState(initialForm);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
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

  const currentFile = activeTab === "audio" ? audioFile : activeTab === "video" ? videoFile : null;

  const previewUrl = useMemo(() => {
    if (!currentFile) return "";
    return URL.createObjectURL(currentFile);
  }, [currentFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
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

  const uploadToS3 = async (file, type) => {
    if (!file) return null;

    if (type === "audio" && !file.type.startsWith("audio/")) {
      throw new Error("Please choose a valid audio file");
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      throw new Error("Please choose a valid video file");
    }

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File too large. Please upload a file under 20MB");
    }

    const extension = file.name.split(".").pop();
    const safeName = `${type}_${Date.now()}.${extension}`;
    const formData = new FormData();
    formData.append("file", file, safeName);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(getErrorMessage(json?.error, "Upload failed"));
    }

    return json.url;
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.profession.trim()) return "Profession is required";
    if (!form.city.trim()) return "City is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile_number.replace(/\D/g, "").slice(-10))) {
      return "Enter a valid 10-digit mobile number";
    }
    if (!form.respondent_type) return "Please select who you are";
    if (!form.testimonial_rating) return "Please add a rating";
    if (activeTab === "text" && !form.content.trim()) {
      return "Please write your testimonial";
    }
    if (activeTab === "audio" && !audioFile) {
      return "Please upload your audio testimonial";
    }
    if (activeTab === "video" && !videoFile) {
      return "Please upload your video testimonial";
    }
    return "";
  };

  const resetFormForAnotherSubmission = () => {
    setIsSubmitted(false);
    setActiveTab("text");
    setForm((current) => ({
      ...initialForm,
      name: current.name,
      profession: current.profession,
      city: current.city,
      respondent_type: current.respondent_type,
      mobile_number: current.mobile_number,
    }));
    resetUploads();
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      let mediaUrl = null;

      if (activeTab === "audio" && audioFile) {
        mediaUrl = await uploadToS3(audioFile, "audio");
      }

      if (activeTab === "video" && videoFile) {
        mediaUrl = await uploadToS3(videoFile, "video");
      }

      const response = await fetch("/api/testimonial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          mobile_number: form.mobile_number.replace(/\D/g, "").slice(-10),
          testimonial_type: activeTab,
          media_url: mediaUrl,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(json?.error, "Failed to submit testimonial"));
      }

      toast.success("Testimonial submitted successfully");
      setIsSubmitted(true);
      setForm((current) => ({
        ...current,
        testimonial_rating: 0,
        content: "",
      }));
      resetUploads();
    } catch (error) {
      toast.error(getErrorMessage(error?.message, "Failed to submit testimonial"));
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
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="lg:w-[42%]"
        >
          <div className="overflow-hidden rounded-[28px] border border-white/70 bg-[#0B3B3B] p-8 text-white shadow-[0_20px_80px_rgba(10,74,74,0.22)]">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              YVITY Testimonials
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Share your experience in the format that feels natural.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/76 sm:text-base">
              Choose text, audio, or video. Each mobile number can submit one testimonial per format, and your response is saved once the form is completed successfully.
            </p>

            <div className="mt-8 grid gap-3">
              {TESTIMONIAL_TYPES.map((type, index) => (
                <motion.div
                  key={type.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.35 }}
                  className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">{type.label} testimonial</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                      One per number
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/72">
                    Submit a thoughtful written review or upload an audio/video response with the same smooth flow.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
          className="flex-1"
        >
          <div className="rounded-[30px] border border-[#DBE7E4] bg-white/95 p-5 shadow-[0_16px_70px_rgba(24,57,49,0.12)] backdrop-blur md:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0A4A4A]/55">
                  Public Submission
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#113131]">
                  Tell us about your testimonial
                </h2>
              </div>
              <div className="rounded-full bg-[#EAF4F1] px-4 py-2 text-xs font-semibold text-[#0A4A4A]">
                Route: /testimonial
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[28px] border border-[#D3E9E3] bg-[linear-gradient(180deg,_#F7FCFB_0%,_#ECF7F4_100%)] p-8 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0A4A4A] text-white">
                    <FiCheckCircle size={30} />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-[#123433]">
                    Testimonial submitted successfully
                  </h3>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#456664]">
                    Thank you for sharing your experience. Your {activeTab} testimonial has been saved in the temporary testimonial store for now.
                  </p>
                  <button
                    type="button"
                    onClick={resetFormForAnotherSubmission}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A4A4A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F6161]"
                  >
                    Submit another format
                    <FiArrowRight />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="rounded-2xl bg-[#F4F7F6] p-1.5">
                    <div className="grid grid-cols-3 gap-1.5">
                      {TESTIMONIAL_TYPES.map((type) => {
                        const isActive = activeTab === type.key;
                        return (
                          <button
                            key={type.key}
                            type="button"
                            onClick={() => {
                              setActiveTab(type.key);
                              resetUploads();
                            }}
                            className={`rounded-[18px] px-4 py-3 text-sm font-semibold transition-all ${
                              isActive
                                ? "bg-white text-[#0A4A4A] shadow-sm"
                                : "text-[#506260] hover:text-[#0A4A4A]"
                            }`}
                          >
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Field
                      label="Name"
                      value={form.name}
                      onChange={(value) => updateField("name", value)}
                      placeholder="Your full name"
                      icon={<FiUser />}
                    />
                    <Field
                      label="Profession"
                      value={form.profession}
                      onChange={(value) => updateField("profession", value)}
                      placeholder="Your profession"
                    />
                    <Field
                      label="City"
                      value={form.city}
                      onChange={(value) => updateField("city", value)}
                      placeholder="Your city"
                      icon={<FiMapPin />}
                    />
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183A39]">
                        You are a
                      </label>
                      <select
                        value={form.respondent_type}
                        onChange={(event) => updateField("respondent_type", event.target.value)}
                        className="h-12 w-full rounded-2xl border border-[#D6E2DF] bg-white px-4 text-sm text-[#234040] outline-none transition-colors focus:border-[#0A4A4A]"
                      >
                        {RESPONDENT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Field
                      label="Mobile Number"
                      value={form.mobile_number}
                      onChange={(value) =>
                        updateField("mobile_number", value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="10-digit mobile number"
                    />
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#183A39]">
                        Rating
                      </label>
                      <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#D6E2DF] bg-white px-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateField("testimonial_rating", star)}
                            className={`text-xl transition-transform hover:scale-110 ${
                              star <= form.testimonial_rating ? "text-[#F4B400]" : "text-[#D0D6D4]"
                            }`}
                          >
                            <FiStar
                              className={star <= form.testimonial_rating ? "fill-[#F4B400]" : ""}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="mt-5"
                    >
                      {activeTab === "text" ? (
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[#183A39]">
                            Testimonial
                          </label>
                          <textarea
                            rows={6}
                            value={form.content}
                            onChange={(event) => updateField("content", event.target.value)}
                            placeholder="Share your experience here..."
                            className="w-full rounded-[22px] border border-[#D6E2DF] bg-white px-4 py-4 text-sm text-[#234040] outline-none transition-colors focus:border-[#0A4A4A] resize-none"
                          />
                        </div>
                      ) : (
                        <div className="rounded-[24px] border border-dashed border-[#BFD1CD] bg-[#F7FAF9] p-5">
                          <label className="mb-3 block text-sm font-semibold text-[#183A39]">
                            Upload {activeTab} testimonial
                          </label>
                          <input
                            type="file"
                            accept={activeTab === "audio" ? "audio/*" : "video/*"}
                            onChange={(event) =>
                              handleFileChange(activeTab, event.target.files?.[0] ?? null)
                            }
                            className="block w-full text-sm text-[#395756] file:mr-4 file:rounded-full file:border-0 file:bg-[#0A4A4A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0F6161]"
                          />

                          {currentFile ? (
                            <div className="mt-4 rounded-2xl border border-[#D6E2DF] bg-white p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm font-medium text-[#234040]">{currentFile.name}</p>
                                <button
                                  type="button"
                                  onClick={resetUploads}
                                  className="inline-flex items-center gap-2 rounded-full border border-[#D6E2DF] px-3 py-1.5 text-xs font-semibold text-[#234040]"
                                >
                                  <FiRefreshCw />
                                  Replace
                                </button>
                              </div>

                              {activeTab === "audio" ? (
                                <audio controls src={previewUrl} className="w-full" />
                              ) : (
                                <video controls src={previewUrl} className="max-h-[280px] w-full rounded-2xl bg-black object-cover" />
                              )}
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-[#607673]">
                              Upload one {activeTab} file. Maximum size: 20MB.
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[#5A7370]">
                      One mobile number can submit only one testimonial per type.
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A4A4A] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0F6161] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                      <FiArrowRight />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default function PublicTestimonialPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestimonialForm />
    </Suspense>
  );
}

function Field({ label, value, onChange, placeholder, icon = null }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#183A39]">{label}</label>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#64807B]">
            {icon}
          </span>
        ) : null}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-2xl border border-[#D6E2DF] bg-white px-4 text-sm text-[#234040] outline-none transition-colors focus:border-[#0A4A4A] ${
            icon ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
}
