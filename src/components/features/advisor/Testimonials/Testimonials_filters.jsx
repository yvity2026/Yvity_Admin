"use client";

import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { FaPlayCircle, FaVideo } from "react-icons/fa";
import { FaMessage, FaShield } from "react-icons/fa6";
import { IoIosMusicalNotes } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { MdClose, MdOutlineVerifiedUser } from "react-icons/md";
import { RiVideoAiFill } from "react-icons/ri";

const FILTERS = [
  { label: "All" },
  { icon: <IoDocumentText />, label: "Text" },
  { icon: <IoIosMusicalNotes />, label: "Audio" },
  { icon: <FaVideo />, label: "Video" },
];

const normalizeTestimonialType = (value) => {
  if (!value) return "text";

  const normalized = String(value).trim().toLowerCase();

  if (normalized === "text" || normalized === "audio" || normalized === "video") {
    return normalized;
  }

  return "text";
};

const getDisplayType = (testimonial) =>
  normalizeTestimonialType(testimonial?.testimonial_type || testimonial?.type);

const getFilterType = (label) => {
  if (label === "Text") return "text";
  if (label === "Audio") return "audio";
  if (label === "Video") return "video";
  return "All";
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

const formatTime = (time) => {
  if (!time) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const formatRelativeDate = (value) => {
  if (!value) return "";

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
};

const renderStars = (rating = 0) => {
  const fullStars = Math.max(1, Math.round(Number(rating) || 0));
  return "★".repeat(fullStars);
};

const Testimonials_filters = ({
  showActions = true,
  allTestimonials = [],
  testimonials = [],
  loading = false,
  activeFilter = "All",
  onFilterChange,
  onTestimonialUpdate,
}) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [audioState, setAudioState] = useState({
    duration: 0,
    currentTime: 0,
    progress: 0,
  });

  const audioRef = useRef(null);

  const filteredTestimonials = useMemo(() => {
    if (activeFilter === "All") return testimonials;

    return testimonials.filter(
      (testimonial) => getDisplayType(testimonial) === getFilterType(activeFilter)
    );
  }, [activeFilter, testimonials]);

  const countSource = allTestimonials.length ? allTestimonials : testimonials;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const getCount = (label) => {
    if (label === "All") return countSource.length;

    return countSource.filter(
      (testimonial) => getDisplayType(testimonial) === getFilterType(label)
    ).length;
  };

  const togglePlay = (testimonial) => {
    if (!audioRef.current) return;

    if (playingId === testimonial.id) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }

    audioRef.current.src = testimonial.media_url || "";
    audioRef.current
      .play()
      .then(() => setPlayingId(testimonial.id))
      .catch(() => {
        toast.error("Unable to play audio");
        setPlayingId(null);
      });
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;

    setAudioState({
      currentTime: current,
      duration: audioRef.current.duration || 0,
      progress: (current / duration) * 100,
    });
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setAudioState((prev) => ({
      ...prev,
      duration: audioRef.current.duration || 0,
    }));
  };

  const handleApprove = async () => {
    if (!selectedTestimonial?.id) return;

    try {
      const res = await fetch(`/api/advisor/testimonials/${selectedTestimonial.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to approve testimonial");
      }

      toast.success("Approved successfully");
      onTestimonialUpdate?.({
        ...selectedTestimonial,
        ...json.data,
        status: "approved",
      });
      setSelectedTestimonial((prev) =>
        prev ? { ...prev, status: "approved" } : prev
      );
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleReject = async () => {
    if (!selectedTestimonial?.id) return;

    try {
      const res = await fetch(`/api/advisor/testimonials/${selectedTestimonial.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to reject testimonial");
      }

      toast.success("Rejected successfully");
      onTestimonialUpdate?.({
        ...selectedTestimonial,
        ...json.data,
        status: "rejected",
      });
      setSelectedTestimonial(null);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const getStatusText = (testimonial) => {
    if (testimonial?.status === "approved") return "Approved";
    if (testimonial?.status === "rejected") return "Rejected";
    return "Pending";
  };

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlayingId(null)}
      />

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>

          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="w-full px-4 sm:px-6 md:px-[50px] py-4 rounded-2xl bg-white border-l-4 border-gray-200 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
                    <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>

              <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />

              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            {FILTERS.map((item, index) => (
              <button
                key={index}
                onClick={() => onFilterChange?.(item.label)}
                className={`px-3 py-1 flex items-center gap-2 rounded-2xl border text-[10px] sm:text-xs transition-all cursor-pointer ${
                  activeFilter === item.label
                    ? "bg-[#0A4A4A] text-white border-[#0A4A4A]"
                    : "bg-white border-[#DADADA] text-[#111827]"
                }`}
              >
                {item.icon}

                <span className="font-poppins text-xs font-semibold">
                  {item.label} ({getCount(item.label)})
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {filteredTestimonials.map((testimonial) => {
              const type = getDisplayType(testimonial);
              const customerName =
                testimonial?.user?.name || testimonial?.name || "Customer";
              const statusText = getStatusText(testimonial);

              return (
                <div
                  key={testimonial.id}
                  className="w-full px-4 sm:px-6 md:px-[50px] py-4 md:py-[19px] flex flex-col gap-[18px] md:gap-[18px] rounded-2xl border-l-4 border-l-[#E2E1DC] hover:border-l-[#0D6060] bg-white transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                    <div className="flex gap-[16px] md:gap-[16px] items-center">
                      <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] relative rounded-full bg-green-950 overflow-hidden flex items-center justify-center text-white text-xs font-semibold">
                        {testimonial?.user?.selfie_url ? (
                          <Image
                            src={testimonial.user.selfie_url}
                            fill
                            alt={customerName}
                            className="object-cover"
                          />
                        ) : (
                          <span>{getInitials(customerName)}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm sm:text-base font-bold text-[#111827]">
                          {customerName}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#6B7280]">
                          {[testimonial?.mobile_number, formatRelativeDate(testimonial?.created_at)]
                            .filter(Boolean)
                            .join(" • ")}
                        </p>
                      </div>
                    </div>
                    {type === "text" && (
                      <span className="flex items-center gap-1 text-[#0A4A4A] text-xs rounded-2xl bg-[#E8F4F4] font-semibold p-[10px]">
                        <AiFillEdit /> Text
                      </span>
                    )}
                    {type === "audio" && (
                      <span className="flex items-center gap-1 text-[#0A4A4A] text-xs rounded-2xl bg-[#E8F4F4] font-semibold p-[10px]">
                        <IoIosMusicalNotes /> Audio
                      </span>
                    )}
                    {type === "video" && (
                      <span className="flex items-center gap-1 text-[#0A4A4A] text-xs rounded-2xl bg-[#FDF8E5] font-semibold p-[10px]">
                        <RiVideoAiFill /> Video
                      </span>
                    )}
                  </div>

                  {type === "text" && (
                    <p className="text-[#374151] text-xs sm:text-sm italic">
                      {testimonial.content || "No testimonial content available"}
                    </p>
                  )}
                  {type === "audio" && (
                    <div className="flex items-center gap-2 rounded-lg bg-[#F0F8F8] px-4 py-2">
                      <FaPlayCircle
                        onClick={() => togglePlay(testimonial)}
                        className="w-[28px] h-[28px] text-[#0A4A4A] cursor-pointer"
                      />

                      <div className="flex-1 h-[6px] bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0A4A4A]"
                          style={{
                            width:
                              playingId === testimonial.id
                                ? `${audioState.progress}%`
                                : "0%",
                          }}
                        />
                      </div>

                      <span className="text-gray-500 font-nunito text-xs font-bold leading-4">
                        {playingId === testimonial.id
                          ? `${formatTime(audioState.currentTime)} / ${formatTime(audioState.duration)}`
                          : "0:00 / 0:00"}
                      </span>
                    </div>
                  )}
                  {type === "video" && testimonial.media_url && (
                    <video
                      className="w-full h-[120px] rounded-md object-cover cursor-pointer"
                      controls
                    >
                      <source src={testimonial.media_url} type="video/mp4" />
                    </video>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                    <p className="text-[#E1B12C]">
                      {renderStars(testimonial.testimonial_rating)}
                    </p>

                    <span className="flex gap-2 items-center text-xs text-[#065F46] font-semibold">
                      <MdOutlineVerifiedUser />
                      {statusText} •{" "}
                      {testimonial?.is_verified || testimonial?.is_mobile_verified
                        ? "OTP Verified"
                        : "Verification Pending"}
                    </span>
                    {showActions && (
                      <span className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-[#E8F4F4] rounded-md text-xs cursor-pointer"
                          onClick={() => setSelectedTestimonial(testimonial)}
                        >
                          View
                        </button>
                        <button className="px-2 py-1 border border-[#C1C1C1] rounded-md text-xs cursor-pointer">
                          Reply
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {!filteredTestimonials.length && (
              <div className="w-full px-4 sm:px-6 md:px-[50px] py-8 rounded-2xl bg-white text-sm text-[#6B7280]">
                No testimonials found for this filter.
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTestimonial && (
        <ModalWrapper onClose={() => setSelectedTestimonial(null)}>
          <div className="px-5 md:px-[30px] pb-6 rounded-[30px] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
            <div className="h-[62px] flex justify-between items-center border-b">
              <span className="text-[#111827] font-poppins text-base font-bold flex items-center gap-[11px]">
                <FaMessage />
                Testimonials Details
              </span>

              <MdClose
                className="cursor-pointer text-xl"
                onClick={() => setSelectedTestimonial(null)}
              />
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <span className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-950 flex items-center justify-center text-white overflow-hidden relative">
                  {selectedTestimonial?.user?.selfie_url ? (
                    <Image
                      src={selectedTestimonial.user.selfie_url}
                      fill
                      alt={selectedTestimonial?.user?.name || selectedTestimonial?.name || "Customer"}
                      className="object-cover"
                    />
                  ) : (
                    <span>
                      {getInitials(
                        selectedTestimonial?.user?.name || selectedTestimonial?.name || "Customer"
                      )}
                    </span>
                  )}
                </div>
                <span className="text-[#6B7280] font-nunito text-xs font-normal leading-4 flex flex-col justify-between">
                  <p className="text-[#111827] font-poppins text-base font-bold leading-normal">
                    {selectedTestimonial?.user?.name ||
                      selectedTestimonial?.name ||
                      "Customer"}
                  </p>
                  {[selectedTestimonial?.mobile_number, formatRelativeDate(selectedTestimonial?.created_at)]
                    .filter(Boolean)
                    .join(" • ")}
                </span>
              </span>

              {getDisplayType(selectedTestimonial) === "text" && (
                <p className="rounded-lg bg-[#F0F8F8] px-[13px] py-[11px] text-[#6B7280] font-nunito text-xs italic font-semibold leading-5">
                  {selectedTestimonial?.content || "No testimonial content available"}
                </p>
              )}

              {getDisplayType(selectedTestimonial) === "audio" && (
                <audio
                  controls
                  className="w-full"
                  src={selectedTestimonial?.media_url || ""}
                />
              )}

              {getDisplayType(selectedTestimonial) === "video" &&
                selectedTestimonial?.media_url && (
                  <video controls className="w-full rounded-lg">
                    <source src={selectedTestimonial.media_url} type="video/mp4" />
                  </video>
                )}

              <span className="flex justify-between items-center">
                <span className="text-[#E1B12C]">
                  {renderStars(selectedTestimonial?.testimonial_rating)}
                </span>
                <span className="flex items-center gap-2 text-[#065F46] text-right font-poppins text-xs font-semibold leading-normal">
                  <FaShield />
                  {selectedTestimonial?.is_verified ||
                  selectedTestimonial?.is_mobile_verified
                    ? "OTP Verified"
                    : "Verification Pending"}
                </span>
              </span>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-2">
                <button
                  className="px-4 py-3 rounded-lg bg-[#FEF2F2] text-[#E85D5D] border border-[#FEB5B5] text-xs font-semibold"
                  onClick={handleApprove}
                >
                  Approve
                </button>

                <button
                  onClick={handleReject}
                  className="px-4 py-3 rounded-lg bg-[#0A4A4A] text-white text-xs font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

export default Testimonials_filters;