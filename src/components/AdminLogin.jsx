"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaPhone, FaShieldAlt } from "react-icons/fa";

export default function AdminLogin() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const router = useRouter();

  const otp = otpArray.join("");

  const isValidPhone = (num) => /^[6-9]\d{9}$/.test(num);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").replace(/^[0-5]+/, "");
    if (val.length <= 10) setPhone(val);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value.slice(-1);
    setOtpArray(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;

    e.preventDefault();
    const arr = paste.split("");
    setOtpArray(arr);
    setTimeout(() => otpRefs.current[5]?.focus(), 0);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPhone(phone)) {
      setError("Enter valid 10-digit number starting with 6-9");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/admin/login/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Failed to send OTP");
        return;
      }

      setOtpArray(["", "", "", "", "", ""]);
      setStep("otp");
      setResendTimer(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch {
      setError("Unable to send OTP right now");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/admin/login/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Failed to verify OTP");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to verify OTP right now");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");

    if (!isValidPhone(phone)) {
      setError("Enter valid 10-digit number");
      return;
    }

    setResending(true);

    try {
      const response = await fetch("/api/auth/admin/login/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Failed to resend OTP");
        return;
      }

      setOtpArray(["", "", "", "", "", ""]);
      setResendTimer(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch {
      setError("Unable to resend OTP right now");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F8F6F1] px-4">
      {/* 🌈 Animated Background Bloom - Using Primary Color Tints */}
      <div className="absolute w-[500px] h-[500px] bg-[#0a4a4a]/10 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-[#F59E0B]/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-pulse" />

      {/* 🧊 Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative z-10 backdrop-blur-xl bg-white/95 border-2 border-[#0a4a4a]/10 shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gradient-to-br from-[#0a4a4a] to-[#0a4a4a]/80 rounded-full">
            <img
              src="/images/Adivisor/Navbar/navlogo.png"
              alt="YVITY Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Header - Using Cormorant Garamond for heading */}
        <div className="text-center mb-8">
          <motion.h1
            key={`title-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold font-cormorant text-[#0a4a4a] mb-2"
          >
            {step === "phone" ? "Admin Access" : "Verify OTP"}
          </motion.h1>
          <p className="text-[#0a4a4a]/70 text-sm font-poppins">
            {step === "phone"
              ? "Enter your mobile number to get started"
              : "Enter the 6-digit code sent to your phone"}
          </p>
        </div>

        {/* Error Message with Animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex gap-2 items-start font-poppins"
            >
              <span className="text-lg mt-0.5">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          {step === "phone" ? (
            <motion.form
              key="phone"
              onSubmit={handleSendOtp}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="space-y-6"
            >
              {/* Phone Input */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-[#0a4a4a] flex items-center gap-2 font-poppins">
                  <FaPhone className="text-[#F59E0B]" />
                  Mobile Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  aria-label="Mobile number for admin login"
                  aria-describedby="phone-hint"
                  className="w-full p-4 text-lg rounded-xl bg-white border-2 border-[#0a4a4a]/20 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/30 outline-none transition-all placeholder:text-[#0a4a4a]/40 font-poppins"
                />
                <p id="phone-hint" className="text-xs text-[#0a4a4a]/60 font-poppins">
                  10 digits • Must start with 6, 7, 8, or 9
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-[#0a4a4a] hover:bg-[#0a4a4a]/90 text-white py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg font-poppins"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send OTP <FaArrowRight size={16} />
                  </>
                )}
              </motion.button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-xs text-[#0a4a4a]/70 bg-[#F59E0B]/10 p-3 rounded-lg border border-[#F59E0B]/20 font-poppins">
                <FaShieldAlt className="text-[#F59E0B]" />
                <span>Your data is secure with bank-level encryption</span>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              onSubmit={handleVerifyOtp}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="space-y-6"
            >
              {/* Phone Display */}
              <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg border-2 border-[#F59E0B]/30">
                <p className="text-sm text-[#0a4a4a] font-poppins">
                  Code sent to{" "}
                  <span className="font-semibold text-[#F59E0B]">+91 {phone}</span>
                </p>
              </div>

              {/* OTP Input Fields */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#0a4a4a] font-poppins">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpArray.map((digit, i) => (
                    <motion.input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handlePaste}
                      maxLength={1}
                      aria-label={`OTP digit ${i + 1}`}
                      whileFocus={{ scale: 1.15 }}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 border-[#0a4a4a]/30 bg-white focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/30 outline-none transition-all font-poppins"
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtpArray(["", "", "", "", "", ""]);
                    setError("");
                    setResendTimer(0);
                  }}
                  className="flex-1 px-4 py-3 bg-[#0a4a4a]/10 text-[#0a4a4a] rounded-xl font-medium hover:bg-[#0a4a4a]/20 transition-all duration-200 active:scale-95 font-poppins"
                >
                  Back
                </button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 px-4 py-3 bg-[#0a4a4a] hover:bg-[#0a4a4a]/90 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-poppins"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span> Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </motion.button>
              </div>

              {/* Resend Button */}
              <div className="text-center pt-2 border-t border-[#0a4a4a]/10">
                {resendTimer > 0 ? (
                  <p className="text-sm text-[#0a4a4a]/60 font-poppins">
                    Resend code in <span className="font-semibold text-[#F59E0B]">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending || resendTimer > 0}
                    className="text-sm text-[#F59E0B] hover:text-[#F59E0B]/80 font-semibold transition-colors font-poppins"
                  >
                    {resending ? "Resending..." : "Didn't receive code? Resend"}
                  </button>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
