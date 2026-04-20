"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import Testimonial_Stats from "@/components/features/advisor/Testimonials/Testimonial_Stats";
import Testimonials_filters from "@/components/features/advisor/Testimonials/Testimonials_filters";
import { useModal } from "@/context/ModalContext";
// import ProgressBar from "@/app/components/ui/progressionbar";
import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaPlayCircle, FaPlus, FaVideo } from "react-icons/fa";
import { FaMessage, FaShield } from "react-icons/fa6";
import { IoIosMusicalNotes } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { MdClose, MdOutlineVerifiedUser } from "react-icons/md";
import { RiVideoAiFill } from "react-icons/ri";

export const testimonialsData = [
  { count: 50, label: "total" },
  { count: 50, label: "Pending" },
  { count: 50, label: "Approval" },
  { count: 50, label: "Avg Rating" },
];

const page = () => {
  const testimonialsData1 = [
    { label: "All" },
    { icon: <IoDocumentText />, label: "Text" },
    { icon: <IoIosMusicalNotes />, label: "Audio" },
    { icon: <FaVideo />, label: "Video" },
  ];

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // const testimonialsData1 = [
  //   { label: "All", icon: "📋" },
  //   { label: "Text", icon: "📝" },
  //   { label: "Audio", icon: "🎧" },
  //   { label: "Video", icon: "🎥" },
  // ];

  const getCount = (label) => {
    if (label === "All") return testimonials.length;

    return testimonials.filter((t) => t.type === label).length;
  };

  const { trigger, clearTrigger } = useModal();
  const [isRequest, setIsRequest] = useState(false);
  useEffect(() => {
    if (trigger === "REQUEST_TESTIMONIAL") {
      setIsRequest(true);
      clearTrigger(); // IMPORTANT
    }
  }, [trigger]);

  const [isTextOpen, setIsTextOpen] = useState(false);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;

    setCurrentTime(current);
    setProgress((current / duration) * 100);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration || 0);
  };

  const testimonials = [
    {
      type: "Text",
      name: "Priya Devi",
      role: "Teacher • Hyderabad • 5 days ago",
      message: "Excellent guidance on health insurance. Highly recommend!",
      color: "bg-green-950",
    },
    {
      type: "Audio",
      name: "Suresh Reddy",
      role: "Business Owner · Vijayawada · 1 week ago",
      color: "bg-[#A5780A]",
    },
    {
      type: "Video",
      name: "Mahesh Kumar",
      role: "Govt Employee · Nellore · 2 weeks ago",
      color: "bg-green-950",
    },
  ];

  const [activeFilter, setActiveFilter] = useState("All");
  const filteredTestimonials =
    activeFilter === "All"
      ? testimonials
      : testimonials.filter((t) => t.type === activeFilter);

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div>
      <div className="px-4 md:p-6 lg:p-10 xl:px-16 xl:pt-6 mx-auto w-full flex flex-col gap-6">
        {/* Stats */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {testimonialsData.map((item, index) => (
            <div
              key={index}
              className="min-h-[70px] md:h-[86px] w-full  py-4 md:py-[12.5px] px-4 md:px-[55px] rounded-2xl border border-[#E2E1DC] bg-white"
            >
              <span className="flex items-center flex-col gap-1">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827] text-center font-poppins text-[28px] leading-normal">
                  {item.count}
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs font-medium">
                  {item.label}
                </p>
              </span>
            </div>
          ))}
        </div> */}
        <Testimonial_Stats />

        <Testimonials_filters />
      </div>

      {isTextOpen && (
        <ModalWrapper onClose={() => setIsTextOpen(false)}>
          <div className="px-5 md:px-[30px] pb-6 rounded-[30px] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
            {/* HEADER */}
            <div className="h-[62px] flex justify-between items-center border-b">
              <span className="text-[#111827] font-poppins text-base font-bold flex items-center gap-[11px]">
                <FaMessage />
                Testimonials Details
              </span>

              <MdClose
                className="cursor-pointer text-xl"
                onClick={() => setIsTextOpen(false)}
              />
            </div>

            {/* BODY */}
            <div className="mt-4 flex flex-col gap-4">
              <span className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-950 flex items-center justify-center text-white">
                  MA
                </div>
                <span className="text-[#6B7280] font-nunito text-xs font-normal leading-4 flex flex-col justify-between">
                  <p className="text-[#111827] font-poppins text-base font-bold leading-normal">
                    Priya Devi
                  </p>
                  Teacher • Nellore • 2 days ago
                </span>
              </span>
              <p className="rounded-lg bg-[#F0F8F8] px-[13px] py-[11px]  text-[#6B7280] font-nunito text-xs italic font-semibold leading-5">
                “Krishna helped me choose the right term plan. He explained
                every detail clearly. Highly trustworthy advisor!”
              </p>
              <span className="flex justify-between items-center">
                ⭐⭐⭐⭐
                <span className="flex items-center gap-2 text-[#065F46] text-right font-poppins text-xs font-semibold leading-normal">
                  <FaShield />
                  OTP Verified
                </span>
              </span>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-2">
                <button className="px-4 py-3 rounded-lg bg-[#FEF2F2] text-[#E85D5D] border border-[#FEB5B5] text-xs font-semibold">
                  Approve
                </button>

                <button
                  onClick={() => setIsDelete(false)}
                  className="px-4 py-3 rounded-lg bg-[#0A4A4A] text-white text-xs font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {isRequest && (
        <ModalWrapper onClose={() => setIsRequest(false)}>
          <div className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl no-scrollbar">
            {/* HEADER */}
            <div className="h-[62px] flex justify-between items-center border-b px-5 md:px-6">
              <span className="flex items-center gap-2 font-semibold">
                <FaMessage />
                Request Testimonials
              </span>

              <MdClose
                className="cursor-pointer"
                onClick={() => setIsRequest(false)}
              />
            </div>

            {/* BODY */}
            <div className="px-5 md:px-6 pb-6 mt-5 flex flex-col gap-4">
              <p className="rounded-lg border border-[#DBE1E0] bg-[#E0F4F3] px-4 py-4 text-[#0A4A4A] text-xs leading-5">
                Send a personalized request to your clients asking for a
                testimonial. They verify via OTP.
              </p>

              {/* Client Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Client Name <span className="text-red-600">*</span>
                </label>
                <input
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="Client Full Name"
                />
              </div>

              {/* Client Mobile */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Client Mobile <span className="text-red-600">*</span>
                </label>
                <input
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="10-digit mobile number"
                />
              </div>

              {/* Testimonial Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Testimonial Type <span className="text-red-600">*</span>
                </label>

                <select className="py-3 px-4 rounded-lg border bg-[#FAFCFB] text-sm">
                  <option value="">Select type</option>
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Personal Message (Optional)
                </label>

                <textarea
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="e.g. Hi Ravi, I hope your plan is helping..."
                />
              </div>

              {/* Add Point */}
              <button className="flex items-center gap-2 text-[#0D6060] text-sm font-semibold">
                <FaPlus />
                Add Point
              </button>

              {/* Submit */}
              <button className="mt-4 px-5 py-3 rounded-lg bg-[#0A4A4A] text-white">
                Request Testimonial
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default page;
