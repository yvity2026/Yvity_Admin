"use client";
import React, { useState } from "react";
import {
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { TbSearchOff } from "react-icons/tb";
import { AdvisorCard } from "./AdvisorCard";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useAuth } from "@/context/AuthUserContext";

const AdvisorSearchFilter = ({ onSearchChange, advisors }) => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { user, advisor, loading } = useAuth();

  const filterTags = [
    "All",
    "Life Insurance",
    "Health Insurance",
    "MDRT Advisors",
    "Near Me",
    "Top Rated",
  ];

  // Mock function to handle search - in a real app, you'd pass this to a parent
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", { location, searchQuery, activeFilter });
    if (onSearchChange) onSearchChange({ location, searchQuery, activeFilter });
  };

  const filteredAdvisors = advisors.filter((advisor) => {
    // 🔹 Filter by tag
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Near Me" &&
        location &&
        advisor.location.toLowerCase().includes(location.toLowerCase())) ||
      (activeFilter === "Top Rated" && advisor.score >= 80) ||
      advisor.tags.includes(activeFilter);

    // 🔹 Filter by search text (name or title)
    const matchesSearch =
      advisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      advisor.title.toLowerCase().includes(searchQuery.toLowerCase());

    // 🔹 Filter by location input
    const matchesLocation =
      !location ||
      advisor.location.toLowerCase().includes(location.toLowerCase());

    return matchesFilter && matchesSearch && matchesLocation;
  });

  const getGreeting = () => {
    const now = new Date();

    // Convert to India time
    const indiaTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );

    const hour = indiaTime.getHours();

    if (hour < 12) return ["Good morning", "☀️"];
    if (hour < 17) return ["Good afternoon", "🌤️"];
    if (hour < 21) return ["Good evening", "🌇"];
    return ["Good night", "🌙"];
  };

  const Wave = getGreeting();
  return (
    <div className="w-full  mx-auto bg-[#0D4D4D] text-white pt-[66px] overflow-hidden font-poppins">
      {/* 1. HERO SECTION */}
      <div className=" mx-auto  px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 pb-[39px] ">
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-3">
          <p className="flex items-center gap-2 text-[clamp(12px,1.5vw,16px)] font-normal text-[#B4B1AA]">
            {Wave[0]}, {user?.name}{" "}
            <span role="img" aria-label="wave">
              {Wave[1]}
            </span>
          </p>
          <h1 className="text-[#F8F6F1] text-[38px] font-bold font-cormorant">
            Find Your{" "}
            <span className="text-[#F59E0B] italic leading-normal">
              Trusted
            </span>{" "}
            <br />
            Insurance Advisor
          </h1>
        </div>

        {/* 2. SEARCH BAR CONTAINER */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 xl:pl-[47px] xl:pr-[53px] xl:py-[22px] shadow-2xl transition-all duration-300 hover:shadow-orange-400/10 border border-white/10 flex flex-col gap-3 sm:gap-4 mb-6"
        >
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0">
            {/* Location Input */}
            <div className="flex items-center gap-3 flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 px-3 sm:px-4 py-2 group">
              <HiOutlineLocationMarker className="text-gray-400 text-xl shrink-0 group-focus-within:text-orange-400 transition-colors" />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (e.g. Nellore, Hyderabad)"
                className="w-full outline-none bg-transparent py-2 text-sm sm:text-base text-[#6B7280] font-poppins"
              />
            </div>

            {/* Name/Service Input */}
            <div className="flex items-center gap-3 flex-1 w-full px-3 sm:px-4 py-2 group">
              <HiOutlineSearch className="text-gray-400 text-xl shrink-0 group-focus-within:text-orange-400 transition-colors" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or service..."
                className="w-full outline-none bg-transparent py-2 text-sm sm:text-base text-[#6B7280] font-poppins"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-[#0A3D3D] hover:bg-[#1A5D5D] text-white font-bold py-3 sm:py-4 px-5 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-between transition-all group active:scale-[0.98] cursor-pointer"
          >
            <span className="text-base sm:text-lg">Search</span>
            <HiOutlineArrowRight className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </form>

        {/* 3. FILTER TAGS */}
        <div className="flex p-1 overflow-x-scroll md:overflow-visible md:p-0 no-scrollbar h-full flex-nowrap md:flex-wrap gap-3 sm:gap-4">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 cursor-pointer border border-transparent whitespace-nowrap outline-none
        ${
          activeFilter === tag
            ? "bg-orange-400 text-[#0D4D4D] shadow-md shadow-orange-400/20 ring-2 ring-orange-300"
            : "bg-white/5 text-gray-200 border-gray-600 hover:bg-white/10 hover:border-gray-400"
        }
      `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 4. STATS BAR */}
      <div className="w-full bg-[#083D3D]/60 border-t border-white/5 md:px-[120px]">
        <div className="mx-auto py-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-y-0 md: md:justify-items-stretch text-center md:text-left xl:px-[150px]">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:border-r border-white/10 px-4">
              <span className="text-[clamp(18px,3vw,24px)] font-bold text-[#F59E0B] text-center font-poppins">
                250+
              </span>
              <span className="text-[clamp(10px,1vw,14px)] font-normal text-[#F8F6F1] font-poppins">
                Verified Advisors
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:justify-center md:border-r border-white/10 px-4">
              <span className="text-[clamp(18px,3vw,24px)] font-bold text-[#F59E0B] text-center font-poppins">
                30+
              </span>
              <span className="text-[clamp(10px,1vw,14px)] font-normal text-[#F8F6F1] font-poppins">
                Cities Covered
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:justify-end px-4">
              <span className="text-[clamp(18px,3vw,24px)] font-bold text-[#F59E0B] text-center font-poppins">
                5,991+
              </span>
              <span className="text-[clamp(10px,1vw,14px)] font-normal text-[#F8F6F1] font-poppins">
                Verified Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Displyed here */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 pt-[62px] pb-[54px] flex flex-col gap-10 bg-[#FFFFFF] w-full">
        <span className="flex items-center justify-between">
          <span className="text-[clamp(32px,5vw,48px)] leading-[50px]  font-bold  font-cormorant text-[#111827] flex itemcen gap-3">
            Featured
            <p className="text-[clamp(32px,5vw,48px)] font-bold italic text-[#F59E0B]  font-cormorant">
              Advisors{" "}
            </p>
          </span>
          <button className="hidden md:flex gap-[10px] text-[clamp(10px,1vw,14px)] font-normal text-[var(--primary-900,#0A4A4A)]">
            View all
            <IoIosArrowRoundForward />
          </button>
        </span>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 gap-y-12 ">   
          {filteredAdvisors.map((advisor, index) => (
            <AdvisorCard
              key={advisor.id || index}
              id={advisor.id}
              name={advisor.name}
              title={advisor.title}
              location={advisor.location}
              score={advisor.score}
              scoreLabel={advisor.scoreLabel}
              exp={advisor.exp}
              reviews={advisor.reviews}
              recs={advisor.recs}
              clients={advisor.clients}
              tags={advisor.tags}
              selfie_url={advisor.selfie_url}
            />
          ))}
        </div>
        <div className="flex md:hidden justify-center ">
          <button className="flex items-center gap-[10px] text-[14px] font-normal bg-[#0A4A4A] text-gray-200 px-6 py-3 rounded-xl">
            View all
            <IoIosArrowRoundForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvisorSearchFilter;
