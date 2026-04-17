"use client";
import ProgressBar from "@/app/components/ui/Progressionbar";
import React from "react";
import { BsChatDots, BsFillInfoSquareFill } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { FaPlayCircle } from "react-icons/fa";
import { IoIosCall, IoIosPlay, IoMdCheckmarkCircle } from "react-icons/io";
import {
  MdBarChart,
  MdCall,
  MdLocationPin,
  MdOutlineChevronLeft,
} from "react-icons/md";
import { TbDownload, TbMail } from "react-icons/tb";
import { useRouter } from "next/navigation";

const page = () => {
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
  const actions = [
    { label: "Recommendations" },
    { label: "Testimonials" },
    { label: "Share" },
    { label: "QR Code" },
  ];

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
      <div className="w-full flex flex-col gap-4 p-4 sm:p-6 xl:px-[15px]">
        <div className="flex flex-col md:flex-row pt-6 w-full gap-[14px]">
          {/* left Portion */}
          <div className="relative rounded-2xl bg-white shadow-sm flex-1">
            <div className="h-[78px] bg-gradient-to-r from-[#032B2B] to-[#095A5B] mb-[65px] w-full rounded-t-2xl"></div>
            {/* profile circle */}
            <span className="absolute h-16 w-16 sm:h-20 sm:w-20 md:h-22 md:w-22 rounded-full bg-yellow-300 top-[39px] left-4 md:left-[30px]"></span>
            {/* Advisor Dtails */}
            <div className="pl-4 md:pl-[29px]">
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
                <span className="flex gap-5 h-full">
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
                    className="h-[28px] md:gap-[10px] flex items-center p-[10px] text-teal-950 text-[10px] sm:text-xs md:text-xs font-semibold leading-normal font-poppins rounded-2xl bg-[#E8F1EE]"
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
              <div className="grid grid-cols-4 sm:flex-row flex-wrap gap-3 mt-4">
                {summaryData.map((item, index) => (
                  <div
                    key={index}
                    className="w-full px-4 sm:px-6 py-3 
      flex flex-col justify-center border rounded-md bg-[#F0F8F8]"
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
      hover:bg-teal-950 hover:text-white transition"
                  >
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
    hover:bg-gray-800 transition"
                >
                  <TbDownload />
                  Download PDF Profile
                </button>
              </div>
            </div>
          </div>
          {/* Right potion */}
          <div className="flex flex-col justify-between min-w-[289px]">
            {/* R1 */}
            <div className="w-full py-6 px-[17px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
              {/* Heading */}
              <span className="text-[16px] font-bold text-[#111827] font-[Poppins] flex items-center gap-2">
                <span>
                  <MdCall />
                </span>
                Contact Advisor
              </span>

              {/* Buttons container */}
              <div className="flex flex-col gap-2 flex-1">
                <button className="w-full text-[10px] px-[23px] py-[14px] font-medium rounded-lg bg-[#0A4A4A] flex gap-2 items-center justify-center text-white">
                  <IoIosCall />
                  Call Now
                </button>

                <button className="w-full text-[10px] px-[23px] py-[14px] font-medium rounded-lg bg-[#26D367] flex gap-2 items-center justify-center text-white">
                  <BsChatDots />
                  Whatsapp
                </button>

                <button className="w-full text-[10px] px-[23px] py-[14px] bg-white flex gap-2 items-center justify-center rounded-lg border border-[#E8F4F4] text-primary-900 font-poppins text-xs font-semibold">
                  <TbMail />
                  Call Now
                </button>
              </div>
            </div>

            {/* R2 */}
            <div className="w-full px-[17px] py-[23px] flex flex-col gap-[15px] rounded-2xl bg-white shadow-soft">
              {/* Heading */}
              <span className="text-[var(--headings-important-text)] text-[16px] font-bold font-[Poppins] leading-normal flex items-center gap-[15px]">
                <span>
                  <MdBarChart />
                </span>
                Quick Stats
              </span>

              <div className="flex flex-col flex-1 gap-2">
                {statsData.map((item, index) => (
                  <div
                    key={index}
                    className="py-[8px] pl-5 pr-[10px] flex justify-between items-center rounded-lg bg-[#F0F8F8]"
                  >
                    <span className="text-[12px] font-normal text-[#6B7280] font-[Nunito] leading-[16px]">
                      {item.label}
                    </span>
                    <span className="text-[var(--headings-important-text)] text-[14px] font-bold font-[Poppins] text-right leading-normal">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* R3 */}
            <div className="w-full py-[23px] pl-[20px] pr-[53px] flex flex-col gap-3 rounded-2xl bg-white shadow-soft">
              {/* Heading */}
              <span className="text-[var(--headings-important-text)] text-[16px] font-bold font-[Poppins] leading-normal flex items-center gap-2">
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
                    className="flex flex-wrap gap-2 items-center text-[12px] font-normal text-[#6B7280] font-[Nunito] leading-[16px]"
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
          <div className="border-b border-highlights rounded-t-2xl flex gap-0">
            {footerheadings.map((heading, index) => (
              <button
                key={index}
                className="font-poppins p-[10px] text-center text-[10px] cursor-pointer text-primary-900  text-sm font-bold"
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
              <p className="text-[var(--headings-important-text)] text-[14px] font-bold font-[Poppins] leading-normal self-stretch">
                Companies Associated
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {companies.map((comp, index) => (
                  <span
                    key={index}
                    className="p-[10px] flex gap-2 items-center text-[var(--primary-900)] text-[12px] font-semibold font-[Poppins] leading-normal rounded-2xl bg-[#E8F4F4]"
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
    </div>
  );
};

export default page;
