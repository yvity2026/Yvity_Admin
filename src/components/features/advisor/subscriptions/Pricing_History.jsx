import { paymentHistory } from "@/app/advisor/subscriptions/page";
import React from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { MdOutlineVerifiedUser } from "react-icons/md";

const Pricing_History = () => {
  return (
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
                <tr
                  key={index}
                  className="border-t text-[clamp(8px,1vw,12px)] font-nunito"
                >
                  <td className="py-2 md:py-[10px]  sm:font-normal leading-normal font-nunito">
                    {item.date}
                  </td>
                  <td className="py-2 md:py-[10px] font-normal">
                    {item.plan === "Gold Plan" && "👑 "}
                    {item.plan === "Silver Plan" && "🥈 "}
                    {item.plan}
                  </td>
                  <td className="py-2 md:py-[10px] t text-xs sm:text-sm md:text-[12px] font-semibold leading-normal font-poppins">
                    {item.amount}
                  </td>
                  <td className="py-2 md:py-[10px]  text-xs sm:text-sm md:text-[12px] font-normal leading-normal font-nunito">
                    {item.method}
                  </td>
                  <td className="py-2 md:p-[10px]">
                    <span className="text-[#0A4A4A] font-poppins font-semibold leading-normal px-[10px] py-2 font-medium flex items-center gap-1 whitespace-nowrap rounded-2xl bg-[#E8F4F4] w-fit">
                      <MdOutlineVerifiedUser />
                      {item.status}
                    </span>
                  </td>
                  <td className="p-[10px]">
                    <button className="text-[#0A4A4A] font-poppins text-xs font-semibold leading-normal p-[10px] hover:underline flex items-center gap-2 whitespace-nowrap rounded-2xl bg-[#E8F4F4]">
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
  );
};

export default Pricing_History;
