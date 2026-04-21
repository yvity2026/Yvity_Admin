"use client";

import { paymentHistory } from "@/app/advisor/subscriptions/page";
import React from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { MdOutlineVerifiedUser } from "react-icons/md";

const Pricing_History = () => {
  const handleDownload = (fileUrl, fileName) => {
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;

    // force download (works if server allows it)
    link.setAttribute("download", fileName || "invoice.pdf");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-2xl px-4 md:px-10 py-7 border border-gray-100">
      <h2 className="text-[16px] font-bold text-[var(--headings-important-text)] font-poppins mb-5">
        Payment History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[12px] text-[var(--labels-secondary-info)] font-semibold font-poppins">
              {["Date", "Plan", "Amount", "Method", "Status", "Invoice"].map(
                (head) => (
                  <th key={head} className="text-left px-3 py-2">
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {paymentHistory.map((item, index) => (
              <tr
                key={index}
                className="bg-white border border-gray-100"
              >
                <td className="px-3 py-3 text-[12px] font-nunito text-gray-700">
                  {item.date}
                </td>

                <td className="px-3 py-3 font-medium text-gray-800">
                  {item.plan === "Gold Plan" && "👑 "}
                  {item.plan === "Silver Plan" && "🥈 "}
                  {item.plan}
                </td>

                <td className="px-3 py-3 text-[12px] font-semibold text-gray-900">
                  {item.amount}
                </td>

                <td className="px-3 py-3 text-[12px] text-gray-600">
                  {item.method}
                </td>

                <td className="px-3 py-3">
                  <span className="flex items-center gap-1 px-3 py-1 text-[#0A4A4A] bg-[#E8F4F4] rounded-full text-[12px] font-semibold w-fit">
                    <MdOutlineVerifiedUser />
                    {item.status}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <button
                    onClick={() =>
                      handleDownload(
                        item.invoiceUrl || item.invoice,
                        `invoice-${index + 1}.pdf`
                      )
                    }
                    className="flex items-center gap-2 px-3 py-1 text-[#0A4A4A] bg-[#E8F4F4] rounded-full text-[12px] font-semibold cursor-pointer hover:underline"
                  >
                    <HiOutlineDownload />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pricing_History;