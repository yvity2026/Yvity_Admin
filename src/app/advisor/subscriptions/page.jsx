"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import Plans from "@/components/features/advisor/subscriptions/Plans";
import Pricing_History from "@/components/features/advisor/subscriptions/Pricing_History";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaCheck,
  FaCreditCard,
  FaCrown,
  FaMedal,
  FaPlus,
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { HiMiniShieldCheck } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { MdAutorenew, MdClose, MdOutlineVerifiedUser } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { SiInfinityfree } from "react-icons/si";
import { motion } from "framer-motion"

  export const paymentHistory = [
    {
      date: "Jan 5, 2025",
      plan: "Gold Plan",
      amount: "₹2,999",
      method: "UPI",
      status: "Paid",
      invoice: "Download",
    },
    {
      date: "Jan 5, 2024",
      plan: "Gold Plan",
      amount: "₹2,999",
      method: "UPI",
      status: "Paid",
      invoice: "Download",
    },
    {
      date: "Jan 5, 2023",
      plan: "Silver Plan",
      amount: "₹999",
      method: "Net Banking",
      status: "Paid",
      invoice: "Download",
    },
  ];

    export const pricingData = [
    {
      title: "Free",
      price: "0",
      period: "",
      message: "Free forever, no credit card required",
      features: ["Basic Profile", "3 Achievements", "5 Text Testimonials"],
      medal : <SiInfinityfree />,
      nonFeatures: [
        "Identify Verified Badge",
        "Audio/video Reviews",
        "QR Code Download",
        "Priority Directory",
      ],
      cardStyle:
        "hover:rounded-[16px] hover:border border-transparent hover:border-[#0D6060] bg-white hover:shadow-[0_0_4px_2px_rgba(13,96,96,0.25)]",
      buttonText: "Free",
      buttonStyle:
        "flex items-center justify-center gap-2  md:min-w-0 lg:min-h-[44px] rounded-full text-sm md:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 border-2 border-transparent bg-[#F8F6F1] hover:border-[#0D6060] hover:bg-[#F8F6F1] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[var(--labels-secondary-info,#6B7280)]",
    },
    {
      title: "Silver",
      price: "999",
      period: "/year",
      features: [
        "Full Profile",
        "Unlimited Achievements",
        "Unlimited Text Reviews",
        "Identify Verified Badge",
        "Audio Reviews",
      ],
      medal : <FaMedal />,
      nonFeatures: ["Vedio Testimonials", "QR Code Download"],
      cardStyle:
        "hover:rounded-[16px] hover:border border-transparent  hover:border-[#0D6060] bg-white hover:shadow-[0_0_4px_2px_rgba(13,96,96,0.25)]",
      buttonText: "Silver",
      buttonStyle:
        "flex items-center justify-center gap-2  md:min-w-0 xl:min-h-[44px] rounded-full text-sm  md:text-base px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-(--primary-900,#0A4A4A) text-(--ct-as-badges-accents,#F59E0B) hover:bg-(--Primary-800,#076868) hover:text-(--ct-as-badges-accents,#F59E0B) hover:shadow-[0_4px_12px_rgba(13,96,96,0.25)] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[ var(--ct-as-badges-accents,#F59E0B)]",
    },
    {
      title: "Gold",
      price: "2999",
      period: "/year",
      features: [
        "Everything in Silver",
        "Video Testimonials",
        "QR Code Download",
        "Recomendations",
        "Priority Directory Listing",
        "Intro Video Upload",
        "Finding Advisors Badge",
      ],
      medal : <FaCrown />,
      // nonFeatures?: [
      //   "No access to premium features",
      //   "Limited profile customization",
      //   "No priority support",
      // ],
      cardStyle:
        "hover:rounded-[16px] border border-[#F59E0B] bg-white hover:shadow-[0_0_4px_2px_rgba(217,119,6,0.25)]",
      buttonText: "Active Plan",
      buttonStyle:
        "flex items-center justify-center gap-2  md:min-w-0 xl:min-h-[44px] rounded-full text-xs sm:text-sm md:text-base px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-[rgba(217,119,6,0.9)] to-[rgba(255,169,70,0.9)] hover:shadow-[0_4px_12px_rgba(217,119,6,0.25)] transition-all duration-500 active:scale-[0.98] cursor-pointer text-[var(--Pearl-Whitepage-background,#F8F6F1)]",
      cover: "Your Plan",
      coverStyle:
        "absolute top-0  left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-(--primary-900,#0A4A4A) text-[var(--Pearl-Whitepage-background,#F8F6F1)] rounded-[16px] bg-gradient-to-r from-[#D97706] to-[#FF8900] xl:text-[13px]  text-xs px-1 xl:px-3 py-1 rounded-full",
    },
  ];

