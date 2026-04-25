"use client";

import React from "react";

const Testimonial_Stats = ({ stats = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="min-h-[70px] md:h-[86px] w-full py-4 md:py-[12.5px] px-4 md:px-[55px] rounded-2xl border border-[#E2E1DC] bg-white"
          >
            <span className="flex items-center flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-10 bg-gray-300 rounded animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
              </div>

              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((item, index) => (
        <div
          key={index}
          className="min-h-[70px] md:h-[86px] w-full py-4 md:py-[12.5px] px-4 md:px-[55px] rounded-2xl border border-[#E2E1DC] bg-white"
        >
          <span className="flex items-center flex-col gap-1">
            <span
              className={`${item.style} text-lg sm:text-xl md:text-2xl font-bold text-[#111827] text-center font-poppins text-[28px] leading-normal flex items-center gap-2`}
            >
              {item.count}
              <span className={item.iconStyle}>{item?.icon}</span>
            </span>
            <p className="text-gray-500 text-[10px] sm:text-xs font-medium">
              {item.label}
            </p>
          </span>
        </div>
      ))}
    </div>
  );
};

export default Testimonial_Stats;
