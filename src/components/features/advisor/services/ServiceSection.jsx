"use client"
import Skeleton from "@/app/components/skeleton/Skeleton";
import React, { useEffect, useState } from "react";
import { FaShield } from "react-icons/fa6";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";


const ServiceSection = ({  data, setIsDelete, setEdit, ShowActions = true }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
      const fetchData = async () => {
        // await your API
        await new Promise((res) => setTimeout(res, 1500)); // simulate delay
        setLoading(false);
      };
  
      fetchData();
    }, []);

  return (
    <>
    {
      loading ? (
        <div className="w-full rounded-2xl border border-[#E2E1DC] bg-white pb-[38px] shadow-none min-w-[480px] lx:w-full">
    
    {/* Header */}
    <div className="h-[60px] px-3 sm:px-4 md:px-[30px] py-3 md:py-[18px] rounded-t-2xl bg-[#2A9D8F] flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full bg-white/40" />
        <Skeleton className="h-4 w-32 bg-white/40 rounded-md" />
      </div>

      {ShowActions && (
        <div className="flex gap-2">
          <Skeleton className="h-6 w-14 rounded-md bg-white/40" />
          <Skeleton className="h-6 w-16 rounded-md bg-white/40" />
        </div>
      )}
    </div>

    {/* Body */}
    <div className="pl-3 sm:pl-4 md:pl-[40px] mt-[16px] flex flex-col gap-3">
      
      {/* Badge */}
      <Skeleton className="h-7 w-28 rounded-lg" />

      {/* Experience */}
      <Skeleton className="h-3 w-32 rounded-md" />

      {/* List */}
      <div className="flex flex-col gap-2 mt-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  </div>
      ) : (

        <div className="w-full rounded-2xl border border-[#E2E1DC] bg-white pb-[38px] shadow-none min-w-[480px] lx:w-full">
          <div className="h-[60px] px-3 sm:px-4 md:px-[30px] py-3 md:py-[18px] rounded-t-2xl bg-[#2A9D8F] shadow-[0_0_2px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
            <span className="flex items-center gap-2 text-[#F8F6F1] font-[Poppins] text-[16px] font-bold leading-normal">
              <FaShield />
              Life Insurance
            </span>
            {ShowActions && (
              <span className="flex flex-wrap gap-2 sm:gap-[11px]">
                <button
                  className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#D5D5D5] bg-white text-[#0A4A4A] font-poppins text-xs font-medium leading-normal cursor-pointer"
                  onClick={() => setEdit(true)}
                >
                  Edit
                </button>
                <button
                  className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#F7C6C6] bg-white  text-[#D32323] font-poppins text-xs font-medium leading-normal cursor-pointer"
                  onClick={() => setIsDelete(true)}
                >
                  Delete
                </button>
              </span>
            )}
          </div>
          <div className="pl-3 sm:pl-4 md:pl-3 sm:pl-4 md:pl-[40px] mt-[16px] flex flex-col gap-2">
            <span className="flex gap-2 justify-start items-center rounded-lg bg-[#E0F4F3] w-auto md:w-[116px] min-h-[30px] px-3 py-1 text-green-800 font-poppins text-[11px] sm:text-xs font-semibold ">
              <HiOutlineBuildingLibrary />
              LIC of India
            </span>
            <p className="text-[#6B7280] font-nunito text-[11px] sm:text-xs font-normal leading-4">
              14+ years experience
            </p>
            <ul className="flex flex-col gap-2 text-[#374151] font-nunito text-[11px] sm:text-xs font-normal leading-4 list-disc pl-4">
              <li>Term Insurance Plans</li>
              <li>Endowment & Money Back</li>
              <li>Child Education Plans</li>
              <li>Pension & Retirement Plans</li>
            </ul>
          </div>
        </div>
      )
    }
    </>
  );
};

export default ServiceSection;
