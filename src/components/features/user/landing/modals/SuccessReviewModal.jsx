"use client";
import React from "react";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SuccessReviewModal = ({ isOpen, onClose, score = 12 }) => {
  const router = useRouter()
  if (!isOpen) return null;

  const handleSubmit = () => {
    toast.success("Your IRDAI details have been submitted. Our team will verify them and activate your profile with in 48 Hours")
    router.push("/")
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-[600px] bg-white rounded-3xl overflow-hidden shadow-[0_0_8px_2px_rgba(245,158,11,0.25)]"
      >
        {/* Teal Header */}
        <div className="bg-[#0D4D4D] p-6 text-white relative text-left">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <IoClose size={20} />
          </button>

          <div className="flex flex-col items-start mb-2">
            <Image
              src="/images/Adivisor/Navbar/navlogo.png"
              height={100}
              width={100}
              alt="Navbar logo"
            />
          </div>
          <h2 className="text-white text-[32px] font-bold font-cormorant leading-normal">Insurance Advisor Profile</h2>
          <p className="text-[#A9A9A9] text-[16px] font-normal font-poppins leading-normal">
            Fill your advisor details—this is your public profile
          </p>
        </div>

        {/* Content Area */}
        <div className="p-8 flex flex-col items-center text-center">
          {/* Confetti Emoji/Icon */}
          <div className="text-5xl mb-2">🎉</div>

          <h3 className="text-[#0A4A4A] text-center text-[36px] font-bold font-cormorant leading-normal mb-2">
            Profile Is Under review!
          </h3>

          <p className="text-[#6B7280] text-center text-[14px] font-medium font-poppins leading-normal mb-4 ">
            Your IRDAI details have been submitted. Our team will verify them
            and activate your profile. Meanwhile try to add remaining .
          </p>

          {/* Score Card */}
          <div className="w-full bg-[#F4F7F7] rounded-2xl py-[32px] px-[26px] border border-gray-100 mb-8">
            <p className="text-[#6B7280] text-center text-[14px] font-normal font-poppins leading-[24px]">
              Your YVITY Score
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-[#0A4A4A] text-center text-[32px] font-bold font-poppins leading-normal">{score}</span>
              <span className="text-[#6B7280] text-[16px] font-bold font-poppins leading-normal">/100</span>
            </div>
            <p className="text-[#F59E0B] text-center text-[14px] font-semibold font-poppins leading-[24px]">
              Complete identify verification to increase your score
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {router.push("/")}}
            className="w-full bg-[#0D4D4D] hover:bg-[#0A3D3D] text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessReviewModal;
