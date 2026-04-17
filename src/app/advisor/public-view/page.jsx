"use client";
import ProgressBar from "@/app/components/ui/Progressionbar";
import React, { useEffect, useState } from "react";
import { BsChatDots, BsChatSquare, BsFillInfoSquareFill, BsShare } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { FaFacebookF, FaLink, FaPlay, FaPlayCircle, FaWhatsapp } from "react-icons/fa";
import { IoIosCall, IoIosPlay, IoMdCheckmarkCircle } from "react-icons/io";
import {
  MdBarChart,
  MdCall,
  MdLocationPin,
  MdOutlineChevronLeft,
  MdOutlineMail,
  MdSms,
} from "react-icons/md";
import { TbDownload, TbMail } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import { IoClose, IoQrCode } from "react-icons/io5";
import { FiArrowRight, FiUpload } from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";
import { AiOutlineLike } from "react-icons/ai";

const page = () => {
  const qrRef = React.useRef(null);

const [activeModal, setActiveModal] = useState(null);

const MODALS = {
  TESTIMONIAL: "testimonial",
  RECOMMEND: "recommend",
  SHARE: "share",
  VIDEO: "video",
  QR: "qr"
};

useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") setActiveModal(null);
  };
  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);

const downloadQR = () => {
  const canvas = qrRef.current?.querySelector("canvas");
  if (!canvas) return;

  const pngUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.href = pngUrl;
  link.download = "krishna-qr.png";
  link.click();
};

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
  // const actions = [
  //   { label: "Recommendations" },
  //   { label: "Testimonials" },
  //   { label: "Share" },
  //   { label: "QR Code" },
  // ];

  const statsData = [
    { label: "Testimonials", value: 12 },
    { label: "Recommendations", value: 8 },
    { label: "Profile Views", value: 245 },
    { label: "Member Since", value: "2023" },
  ];

  const footerheadings = [
    "Home",
    "Journey",
    "Service",
    "Aceivements",
    "Gallery",
    "Testimonials",
  ];

  const companies = [
    {
      icon: <CiBank />,
      data: "Quick Response",
    },
    {
      icon: <CiBank />,
      data: "Quick Response",
    },
    {
      icon: <CiBank />,
      data: "Quick Response",
    },
    {
      icon: <CiBank />,
      data: "Quick Response",
    },
  ];
  const router = useRouter();

