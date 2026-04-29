"use client";
import React from "react";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SuccessReviewModal = ({ isOpen, onClose, score = 12 }) => {
  const router = useRouter();
  if (!isOpen) return null;

  const handleSubmit = () => {
    toast.success(
      "Your IRDAI details have been submitted. Our team will verify them and activate your profile with in 48 Hours",
    );
    router.push("/");
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Container - Responsive */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_8px_2px_rgba(245,158,11,0.25)]"
      >
        {/* Teal Header - Responsive */}
        <div className="bg-[#0D4D4D] p-4 sm:p-6 text-white relative text-left">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer z-10"
          >
            <IoClose size={20} />
          </button>

          <div className="flex flex-col items-start mb-2 sm:mb-3">
            <Image
              src="/images/yvity.png"
              height={80}
              width={80}
              alt="Navbar logo"
              className="sm:h-[100px] sm:w-[100px]"
            />
          </div>
          <h2 className="text-white text-2xl sm:text-[32px] font-bold font-cormorant leading-normal">
            Insurance Advisor Profile
          </h2>
          <p className="text-[#A9A9A9] text-sm sm:text-[16px] font-normal font-poppins leading-normal mt-1 sm:mt-2">
            Fill your advisor details—this is your public profile
          </p>
        </div>

        {/* Content Area - Responsive */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Confetti Emoji/Icon */}
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🎉</div>

          <h3 className="text-[#0A4A4A] text-center text-2xl sm:text-[36px] font-bold font-cormorant leading-normal mb-2 sm:mb-3">
            Profile Is Under review!
          </h3>

          <p className="text-[#6B7280] text-center text-xs sm:text-[14px] font-medium font-poppins leading-normal mb-4 sm:mb-6">
            Your IRDAI details have been submitted. Our team will verify them
            and activate your profile. Meanwhile try to add remaining details.
          </p>

          {/* Score Card - Responsive */}
          <div className="w-full bg-[#F4F7F7] rounded-xl sm:rounded-2xl py-6 sm:py-[32px] px-4 sm:px-[26px] border border-gray-100 mb-6 sm:mb-8">
            <p className="text-[#6B7280] text-center text-xs sm:text-[14px] font-normal font-poppins leading-[24px]">
              Your YVITY Score
            </p>
            <div className="flex items-baseline justify-center gap-1 mt-2">
              <span className="text-[#0A4A4A] text-center text-2xl sm:text-[32px] font-bold font-poppins leading-normal">
                {score}
              </span>
              <span className="text-[#6B7280] text-sm sm:text-[16px] font-bold font-poppins leading-normal">
                /100
              </span>
            </div>
            <p className="text-[#F59E0B] text-center text-xs sm:text-[14px] font-semibold font-poppins leading-[24px] mt-2">
              Complete identify verification to increase your score
            </p>
          </div>

          {/* Action Button - Responsive */}
          <button
            onClick={() => {
              router.push("/");
            }}
            className="w-full bg-[#0D4D4D] hover:bg-[#0A3D3D] text-white font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all active:scale-[0.98] cursor-pointer text-sm sm:text-base"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessReviewModal;
