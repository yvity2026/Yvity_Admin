"use client";
import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { getDaysLeft } from "@/lib/days";

export default function AdvisorProfile({ data, onClose }) {
  const planConfig = {
    gold: {
      label: "★ Gold",
      price: "+₹2,999/yr",
      className: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    silver: {
      label: "☆ Silver",
      price: "+₹1,499/yr",
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },
    free: {
      label: "◆ Free",
      price: "₹0/yr",
      className: "bg-green-100 text-green-700 border-green-300",
    },
  };

  function formatDate(dateString) {
    if (!dateString) return "-";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const currentPlan = planConfig[data?.plan] || planConfig.free;
  const daysLeft = getDaysLeft(data?.planexpiry);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-[95vw] sm:max-w-[520px] 2xl:max-w-[620px] rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span>Advisor Profile</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5 px-4 sm:px-5 py-4">
          {/* Left */}
          <div className="flex gap-3 min-w-0 flex-1">
            {/* Avatar */}
            <div className="w-14 h-14 sm:w-12 sm:h-12 relative rounded-full bg-[#1f5f4a] flex items-center justify-center text-white font-semibold overflow-hidden shrink-0">
              {data?.profile_pic ? (
                <Image
                  src={data.profile_pic}
                  alt="Advisor"
                  fill
                  sizes="40px"
                  unoptimized
                  className="absolute inset-0 object-cover"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {data?.name?.[0] || "A"}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <p className="text-[15px] sm:text-[16px] font-semibold text-gray-900 break-words">
                {data?.name || "Advisor"}
              </p>

              <p className="text-xs text-gray-500 mb-2 break-words">
                {data?.profession || "Insurance Advisor"} •{" "}
                {data?.location || "N/A"}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {/* Plan */}
                <span
                  className={`text-[11px] px-2 py-[2px] rounded-full border ${currentPlan.className}`}
                >
                  {currentPlan.label}
                </span>

                {/* IRDAI */}
                <span className="text-[11px] px-2 py-[2px] rounded-full bg-green-100 text-green-700 border border-green-300">
                  ✓ IRDAI Verified
                </span>

                {/* Status */}
                {data?.isVerified ? (
                  <span className="text-[11px] px-2 py-[2px] rounded-full bg-green-100 text-green-700 border border-green-300">
                    ● Active
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-[2px] rounded-full bg-red-100 text-red-700 border border-red-300">
                    ● Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="text-center sm:min-w-[80px]">
            <p className="text-[26px] sm:text-[30px] font-semibold text-gray-900 leading-none">
              {data?.total || 0}
            </p>

            <p className="text-[11px] text-gray-400 mt-1">YVITY Score</p>
          </div>
        </div>

        {/* Info Table */}
        <div className="px-4 sm:px-5 py-4 border-t border-b border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[13px]">
            {/* Mobile */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Mobile</p>
              <p className="text-gray-800 break-all">
                +91 {data?.phone || "—"}
              </p>
            </div>

            {/* Plan */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Plan</p>

              <span
                className={`text-[11px] px-2 py-[2px] rounded-full border inline-flex flex-col items-center leading-tight w-max ${currentPlan.className}`}
              >
                <span>{currentPlan.label}</span>
                <span>{currentPlan.price}</span>
              </span>
            </div>

            {/* Email */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Email</p>
              <p className="text-gray-800 break-all">{data?.email || "—"}</p>
            </div>

            {/* Testimonials */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Testimonials</p>
              <p className="text-gray-800">{data?.testimonialCount || 0}</p>
            </div>

            {/* City */}
            <div>
              <p className="text-gray-400 text-xs mb-1">City</p>
              <p className="text-gray-800">{data?.location || "—"}</p>
            </div>

            {/* Recommendations */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Recommendations</p>
              <p className="text-gray-800">{data?.recommendationCount || 0}</p>
            </div>

            {/* IRDAI */}
            <div>
              <p className="text-gray-400 text-xs mb-1">IRDAI No.</p>
              <p className="text-gray-800 break-all">
                {data?.licenseNo || "—"}
              </p>
            </div>

            {/* Registered */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Registered</p>
              <p className="text-gray-800">
                {formatDate(data?.registeredAt) || "—"}
              </p>
            </div>

            {/* Renew Date */}
            <div>
              <p className="text-gray-400 text-xs mb-1">Renew Date</p>
              <p className="text-gray-800">
                {formatDate(data?.planexpiry) || "—"}
              </p>

              {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                <button className="mt-2 text-xs px-3 py-1 rounded-md bg-red-100 text-red-700 border border-red-300 hover:bg-red-200">
                  Renew Now ({daysLeft} days left)
                </button>
              )}
            </div>
            {/* renew Button */}
            {/* <div>
              <p className="text-gray-400 text-xs mb-1">Renew Date</p>
              <p className="text-gray-800">
                {formatDate(data?.planexpiry) || "—"}
              </p>
            </div> */}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="px-4 sm:px-5 py-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase mb-3">
            Score Breakdown
          </p>

          <div className="bg-gray-50 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              {
                score: `${data?.identityScore || 0}/30`,
                label: "Identity",
              },
              {
                score: `${data?.visibilityScore || 0}/30`,
                label: "Visibility",
                highlight: true,
              },
              {
                score: `${data?.trustScore || 0}/40`,
                label: "Trust",
              },
              {
                score: `${data?.total || 0}`,
                label: "Total",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-lg py-3 px-2 border border-gray-100"
              >
                <p
                  className={`text-[15px] sm:text-[16px] font-semibold ${
                    item.highlight ? "text-yellow-600" : "text-gray-900"
                  }`}
                >
                  {item.score}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