const actions = [
  { label: "Recommendations", icon: <AiOutlineLike />, modal: MODALS.RECOMMEND },
  { label: "Testimonials", icon: <BsChatSquare />, modal: MODALS.TESTIMONIAL },
  { label: "Share", icon : <BsShare />, modal: MODALS.SHARE },
  { label: "QR Code", icon: <IoQrCode />,  modal: MODALS.QR },
];
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
            <span className="absolute h-16 w-16 sm:h-20 sm:w-20 md:h-22 md:w-22 rounded-full bg-yellow-300 top-[39px] left-4 md:left-[30px]"></span>
            {/* Advisor Dtails */}
            <div className="px-4 md:px-6">
              <span className="flex flex-col gap-1">
                <p className="text-[#111827] text-[18px] sm:text-[20px] md:text-[24px] font-bold leading-normal font-cormorant">
                  Krishna Mohan
                </p>
                <span className="flex gap-2 items-center">
                  <IoMdCheckmarkCircle />
                  <p className="">Identity Verified</p>
                </span>
                <p className="text-gray-700 text-[10px] sm:text-xs md:text-xs font-normal leading-4 font-poppins">
                  Senior LIC Advisor • Nellore, AP
                </p>
                <p className="text-teal-950 text-[10px] sm:text-xs md:text-xs sm:text-xs sm:text-sm md:text-sm md:text-xs sm:text-sm md:text-sm font-medium leading-4 font-poppins">
                  Life Insurance · Health Insurance
                </p>
              </span>
            </div>
            {/* intro video */}
            <div className="pr-[30px] pl-[29px]">
              <div className="bg-amber-200 w-full  pl-[20px] pr-[23px] py-[9px] mt-[24px] bg-gradient-to-r from-[#022927] to-[#053F40] rounded-lg">
                <span className="flex gap-5 h-full cursor-pointer" onClick={() => setActiveModal(MODALS.VIDEO)}>
                  <FaPlayCircle
                    size={40}
                    className="flex justify-center items-center"
                  />
                  <span className="flex flex-col justify-between w-full">
                    <span className="flex gap-1 text-[#F8F6F1] text-[10px] text-xs sm:text-sm font-medium leading-4 font-poppins">
                      <IoIosPlay />
                      Watch Intro Video
                    </span>
                    <p className="text-[#82ADAD] text-[10px] sm:text-xs font-normal leading-4 font-poppins">
                      Krishna Mohan introduces himself
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
                    87/100
                  </h2>
                  <span>⭐⭐⭐⭐</span>
                  <p className="text-gray-500 text-[10px] sm:text-xs md:text-xs font-semibold leading-normal font-poppins">
                    YVITY Credibility Score
                  </p>
                </span>
                <span>
                  <ProgressBar value={87} />
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {summaryData.map((item, index) => (
                  <div
                    key={index}
                    className="w-full px-4 sm:px-6 py-3 
      flex flex-col justify-center border rounded-md bg-[#F0F8F8] cursor-pointer"
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
                    className="px-3 py-2 border rounded-md 
      flex items-center justify-center 
      text-xs sm:text-sm font-medium 
      hover:bg-teal-950 hover:text-white transition flex items-center gap-2 cursor-pointer"
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
          </div>
          {/* Right potion */}
          <div className="flex flex-col gap-4 lg:justify-between w-full lg:w-[320px]">
            {/* R1 */}
            <div className="w-full py-6 px-[17px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
              {/* Heading */}
              <span className="text-[16px] font-bold text-[#111827] font-poppins flex items-center gap-2">
                <span>
                  <MdCall />
                </span>
                Contact Advisor
              </span>

              {/* Buttons container */}
              <div className="flex flex-col gap-2 flex-1">
                <button className="w-full text-[10px] px-[23px] py-[14px] font-medium rounded-lg bg-[#0A4A4A] flex gap-2 items-center justify-center text-white cursor-pointer">
                  <IoIosCall />
                  Call Now
                </button>

                <button className="w-full text-[10px] px-[23px] py-[14px] font-medium rounded-lg bg-[#26D367] flex gap-2 items-center justify-center text-white cursor-pointer">
                  <BsChatDots />
                  Whatsapp
                </button>

                <button className="w-full text-[10px] px-[23px] py-[14px] bg-white flex gap-2 items-center justify-center rounded-lg border border-[#E8F4F4] text-primary-900 font-poppins text-xs font-semibold cursor-pointer">
                  <TbMail />
                  Send Mail
                </button>
              </div>
            </div>

            {/* R2 */}
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

            {/* R3 */}
            <div className="w-full py-[23px] pl-[20px] pr-[53px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
              {/* Heading */}
              <span className="text-[var(--headings-important-text)] text-[16px] font-bold font-poppins leading-normal flex items-center gap-2">
                <span>
                  <BsFillInfoSquareFill />
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
          </div>
        </div>
        {/* second layer */}
        <div className="rounded-2xl bg-white shadow-soft">
          <div className="border-b border-highlights rounded-t-2xl flex overflow-x-auto no-scrollbar">
            {footerheadings.map((heading, index) => (
              <button
                key={index}
                className="font-poppins p-[10px] text-center text-[clamp(10px,1vw,14px)] cursor-pointer text-primary-900  text-sm font-bold"
              >
                {heading}
              </button>
            ))}
          </div>

          {/* Dynamic content */}
          <div className="pt-[20px] px-4 md:pl-[40px] md:pr-[240px] pb-[36px] flex flex-col gap-2 ">
            <p className="text-[#6B7280] font-nunito text-sm font-normal leading-6">
              I am Krishna Mohan, a Senior LIC Advisor based in Nellore, AP with
              over 14 years of experience. I am an MDRT qualifier and YVITY
              Verified Professional. My mission is to provide trusted,
              transparent advice that genuinely protects my clients' financial
              future.
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-[var(--headings-important-text)] text-[14px] font-bold font-poppins leading-normal self-stretch">
                Companies Associated
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {companies.map((comp, index) => (
                  <span
                    key={index}
                    className="p-[10px] flex gap-2 items-center text-[var(--primary-900)] text-[12px] font-semibold font-poppins leading-normal rounded-2xl bg-[#E8F4F4]"
                  >
                    <span className="">{comp.icon}</span>
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
                    className="px-3 py-1 
        w-full sm:w-auto 
        flex items-center justify-center sm:justify-start
        text-[10px] sm:text-[12px] font-semibold 
        rounded-2xl bg-[#E0F4F3] text-[var(--primary-900)]"
                  >
                    {comp.data}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      ;

{activeModal === MODALS.TESTIMONIAL && (
  <ModalWrapper onClose={() => setActiveModal(null)}>
    
    <div className="bg-white rounded-[2rem] shadow-xl w-[calc(100vw-2rem)] sm:w-full max-w-lg overflow-hidden border border-gray-100 h-auto">

      {/* Header - Tightened padding for vertical fit */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📷</span>
          <h2 className="text-xl font-bold text-slate-900">
            Give Testimonial
          </h2>
        </div>

        <button
          onClick={() => setActiveModal(null)}
          className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Body - Adjusted spacing from 5 to 4 to save vertical pixels */}
      <div className="p-6 space-y-4">

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white shadow-sm rounded-lg text-sm font-bold text-slate-800">
            <span>📄</span> Text
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700">
            <span>🎵</span> Audio
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700">
            <span>🎬</span> Video
          </button>
        </div>

        {/* Form - Compact layout */}
        <div className="space-y-3">
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 text-sm">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5 text-sm">
              Mobile (OTP) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="10 digit mobile number"
              className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5 text-sm">
              Testimonial <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="3" // Reduced from 4 to 3 to ensure no scrolling
              placeholder="Share your experience..."
              className="w-full px-4 py-3 bg-slate-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5 text-sm">
              Rating
            </label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <button key={i} className="text-3xl text-yellow-400 hover:scale-110 transition-transform">★</button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button className="w-full bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          Submit & Verify OTP
          <FiArrowRight size={18} />
        </button>

      </div>
    </div>
  </ModalWrapper>
)}

{
  activeModal === MODALS.QR && (
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
          <QRCodeCanvas
            value="https://yvity.in/krishna"
            size={180}
          />
        </div>

        {/* Info */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Krishna Mohan
          </h2>
          <p className="text-sm text-gray-500 break-all">
            yvity.in/krishna
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
  )
}

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
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <span className="text-xl">🤝</span>
            <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
              Helpful & Honest
            </span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <span className="text-xl">🏆</span>
            <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
              Expert Knowledge
            </span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <span className="text-xl text-orange-500">⚡</span>
            <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
              Quick Response
            </span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <span className="text-xl">💯</span>
            <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
              Best Policy Advice
            </span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <span className="text-xl text-blue-400">🛡️</span>
            <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
              Trustworthy
            </span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <span className="text-xl">😊</span>
            <span className="text-slate-600 font-bold text-[0.8rem] group-hover:text-emerald-800">
              Great Experience
            </span>
          </button>
        </div>

        {/* Input Section */}
        <div className="space-y-2">
          <label className="block font-bold text-slate-800 text-base">
            Mobile (OTP Verification) <span className="text-red-500">*</span>
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

{
  activeModal === MODALS.SHARE && (
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
                  yvity.in/krishna
                </p>
              </div>
            </button>

          </div>
        </div>
      </div>
    </ModalWrapper>
  )
}

{
  activeModal === MODALS.VIDEO && (
    <ModalWrapper onClose={() => setActiveModal(null)}>
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="text-slate-800 text-xl">
                <FiUpload />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Intro Video
              </h2>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="text-gray-400 hover:text-gray-600 bg-cyan-50/50 p-1.5 rounded-full transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Video Preview */}
          <div className="w-full aspect-video bg-[#f2f8f8] flex items-center justify-center relative group cursor-pointer" >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FaPlay size={28} className="text-[#0a4d4a]" />
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">
              Krishna Mohan – Introduction
            </h3>
            <p className="text-slate-500 font-medium text-lg">
              Senior LIC Advisor • Nellore, AP
            </p>
          </div>
          
        </div>
      </div>
    </ModalWrapper>
  )
}

    </div>
  );
};

export default page;
