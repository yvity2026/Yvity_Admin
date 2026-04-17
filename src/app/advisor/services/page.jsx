"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import React, { useState } from "react";
import { FaCross, FaMehBlank, FaPlus } from "react-icons/fa";
import { FaPencil, FaShield } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { LuClockAlert } from "react-icons/lu";
import { MdClose } from "react-icons/md";

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
  const [isOpen, setOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [form, setForm] = useState({
    serviceType: "",
    company: "",
    experience: "",
    services: [""],
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index, value) => {
    const updated = [...form.services];
    updated[index] = value;
    setForm((prev) => ({ ...prev, services: updated }));
  };

  const addServicePoint = () => {
    setForm((prev) => ({
      ...prev,
      services: [...prev.services, ""],
    }));
  };

  const removeServicePoint = (index) => {
    const updated = form.services.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, services: updated }));
  };

  return (
    <div className="px-4 sm:px-6 md:px-[90px] pt-4 sm:pt-6 md:pt-[30px] min-h-full">
      {/* Info */}
      <div className="mb-[20px] rounded-[8px] border border-[#DBE1E0] bg-[#E0F4F3] px-3 sm:px-4 md:pl-[30px] py-3 md:py-[14px] flex gap-[15px] items-center">
        <LuClockAlert />
        <p>Services you add here appear as cards on your public profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="w-full rounded-2xl border border-[#E2E1DC] bg-white pb-[38px] shadow-none">
          <div className="h-[60px] px-3 sm:px-4 md:px-[30px] py-3 md:py-[18px] rounded-t-2xl bg-[#2A9D8F] shadow-[0_0_2px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
            <span className="flex items-center gap-2 text-[#F8F6F1] font-[Poppins] text-[16px] font-bold leading-normal">
              <FaShield />
              Life Insurance
            </span>
            <span className="flex flex-wrap gap-2 sm:gap-[11px]">
              <button
                className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#D5D5D5] bg-white text-[#0A4A4A] font-[Poppins] text-[16px] font-bold leading-normal"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
              <button
                className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#F7C6C6] bg-white  text-[#D32323] font-[Poppins] text-xs font-medium leading-normal"
                onClick={() => setIsDelete(true)}
              >
                Delete
              </button>
            </span>
          </div>
          <div className="pl-3 sm:pl-4 md:pl-3 sm:pl-4 md:pl-[40px] mt-[16px] flex flex-col gap-2">
            <span className="flex gap-2 justify-start items-center rounded-lg bg-[#E0F4F3] w-auto md:w-[116px] min-h-[30px] px-3 py-1 text-green-800 font-poppins text-[11px] sm:text-xs font-semibold ">
              <FaMehBlank />
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

        {/* Add Card Button */}
        <div className="w-full flex items-center justify-center cursor-pointer hover:opacity-90 rounded-2xl border border-[#E2E1DC] bg-white shadow-none">
          <span className="flex flex-col justify-center items-center text-2xl">
            <HiPlus />
            <p>Add New Services</p>
          </span>
        </div>
      </div>

      {/* Edit popup */}
      {isOpen && (
        <ModalWrapper onClose={() => setOpen(false)}>
          <div className="px-5 md:px-[30px] pb-6">
            {/* HEADER */}
            <div className="h-[62px] flex justify-between items-center border-b">
              <span className="flex items-center gap-2 font-semibold">
                <FaPlus />
                Add Service
              </span>
              <MdClose onClick={() => setOpen(false)} />
            </div>

            {/* BODY */}
            <div className="mt-5 flex flex-col gap-4">
              {/* Service Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Service Type <span className="text-red-600">*</span>
                </label>
                <input
                  value={form.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="Life Insurance"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Company <span className="text-red-600">*</span>
                </label>
                <input
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="LIC Of India"
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Years of Experience <span className="text-red-600">*</span>
                </label>
                <input
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="e.g. 14"
                />
              </div>

              {/* Dynamic Services */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Key Services Offered <span className="text-red-600">*</span>
                </label>

                {form.services.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={item}
                      onChange={(e) =>
                        handleServiceChange(index, e.target.value)
                      }
                      className="flex-1 py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                      placeholder="e.g. Term Insurance Plans"
                    />
                    <MdClose
                      className="cursor-pointer"
                      onClick={() => removeServicePoint(index)}
                    />
                  </div>
                ))}
              </div>

              {/* Add Point */}
              <button
                onClick={addServicePoint}
                className="flex items-center gap-2 text-[#0D6060] text-sm font-semibold"
              >
                <FaPlus />
                Add Point
              </button>

              {/* Submit */}
              <button className="mt-4 px-5 py-3 rounded-lg bg-[#0A4A4A] text-white">
                Add Service
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
      {isEdit && (
        <ModalWrapper onClose={() => setEdit(false)}>
          <div className="px-5 md:px-[30px] pb-6">
            {/* HEADER */}
            <div className="h-[62px] flex justify-between items-center border-b">
              <span className="flex items-center gap-2 font-semibold">
                <FaPencil />
                Edit sService
              </span>
              <MdClose onClick={() => setEdit(false)} />
            </div>

            {/* BODY */}
            <div className="mt-5 flex flex-col gap-4">
              {/* Service Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Service Type <span className="text-red-600">*</span>
                </label>
                <input
                  value={form.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="Life Insurance"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Company <span className="text-red-600">*</span>
                </label>
                <input
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="LIC Of India"
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Years of Experience <span className="text-red-600">*</span>
                </label>
                <input
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                  placeholder="e.g. 14"
                />
              </div>

              {/* Dynamic Services */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Key Services Offered <span className="text-red-600">*</span>
                </label>

                {form.services.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={item}
                      onChange={(e) =>
                        handleServiceChange(index, e.target.value)
                      }
                      className="flex-1 py-3 px-4 rounded-lg border bg-[#FAFCFB]"
                      placeholder="e.g. Term Insurance Plans"
                    />
                    <MdClose
                      className="cursor-pointer"
                      onClick={() => removeServicePoint(index)}
                    />
                  </div>
                ))}
              </div>

              {/* Add Point */}
              <button
                onClick={addServicePoint}
                className="flex items-center gap-2 text-[#0D6060] text-sm font-semibold"
              >
                <FaPlus />
                Add Point
              </button>

              {/* Submit */}
              <button className="mt-4 px-5 py-3 rounded-lg bg-[#0A4A4A] text-white">
                Save Changes
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
      {isDelete && (
        <ModalWrapper onClose={() => setIsDelete(false)}>
          <div className="px-5 md:px-[30px] pb-6">
            {/* HEADER */}
            <div className="h-[62px] flex justify-between items-center border-b">
              <span className="text-[#111827] font-poppins text-base font-bold">
                Delete Service?
              </span>

              <MdClose
                className="cursor-pointer text-xl"
                onClick={() => setIsDelete(false)}
              />
            </div>

            {/* BODY */}
            <div className="mt-4 flex flex-col gap-4">
              <p className="text-[#374151] font-nunito text-sm">
                Remove <span className="font-semibold">Life Insurance</span>{" "}
                from your profile?
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-2">
                <button className="px-4 py-3 rounded-lg bg-[#FEF2F2] text-[#E85D5D] border border-[#FEB5B5] text-xs font-semibold">
                  Yes Delete
                </button>

                <button
                  onClick={() => setIsDelete(false)}
                  className="px-4 py-3 rounded-lg bg-[#0A4A4A] text-white text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
}
