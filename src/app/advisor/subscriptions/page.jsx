"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import React, { useState } from "react";
import { FaArrowRight, FaCheck, FaCrown, FaMedal, FaPlus } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";
import { HiMiniShieldCheck } from "react-icons/hi2";
import { MdAutorenew, MdClose, MdOutlineVerifiedUser } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const page = () => {
  const paymentHistory = [
    {
      date: "Jan 5, 2025",
      plan: "Gold Plan",
      amount: "₹2,999",
      method: "UPI",
      status: "Paid",
      invoice: "Download",
    },
    {
      date: "Jan 5, 2024",
      plan: "Gold Plan",
      amount: "₹2,999",
      method: "UPI",
      status: "Paid",
      invoice: "Download",
    },
    {
      date: "Jan 5, 2023",
      plan: "Silver Plan",
      amount: "₹999",
      method: "Net Banking",
      status: "Paid",
      invoice: "Download",
    },
  ];

  const pricingData = [
    {
      title: "Free",
      price: "0",
      period: "",
      message: "Free forever, no credit card required",
      features: ["Basic Profile", "3 Achievements", "5 Text Testimonials"],
      nonFeatures: [
        "Identify Verified Badge",
        "Audio/video Reviews",
        "QR Code Download",
        "Priority Directory",
      ],
      cardStyle:
        "hover:rounded-[16px] hover:border border-transparent hover:border-[#0D6060] bg-white hover:shadow-[0_0_4px_2px_rgba(13,96,96,0.25)]",
      buttonText: "Current : Free",
      buttonStyle:
        "flex items-center justify-center gap-2  md:min-w-0 lg:min-h-[44px] rounded-full text-sm md:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 border-2 border-transparent bg-[#F8F6F1] hover:border-[#0D6060] hover:bg-[#F8F6F1] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[var(--labels-secondary-info,#6B7280)]",
    },
    {
      title: "Silver",
      price: "999",
      period: "/year",
      features: [
        "Full Profile",
        "Unlimited Achievements",
        "Unlimited Text Reviews",
        "Identify Verified Badge",
        "Audio Reviews",
      ],
      nonFeatures: ["Vedio Testimonials", "QR Code Download"],
      cardStyle:
        "hover:rounded-[16px] hover:border border-transparent  hover:border-[#0D6060] bg-white hover:shadow-[0_0_4px_2px_rgba(13,96,96,0.25)]",
      buttonText: "Upgrade to silver",
      buttonStyle:
        "flex items-center justify-center gap-2  md:min-w-0 xl:min-h-[44px] rounded-full text-sm  md:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-(--primary-900,#0A4A4A) text-(--ct-as-badges-accents,#F59E0B) hover:bg-(--Primary-800,#076868) hover:text-(--ct-as-badges-accents,#F59E0B) hover:shadow-[0_4px_12px_rgba(13,96,96,0.25)] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[ var(--ct-as-badges-accents,#F59E0B)]",
    },
    {
      title: "Gold",
      price: "2999",
      period: "/year",
      features: [
        "Everything in Silver",
        "Video Testimonials",
        "QR Code Download",
        "Recomendations",
        "Priority Directory Listing",
        "Intro Video Upload",
        "Finding Advisors Badge",
      ],
      // nonFeatures?: [
      //   "No access to premium features",
      //   "Limited profile customization",
      //   "No priority support",
      // ],
      cardStyle:
        "hover:rounded-[16px] border border-[#F59E0B] bg-white hover:shadow-[0_0_4px_2px_rgba(217,119,6,0.25)]",
      buttonText: "Active Plan",
      buttonStyle:
        "flex items-center justify-center gap-2  md:min-w-0 xl:min-h-[44px] rounded-full text-xs sm:text-sm md:text-base px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-[rgba(217,119,6,0.9)] to-[rgba(255,169,70,0.9)] hover:shadow-[0_4px_12px_rgba(217,119,6,0.25)] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[var(--Pearl-Whitepage-background,#F8F6F1)]",
      cover: "Your Plan",
      coverStyle:
        "absolute top-0  left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-(--primary-900,#0A4A4A) text-[var(--Pearl-Whitepage-background,#F8F6F1)] rounded-[16px] bg-gradient-to-r from-[#D97706] to-[#FF8900] xl:text-[13px]  text-xs px-1 xl:px-3 py-1 rounded-full",
    },
  ];
  const [open, isopen] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-10 xl:px-15 mx-auto pt-[24px] pb-[81px] flex flex-col gap-[26px]">
      <div className="w-full  h-auto  bg-white px-4 md:pl-[40px] md:pr-[44px] py-6 md:py-[33px] flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-0 rounded-2xl">
        <div className="flex flex-col gap-4">
          <span>
            <h3 className="text-xl sm:text-2xl md:text-[32px] font-bold">
              Gold Plan
            </h3>

            {/* Mobile only */}
            <p className="md:hidden text-sm text-gray-300">
              288 days remaining
            </p>

            <p className="text-sm md:text-[14px]">
              Expires: December 31, 2025 · Auto-renewal OFF
            </p>
          </span>

          <span className="flex flex-col sm:flex-row gap-3">
            <button
              className="
              text-[clamp(10px,1vw,14px)]
       w-full sm:w-auto
      flex items-center justify-center
      px-4 gap-2 py-[10px] rounded-lg bg-[#F59E0B]
    "
            >
              <MdAutorenew />
              Renew Now
            </button>

            <button
              className="
              text-[clamp(10px,1vw,14px)]
      w-full sm:w-auto   // ✅ FIXED (space added)
      flex items-center justify-center
      px-4 py-[10px] rounded-lg border bg-[#256B6B]
    "
            >
              Enable Auto Renewal
            </button>
          </span>

          <span className="flex items-center gap-2 text-xs">
            <FaCrown />
            current plan
          </span>
        </div>
        <div className="hidden md:flex justify-end ">
          <span>
            <h3 className="text-[36px] font-bold text-right">285</h3>
            <p className="text-[14px] text-right">Days Remaining</p>
          </span>
        </div>
      </div>

      {/* Plan comparision */}
      <div className="h-auto w-full  bg-white px-3  xl:px-[40px] py-[27px] rounded-2xl">
        <p className="text-[var(--headings-important-text)] text-base sm:text-lg md:text-[16px] font-bold leading-normal font-[Poppins] mb-4">
          Plan Comparision
        </p>
        <div className="xl:px-[40px] grid grid-cols-1 lg:grid-cols-3 gap-4 w-full md:justify-items-center">
          {pricingData.map((item, index) => (
            <div
              key={index}
              // variants={itemstyle}
              className={`${item.cardStyle} relative w-full flex flex-col gap-4 mx-auto p-4 md:py-[36px] md:px-[16px] rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]`}
            >
              <span className="flex justify-start">
                <FaMedal/>
              </span>
              <p className="text-xl md:text-2xl font-semibold tracking-[1.4px] text-(--ct-as-badges-accents,#F59E0B) uppercase font-poppins leading-none">
                {item.title}
              </p>
              <p
                className={`text-xl sm:text-2xl lg:text-3xl font-bold font-poppins text-[#111827]`}
              >
                ₹{Number(item.price?.split("/")[0] || 0)}
                <span className="text-gray-400 text-base font-bold">
                  {item.period}
                </span>
              </p>
              <div className="flex flex-col gap-4">
                <ul className="flex flex-col justify-start items-start gap-2 md:gap-2 mt-2 md:pt-6 text-[var(--Body-content)] text-xs sm:text-sm md:text-[12px] font-normal leading-normal font-[Poppins]">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <FaCheck className="text-green-400" />
                      {feature}
                    </li>
                  ))}

                  {item.nonFeatures?.map((nonFeature, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <RxCross2 />
                      {nonFeature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full mt-4 md:mt-0 flex items-center justify-center gap-2 rounded-full transition-all duration-500 ease-in-out ${item.buttonStyle}`}
                >
                  {item.buttonText}
                </button>
              </div>
              {item.cover && (
                <span
                  className={`${item.coverStyle} flex items-center gap-1 font-poppins font-semibold md:gap-2 md:w-36`}
                >
                  <HiMiniShieldCheck size={16} />
                  {item.cover}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Payment History */}
      <div className="h-auto w-96 md:w-full bg-white rounded-2xl px-3 sm:px-4 md:pl-[40px] md:pr-[50px] py-[27px]">
        <div className="p-4">
          <h2 className="text-xl mb-4 text-[var(--headings-important-text)] text-[16px] font-bold leading-normal font-[Poppins]">
            Payment History
          </h2>
          <div className="overflow-x-auto w-full">
            <table className="w-full border-gray-200 text-sm">
              <thead className="text-[var(--labels-secondary-info)] text-xs sm:text-sm md:text-[12px] font-semibold leading-normal font-[Poppins]">
                <tr className="">
                  <th className="text-left py-2 md:py-[10px] text-[10px] sm:text-xs">
                    Date
                  </th>
                  <th className="text-left py-2 md:py-[10px] text-[10px] sm:text-xs">
                    Plan
                  </th>
                  <th className="text-left py-2 md:py-[10px] text-[10px] sm:text-xs">
                    Amount
                  </th>
                  <th className="text-left py-2 md:py-[10px] text-[10px] sm:text-xs">
                    Method
                  </th>
                  <th className="text-left py-2 md:py-[10px] text-[10px] sm:text-xs">
                    Status
                  </th>
                  <th className="text-left py-2 md:py-[10px] text-[10px] sm:text-xs">
                    Invoice
                  </th>
                </tr>
              </thead>

              <tbody>
                {paymentHistory.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 md:py-[10px] text-[var(--Body-content)] text-xs sm:text-sm md:text-[12px] sm:font-normal leading-normal font-nunito">
                      {item.date}
                    </td>
                    <td className="py-2 md:py-[10px] text-xs sm:text-sm md:text-[12px] font-normal">
                      {item.plan}
                    </td>
                    <td className="py-2 md:py-[10px] text-[var(--headings-important-text)] text-xs sm:text-sm md:text-[12px] font-semibold leading-normal font-poppins">
                      {item.amount}
                    </td>
                    <td className="py-2 md:py-[10px] text-[var(--Body-content)] text-xs sm:text-sm md:text-[12px] font-normal leading-normal font-nunito">
                      {item.method}
                    </td>
                    <td className="py-2 md:p-[10px]">
                      <span className="text-green-600 p-[10px] font-medium flex items-center gap-1 whitespace-nowrap rounded-2xl bg-[#E8F4F4] w-fit">
                        <MdOutlineVerifiedUser />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-[10px]">
                      <button className="text-blue-600 p-[10px] hover:underline flex items-center gap-2 whitespace-nowrap rounded-2xl bg-[#E8F4F4]">
                        <HiOutlineDownload />
                        {item.invoice}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {open && (
        <ModalWrapper onClose={() => isopen(false)}>
          <div className="px-5 md:px-[30px] pb-6">
            {/* HEADER */}
            <div className="h-[62px] flex justify-between items-center border-b">
              <span className="flex items-center gap-2 font-semibold">
                <FaCrown />
                Renew Gold Plan
              </span>
              <MdClose onClick={() => isopen(false)} />
            </div>

            {/* BODY */}
            <div className="mt-5 flex flex-col gap-4">
              <span className="rounded-lg border border-[#DBE1E0] bg-[#E0F4F3] pl-[30px] pt-[37px] pt-[16px] pb-[31px] text-[#0A4A4A] font-poppins text-xs font-normal leading-5">
                <span className="flex items-center gap-[7px] text-[#111827] font-poppins text-sm font-semibold leading-normal">
                  <FaCrown />
                  Gold Plan - ₹2,999/year
                </span>
                New expiry : December 31, 2026
              </span>
              {/* Service Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Select Payment Method <span className="text-red-600">*</span>
                </label>

                <div className="flex flex-col gap-3 mt-2">
                  {/* UPI */}
                  <label className="w-full cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      className="hidden peer"
                    />
                    <div
                      className="w-full py-3 px-4 border rounded-lg bg-[#FAFCFB] 
        peer-checked:bg-[#0A4A4A] peer-checked:text-white 
        peer-checked:border-[#0A4A4A] transition"
                    >
                      UPI
                    </div>
                  </label>

                  {/* Credit Card */}
                  <label className="w-full cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      className="hidden peer"
                    />
                    <div
                      className="w-full py-3 px-4 border rounded-lg bg-[#FAFCFB] 
        peer-checked:bg-[#0A4A4A] peer-checked:text-white 
        peer-checked:border-[#0A4A4A] transition"
                    >
                      Credit Card
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label className="w-full cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      className="hidden peer"
                    />
                    <div
                      className="w-full py-3 px-4 border rounded-lg bg-[#FAFCFB] 
        peer-checked:bg-[#0A4A4A] peer-checked:text-white 
        peer-checked:border-[#0A4A4A] transition"
                    >
                      Net Banking
                    </div>
                  </label>
                </div>
              </div>
              {/* Submit */}
              <button className="mt-4 px-5 py-3 rounded-lg bg-[#0A4A4A] text-white flex items-center justify-center gap-2">
                Pay 2,999
                <FaArrowRight />
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default page;
