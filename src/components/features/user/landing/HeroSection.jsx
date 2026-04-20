"use client"
import React, { useState } from "react";
import {
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { TbSearchOff } from "react-icons/tb";
import { AdvisorCard } from "./AdvisorCard";
import { IoIosArrowRoundForward } from "react-icons/io";

const AdvisorSearchFilter = ({ onSearchChange }) => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filterTags = [
    "All",
    "Life Insurance",
    "Health Insurance",
    "MDRT Advisors",
    "Near Me",
    "Top Rated",
  ];

  const advisors = [
    {
      name: "Krishna Mohan",
      title: "Chief Life Planner",
      location: "Nellore, AP",
      score: 80,
      scoreLabel: "Top 10% Advisor",
      exp: "14+",
      reviews: 32,
      recs: 12,
      clients: "200+",
      tags: ["Life Insurance", "Health Insurance", "MDRT", "Founding"],
    },
    {
      name: "Priya Sharma",
      title: "Senior Financial Advisor",
      location: "Hyderabad, TS",
      score: 75,
      scoreLabel: "Top 5% Advisor",
      exp: "10+",
      reviews: 45,
      recs: 20,
      clients: "350+",
      tags: ["Life Insurance", "Health Insurance", "MDRT", "Founding"],
    },
    {
      name: "Ravi Kumar",
      title: "Insurance Consultant",
      location: "Vijayawada, AP",
      score: 70,
      scoreLabel: "Top 20% Advisor",
      exp: "8+",
      reviews: 21,
      recs: 9,
      clients: "150+",
      tags: ["Life Insurance", "Health Insurance", "MDRT", "Founding"],
    },
    {
      name: "Anitha Reddy",
      title: "Wealth & Protection Advisor",
      location: "Vizag, AP",
      score: 90,
      scoreLabel: "Top 15% Advisor",
      exp: "12+",
      reviews: 38,
      recs: 15,
      clients: "180+",
      tags: ["Life Insurance", "Health Insurance", "MDRT", "Founding"],
    },
    {
      name: "Suresh Babu",
      title: "Life & Health Specialist",
      location: "Chennai, TN",
      score: 76,
      scoreLabel: "Top 25% Advisor",
      exp: "6+",
      reviews: 18,
      recs: 7,
      clients: "120+",
      tags: ["Life Insurance", "Health Insurance", "MDRT", "Founding"],
    },
    {
      name: "Meena Iyer",
      title: "Financial Security Planner",
      location: "Bangalore, KA",
      score: 60,
      scoreLabel: "Top 8% Advisor",
      exp: "16+",
      reviews: 52,
      recs: 24,
      clients: "400+",
      tags: ["Life Insurance", "Health Insurance", "MDRT", "Founding"],
    },
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

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };
  return (
    <div className="w-full  mx-auto bg-[#0D4D4D] text-white p-4 md:p-6 lg:p-10 xl:px-[15px] xl:pt-[66px] overflow-hidden font-poppins">
      {/* 1. HERO SECTION */}
      <div className=" mx-auto pt-[66px] pb-[39px] xl:px-[120px]">
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-4">
          <p className="flex items-center gap-2 mb- text-[16px] font-normal text-[#B4B1AA]">
            {getGreeting()}, krishna{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </p>
          <h1 className="text-[#F8F6F1] text-[38px] font-bold font-cormorant">
            Find Your{" "}
            <span className="text-[#F59E0B] italic leading-normal">Trusted</span>{" "}
            <br />
            Insurance Advisor
          </h1>
        </div>

        {/* 2. SEARCH BAR CONTAINER */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-[2rem] p-3 xl:px-[47px] xl:py-[22px] shadow-2xl transition-all duration-300 hover:shadow-orange-400/10 border border-white/10 flex flex-col gap-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Location Input */}
            <div className="flex items-center gap-3 flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 px-4 md:pb-0 py-2 group">
              <HiOutlineLocationMarker className="text-gray-400 text-xl shrink-0 group-focus-within:text-orange-400 transition-colors" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City (e.g. Nellore, Hyderabad)"
                className="w-full outline-none placeholder:text-[#6B7280] font-poppins bg-transparent py-2 text-[#6B7280] font-normal text-[16px] leading-[16px] "
              />
            </div>

            {/* Name/Service Input */}
            <div className="flex items-center gap-2 flex-1 w-full px-4 py-2 group">
              <HiOutlineSearch className="text-gray-400 text-xl shrink-0 group-focus-within:text-orange-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or service..."
                className="w-full outline-none placeholder:text-gray-400 bg-transparent py-2 text-[#6B7280] font-normal text-[16px] leading-[16px]  font-poppins"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-[#0A3D3D] hover:bg-[#1A5D5D] text-white font-bold py-3 pl-[47px] pr-[53px] rounded-2xl flex items-center justify-between transition-all group active:scale-[0.98]"
          >
            <span className="text-lg">Search</span>
            <HiOutlineArrowRight className="text-xl group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </form>

        {/* 3. FILTER TAGS */}
        <div className="flex flex-wrap gap-4 mt-[24px]">
          {filterTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={`px-[16px] py-[6px] rounded-full border text-sm transition-all duration-300 ${
                activeFilter === tag
                  ? "bg-orange-400 border-orange-400 text-[#0D4D4D] font-bold shadow-lg shadow-orange-400/20"
                  : "border-gray-500 bg-white/5 hover:bg-white/10 text-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 4. STATS BAR */}
      <div className="w-full bg-[#083D3D]/60 border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-y-0 text-center md:text-left xl:px-[150px]">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:border-r border-white/10 px-4">
              <span className="text-center font-poppins text-2xl font-bold text-[#F59E0B]">250+</span>
              <span className="text-[14px] font-normal text-[#F8F6F1] font-poppins">
                Verified  Advisors
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:justify-center md:border-r border-white/10 px-4">
              <span className="text-center font-poppins text-2xl font-bold text-[#F59E0B]">30+</span>
              <span className="text-[14px] font-normal text-[#F8F6F1] font-poppins">
                Cities Covered
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:justify-end pl-4">
              <span className="text-center font-poppins text-2xl font-bold text-[#F59E0B]">5,991+</span>
              <span className="text-[14px] font-normal text-[#F8F6F1] font-poppins">
                Verified Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Displyed here */}
      <div className="px-[120px] pt-[62px] pb-[54px] flex flex-col gap-10 bg-[#FFFFFF]">
        <span className="flex items-center justify-between">
          <span className="text-[48px] leading-[50px]  font-bold  font-cormorant text-[#111827] flex itemcen gap-3">
            Featured
            <p className="text-[var(--ct-as-badges-accents,#F59E0B)] italic">
              Advisors{" "}
            </p>
          </span>
          <button className="flex gap-[10px] text-[14px] font-normal text-[var(--primary-900,#0A4A4A)] ">
            View all
            <IoIosArrowRoundForward />
          </button>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvisors.map((advisor, index) => (
            <AdvisorCard
              key={index}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvisorSearchFilter;
