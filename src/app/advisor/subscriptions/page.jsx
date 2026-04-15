import React from "react";
import { FaArrowRight, FaCheck, FaCrown } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";
import { MdAutorenew, MdOutlineVerifiedUser } from "react-icons/md";
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
        "flex items-center justify-center gap-2 w-full lg:min-h-[44px] rounded-full text-sm md:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 border-2 border-transparent bg-[#F8F6F1] hover:border-[#0D6060] hover:bg-[#F8F6F1] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[var(--labels-secondary-info,#6B7280)]",
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
        "flex items-center justify-center gap-2 w-full xl:min-h-[44px] rounded-full text-sm  md:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-(--primary-900,#0A4A4A) text-(--ct-as-badges-accents,#F59E0B) hover:bg-(--Primary-800,#076868) hover:text-(--ct-as-badges-accents,#F59E0B) hover:shadow-[0_4px_12px_rgba(13,96,96,0.25)] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[ var(--ct-as-badges-accents,#F59E0B)]",
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
        "flex items-center justify-center gap-2 w-full xl:min-h-[44px] rounded-full text-xs sm:text-sm md:text-base px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-[rgba(217,119,6,0.9)] to-[rgba(255,169,70,0.9)] hover:shadow-[0_4px_12px_rgba(217,119,6,0.25)] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[var(--Pearl-Whitepage-background,#F8F6F1)]",
      cover: "most popular",
      coverStyle:
        "absolute top-0  left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-(--primary-900,#0A4A4A) text-[var(--Pearl-Whitepage-background,#F8F6F1)] rounded-[16px] bg-gradient-to-r from-[#D97706] to-[#FF8900] xl:text-[13px]  text-xs px-1 xl:px-3 py-1 rounded-full",
    },
  ];

  return (
    <div className="px-[90px] pt-[24px] pb-[81px] flex flex-col gap-[26px]">
      <div className="w-[1000px] h-[243px] bg-green-200 py-[33px] pl-[40px] pr-[44px] grid grid-cols-2">
        <div className="bg-orange-300 flex flex-col gap-4">
          <span>
          <h3 className="mb-2 text-[var(--Pearl-Whitepage-background)] text-[32px] font-bold leading-normal font-[Poppins]">Gold Plan</h3>
          <p className="text-[var(--background-highlights)] text-[14px] font-normal leading-[26px] font-[Nunito]">Expires: December 31, 2025 · Auto-renewal OFF</p>
          </span>
          <span className="flex gap-5 ">
            <button className="h[42px] w-[155px] flex items-center px-[16px] py-[10px] text-[var(--Pearl-Whitepage-background)] text-[14px] font-bold leading-[26px] font-[Poppins] gap-3 rounded-lg bg-[#F59E0B]">
              <MdAutorenew />
              Renew Now
            </button>
            <button className="h[42px] w-[188px] flex items-center px-[16px] py-[10px] text-[var(--Pearl-Whitepage-background)] text-center text-[14px] font-bold leading-[26px] font-[Poppins] rounded-lg border border-[#539292] bg-[#256B6B] ">
              Enable Auto Renewal
            </button>
          </span>
          <span className="w-[128] h-[32px] px-[16px] py-[6px] flex gap-2 text-[var(--ct-as-badges-accents)] text-[12px] font-semibold leading-[8px] font-[Poppins]">
            <FaCrown />
            current plan
          </span>
        </div>
        <div className="bg-yellow-700 flex justify-end">
          <span>
            <h3 className="text-[var(--Pearl-Whitepage-background)] text-right text-[36px] font-bold leading-normal font-[Poppins]">285</h3>
            <p className="text-[var(--background-highlights)] text-right text-[14px] font-normal leading-[26px] font-[Nunito]">Days Remaining</p>
          </span>
        </div>
      </div>

      {/* Plan comparision */}
      <div className="h-[587px] w-[1000px] bg-olive-600 px-[40px] py-[27px]">
        <p className="text-[var(--headings-important-text)] text-[16px] font-bold font-[Poppins] leading-normal mb-4">Plan Comparision</p>
        <div className="px-[40px] grid grid-cols-3 w-full">
          {pricingData.map((item, index) => (
            <div
              key={index}
              // variants={itemstyle}
              className={`${item.cardStyle} relative h-[480px] w-full md:max-w-[260px] py-[36px] px-[16px] `}
            >
              <p className="text-xl md:text-2xl font-semibold tracking-[1.4px] text-(--ct-as-badges-accents,#F59E0B) uppercase font-poppins leading-none">
                {item.title}
              </p>
              <p
                className={`text-xl sm:text-2xl lg:text-3xl font-bold font-poppins text-[#111827] ${
                  Number(item.price?.split("/")[0] || 0) === 0
                    ? "invisible"
                    : ""
                }`}
              >
                ₹{Number(item.price?.split("/")[0] || 0)}
                <span className="text-gray-400 text-base font-bold">
                  {item.period}
                </span>
              </p>
              {/* {item.message ? (
                <p className=" text-[15px] md:text-[11px] lg:text-[13px] xl:text-[16px] font-normal leading-[26px] text-[var(--Body-content,#374151)] font-nunito">
                  {item.message}
                </p>
              ) : (
                <p className="invisible">placeholder</p>
              )} */}
              {/* <p className="text-[16px] font-normal leading-[26px] text-[var(--Body-content,#374151)] font-nunito">{item.message}</p> */}
              <div className="h-0.5 w-full bg-gray-300"></div>
              <div className="flex flex-col justify-between min-h-86 md:gap-8  w-full">
                <ul className="flex flex-col justify-start items-start gap-2 md:gap-2 mt-2 md:pt-6 text-[var(--Body-content)] text-[12px] font-normal leading-normal font-[Poppins]">
                  {item.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-1"
                    >
                      <FaCheck className="text-green-400" />
                      {feature}
                    </li>
                  ))}

                  {item.nonFeatures?.map((nonFeature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-1"
                    >
                      <RxCross2 />
                      {nonFeature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full flex items-center justify-center gap-2 rounded-full transition-all duration-500 ease-in-out ${item.buttonStyle}`}
                >
                  {item.buttonText}
                </button>
              </div>
              {item.cover && (
                <span
                  className={`${item.coverStyle} flex items-center gap-1 font-poppins font-semibold md:gap-2 md:w-36`}
                >
                  <FaCheck size={16} />
                  {item.cover}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Payment History */}
      <div className="h-[276px] w-[1000px] bg-orange-200 pl-[40px] py-[27px] pr-[50px]">
        <div className="p-4">
      <h2 className="text-xl mb-4 text-[var(--headings-important-text)] text-[16px] font-bold leading-normal font-[Poppins]">Payment History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="text-[var(--labels-secondary-info)] text-[12px] font-semibold leading-normal font-[Poppins]">
            <tr className="">
              <th className="text-left py-[10px]">Date</th>
              <th className="text-left py-[10px]">Plan</th>
              <th className="text-left py-[10px]">Amount</th>
              <th className="text-left py-[10px]">Method</th>
              <th className="text-left py-[10px]">Status</th>
              <th className="text-left py-[10px]">Invoice</th>
            </tr>
          </thead>

          <tbody>
            {paymentHistory.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-[10px] text-[var(--Body-content)] text-[12px] font-normal leading-normal font-[Nunito]">{item.date}</td>
                <td className="py-[10px]">{item.plan}</td>
                <td className="py-[10px] text-[var(--headings-important-text)] text-[12px] font-semibold leading-normal font-[Poppins]">{item.amount}</td>
                <td className="py-[10px] text-[var(--Body-content)] text-[12px] font-normal leading-normal font-[Nunito]">{item.method}</td>
                <td className="p-[10px]">
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <MdOutlineVerifiedUser />
                    {item.status}
                  </span>
                </td>
                <td className="p-[10px]">
                  <button className="text-blue-600 hover:underline flex items-center gap-2  ">
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
    </div>
  );
};

export default page;
