"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import ServiceSection from "@/components/features/advisor/services/ServiceSection";
import { useModal } from "@/context/ModalContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCross, FaMehBlank, FaPlus } from "react-icons/fa";
import { FaPencil, FaShield } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
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

  const validateForm = () => {
    if (!form.serviceType.trim()) {
      toast.error("Service Type is required");
      return false;
    }

    if (!form.company.trim()) {
      toast.error("Company is required");
      return false;
    }

    if (!form.experience.trim()) {
      toast.error("Years of Experience is required");
      return false;
    }

    if (isNaN(form.experience) || Number(form.experience) < 0) {
      toast.error("Enter a valid experience");
      return false;
    }

    if (!form.services.length) {
      toast.error("Add at least one service");
      return false;
    }

    for (let i = 0; i < form.services.length; i++) {
      if (!form.services[i].trim()) {
        toast.error(`Key Service point ${i + 1} cannot be empty`);
        return false;
      }
    }

    return true;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index, value) => {
    const updated = [...form.services];
    updated[index] = value;
    setForm((prev) => ({ ...prev, services: updated }));
  };

  const { trigger, clearTrigger } = useModal();

  const [isService, setIsService] = useState(false);
  useEffect(() => {
    if (trigger === "ADD_SERVICE") {
      setIsService(true);
      clearTrigger(); // IMPORTANT
    }
  }, [trigger]);

  const handleSubmit = () => {
    if (!validateForm()) return;

    // success
    toast.success("Service added successfully!");

    console.log("Final Form:", form);

    // optional reset
    // setForm(initialState);

    // optional close modal
    // setIsService(false);
  };

  const addServicePoint = () => {
    if (form.services.some((s) => !s.trim())) {
      toast.error("Fill existing service before adding new");
      return;
    }

    setForm((prev) => ({
      ...prev,
      services: [...prev.services, ""],
    }));
  };

  const removeServicePoint = (index) => {
    if (form.services.length === 1) {
      toast.error("At least one service is required");
      return;
    }

    const updated = [...form.services];
    updated.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      services: updated,
    }));
  };

  const validateEditServiceForm = () => {
    if (!form.serviceType.trim()) {
      toast.error("Service Type is required");
      return false;
    }

    if (!form.company.trim()) {
      toast.error("Company is required");
      return false;
    }

    if (!form.experience.trim()) {
      toast.error("Years of Experience is required");
      return false;
    }

    if (isNaN(form.experience) || Number(form.experience) <= 0) {
      toast.error("Enter a valid experience (number > 0)");
      return false;
    }

    if (!form.services.length) {
      toast.error("At least one service is required");
      return false;
    }

    for (let i = 0; i < form.services.length; i++) {
      if (!form.services[i].trim()) {
        toast.error(`Service point ${i + 1} cannot be empty`);
        return false;
      }
    }

    return true;
  };

  const handleEditSubmit = () => {
    if (!validateEditServiceForm()) return;

    // success flow
    toast.success("Service updated successfully!");

    console.log("Updated Form:", form);

    // optional close modal
    setEdit(false);
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // 👉 Replace with real API call
      await new Promise((res) => setTimeout(res, 1000));

      toast.success("Service deleted successfully");

      // optional: update state / remove item locally

      setIsDelete(false);
    } catch (err) {
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-[90px] pt-4 sm:pt-6 md:pt-[30px] min-h-full">
      {/* Info */}
      <div className="mb-[20px] text-[clamp(10px,1vw,14px)] rounded-lg border border-[#DBE1E0] bg-[#E0F4F3] px-3 sm:px-4 md:pl-[30px] py-3 md:py-[14px] flex gap-[15px] items-center">
        <LuClockAlert />
        <p>Services you add here appear as cards on your public profile.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
        <ServiceSection setEdit={setEdit} setIsDelete={setIsDelete} />
        <div className="w-full rounded-2xl border border-[#E2E1DC] bg-white pb-[38px] shadow-none min-w-[480px] lx:w-full">
          <div className="h-[60px] px-3 sm:px-4 md:px-[30px] py-3 md:py-[18px] rounded-t-2xl bg-[#2A9D8F] shadow-[0_0_2px_0_rgba(0,0,0,0.25)] flex justify-between items-center">
            <span className="flex items-center gap-2 text-[#F8F6F1] font-[Poppins] text-[16px] font-bold leading-normal">
              <FaShield />
              Life Insurance
            </span>
            <span className="flex flex-wrap gap-2 sm:gap-[11px]">
              <button
                className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#D5D5D5] bg-white text-[#0A4A4A] font-poppins text-xs font-medium leading-normal"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
              <button
                className="p-[10px] rounded-[6px] h-[26px] flex items-center border border-[#F7C6C6] bg-white  text-[#D32323] font-poppins text-xs font-medium leading-normal"
                onClick={() => setIsDelete(true)}
              >
                Delete
              </button>
            </span>
          </div>
          <div className="pl-3 sm:pl-4 md:pl-3 sm:pl-4 md:pl-[40px] mt-[16px] flex flex-col gap-2">
            <span className="flex gap-2 justify-start items-center rounded-lg bg-[#E0F4F3] w-auto md:w-[116px] min-h-[30px] px-3 py-1 text-green-800 font-poppins text-[11px] sm:text-xs font-semibold ">
              <HiOutlineBuildingLibrary />
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
        <div className="w-full flex items-center justify-center cursor-pointer hover:opacity-90 rounded-2xl border-2 border-[#E2E1DC] border-dashed hover:border-[#785DC8] bg-white shadow-none min-w-[480px] lg:w-full  min-h-[240px] py-[80px]">
          <span className="flex flex-col justify-center items-center text-2xl">
            <FaPlus className="text-[#785DC8] w-10 h-10" />
            <p className="text-gray-500 text-center font-[Poppins] text-[clamp(12px,1.5vw,16px)] font-medium leading-normal">
              Add New Services
            </p>
          </span>
        </div>
      </div>

      {/* Edit popup */}

      {isService && (
        <ModalWrapper onClose={() => setIsService(false)}>
          {/* 1. Added h-auto and removed scroll constraints.
        2. Set bg-white and overflow-hidden for the clean card look.
        3. Match the specific max-w-lg from your designs.
    */}
          <div className="bg-white w-[92vw] sm:w-[85vw] md:w-[70vw] lg:w-[50vw] max-w-lg overflow-y-scroll max-h-[543px] flex flex-col rounded-[2rem] shadow-xl border border-gray-100 h-auto no-scrollbar">
            {/* HEADER - Updated to match image icon/style */}
            <div className="px-8 py-5 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FaPlus className="text-[#6333C0] text-lg" />
                <h2 className="text-xl font-bold text-slate-900">
                  Add Service
                </h2>
              </div>
              <button
                onClick={() => setIsService(false)}
                className="bg-slate-50 p-1.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* BODY - Tightened gaps (gap-5) and padding (p-7) to fit screen */}
            <div className="p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col gap-3 sm:gap-4 md:gap-5">
              {/* Service Type */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                  className="w-full py-3.5 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all placeholder:text-gray-400"
                  placeholder="Life Insurance"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full py-3.5 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all"
                  placeholder="LIC of India"
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full py-3.5 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all"
                  placeholder="e.g. 14"
                />
              </div>

              {/* Dynamic Services Section */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Key Services Offered <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col gap-3">
                  {form.services.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        value={item}
                        onChange={(e) =>
                          handleServiceChange(index, e.target.value)
                        }
                        className="flex-1 py-3.5 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all"
                        placeholder="e.g. Term Insurance Plans"
                      />
                      <button
                        type="button"
                        onClick={() => removeServicePoint(index)}
                        className="p-2 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:text-red-600 transition-all shrink-0"
                      >
                        <MdClose size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addServicePoint}
                  className="flex items-center gap-2 text-[#0D6060] font-bold text-base mt-1 w-fit hover:opacity-80 transition-opacity"
                >
                  <FaPlus size={14} />
                  Add Point
                </button>
              </div>

              {/* Submit Button - Updated padding to match image height */}
              <button
                className="w-full mt-2 bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4 rounded-2xl font-bold text-lg transition-transform active:scale-[0.98] shadow-lg shadow-emerald-900/10"
                onClick={() => {
                  validateForm();
                }}
                onSubmit={() => {
                  handleSubmit();
                }}
              >
                Add Service
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {isEdit && (
        <ModalWrapper onClose={() => setEdit(false)}>
          {/* 1. h-auto and removed overflow-y-auto to prevent scrolling.
        2. Rounded-[2rem] and shadow-xl to match your reference images.
    */}
          <div className="bg-white w-[calc(100vw-2rem)] sm:w-full max-w-lg overflow-hidden flex flex-col rounded-[2rem] shadow-xl border border-gray-100 h-auto">
            {/* HEADER - Updated with specific pencil icon and styling */}
            <div className="px-8 py-5 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-lg">✏️</span>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Service
                </h2>
              </div>
              <button
                onClick={() => setEdit(false)}
                className="bg-slate-50 p-1.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* BODY - space-y-4 and p-7 to ensure everything fits on one screen */}
            <div className="p-4 sm:p-5 md:p-6 lg:p-7 flex flex-col gap-4">
              {/* Service Type */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.serviceType}
                  onChange={(e) => handleChange("serviceType", e.target.value)}
                  className="w-full py-3 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all placeholder:text-gray-400"
                  placeholder="Life Insurance"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full py-3 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all"
                  placeholder="LIC of India"
                />
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full py-3 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all"
                  placeholder="e.g. 14"
                />
              </div>

              {/* Dynamic Services Section */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-800 text-[0.95rem]">
                  Key Services Offered <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col gap-2.5">
                  {form.services.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        value={item}
                        onChange={(e) =>
                          handleServiceChange(index, e.target.value)
                        }
                        className="flex-1 py-3 px-5 rounded-xl border border-gray-200 bg-[#FAFCFB] focus:border-[#0D6060] outline-none transition-all"
                        placeholder="e.g. Term Insurance Plans"
                      />
                      <button
                        type="button"
                        onClick={() => removeServicePoint(index)}
                        className="p-1.5 rounded-lg border border-red-100 bg-red-50 text-red-400 hover:text-red-600 transition-all shrink-0"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addServicePoint}
                  className="flex items-center gap-2 text-[#0D6060] font-bold text-sm mt-1 w-fit hover:opacity-80 transition-opacity"
                >
                  <FaPlus size={12} />
                  Add Point
                </button>
              </div>

              {/* Submit Button */}
              <button
                className="w-full mt-2 bg-[#0a4d4a] hover:bg-[#073a38] text-white py-3.5 rounded-2xl font-bold text-lg transition-transform active:scale-[0.98] shadow-lg shadow-emerald-900/10"
                onClick={() => validateEditServiceForm()}
                onSubmit={() => {
                  handleEditSubmit();
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {isDelete && (
        <ModalWrapper onClose={() => setIsDelete(false)}>
          {/* 1. Using rounded-[2rem] and shadow-xl to match other modals.
      2. Set overflow-hidden to ensure a clean card look.
    */}
          <div className="bg-white w-[calc(100vw-2rem)] sm:w-full max-w-md overflow-hidden flex flex-col rounded-[2rem] shadow-xl border border-gray-100 h-auto">
            {/* HEADER - Consistent padding and border */}
            <div className="px-8 py-5 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-900">
                Delete Service?
              </h2>
              <button
                onClick={() => setIsDelete(false)}
                className="bg-slate-50 p-1.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* BODY - Centered text and horizontally aligned buttons */}
            <div className="p-8 flex flex-col gap-8">
              <p className="text-slate-600 text-center text-lg">
                Remove{" "}
                <span className="font-bold text-slate-900">Life Insurance</span>{" "}
                from your profile?
              </p>

              {/* ACTION BUTTONS - Side by side layout */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 rounded-2xl border border-red-200 bg-red-50 text-red-500 font-bold text-base transition-all active:scale-[0.98] hover:bg-red-100 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>

                <button
                  onClick={() => setIsDelete(false)}
                  className="flex-1 py-4 rounded-2xl bg-[#0a4d4a] text-white font-bold text-base transition-all active:scale-[0.98] hover:bg-[#073a38]"
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
