import { pricingData } from "@/app/advisor/subscriptions/page";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { HiMiniShieldCheck } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";

const Plans = ({setIsUpgrade}) => {
  return (
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
            <span className="flex justify-start">{item.medal}</span>
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
                className={`w-full mt-4 md:mt-0 flex items-center justify-center gap-2 rounded-full transition-all duration-500 ease-in-out text-[clamp(12px,1.5vw,16px)] ${item.buttonStyle}`}
                onClick={() => setIsUpgrade(true)}
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
  );
};

export default Plans;
