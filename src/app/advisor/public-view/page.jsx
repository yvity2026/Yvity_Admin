import React from "react";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import {
  MdBarChart,
  MdCall,
  MdLocationPin,
  MdOutlineChevronLeft,
} from "react-icons/md";

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
      icon : <CiBank />,
      data : "Quick Response"
    },
    {
      icon : <CiBank />,
      data : "Quick Response"
    },
    {
      icon : <CiBank />,
      data : "Quick Response"
    },
    {
      icon : <CiBank />,
      data : "Quick Response"
    }
  ]

  return (
    <div>
      {/* Header */}
      <header className="h-[60px] bg-green-700">
        <span className="flex items-center pl-10 py-[18px]">
          <MdOutlineChevronLeft />
          Back
        </span>
      </header>
      {/* content */}
      <div className=" flex flex-col gap-4 px-[123px] pb-[89px]">
        <div className=" flex pt-6 w-full gap-[14px]">
          {/* Right Portion */}
          <div className="relative w-[891px] h-[725px]  bg-green-400">
            <div className="h-[78px] bg-red-600 mb-44 w-full"></div>
            {/* profile circle */}
            <span className="absolute h-44 w-44 rounded-full bg-yellow-300 top-[39px] left-[30px]"></span>
            {/* Advisor Dtails */}
            <div className="pl-[29px]">
              <span className="">
                <p>ewrdthfjg</p>
                <span>
                  <p></p>
                </span>
                <p></p>
                <p></p>
              </span>
            </div>
            <div className="pr-[30px] pl-[29px]">
              <div className="bg-amber-200 h-[59px] w-[832px]"></div>
            </div>
            <div className="pl-[29px] pr-[40px]">
              <div className="flex gap-2 bg-pink-500">
                {aboutData.map((data, index) => (
                  <span
                    key={index}
                    className="h-[28px] w-[125px] flex items-center"
                  >
                    {data}
                  </span>
                ))}
              </div>
              <div className="h-[70px] w-[820px] bg-amber-200"></div>
              <div className="flex  gap-3">
                {aboutData.map((item, index) => (
                  <div
                    key={index}
                    className="h-[62px] w-[200px] px-[40px] flex flex-col justify-center border rounded-md"
                  >
                    {/* count */}
                    <span className="text-sm font-semibold text-gray-800">
                      {index + 1}
                    </span>

                    {/* label */}
                    <span className="text-xs text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {actions.map((item, index) => (
                  <button
                    key={index}
                    className="h-[50px] border rounded-md flex items-center justify-center text-sm font-medium hover:bg-gray-100 transition"
                  >
                    {item.label}
                  </button>
                ))}

                {/* Full width button */}
                <button className="h-[50px] col-span-2 bg-black text-white rounded-md flex items-center justify-center font-semibold hover:bg-gray-800 transition">
                  Download PDF Profile
                </button>
              </div>
            </div>
          </div>
          {/* left potion */}
          <div className="flex flex-col justify-between">
            {/* L1 */}
            <div className="w-[289px] h-[225px] bg-pink-300 py-6 px-[17px] flex flex-col gap-3">
              {/* Heading */}
              <span className="text-[16px] font-bold text-[#111827] font-[Poppins] flex items-center gap-2">
                <span>
                  <MdCall />
                </span>
                Contact Advisor
              </span>

              {/* Buttons container */}
              <div className="flex flex-col gap-2 flex-1">
                <button className=" h-[40px]  w-[255px] bg-white rounded-md text-sm font-medium">
                  Call Now
                </button>

                <button className="h-[40px]  w-[255px] bg-white rounded-md text-sm font-medium">
                  WhatsApp
                </button>

                <button className="h-[40px] w-[255px] bg-white rounded-md text-sm font-medium">
                  Send Mail
                </button>
              </div>
            </div>

            {/* L2 */}
            <div className="w-[289px] h-[298px] bg-pink-300 px-[17px] py-[23px] flex flex-col gap-[15px]">
              {/* Heading */}
              <span className="text-[var(--headings-important-text)] text-[16px] font-bold font-[Poppins] leading-normal flex items-center gap-2">
                <span>
                  <MdBarChart />
                </span>
                Quick Stats
              </span>

              <div className="flex flex-col gap-3 flex-1  gap-2">
                {statsData.map((item, index) => (
                  <div
                    key={index}
                    className=" h-[33px] w-[255px] py-[8px] pl-5 pr-[10px] flex justify-between items-center bg-amber-300"
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

            {/* L3 */}
            <div className="w-[289px] h-[174px] bg-pink-300 py-[23px] pl-[20px] pr-[53px] flex flex-col gap-3">
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
                  <span key={index} className="flex gap-2 items-center text-[12px] font-normal text-[#6B7280] font-[Nunito] leading-[16px]">
                    <span>{item.icon}</span>
                    {item.data}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* second layer */}
        <div className="h-[288px] w-[1198px] bg-red-50">
          <div className="h-[48px] bg-green-500">
            {footerheadings.map((heading, index) => (
              <button key={index} className="w-[132px] h-[32px] p-[10px]">
                {heading}
              </button>
            ))}
          </div>

{/* Dynamic content */}
          <div className="pl-[40px] pt-[20px] pr-[240px] pb-[36px] flex flex-col gap-2">
            <p className="text-[var(--labels-secondary-info)] text-[14px] font-normal font-[Nunito] leading-[24px]">
            I am Krishna Mohan, a Senior LIC Advisor based in Nellore, AP with
            over 14 years of experience. I am an MDRT qualifier and YVITY
            Verified Professional. My mission is to provide trusted, transparent
            advice that genuinely protects my clients' financial future.
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-[var(--headings-important-text)] text-[14px] font-bold font-[Poppins] leading-normal self-stretch">Companies Associated</p>
            <div className="flex items-center gap-2 bg-green-200">
              {
                companies.map((comp, index) => (
                  <span key={index} className="w-[156px] h-[28px] p-[10px] flex gap-2 items-center text-[var(--primary-900)] text-[12px] font-semibold font-[Poppins] leading-normal">
                    <span className="">{comp.icon}</span>
                    {comp.data}
                  </span>
                ))
              }
              </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[var(--headings-important-text)] text-[14px] font-bold font-[Poppins] leading-normal self-stretch">Specialization</p>
            <div className="flex items-center gap-2">
              {
                companies.map((comp, index) => (
                  <span key={index} className="w-[156px] h-[28px] p-[10px] bg-green-300 flex items-center ext-[var(--primary-900)] text-[12px] font-semibold font-[Poppins] leading-normal">
                    {comp.data}
                  </span>
                ))
              }
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
