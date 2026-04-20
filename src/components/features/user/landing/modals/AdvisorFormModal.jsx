import React, { useState } from "react";
import { IoClose, IoChevronDown, IoCloudUploadOutline } from "react-icons/io5";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { LuPlus } from "react-icons/lu";
import Image from "next/image";

const AdvisorFormModal = ({ isOpen, onClose, onContinue }) => {
  // Available services list
  const initialServices = [
    "Life Insurance",
    "Health Insurance",
    "General Insurance",
    "Mutual Funds",
  ];

  // State for the current form inputs
  const [formData, setFormData] = useState({
    service: "",
    company: "",
    designation: "",
    license: "",
    experience: "",
    bio: "",
  });

  // State for saved services
  const [addedServices, setAddedServices] = useState([]);

  // Filter dropdown to hide already added services
  const availableServices = initialServices.filter(
    (s) => !addedServices.some((as) => as.service === s),
  );

  const handleAddService = () => {
    if (formData.service && formData.company) {
      setAddedServices([...addedServices, { ...formData, id: Date.now() }]);
      // Reset current form
      setFormData({
        service: "",
        company: "",
        designation: "",
        license: "",
        experience: "",
        bio: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm  no-scrollbar">
      <div className="relative w-full max-w-[600px] bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-[#0D4D4D] p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20"
          >
            <IoClose size={20} />
          </button>
          <div className="">
            <Image
              src="/images/Adivisor/Navbar/navlogo.png"
              height={100}
              width={100}
              alt="Navbar logo"
            />
          </div>
          <h2 className="text-[32px] font-cormorant font-bold rounded-lg">Insurance Advisor Profile</h2>
          <p className="text-[A9A9A9] text-[16px] font-poppins rounded-lg">
            Fill your advisor details—this is your public profile
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#F9F8F6]">
          <button className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <HiOutlineArrowLeft /> Change role
          </button>

<div className="px-6">
          <div className="bg-[#EBF3F3] border-l-4 border-[#0D4D4D] py-4 pl-[20px] pr-[104px] rounded-lg mb-6 text-xs text-[#0D4D4D]">
            Insurance Advisor profile. This will be your public credibility
            profile on YVITY.
          </div>
</div>

          {/* Render Added Services (Summary View) */}
          {addedServices.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm relative"
            >
              <span className="text-[10px] font-bold text-[#0D4D4D] uppercase bg-gray-100 px-2 py-1 rounded mb-2 inline-block">
                Added Service
              </span>
              <h3 className="font-bold text-gray-800">{item.service}</h3>
              <p className="text-sm text-gray-600">
                {item.company} • {item.designation}
              </p>
              <button
                onClick={() =>
                  setAddedServices(
                    addedServices.filter((s) => s.id !== item.id),
                  )
                }
                className="absolute top-4 right-4 text-red-400 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          {/* The Active Form */}
          <div className="bg-white]  p-6 space-y-4">
          <div className="bg-[#E8F4F4] px-[16px] py-[24px] rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">
                Service <span className="text-red-500">*</span>
              </label>
              <button
                onClick={handleAddService}
                className="flex items-center gap-1 text-[#0D4D4D] text-xs font-bold border border-[#0D4D4D] px-3 py-1 rounded-md hover:bg-[#0D4D4D] hover:text-white transition-all"
              >
                <LuPlus /> Add
              </button>
            </div>

            <select
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-gray-200 bg-white appearance-none outline-none focus:ring-2 ring-[#0D4D4D]/20"
            >
              <option value="">Select Service</option>
              {availableServices.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">
                Insurance Company <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-gray-200 bg-white"
              >
                <option value="">Select Company</option>
                <option value="Bajaj Allianz">
                  Bajaj Allianz Life Insurance
                </option>
                <option value="LIC">LIC of India</option>
                <option value="HDFC Life">HDFC Life Insurance</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  IRDAI License No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1234567"
                  className="w-full p-3 rounded-xl border border-gray-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">
                  Years of Experience
                </label>
                <select className="w-full p-3 rounded-xl border border-gray-200 bg-white">
                  <option>Select</option>
                </select>
              </div>
            </div>
</div>
<p className="text-[#374151] text-[16px] font-medium font-poppins leading-normal">Upload IRDAI Certificate</p>
<div className="px-5 pt-[29px] pb-[23px] flex flex-col gap-4 rounded-lg border border-[#E6E6E6] bg-[#F8F6F1]">
  <p className="text-[#6B7280] text-[12px] font-normal font-poppins leading-[20px]">Upload  a single screenshot or image of your IRDAI license. It should show all your registered companies and details.</p>
  <p className="py-[10px] pr-[14px] pl-[20px] text-[#6B7280] text-[12px] font-normal font-poppins leading-[20px] rounded-lg border-l-[3px] border-l-[#0D6060] bg-[#E8F4F4]">Take a screenshot from the IRDAI website showing your license details. One image is sufficient - it will show all companies registered under your license.</p>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-white flex flex-col items-center justify-center text-center">
              <IoCloudUploadOutline size={40} className="text-gray-400 mb-2" />
              <p className="font-bold text-gray-700">
                Tap to Upload Certificate
              </p>
              <p className="text-[10px] text-gray-400">
                IRDAI license screenshot • JPG, PNG • Max 5MB
              </p>
            </div>
            <p className="text-[#6B7280] text-center text-[14px] font-normal font-poppins leading-[24px]">Click to simulate upload</p>
</div>

            <div className="space-y-1">
              <label className="text-[#374151] text-[16px] font-medium font-poppins leading-normal mb-2">
                Short Bio
              </label>
              <textarea
                placeholder="e.g. 10+ years helping families secure their future with life and health insurance..."
                className="w-full p-3 rounded-xl border border-gray-200 min-h-[100px] bg-[#FDFCFB] text-[#6B7280] text-[14px] font-normal font-poppins leading-[24px]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white shrink-0 border-t">
          <button
            className="w-full bg-[#F39C12] hover:bg-[#E67E22] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-poppins"
            onClick={() => onContinue(formData)}
          >
            Save & Submit Profile <HiOutlineArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvisorFormModal;