const page = () => {
  const [isRenew, setIsRenew] = useState(false);
  const [isAutoRenew, setIsAutoRenew] = useState(false);
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);

  const validatePayment = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) return;

    try {
      setLoading(true);

      // simulate API/payment gateway
      await new Promise((res) => setTimeout(res, 1200));

      toast.success(`Payment initiated via ${paymentMethod}`);

      setIsRenew(false);
    } catch (err) {
      toast.error("Payment failed. Try again");
    } finally {
      setLoading(false);
    }
  };

  const [autoRenewInput, setAutoRenewInput] = useState("");

  const validateAutoRenew = () => {
    const value = autoRenewInput.trim();

    // UPI pattern (basic)
    const upiRegex = /^[\w.-]+@[\w.-]+$/;

    // last 4 digits of card
    const cardRegex = /^\d{4}$/;

    if (!value) {
      toast.error("Payment detail is required");
      return false;
    }

    if (!upiRegex.test(value) && !cardRegex.test(value)) {
      toast.error("Enter valid UPI ID or last 4 digits of card");
      return false;
    }

    return true;
  };

  const handleAutoRenew = async () => {
    if (!validateAutoRenew()) return;

    try {
      setLoading(true);

      // simulate API
      await new Promise((res) => setTimeout(res, 1200));

      toast.success("Auto-renewal enabled successfully");

      setIsAutoRenew(false);
      setAutoRenewInput("");
    } catch (err) {
      toast.error("Failed to enable auto-renewal");
    } finally {
      setLoading(false);
    }
  };
  const [isOn, setIsOn] = useState(false)
  return (
    <div className="p-4 md:p-6 lg:p-10 xl:px-15 pt-[24px] pb-[81px] flex flex-col gap-[26px]">
      <div className="w-full  h-auto  bg-white px-4 md:pl-[40px] md:pr-[44px] py-6 md:py-[33px] flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-0 rounded-2xl bg-gradient-to-r from-[#094C4B] to-[#0A6A69] shadow-[0_0_2px_0_rgba(0,0,0,0.2)]">
        <div className="flex flex-col gap-4">
          <span>
            <h3 className="text-xl sm:text-2xl md:text-[32px] font-bold text-[#F8F6F1]">
              Gold Plan
            </h3>

            {/* Mobile only */}
            <p className="md:hidden text-sm  text-[#F8F6F1]">
              288 days remaining
            </p>

            <p className="text-[clamp(10px,1vw,14px)] text-[#F8F6F1]">
              Expires: December 31, 2025 · Auto-renewal OFF
            </p>
          </span>

          <span className="flex flex-col sm:flex-row gap-3">
            <button
              className="
              text-[clamp(10px,1vw,14px)]
       w-full sm:w-auto
      flex items-center justify-center
      px-4 gap-2 py-[10px] rounded-lg bg-[#F59E0B] text-[#F8F6F1] cursor-pointer
    "
              onClick={() => setIsRenew(true)}
            >
              <MdAutorenew />
              Renew Now
            </button>

            <button
              className="
              text-[clamp(10px,1vw,14px)]
      w-full sm:w-auto   // ✅ FIXED (space added)
      flex items-center justify-center
      px-4 py-[10px] rounded-lg bg-[#256B6B] text-[#F8F6F1] border border-[#539292] cursor-pointer
    "
              onClick={() => setIsAutoRenew(true)}
            >
              Enable Auto Renewal
            </button>
          </span>

          <span className="flex items-center gap-2 text-xs text-[#F59E0B] rounded-2xl bg-[rgba(245,158,11,0.2)] py-[6px] px-4 w-fit">
            <FaCrown />
            current plan
          </span>
        </div>
        <div className="hidden md:flex justify-end ">
          <span>
            <h3 className="text-[36px] font-bold text-right text-[#F8F6F1]">
              285
            </h3>
            <p className="text-[14px] text-right text-[#F8F6F1] ">
              Days Remaining
            </p>
          </span>
        </div>
      </div>

      <div
      onClick={() => setIsOn(!isOn)}
      className="w-48 h-12 bg-gray-200 rounded-full p-1 flex items-center cursor-pointer relative"
    >
      {/* Sliding background */}
      <motion.div
        className="absolute top-1 bottom-1 w-1/2 bg-[#0A6A69] rounded-full"
        animate={{
          x: isOn ? 0 : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />

      {/* Labels */}
      <div className="w-1/2 text-center z-10 text-sm font-medium">
        <span className={isOn ? "text-white" : "text-[#0A6A69"}>
          Pricing
        </span>
      </div>

      <div className="w-1/2 text-center z-10 text-sm font-medium">
        <span className={!isOn ? "text-white" : "text-[#0A6A69]"}>
          History
        </span>
      </div>
    </div>

{
  isOn ? ( <Plans />) : (<Pricing_History />)
}
    
     

      {/* Modals */}
      {false && (
        <ModalWrapper onClose={() => setIsRenew(false)}>
          <div className="px-5 md:px-[30px] pb-6">
            {/* HEADER */}
            <div className="h-[62px] flex justify-between items-center border-b">
              <span className="flex items-center gap-2 font-semibold">
                <FaCrown />
                Renew Gold Plan
              </span>
              <MdClose onClick={() => setIsRenew(false)} />
            </div>

            {/* BODY */}
            <div className="mt-5 flex flex-col gap-4">
              <span className="rounded-lg border border-[#DBE1E0] bg-[#E0F4F3] pl-[30px] pt-[37px] pt-[16px] pb-[31px] text-[#0A4A4A] font-poppins text-xs font-normal leading-5">
                <span className="flex items-center gap-[7px] text-[#111827] font-poppins text-sm font-semibold leading-normal">
                  <FaCrown />
                  Gold Plan - ₹2,999/year
                </span>
                New expiry : December 31, 2026
              </span>
              {/* Service Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">
                  Select Payment Method <span className="text-red-600">*</span>
                </label>

                <div className="flex flex-col gap-3 mt-2">
                  {/* UPI */}
                  <label className="w-full cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      className="hidden peer"
                    />
                    <div
                      className="w-full py-3 px-4 border rounded-lg bg-[#FAFCFB] 
        peer-checked:bg-[#0A4A4A] peer-checked:text-white 
        peer-checked:border-[#0A4A4A] transition"
                    >
                      UPI
                    </div>
                  </label>

                  {/* Credit Card */}
                  <label className="w-full cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      className="hidden peer"
                    />
                    <div
                      className="w-full py-3 px-4 border rounded-lg bg-[#FAFCFB] 
        peer-checked:bg-[#0A4A4A] peer-checked:text-white 
        peer-checked:border-[#0A4A4A] transition"
                    >
                      Credit Card
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label className="w-full cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      className="hidden peer"
                    />
                    <div
                      className="w-full py-3 px-4 border rounded-lg bg-[#FAFCFB] 
        peer-checked:bg-[#0A4A4A] peer-checked:text-white 
        peer-checked:border-[#0A4A4A] transition"
                    >
                      Net Banking
                    </div>
                  </label>
                </div>
              </div>
              {/* Submit */}
              <button className="mt-4 px-5 py-3 rounded-lg bg-[#0A4A4A] text-white flex items-center justify-center gap-2">
                Pay 2,999
                <FaArrowRight />
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {isRenew && (
        <ModalWrapper onClose={() => setIsRenew(false)}>
          <div className="flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full  overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="text-gray-800 text-xl">
                    <MdAutorenew />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Renew Gold Plan
                  </h2>
                </div>

                <button
                  onClick={() => setIsRenew(false)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Plan Info */}
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      <FaCrown />
                    </span>
                    <h3 className="font-bold text-lg text-slate-800">
                      Gold Plan – ₹2,999/year
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm ml-8">
                    New expiry : December 31, 2026
                  </p>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800">
                    Select Payment Method
                  </h4>

                  <label className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                    <input
                      type="radio"
                      name="payment"
                      className="w-5 h-5 accent-emerald-800"
                      defaultChecked
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                    />
                    <span className="font-medium text-slate-700 group-hover:text-emerald-900">
                      UPI
                    </span>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                    <input
                      type="radio"
                      name="payment"
                      className="w-5 h-5 accent-emerald-800"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                    />
                    <span className="font-medium text-slate-700 group-hover:text-emerald-900">
                      Credit / Debit Card
                    </span>
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                    <input
                      type="radio"
                      name="payment"
                      className="w-5 h-5 accent-emerald-800"
                      checked={paymentMethod === "NET_BANKING"}
                      onChange={() => setPaymentMethod("NET_BANKING")}
                    />
                    <span className="font-medium text-slate-700 group-hover:text-emerald-900">
                      Net Banking
                    </span>
                  </label>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-transform active:scale-[0.98] cursor-pointer"
                >
                  {loading ? "Processing..." : "Pay 2,999"}
                  <FiArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {isAutoRenew && (
        <ModalWrapper onClose={() => setIsAutoRenew(false)}>
          <div className="flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="text-gray-900 text-xl">
                    <MdAutorenew />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Auto - Renewal
                  </h2>
                </div>

                <button
                  onClick={() => setIsAutoRenew(false)}
                  className="text-gray-400 hover:text-gray-600 bg-cyan-50/50 p-1.5 rounded-full transition-colors"
                >
                  <IoClose size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-7">
                <p className="text-slate-500 leading-relaxed text-[1.05rem]">
                  Enable auto - renewal so your Gold Plan renews automatically
                  every year. You'll be notified 30 days before renewal.
                </p>

                <div className="bg-[#f0f9f9] border border-cyan-100 rounded-xl p-5 flex items-start gap-3">
                  <span className="text-xl">
                    <FaCreditCard />
                  </span>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Payment will be charged to your saved UPI / card on <br />
                    <span className="font-medium text-slate-600">
                      Dec 31, 2025
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block font-bold text-slate-800 text-lg">
                    UPI ID / Card (for auto - debit)
                  </label>
                  <input
                    type="text"
                    value={autoRenewInput}
                    onChange={(e) => setAutoRenewInput(e.target.value)}
                    placeholder="e.g. krishna@upi or last 4 digits of card"
                    className="w-full px-5 py-4 bg-slate-50 border border-gray-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <button
                  onClick={handleAutoRenew}
                  disabled={loading}
                  className="w-full bg-[#0a4d4a] hover:bg-[#073a38] text-white py-4.5 rounded-xl font-bold text-lg transition-transform active:scale-[0.98] shadow-lg shadow-emerald-900/10 cursor-pointer"
                >
                  {loading ? "Enabling..." : "Enable Auto - Renewal"}
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {isUpgrade && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/* CARD */}
          <div className="w-[92vw] sm:w-[85vw] md:w-[420px] bg-[#f3f4f6] rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Upgrade Plan
              </h2>

              <button
                onClick={() => setIsUpgrade(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <MdClose className="text-gray-600" size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                You are already on the{" "}
                <span className="font-semibold text-gray-900">Gold Plan</span> –
                from our best plan! You have access to all features.
              </p>

              {/* BUTTON */}
              <button
                onClick={() => setIsUpgrade(false)}
                className="mt-5 w-full bg-[#0f4f4f] hover:bg-[#0c3f3f] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                Got it!
                <span className="text-sm">✓</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
