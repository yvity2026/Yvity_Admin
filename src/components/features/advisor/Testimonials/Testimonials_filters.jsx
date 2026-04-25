import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { FaPlayCircle, FaVideo } from "react-icons/fa";
import { FaMessage, FaShield } from "react-icons/fa6";
import { IoIosMusicalNotes } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { MdClose, MdOutlineVerifiedUser } from "react-icons/md";
import { RiVideoAiFill } from "react-icons/ri";

const Testimonials_filters = ({ showActions = true }) => {
  const [isTextOpen, setIsTextOpen] = useState(false);

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
  const [loading, setLoading] = useState(true);

  const validateTestimonialAction = (action) => {
    // Example conditions — adjust based on real logic
    if (!action) {
      toast.error("Invalid action");
      return false;
    }

    return true;
  };

  const handleApprove = async () => {
    if (!validateTestimonialAction("approve")) return;

    try {
      setLoading(true);
      // await API call
      await new Promise((res) => setTimeout(res, 1000));

      toast.success("Approved successfully");
      setIsTextOpen(false);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    if (!validateTestimonialAction("reject")) return;

    // API call here
    toast.success("Testimonial rejected");
    setIsTextOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      // await your API
      await new Promise((res) => setTimeout(res, 1500)); // simulate delay
      setLoading(false);
    };

    fetchData();
  }, []);

  const renderStars = (rating = 1) => {
  const fullStars = Math.floor(rating);

  return "⭐".repeat(fullStars);
};
  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-4">
          {/* FILTERS SKELETON */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>

          {/* CARDS SKELETON */}
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="w-full px-4 sm:px-6 md:px-[50px] py-4 rounded-2xl bg-white border-l-4 border-gray-200 flex flex-col gap-4"
            >
              {/* HEADER */}
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

              {/* CONTENT */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* MEDIA PLACEHOLDER (audio/video variation feel) */}
              <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />

              {/* FOOTER */}
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* FILTERS */}
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
            {testimonialsData1.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(item.label)}
                className={`px-3 py-1 flex items-center gap-2 rounded-2xl border text-[10px] sm:text-xs transition-all cursor-pointer
            ${
              activeFilter === item.label
                ? "bg-[#0A4A4A] text-white border-[#0A4A4A]"
                : "bg-white border-[#DADADA] text-[#111827]"
            }`}
              >
                {item.icon}

                <span className="font-poppins text-xs font-semibold">
                  {item.label} ({getCount(item.label)}) {/* ✅ COUNT ADDED */}
                </span>
              </button>
            ))}
          </div>

          {/* CARDS */}
          <div className="flex flex-col gap-4">
            {testimonials.map((testimonial) => (
              <div className="w-full px-4 sm:px-6 md:px-[50px] py-4 md:py-[19px] flex flex-col gap-[18px] md:gap-[18px] rounded-2xl border-l-4 border-l-[#E2E1DC] hover:border-l-[#0D6060] bg-white transition-all duration-300">
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                  <div className="flex gap-[16px] md:gap-[16px] items-center">
                    <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] relative rounded-full bg-green-950">
                      <Image
                        src={testimonial?.user?.selfie_url}
                        fill
                        alt="user"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm sm:text-base font-bold text-[#111827]">
                        {testimonial?.user?.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#6B7280]">
                        `${testimonial?.user?.name}`
                      </p>
                    </div>
                  </div>
                  {testimonial.type === "text" && (
                    <span className="flex items-center gap-1 text-[#0A4A4A] text-xs rounded-2xl bg-[#E8F4F4] font-semibold p-[10px]">
                      <AiFillEdit /> Text
                    </span>
                  )}
                  {testimonial.type === "audio" && (
                    <span className="flex items-center gap-1 text-[#0A4A4A] text-xs rounded-2xl bg-[#E8F4F4] font-semibold p-[10px]">
                      <IoIosMusicalNotes /> Audio
                    </span>
                  )}
                  {testimonial.type === "video" && (
                    <span className="flex items-center gap-1 text-[#0A4A4A] text-xs rounded-2xl bg-[#FDF8E5] font-semibold p-[10px]">
                      <RiVideoAiFill /> Video
                    </span>
                  )}
                </div>

                {testimonial.type === "text" && (
                  <p className="text-[#374151] text-xs sm:text-sm italic">
                    {testimonial.text}
                  </p>
                )}
                {testimonial.type === "audio" && (
                  <div className="flex items-center gap-2 rounded-lg bg-[#F0F8F8] px-4 py-2">
                    <audio
                      ref={audioRef}
                      src={testimonial.media_url}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    />

                    <FaPlayCircle
                      onClick={togglePlay}
                      className="w-[28px] h-[28px] text-[#0A4A4A] cursor-pointer"
                    />

                    <div className="flex-1 h-[6px] bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0A4A4A]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <span className="text-gray-500 font-nunito text-xs font-bold leading-4">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                )}
                {testimonial.type === "video" && (
                  <video
                    className="w-full h-[120px] rounded-md object-cover cursor-pointer"
                    controls
                  >
                    <source src={testimonial.media_url} type="video/mp4" />
                  </video>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                  <p>{renderStars(testimonial.testimonial_rating)}</p>

                  <span className="flex gap-2 items-center text-xs text-[#065F46] font-semibold">
                    <MdOutlineVerifiedUser />
                    Approved • OTP Verified
                  </span>
                  {showActions && (
                    <span className="flex gap-2">
                      <button
                        className="px-2 py-1 bg-[#E8F4F4] rounded-md text-xs cursor-pointer"
                        onClick={() => setIsTextOpen(true)}
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
            ))}
            {/* TEXT CARD */}
            {/* {(activeFilter === "All" || activeFilter === "Text") && (
            )} */}

            {/* AUDIO CARD */}
            {/* {(activeFilter === "All" || activeFilter === "Audio") && (
              <div className="w-full px-4 sm:px-6 md:px-[50px] py-4 md:py-[19px] flex flex-col gap-[18px] md:gap-[18px] rounded-2xl border-l-4 border-l-[#E2E1DC] hover:border-l-[#0D6060] bg-white">
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                  <div className="flex gap-[16px] md:gap-[16px] items-center">
                    <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-[#A5780A]"></div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm sm:text-base font-bold text-[#111827]">
                        Suresh Reddy
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#6B7280]">
                        Business Owner · Vijayawada · 1 week ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                  <p>⭐⭐⭐⭐</p>

                  <span className="flex gap-2 items-center text-xs text-[#065F46] font-semibold">
                    <MdOutlineVerifiedUser />
                    Approved • OTP Verified
                  </span>

                  <span className="flex gap-2">
                    <button className="px-2 py-1 bg-[#E8F4F4] rounded-md text-xs cursor-pointer">
                      View
                    </button>
                    <button className="px-2 py-1 border border-[#C1C1C1] rounded-md text-xs cursor-pointer">
                      Reply
                    </button>
                  </span>
                </div>
              </div>
            )} */}

            {/* VIDEO CARD */}
            {/* {(activeFilter === "All" || activeFilter === "Video") && (
              <div className="w-full px-4 sm:px-6 md:px-[50px] py-4 md:py-[19px] flex flex-col gap-[18px] rounded-2xl border-l-4 border-l-[#E2E1DC] hover:border-l-[#0D6060] bg-white">
                <div className="flex flex-col sm:flex-row justify-between gap-[16px] sm:items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-green-950"></div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm sm:text-base font-bold text-[#111827]">
                        Mahesh Kumar
                      </p>
                      <p className="text-[10px] sm:text-xs text-[#6B7280]">
                        Govt Employee · Nellore · 2 weeks ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                  <p>⭐⭐⭐⭐</p>

                  <span className="flex gap-2 items-center text-xs text-[#065F46] font-semibold">
                    <MdOutlineVerifiedUser />
                    Approved • OTP Verified
                  </span>

                  {showActions && (
                    <span className="flex gap-2">
                      <button className="px-2 py-1 bg-[#E8F4F4] rounded-md text-xs cursor-pointer">
                        View
                      </button>
                      <button className="px-2 py-1 border border-[#C1C1C1] rounded-md text-xs cursor-pointer">
                        Reply
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}

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
                <button
                  className="px-4 py-3 rounded-lg bg-[#FEF2F2] text-[#E85D5D] border border-[#FEB5B5] text-xs font-semibold"
                  onClick={() => handleApprove()}
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject()}
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
