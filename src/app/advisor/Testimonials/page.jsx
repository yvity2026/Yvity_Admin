"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
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

const page = () => {
  const testimonialsData = [
    { count: 50, label: "total" },
    { count: 50, label: "Pending" },
    { count: 50, label: "Approval" },
    { count: 50, label: "Avg Rating" },
  ];

  const testimonialsData1 = [
    { label: "All(50)" },
    { icon: <IoDocumentText />, label: "Text" },
    { icon: <IoIosMusicalNotes />, label: "Audio" },
    { icon: <FaVideo />, label: "video" },
  ];

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
    const audio = audioRef.current;
    if (!audio) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress(percent);
  };

  return (
    <div>
      <div className="px-4 md:p-6 lg:p-10 xl:px-16 xl:pt-6 mx-auto w-full flex flex-col gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
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
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
          {testimonialsData1.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 flex items-center gap-2 rounded-2xl border border-[#DADADA] bg-white text-[10px] sm:text-xs"
            >
              {item.icon}
              <p className="text-[#111827] font-poppins text-xs font-semibold leading-normal">
                {item.label}
              </p>
            </span>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {/* TEXT CARD */}
          <div className="w-full px-4 sm:px-6 md:px-[50px] py-4 md:py-[19px] flex flex-col gap-4 md:gap-[18px] rounded-2xl border-l-4 border-l-[#E2E1DC] hover:border-l-[#0D6060] bg-white transition-all duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
              <div className="flex gap-3 items-center">
                <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-green-950"></div>
                <div>
                  <p className="text-sm sm:text-base text-[#111827] font-poppins text-base font-bold leading-normal">
                    Priya Devi
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#6B7280] font-nunito text-xs font-normal leading-4">
                    Teacher • Hyderabad • 5 days ago
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 text-[#0A4A4A]  text-[clamp(8px,1vw,12px)] rounded-2xl bg-[#E8F4F4] font-semibold leading-normal p-[10px]">
                <AiFillEdit />
                Text
              </span>
            </div>

            <p className="text-[#374151] text-xs sm:text-sm italic font-[14px]">
              "Excellent guidance on health insurance. Highly recommend!"
            </p>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
              <p>⭐⭐⭐⭐</p>

              <span className="flex gap-2 items-center text-[10px] sm:text-xs text-[#065F46] font-poppins font-semibold leading-normal">
                <MdOutlineVerifiedUser />
                Approved • OTP Verified
              </span>

              <span className="flex gap-2">
                <button
                  className="px-2 py-1 text-[#0A4A4A] font-medium leading-normal sm:text-xs rounded-md border border-[#D5D5D5] bg-[#E8F4F4] text-[clamp(8px,1vw,12px)]"
                  onClick={() => setIsTextOpen(true)}
                >
                  View
                </button>
                <button className="px-2 py-1 text-[#0A4A4A] font-medium leading-normal sm:text-xs rounded-md border border-[#D5D5D5] text-[clamp(8px,1vw,12px)]">
                  Reply
                </button>
              </span>
            </div>
          </div>

          {/* AUDIO CARD */}
          <div className="w-full  px-4 sm:px-6 md:px-[50px] py-4 md:py-[19px] flex flex-col gap-4 rounded-2xl border-l-4 hover:border-l-[#0D6060] border-l-[#E2E1DC] bg-white">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
              <div className="flex gap-3 items-center">
                <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-[#A5780A]"></div>
                <div>
                  <p className="text-sm sm:text-base text-[#111827] font-poppins text-base font-bold leading-normal">
                    Suresh Reddy
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#6B7280] font-nunito text-xs font-normal leading-4">
                    Business Owner · Vijayawada · 1 week ago
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 text-[#0A4A4A]  text-[clamp(8px,1vw,12px)] rounded-2xl bg-[#E8F4F4] font-semibold leading-normal p-[10px]">
                <IoIosMusicalNotes />
                Audio
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-[11px] md:h-[48px] rounded-lg bg-[#F0F8F8] md:px-[89px] py-[8px]">
      
      {/* Audio element */}
      <audio
        ref={audioRef}
        src="/your-audio.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Play button */}
      <FaPlayCircle
        onClick={togglePlay}
        className="md:h-[32px] w-[32px] text-[#0A4A4A] cursor-pointer"
      />

      {/* Progress bar */}
      <div className="flex-1 h-[6px] md:h-[8px] bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0A4A4A] rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time (simple placeholder) */}
      <span className="text-gray-500 font-nunito text-xs font-bold leading-4">
        {Math.floor(progress / 100 * 100)}%
      </span>
    </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
              <p>⭐⭐⭐⭐</p>
              <span className="flex gap-2 items-center text-[10px] sm:text-xs text-[#065F46] font-poppins  font-semibold leading-normal">
                <MdOutlineVerifiedUser />
                Approved • OTP Verified
              </span>
              <span className="flex gap-2">
                <button
                  className="px-2 py-1 text-[#0A4A4A] font-medium leading-normal sm:text-xs rounded-md border border-[#D5D5D5] bg-[#E8F4F4] text-[clamp(8px,1vw,12px)]"
                  onClick={() => setIsTextOpen(true)}
                >
                  View
                </button>
                <button className="px-2 py-1 text-[#0A4A4A] font-medium leading-normal sm:text-xs rounded-md border border-[#D5D5D5] text-[clamp(8px,1vw,12px)]">
                  Reply
                </button>
              </span>
            </div>
          </div>

          {/* VIDEO CARD */}
          <div className="w-full px-4 sm:px-6 md:px-[50px] py-4 md:py-[19px] flex flex-col gap-4 rounded-2xl border-l-4 border-l-[#E2E1DC] hover:border-l-[#0D6060] bg-white">
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
              <div className="flex gap-3 items-center">
                <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-green-950"></div>
                <div>
                  <p className="text-sm sm:text-base text-[#111827] font-poppins text-base font-bold leading-normal">
                    Mahesh Kumar
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#6B7280] font-nunito text-xs font-normal leading-4">
                    Govt Employee · Nellore · 2 weeks ago
                  </p>
                </div>
              </div>

             <span className="flex items-center gap-1 text-[#0A4A4A] font-poppins text-[clamp(8px,1vw,12px)] rounded-2xl bg-[#FDF8E5] font-semibold leading-normal p-[10px]">
                <RiVideoAiFill />
                Video
              </span>
            </div>

            <video
              className="w-full h-[120px] md:h-[102px] rounded-md cursor-pointer object-cover"
              controls
            >
              <source src="/your-video.mp4" type="video/mp4" />
            </video>

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
              <p>⭐⭐⭐⭐</p>
              <span className="flex gap-2 items-center text-[10px] sm:text-xs text-[#065F46] font-poppins font-semibold leading-normal">
                <MdOutlineVerifiedUser />
                Approved • OTP Verified
              </span>
              <span className="flex gap-2">
                <button
                  className="px-2 py-1 text-[#0A4A4A] font-medium leading-normal sm:text-xs rounded-md border border-[#D5D5D5] bg-[#E8F4F4] text-[clamp(8px,1vw,12px)]"
                  onClick={() => setIsTextOpen(true)}
                >
                  View
                </button>
                <button className="px-2 py-1 text-[#0A4A4A] font-medium leading-normal sm:text-xs rounded-md border border-[#D5D5D5] text-[clamp(8px,1vw,12px)]">
                  Reply
                </button>
              </span>
            </div>
          </div>
        </div>
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
