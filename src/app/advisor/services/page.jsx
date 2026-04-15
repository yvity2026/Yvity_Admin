"use client"
import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";

const initialServices = [
  {
    title: "Life Insurance",
    company: "LIC of India",
    experience: "14+ years experience",
    services: [
      "Term Insurance Plans",
      "Endowment & Money Back",
      "Child Education Plans",
      "Pension & Retirement Plans",
    ],
  },
];

export default function Page() {
  const [services, setServices] = useState(initialServices);

  const addNewService = () => {
    const newCard = {
      title: "New Service",
      company: "Company Name",
      experience: "0 years experience",
      services: ["Service 1", "Service 2", "Service 3"],
    };

    setServices([...services, newCard]);
  };

  return (
    <div className="pl-[90px] pt-[30px]">
      {/* Info */}
      <div className="mb-[20px]">
        <p>Services you add here appear as cards on your public profile.</p>
      </div>

      {/* Add Card Button */}
      <div
        onClick={addNewService}
        className="h-[240px] w-[480px] bg-orange-300 flex items-center justify-center cursor-pointer hover:opacity-90"
      >
        <span className="flex flex-col justify-center items-center text-2xl">
          <HiPlus />
          <p>Add New Services</p>
        </span>
      </div>

      {/* Cards List */}
      <div className="mt-6 flex flex-wrap gap-4">
        {services.map((item, index) => (
          <div
            key={index}
            className="h-[240px] w-[480px] bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{item.title}</h2>

              <div className="flex gap-3 text-sm">
                <button className="text-blue-600">Edit</button>
                <button className="text-red-500">Delete</button>
              </div>
            </div>

            {/* Company */}
            <p className="mt-2 font-semibold">{item.company}</p>
            <p className="text-sm text-gray-500">{item.experience}</p>

            {/* Services */}
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              {item.services.map((s, i) => (
                <p key={i}>• {s}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}