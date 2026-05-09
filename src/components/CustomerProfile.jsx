"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CustomerProfile({ onClose, customer }) {
  if (!customer) return null;

  const initials =
    customer.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CU";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        className="w-[400px] overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-[18px]">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <span className="text-base text-gray-400">Customer</span>
            Customer Details
          </h2>
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-100 text-[13px] text-gray-500"
          >
            x
          </button>
        </div>

        <div className="flex items-center gap-3.5 px-6 py-5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-900 text-[13px] font-bold tracking-wide text-white">
            {initials}
          </div>
          <div>
            <h3 className="mb-1.5 text-[15px] font-semibold text-gray-800">
              {customer.name || "Customer"}
            </h3>
            <div className="flex gap-1.5">
              <span className="rounded-full bg-green-100 px-3 py-0.5 text-[11px] font-medium text-green-700">
                Mobile
              </span>
              <span className="rounded-full bg-green-100 px-3 py-0.5 text-[11px] font-medium text-green-700">
                Email
              </span>
            </div>
          </div>
        </div>

        <div className="mx-6 border-t border-gray-100" />

        <div className="px-6 pb-5 pt-3">
          {[
            { label: "Mobile", value: customer.phone ? `+91 ${customer.phone}` : "—" },
            { label: "Email", value: customer.email || "—" },
            { label: "City", value: customer.location || "—" },
            { label: "Profession", value: customer.profession || "—" },
            { label: "Reviews Given", value: `${customer.reviewCount || 0} reviews` },
            { label: "Last Login", value: customer.lastLogin || "—" },
            { label: "Registered", value: customer.joinedAt || "—" },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between py-[11px] text-[13px] ${
                i < arr.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="text-gray-400">{label}</span>
              <span className="pl-4 text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
