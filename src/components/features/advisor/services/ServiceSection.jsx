"use client";
import Skeleton from "@/app/components/skeleton/Skeleton";
import React from "react";
import { FaShield } from "react-icons/fa6";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

const ServiceSection = ({
  data = [],
  setIsDelete,
  setEdit,
  setEditData,
  setDeleteId,
  ShowActions = true,
  loading = false,
}) => {
  return (
    <>
      {loading ? (
        <div className="w-full rounded-2xl border border-[#E2E1DC] bg-white pb-[38px] shadow-none min-w-[480px] lx:w-full">
          {/* Header Skeleton */}
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

          {/* Body Skeleton */}
          <div className="pl-3 sm:pl-4 md:pl-[40px] mt-[16px] flex flex-col gap-3">
            <Skeleton className="h-7 w-28 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded-md" />

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
        <>
          {data?.length > 0 ? (
            data.map((service) => (
              <div
                key={service.id}
                className="w-full rounded-2xl border border-[#E2E1DC] bg-white pb-[38px] shadow-none min-w-[480px] lx:w-full"
              >
                {/* Header */}
                <div className="h-[60px] px-3 sm:px-4 md:px-[30px] py-3 md:py-[18px] rounded-t-2xl bg-[#2A9D8F] shadow-[0_0_2px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#F8F6F1] font-[Poppins] text-[16px] font-bold leading-normal">
                    <FaShield />
                    {service.service_type}
                  </span>

                  {ShowActions && (
                    <span className="flex flex-wrap gap-2 sm:gap-[11px]">
                      <button
                        className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#D5D5D5] bg-white text-[#0A4A4A] font-poppins text-xs font-medium leading-normal cursor-pointer"
                        onClick={() => {
                          setEditData(service); // ✅ full object for edit
                          setEdit(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#F7C6C6] bg-white text-[#D32323] font-poppins text-xs font-medium leading-normal cursor-pointer"
                        onClick={() => {
                          setDeleteId(service.id);
                          setIsDelete(true);
                        }}
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="pl-3 sm:pl-4 md:pl-[40px] mt-[16px] flex flex-col gap-2">
                  <span className="flex gap-2 justify-start items-center rounded-lg bg-[#E0F4F3] w-auto md:w-[116px] min-h-[30px] px-3 py-1 text-green-800 font-poppins text-[11px] sm:text-xs font-semibold ">
                    <HiOutlineBuildingLibrary />
                    {service.company}
                  </span>

                  <p className="text-[#6B7280] font-nunito text-[11px] sm:text-xs font-normal leading-4">
                    {service.experience_years} years experience
                  </p>

                  <ul className="flex flex-col gap-2 text-[#374151] font-nunito text-[11px] sm:text-xs font-normal leading-4 list-disc pl-4">
                    {service.key_services?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm p-4">No services found</p>
          )}
        </>
      )}
    </>
  );
};

export default ServiceSection;