"use client";
import ProgressBar from "@/app/components/ui/Progressionbar";
import React, { useEffect, useState } from "react";
import {
  BsChatDots,
  BsChatSquare,
  BsFillInfoSquareFill,
  BsShare,
} from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import {
  FaBuilding,
  FaFacebookF,
  FaLink,
  FaPlay,
  FaPlayCircle,
  FaWhatsapp,
} from "react-icons/fa";
import { IoIosCall, IoIosPlay, IoMdCheckmarkCircle } from "react-icons/io";
import {
  MdBarChart,
  MdCall,
  MdLocationPin,
  MdOutlineChevronLeft,
  MdOutlineMail,
  MdSms,
} from "react-icons/md";
import { TbAlertSquareFilled, TbDownload, TbMail } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import { IoClose, IoQrCode } from "react-icons/io5";
import { FiArrowRight, FiCheckCircle, FiUpload } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCirclePlay } from "react-icons/fa6";
import { BiSolidCapsule } from "react-icons/bi";
import { PiHospitalBold } from "react-icons/pi";
import { MdVideoCameraFront } from "react-icons/md";

import toast from "react-hot-toast";
import { ChevronDown, ShieldCheck } from "lucide-react";
import JourneySection from "@/components/features/advisor/professional-journey/journey-section";
const journeyData = [];
import AchievementCard from "@/components/features/advisor/achievements/achievement-card";
import { achievementsData } from "../achievements/page";
import Testimonials_filters from "@/components/features/advisor/Testimonials/Testimonials_filters";
// import { galleryData } from "../gallery/page";
const galleryData = [];
import GalleryItem from "@/components/features/advisor/gallery/gallery-item";
import ServiceSection from "@/components/features/advisor/services/ServiceSection";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "@/app/components/skeleton/Skeleton";
import Image from "next/image";
import { useAuth } from "@/context/AuthUserContext";
import GiveTestimonialModal from "@/components/features/user/landing/modals/public-profile/GiveTestimonialModal";
import { resolveAdvisorProfileSlug } from "@/lib/advisor/profileSlug";
const page = () => {
  const qrRef = React.useRef(null);
  const { user, advisor, loading: authLoading } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [appOrigin, setAppOrigin] = useState("");
  const [serverBaseUrl, setServerBaseUrl] = useState("");
  const [advisorScore, setAdvisorScore] = useState({
    total: 0,
    max: 100,
  });
  const introVideoUrl = advisor?.intro_url?.trim() || "";
  const introVideoTitle = user?.name
    ? `${user.name} Introduction`
    : "Advisor Introduction";
  const introVideoSubtitle = [user?.profession, user?.city]
    .filter(Boolean)
    .join(" • ");
  const galleryData = [

  ]
  const MODALS = {
    TESTIMONIAL: "testimonial",
    RECOMMEND: "recommend",
    SHARE: "share",
    VIDEO: "video",
    QR: "qr",
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAppOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchPublicBaseUrl() {
      try {
        const response = await fetch("/api/config/public-base-url", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result?.baseUrl || !isMounted) {
          return;
        }

        setServerBaseUrl(result.baseUrl);
      } catch (error) {
        console.error("Failed to load public base URL:", error);
      }
    }

    fetchPublicBaseUrl();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchAdvisorScore() {
      try {
        const response = await fetch("/api/advisor/yvity-score-summary", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result?.success || !isMounted) {
          return;
        }

        setAdvisorScore({
          total: result.data?.total ?? 0,
          max: result.data?.max ?? 100,
        });
      } catch (error) {
        console.error("Failed to load advisor score:", error);
      }
    }

    fetchAdvisorScore();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEditClick = (entry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleDeleteClick = (entry) => {
    setDeletingEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const handleOpenIntroVideo = () => {
    if (!introVideoUrl) {
      toast.error("Intro video is not available");
      return;
    }

    setActiveModal(MODALS.VIDEO);
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = qrDownloadFileName;
    link.click();
  };

  const advisorProfileSlug = resolveAdvisorProfileSlug(
    advisor?.profile_slug,
    user?.name,
  );
  const advisorProfileId = advisor?.advisor_id || user?.id || "";
  const publicProfilePath = advisorProfileSlug
    ? `/dashboard/${advisorProfileSlug}`
    : advisorProfileId
      ? `/dashboard/${advisorProfileId}`
      : "";
  const publicBaseUrl = serverBaseUrl || appOrigin;
  const normalizedBaseUrl = publicBaseUrl
    ? publicBaseUrl.replace(/\/+$/, "")
    : "";
  const publicProfileUrl =
    normalizedBaseUrl && publicProfilePath
      ? `${normalizedBaseUrl}${publicProfilePath}`
      : publicProfilePath;
  const publicProfileLabel = publicProfileUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const qrDownloadFileName = `${advisorProfileSlug || "advisor"}-qr.png`;

  const stats = [
    {
      icon: <MdLocationPin />,
      data: "Nellore, Andhra Pradesh",
    },
    {
      icon: <MdLocationPin />,
      data: "Member since January 2019",
    },
    {
      icon: <MdLocationPin />,
      data: "IRDAI License verified",
    },
    {
      icon: <MdLocationPin />,
      data: "Last updated 2 days ago",
    },
  ];
  const aboutData = ["Founding Advisor", "Licence verifiled", "MDRT Advisor"];
  const summaryData = [
    {
      count: "14+",
      label: "Exp",
    },
    {
      count: "50",
      label: "Reviews",
    },
    {
      count: "32",
      label: "Recs",
    },
    {
      count: "500",
      label: "Clients",
    },
  ];

  const statsData = [
    { label: "Testimonials", value: 12 },
    { label: "Recommendations", value: 8 },
    { label: "Profile Views", value: 245 },
    { label: "Member Since", value: "2023" },
  ];

  const [isOpen, setIsOpen] = useState(true);
  const footerheadings = [
    {
      name: "Home",
      isvisible: true
    },
    {
      name: "Journey",
      isvisible: advisor?.ispublic_professional
    },
    {
      name: "Service",
      isvisible: advisor?.ispublic_services
    },
    {
      name: "Achievements",
      isvisible: advisor?.ispublic_achievements
    },
    {
      name: "Gallery",
      isvisible: advisor?.ispublic_gallery
    },
    {
      name: "Testimonials",
      isvisible: advisor?.ispublic_testimonials
    },
  ];

  const [activeTab, setActiveTab] = useState("Home");

  const item = {
    title: "Life Insurance",
    subtitle: "LIC of India • 14+ years",
    icon: <ShieldCheck className="w-5 h-5 text-blue-500" />,
    timeline: [
      {
        year: "2024 - PRESENT",
        role: "Senior Development Officer",
        company: "LIC of India • Nellore Branch",
      },
      {
        year: "2019 - 2024",
        role: "LIC Advisor – MDRT Qualifier",
        company: "LIC of India",
      },
      {
        year: "2015 - 2019",
        role: "Insurance Advisor",
      },
    ],
  };

  const companies = [
    {
      icon: <CiBank />,
      data: "Quick Response",

    },
    {
      icon: <BiSolidCapsule />,
      data: "Best Policy Advice",
    },
    {
      icon: <PiHospitalBold />,
      data: "Great Experience",
    },
  ];
  const router = useRouter();

  const actions = [
    {
      label: "Recommendations",
      icon: <AiOutlineLike />,
      modal: MODALS.RECOMMEND,
    },
    {
      label: "Testimonials",
      icon: <BsChatSquare />,
      modal: MODALS.TESTIMONIAL,
    },
    { label: "Share", icon: <BsShare />, modal: MODALS.SHARE },
    { label: "QR Code", icon: <IoQrCode />, modal: MODALS.QR },
  ];


  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(0);
  const [recommendLoading, setRecommendLoading] = useState(false);

  // ✅ Validation + Submit

  const [selectedReasons, setSelectedReasons] = useState([]);
  // const [mobile, setMobile] = useState("");
  // const [authLoading, setLoading] = useState(false);

  const reasonsList = [
    "Helpful & Honest",
    "Expert Knowledge",
    "Quick Response",
    "Best Policy Advice",
    "Trustworthy",
    "Great Experience",
  ];

  // ✅ toggle selection
  const toggleReason = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason],
    );
  };

  // ✅ submit
  const handleRecommend = async () => {
    if (selectedReasons.length === 0) {
      toast.error("Please select at least one reason");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setRecommendLoading(true);

      // 🔥 replace with real API
      await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reasons: selectedReasons,
          mobile,
        }),
      });

      toast.success("Recommendation submitted & OTP sent");

      // reset
      setSelectedReasons([]);
      setMobile("");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      await new Promise((res) => setTimeout(res, 1500)); // simulate delay
      setRecommendLoading(false);
    }
  };


  

  return (
    <div className="bg-[#F8F6F1]">
      {/* Header */}
      {/* <header className="h-[60px] bg-[#0A4A4A] w-full shadow-md">
        <span
          className="flex items-center px-4 sm:px-6 md:pl-10 md:py-[18px] cursor-pointer"
          onClick={() => router.back()}
        >
          <MdOutlineChevronLeft />
          Back
        </span>
      </header> */}
      {/* content */}
      <div className="w-full flex flex-col gap-4 p-4 sm:p-6 xl:px-[15px] ">
        <div className="flex flex-col lg:flex-row pt-6 w-full gap-4">
          {/* left Portion */}
          <div className="relative rounded-2xl bg-white shadow-sm flex-1">
            <div className="h-[78px] bg-gradient-to-r from-[#032B2B] to-[#095A5B] mb-[65px] w-full rounded-t-2xl"></div>
            {/* profile circle */}
            {authLoading ? (
              <span className="absolute top-[39px] left-4 md:left-[30px]">
                <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 md:h-22 md:w-22 rounded-full" />
              </span>
            ) : (
              <span className="absolute h-16 w-16 sm:h-20 sm:w-20 md:h-22 md:w-22 rounded-full top-[39px] left-4 md:left-[30px] ring-[3px] ring-white bg-[#0A4A4A] text-white overflow-hidden">
                {user?.selfie_url ? (
                  <Image
                    src={user.selfie_url}
                    alt="User profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-2xl">
                    {/* fallback (initial or icon) */}
                    {user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </span>
            )}
            {/* Advisor Details */}
            {authLoading ? (
              <div className="px-4 md:px-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-6 w-40 rounded-md" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-48 rounded-md" />
                  </div>

                  <div className="flex flex-col gap-2 pr-6">
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                  </div>
                </div>

                {/* Intro Video */}
                <div className="mt-6 px-[29px]">
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>

                {/* About Tags */}
                <div className="mt-4 px-[29px] flex gap-2">
                  <Skeleton className="h-7 w-28 rounded-full" />
                  <Skeleton className="h-7 w-32 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>

                {/* Score Card */}
                <div className="mt-4 px-[29px]">
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>

                {/* Summary Grid */}
                <div className="mt-4 px-[29px] grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-4 px-[29px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 rounded-lg" />
                  ))}
                </div>

                {/* Download Button */}
                <div className="mt-3 px-[29px]">
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            ) : (
              <>
                <div className="px-4 md:px-6 md:flex justify-between">
                  <span className="flex flex-col gap-1">
                    <p className="text-[#111827] text-[18px] sm:text-[20px] md:text-[24px] font-bold leading-normal font-cormorant">
                      {user?.name}
                    </p>
                    <span className="flex gap-2 items-center">
                      <FiCheckCircle className="text-[#0A4A4A]" />
                      <p className="">Identity Verified</p>
                    </span>
                    <p className="text-gray-700 text-[10px] sm:text-xs md:text-xs font-normal leading-4 font-poppins">
                      {`${user?.profession} • ${user?.city}`}
                    </p>

                    {/* <p className="text-teal-950 text-[clamp(8px,1vw,12px)] font-medium leading-4 font-poppins">
                  Life Insurance · Health Insurance
                </p> */}
                  </span>
                  <span className="text-teal-950 text-[clamp(8px,1vw,12px)] font-medium leading-4 font-poppins pr-6 flex flex-col gap-3">
                    {[" Life Insurance", "Health Insurance"].map(
                      (item, index) => (
                        <p
                          key={index}
                          className="flex p-[10px] gap-1 bg-[#E0F4F3] rounded-full gap-2"
                        >
                          <FaBuilding /> {item}
                        </p>
                      ),
                    )}
                  </span>
                </div>
                {/* intro video */}
                <div className="pr-[30px] pl-[29px]">
                  <div className="bg-amber-200 w-full  pl-[20px] pr-[23px] py-[9px] mt-[24px] bg-gradient-to-r from-[#022927] to-[#053F40] rounded-lg">
                    <span
                      className="flex gap-5 h-full cursor-pointer"
                      onClick={handleOpenIntroVideo}
                    >
                      <FaRegCirclePlay
                        size={40}
                        className="flex justify-center text-white items-center"
                      />
                      <span className="flex flex-col justify-between w-full">
                        <span className="flex gap-1 text-[#F8F6F1] text-[10px] text-xs sm:text-sm font-medium leading-4 font-poppins">
                          <IoIosPlay />
                          Watch Intro Video
                        </span>
                        <p className="text-[#82ADAD] text-[10px] sm:text-xs font-normal leading-4 font-poppins">
                          {(user?.name || "Advisor")} introduces themselves
                        </p>
                      </span>
                    </span>
                  </div>
                </div>
                {/* verified fields */}
                <div className="pl-[29px] pr-4 md:pr-[40px] mt-[16px]">
                  <div className="flex gap-2 items-center">
                    {aboutData.map((data, index) => (
                      <span
                        key={index}
                        className="h-[28px] md:gap-[8px] flex items-center text-[clamp(8px,1vw,12px)] p-[10px] text-teal-950 font-semibold leading-normal font-poppins rounded-2xl bg-[#E8F1EE]"
                      >
                        <CiBank />
                        {data}
                      </span>
                    ))}
                  </div>
                  <div className="rounded-lg border border-[#E2E2E2] bg-[#F0F8F8] py-[12px] pl-[18px] pr-[34px] mt-[16px] ">
                    <span className="flex items-center gap-[11px] ">
                      <h2 className="text-teal-950 text-2xl font-bold leading-4 font-poppins">
                        {advisorScore.total}/{advisorScore.max}
                      </h2>
                      <span>⭐⭐⭐⭐</span>
                      <p className="text-gray-500 text-[10px] sm:text-xs md:text-xs font-semibold leading-normal font-poppins">
                        YVITY Credibility Score
                      </p>
                    </span>
                    <span>
                      <ProgressBar
                        value={
                          advisorScore.max
                            ? (advisorScore.total / advisorScore.max) * 100
                            : 0
                        }
                      />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {summaryData.map((item, index) => (
                      <div
                        key={index}
                        className="w-full px-4 sm:px-6 py-3 
      flex flex-col justify-center border rounded-md bg-[#F0F8F8] cursor-pointer rounded-lg border border-[#E2E2E2] bg-[#F0F8F8]"
                      >
                        {/* count */}
                        <span className="text-heading text-center font-poppins text-base font-bold leading-[16px]">
                          {item.count}
                        </span>

                        {/* label */}
                        <span className="text-secondaryLabel text-center font-poppins text-xs font-semibold">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {actions.map((item, index) => (
                      <button
                        key={index}
                        className="px-3 py-2 rounded-md 
      flex items-center justify-center 
      text-xs sm:text-sm font-medium 
      hover:bg-teal-950 hover:text-white transition flex items-center gap-2 cursor-pointer rounded-lg border border-[#E2E2E2] bg-[#F0F8F8]"
                        onClick={() => item.modal && setActiveModal(item.modal)}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}

                    {/* Full width button */}
                    <button
                      className="min-h-[45px] sm:min-h-[50px] 
    col-span-1 sm:col-span-2 
    bg-black text-white rounded-md 
    flex items-center gap-2 justify-center 
    text-xs sm:text-sm font-semibold 
    hover:bg-gray-800 transition mb-[19px] xl:mb-[39px] cursor-pointer"
                    >
                      <TbDownload />
                      Download PDF Profile
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Right potion */}
          <div className="flex flex-col gap-4 lg:justify-between w-full lg:w-[320px]">
            {/* R1 */}
            {authLoading ? (
              <div className="w-full py-6 px-[17px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
                {/* Heading */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-2">
                  <Skeleton className="w-full h-[44px] rounded-lg" />
                  <Skeleton className="w-full h-[44px] rounded-lg" />
                  <Skeleton className="w-full h-[44px] rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="w-full py-6 px-[17px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
                {/* Heading */}
                <span className="text-[16px] font-bold text-[#111827] font-poppins flex items-center gap-2">
                  <span>
                    <MdCall className="text-[#DC2020]" />
                  </span>
                  Contact Advisor
                </span>

                {/* Buttons container */}
                <div className="flex flex-col gap-2 flex-1">
                  <button
                    onClick={() => {
                      window.location.href = "tel:+919876543210"; // replace with dynamic number
                    }}
                    className="w-full text-[clamp(8px,1vw,12px)] px-[23px] py-[14px] font-medium rounded-lg bg-[#0A4A4A] flex gap-2 items-center justify-center text-white cursor-pointer"
                  >
                    <IoIosCall size={18} />
                    Call Now
                  </button>

                  <button
                    onClick={() => {
                      const phone = "919876543210"; // no +, include country code
                      const message = encodeURIComponent(
                        "Hi, I want to connect with you.",
                      );
                      window.open(
                        `https://wa.me/${phone}?text=${message}`,
                        "_blank",
                      );
                    }}
                    className="w-full text-[clamp(8px,1vw,12px)] px-[23px] py-[14px] font-medium rounded-lg bg-[#26D367] flex gap-2 items-center justify-center text-white cursor-pointer"
                  >
                    <BsChatDots size={18} />
                    Whatsapp
                  </button>

                  <button
                    onClick={() => {
                      const email = "example@gmail.com"; // replace
                      const subject = encodeURIComponent("Inquiry");
                      const body = encodeURIComponent(
                        "Hello, I would like to connect.",
                      );
                      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                    }}
                    className="w-full text-[clamp(8px,1vw,12px)] px-[23px] py-[14px] bg-white flex gap-2 items-center justify-center rounded-lg border border-[#E8F4F4] text-primary-900 font-poppins text-xs font-semibold cursor-pointer"
                  >
                    <TbMail size={18} />
                    Send Mail
                  </button>
                </div>
              </div>
            )}

            {/* R2 */}
            {authLoading ? (
              <div className="w-full px-[17px] py-[23px] flex flex-col gap-[15px] rounded-2xl bg-white shadow-soft">
                {/* Heading */}
                <div className="flex items-center gap-[15px]">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>

                {/* Stats list */}
                <div className="flex flex-col gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="py-[8px] pl-5 pr-[10px] flex justify-between items-center rounded-lg bg-[#F0F8F8]"
                    >
                      <Skeleton className="h-3 w-24 rounded-md" />
                      <Skeleton className="h-4 w-10 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full px-[17px] py-[23px] flex flex-col gap-[15px] rounded-2xl bg-white shadow-soft">
                {/* Heading */}
                <span className="text-[var(--headings-important-text)] text-[16px] font-bold font-poppins leading-normal flex items-center gap-[15px]">
                  <span>
                    <MdBarChart />
                  </span>
                  Quick Stats
                </span>

                <div className="flex flex-col flex-1 gap-2">
                  {statsData.map((item, index) => (
                    <div
                      key={index}
                      className="py-[8px] pl-5 pr-[10px] flex justify-between items-center rounded-lg bg-[#F0F8F8] cursor-pointer"
                    >
                      <span className="text-[12px] font-normal text-[#6B7280] font-Nunito leading-[16px]">
                        {item.label}
                      </span>
                      <span className="text-[var(--headings-important-text)] text-[14px] font-bold font-poppins text-right leading-normal">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* R3 */}
            {authLoading ? (
              <div className="w-full py-[23px] pl-[20px] pr-[53px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
                {/* Heading */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-2 mt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-3 w-40 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full py-[23px] pl-[20px] pr-[53px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
                {/* Heading */}
                <span className="text-[var(--headings-important-text)] text-[16px] font-bold font-poppins leading-normal flex items-center gap-2">
                  <span>
                    <TbAlertSquareFilled className="text-[#57A5F4]" />
                  </span>
                  Profile Info
                </span>

                {/* Details */}
                <div className="flex flex-col gap-2">
                  {stats.map((item, index) => (
                    <span
                      key={index}
                      className="flex flex-wrap gap-2 items-center text-[12px] font-normal text-[#6B7280] font-nunito leading-[16px]"
                    >
                      <span>{item.icon}</span>
                      {item.data}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* second layer */}
        <div className="rounded-2xl bg-white shadow-soft">
          <div className="border-b border-[#E8F4F4] border-highlights rounded-t-2xl flex overflow-x-auto no-scrollbar md:pl-10">
            {authLoading
              ? [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-[10px]">
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              ))
              : footerheadings.map((heading, index) => (
                heading.isvisible && (
                  <button
                    key={index}
                    onClick={() => setActiveTab(heading)}
                    className="relative font-poppins p-[10px] text-center text-[clamp(10px,1vw,14px)] cursor-pointer text-sm font-bold"
                  >
                    <span
                      className={`${activeTab?.name === heading.name
                        ? "text-primary-900"
                        : "text-gray-400"
                        }`}
                    >
                      {heading.name}
                    </span>

                    {/* Animated underline */}
                    {activeTab === heading && (
                      <motion.div
                        layoutId="footerTabUnderline"
                        className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-primary-900 rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </button>
                )
              ))}
          </div>

          {/* Dynamic content */}
          <div className="pt-[20px] px-4 xl:pl-[40px] xl:pr-[240px] pb-[36px] flex flex-col gap-2">
            {authLoading ? (
              <>
                {/* Paragraph */}
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-[90%] rounded-md" />
                <Skeleton className="h-4 w-[80%] rounded-md" />

                {/* Section heading */}
                <Skeleton className="h-4 w-40 mt-3 rounded-md" />

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-28 rounded-full" />
                  ))}
                </div>

                {/* Another section */}
                <Skeleton className="h-4 w-32 mt-3 rounded-md" />

                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-full" />
                  ))}
                </div>
              </>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {activeTab === "Home" ? (
                    <>
                      <p className="text-[#6B7280] font-nunito text-sm font-normal leading-6 text-[clamp(10px,1vw,14px)]">
                        I am Krishna Mohan, a Senior LIC Advisor based in
                        Nellore, AP with over 14 years of experience. I am an
                        MDRT qualifier and YVITY Verified Professional. My
                        mission is to provide trusted, transparent advice that
                        genuinely protects my clients' financial future.
                      </p>

                      <div className="flex flex-col gap-2">
                        <p className="text-[var(--headings-important-text)] text-[14px] font-bold font-poppins leading-normal self-stretch">
                          Companies Associated
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {companies.map((comp, index) => (
                            <span
                              key={index}
                              className="p-[10px] flex gap-2 items-center text-[clamp(8px,1vw,12px)] font-semibold font-poppins leading-normal rounded-2xl bg-[#E8F4F4]"
                            >
                              <span>{comp.icon}</span>
                              {comp.data}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <p className="text-[12px] sm:text-[14px] font-bold leading-normal">
                          Specialization
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {companies.map((comp, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 w-full sm:w-auto flex items-center justify-center sm:justify-start sm:text-[12px] font-semibold rounded-2xl bg-[#E0F4F3] text-[clamp(8px,1vw,12px)]"
                            >
                              {comp.data}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : activeTab === "Service" && advisor?.ispublic_services ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Life Insurance Card */}
                      <ServiceSection ShowActions={false} />
                    </div>
                  ) : activeTab === "Achievements" && advisor?.ispublic_achievements ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {achievementsData.map((achievement) => (
                        <AchievementCard
                          key={achievement.id}
                          data={achievement}
                          ShowActions={false}
                        />
                      ))}
                    </div>
                  ) : activeTab === "Gallery" && advisor?.ispublic_gallery ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                      {galleryData.map((item) => (
                        <GalleryItem key={item.id} data={item} />
                      ))}
                    </div>
                  ) : activeTab === "Testimonials" && advisor?.ispublic_testimonials ? (
                    <Testimonials_filters showActions={false} />
                  ) : activeTab === "Journey" && advisor?.ispublic_professional ? (
                    journeyData.map((section) => (
                      <JourneySection
                        key={section.id}
                        data={section}
                        showActions={false}
                      />
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm font-medium">
                      No data available
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {activeModal === MODALS.TESTIMONIAL && (
        <GiveTestimonialModal
          open={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === MODALS.QR && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          <div className="w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <span className="flex items-center gap-2 font-semibold text-gray-800">
                QR Code
              </span>

              <button
                onClick={() => setActiveModal(null)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
              >
                <IoClose size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center px-6 py-6 gap-5">
              {/* QR */}
              <div
                ref={qrRef}
                className="bg-gray-100 p-4 rounded-2xl w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] flex items-center justify-center"
              >
                <QRCodeCanvas value={publicProfileUrl || publicProfilePath} size={180} />
              </div>

              {/* Info */}
              <div className="text-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {user?.name || "Advisor"}
                </h2>
                <p className="text-sm text-gray-500 break-all">
                  {publicProfileLabel || publicProfilePath || "Profile link unavailable"}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={downloadQR}
                className="w-full sm:w-[80%] bg-[#0a4d4a] hover:bg-[#073a38] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                Download QR →
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
      {activeModal === MODALS.RECOMMEND && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          {/* 1. Removed max-h and overflow-y-auto to stop scrolling.
      2. Set width to max-w-lg and height to auto for a tight fit.
    */}
          <div className="bg-white rounded-[2.5rem] shadow-xl w-[calc(100vw-2rem)] sm:w-full max-w-lg overflow-hidden border border-gray-100 h-auto">
            {/* Header - Reduced vertical padding slightly for better fit */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👍</span>
                <h2 className="text-xl font-bold text-slate-900">
                  Recommend Advisor
                </h2>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Body - Adjusted gap and padding for vertical efficiency */}
            <div className="p-7 space-y-5">
              <p className="text-slate-500 text-[1.05rem]">
                Why do you recommend Krishna Mohan?
              </p>

              {/* Grid remains responsive but compact */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleReason("Helpful & Honest")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border rounded-3xl transition-all group
    ${selectedReasons.includes("Helpful & Honest")
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50"
                    }
  `}
                >
                  <span className="text-xl">🤝</span>
                  <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
                    Helpful & Honest
                  </span>
                </button>

                <button
                  onClick={() => toggleReason("Expert Knowledge")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border rounded-3xl transition-all group
    ${selectedReasons.includes("Expert Knowledge")
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50"
                    }
  `}
                >
                  <span className="text-xl">🏆</span>
                  <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
                    Expert Knowledge
                  </span>
                </button>

                <button
                  onClick={() => toggleReason("Quick Response")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border rounded-3xl transition-all group
    ${selectedReasons.includes("Quick Response")
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50"
                    }`}
                >
                  <span className="text-xl text-orange-500">⚡</span>
                  <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
                    Quick Response
                  </span>
                </button>

                <button
                  onClick={() => toggleReason("Best Policy Advice")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border rounded-3xl transition-all group
    ${selectedReasons.includes("Best Policy Advice")
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50"
                    }`}
                >
                  <span className="text-xl">💯</span>
                  <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
                    Best Policy Advice
                  </span>
                </button>

                <button
                  onClick={() => toggleReason("Trustworthy")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border rounded-3xl transition-all group
    ${selectedReasons.includes("Trustworthy")
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50"
                    }`}
                >
                  <span className="text-xl text-blue-400">🛡️</span>
                  <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
                    Trustworthy
                  </span>
                </button>

                <button
                  onClick={() => toggleReason("Great Experience")}
                  className={`flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border rounded-3xl transition-all group
    ${selectedReasons.includes("Great Experience")
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-100 hover:border-emerald-500 hover:bg-emerald-50"
                    }`}
                >
                  <span className="text-xl">😊</span>
                  <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
                    Great Experience
                  </span>
                </button>
              </div>

              {/* Input Section */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 text-base">
                  Mobile (OTP Verification){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-gray-100 rounded-2xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Action Button */}
              <button className="w-full bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                Submit
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
      {activeModal === MODALS.SHARE && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          <div className="w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl">
            <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="text-slate-800 text-xl">
                    <FiUpload />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Share Profile
                  </h2>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 bg-cyan-50/50 p-1.5 rounded-full transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* WhatsApp */}
                <button className="w-full flex items-center gap-4 p-4 bg-[#e9f7ef] rounded-2xl border border-transparent hover:border-emerald-200 transition-all text-left">
                  <div className="bg-black text-white p-2 rounded-full">
                    <FaWhatsapp size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Whatsapp</h3>
                    <p className="text-sm text-slate-500">Helpful & Honest</p>
                  </div>
                </button>

                {/* Email */}
                <button className="w-full flex items-center gap-4 p-4 bg-[#eff4ff] rounded-2xl border border-transparent hover:border-blue-200 transition-all text-left">
                  <div className="bg-white border border-gray-200 p-2 rounded-lg text-slate-700">
                    <MdOutlineMail size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Email</h3>
                    <p className="text-sm text-slate-500">Share via Email</p>
                  </div>
                </button>

                {/* SMS */}
                <button className="w-full flex items-center gap-4 p-4 bg-[#e9f7ef] rounded-2xl border border-transparent hover:border-emerald-200 transition-all text-left">
                  <div className="bg-black text-white p-2 rounded-full">
                    <MdSms size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">SMS</h3>
                    <p className="text-sm text-slate-500">Share via SMS</p>
                  </div>
                </button>

                {/* Facebook */}
                <button className="w-full flex items-center gap-4 p-4 bg-[#eff4ff] rounded-2xl border border-transparent hover:border-blue-200 transition-all text-left">
                  <div className="bg-white border border-gray-200 p-2 rounded-lg text-slate-700">
                    <FaFacebookF size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Facebook</h3>
                    <p className="text-sm text-slate-500">Share on Facebook</p>
                  </div>
                </button>

                {/* Copy Link */}
                <button className="w-full flex items-center gap-4 p-4 bg-[#e9f7ef] rounded-2xl border border-transparent hover:border-emerald-200 transition-all text-left">
                  <div className="bg-white border border-gray-200 p-2 rounded-lg text-slate-400 rotate-45">
                    <FaLink size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">
                      Copy Profile Link
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {publicProfileLabel || publicProfilePath || "Profile link unavailable"}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
      {activeModal === MODALS.VIDEO && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          <div className="flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="text-slate-800 text-xl">
                    <MdVideoCameraFront />

                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Intro Video
                  </h2>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 bg-cyan-50/50 p-1.5 rounded-full transition-colors cursor-pointer"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* Video Preview */}
              <div className="w-full aspect-video bg-[#f2f8f8] flex items-center justify-center relative overflow-hidden">
                {introVideoUrl ? (
                  <video
                    key={introVideoUrl}
                    className="h-full w-full bg-black object-cover"
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                  >
                    <source src={introVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <FaPlay size={28} className="text-[#0a4d4a]" />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-8 space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  {introVideoTitle}
                </h3>
                <p className="text-slate-500 font-medium text-lg">
                  {introVideoSubtitle || "Advisor intro video"}
                </p>
                <h3 className="hidden text-2xl font-bold text-slate-900 leading-tight">
                  Krishna Mohan – Introduction
                </h3>
                <p className="hidden text-slate-500 font-medium text-lg">
                  Senior LIC Advisor • Nellore, AP
                </p>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default page;
