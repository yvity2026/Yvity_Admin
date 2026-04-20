import React, { useState } from "react";
import {
  IoShieldCheckmark,
  IoStatsChart,
  IoBusiness,
  IoClose,
} from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import AdvisorFormModal from "./AdvisorFormModal";
import Image from "next/image";

const AdvisorProfileModal = ({ isOpen, onClose, onContinue }) => {
  const [selectedRole, setSelectedRole] = useState("insurance");

  const roles = [
    {
      id: "insurance",
      title: "Insurance Advisor",
      desc: "Build a verified credibility profile, collect OTP reviews, showcase IRDAI license & achievements",
      icon: <IoShieldCheckmark className="text-blue-400" size={32} />,
      isAvailable: true,
    },
    {
      id: "mfd",
      title: "MFD / Financial Advisor",
      desc: "Mutual fund distributors and financial planners",
      icon: <IoStatsChart className="text-blue-300" size={32} />,
      isAvailable: false,
    },
    {
      id: "realestate",
      title: "Real Estate Advisor",
      desc: "Property agents and real estate professionals",
      icon: <IoBusiness className="text-blue-300" size={32} />,
      isAvailable: false,
    },
  ];

  const [isAdvisorForm, setIsAdvisorForm] = useState(false);
  if (!isOpen) return null;

  const validateRoleSelection = () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return false;
    }

    const selected = roles.find((r) => r.id === selectedRole);

    if (!selected?.isAvailable) {
      toast.error("This role is not available yet");
      return false;
    }

    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-scrollbar">
      {/* Background Blur Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm "
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] no-scrollbar"
      >
        {/* FIXED Header Section */}
        <div className="bg-[#0D4D4D] p-8 pb-5 text-white relative shrink-0 sticky">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <IoClose size={20} />
          </button>

          <div className="mb-">
            <Image
              src="/images/Adivisor/Navbar/navlogo.png"
              height={100}
              width={100}
              alt="Navbar logo"
            />
          </div>

          <h2 className="text-[32px] font-cormorant">
            Insurance Advisor Profile
          </h2>
          <p className="text-[#A9A9A9] font-poppins text-[16px]">
            Fill your advisor details—this is your public profile
          </p>
        </div>

        {/* SCROLLABLE Roles List */}
        <div className="p-6 space-y-4 mt-3 overflow-y-auto custom-scrollbar flex-1 bg-white rounded-t-[2rem]">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => role.isAvailable && setSelectedRole(role.id)}
              className={`
                relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer
                ${!role.isAvailable ? "bg-gray-50 opacity-80" : "bg-[#FAF9F4]"}
                ${selectedRole === role.id && role.isAvailable ? "border-orange-400 ring-1 ring-orange-400" : "border-transparent"}
              `}
            >
              <div className="shrink-0 mt-1">{role.icon}</div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-[#1A3C40]">{role.title}</h3>
                  {!role.isAvailable && (
                    <span className="text-[10px] font-bold bg-[#E0F2F1] text-[#00695C] px-2 py-0.5 rounded-full uppercase">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {role.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FIXED Footer Action */}
        <div className="p-6 pt-4 pb-8 bg-white border-t border-gray-100 shrink-0">
          <button
            className="w-full bg-[#0D4D4D] hover:bg-[#0A3D3D] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer"
            onClick={() => {
              if (!validateRoleSelection()) return;

              onContinue(selectedRole);
            }}
          >
            {!selectedRole ? "Select a Role to Continue" : "Continue as Selected Role"}
            <HiOutlineArrowRight size={20} />
          </button>
        </div>
      </motion.div>

      {/* Tailwind CSS Custom Scrollbar Utility */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default AdvisorProfileModal;
