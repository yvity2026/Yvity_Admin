"use client";

import { useState, useRef, useEffect } from "react";
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

  // Resend Timer Effect
  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F8F6F1] px-3 sm:px-4 py-4">
      {/* 🌈 Animated Background Bloom - Responsive sizing */}
      <div className="absolute w-64 h-64 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] bg-[#0a4a4a]/10 blur-3xl sm:blur-[120px] rounded-full top-[-80px] sm:top-[-100px] left-[-80px] sm:left-[-100px] animate-pulse" />
      <div className="absolute w-56 h-56 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] bg-[#F59E0B]/10 blur-3xl sm:blur-[120px] rounded-full bottom-[-60px] sm:bottom-[-100px] right-[-60px] sm:right-[-100px] animate-pulse" />

      {/* 🧊 Card - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative z-10 backdrop-blur-xl bg-white/95 border-2 border-[#0a4a4a]/10 shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 w-full max-w-md"
      >
        {/* Logo Section - Responsive and Fixed */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-2 sm:p-3 bg-gradient-to-br from-[#0a4a4a] to-[#0a4a4a]/80 rounded-full flex items-center justify-center"
          >
            <img
              src="/images/Adivisor/Navbar/navlogo.png"
              alt="YVITY Logo"
              className="h-6 sm:h-8 md:h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback if logo fails to load
                e.target.style.display = "none";
              }}
            />
          </motion.div>
        </div>

        {/* Header - Using Cormorant Garamond for heading, Mobile responsive text */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.h1
            key={`title-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold font-cormorant text-[#0a4a4a] mb-1 sm:mb-2"
          >
            {step === "phone" ? "Admin Access" : "Verify OTP"}
          </motion.h1>
          <p className="text-[#0a4a4a]/70 text-xs sm:text-sm md:text-base font-poppins leading-relaxed px-2">
            {step === "phone"
              ? "Enter your mobile number to get started"
              : "Enter the 6-digit code sent to your phone"}
          </p>
        </div>

        {/* Error Message with Animation - Mobile responsive */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-xs sm:text-sm flex gap-2 items-start font-poppins"
            >
              <span className="text-base sm:text-lg mt-0.5 flex-shrink-0">⚠️</span>
              <span className="flex-1">{error}</span>
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
              className="space-y-4 sm:space-y-6"
            >
              {/* Phone Input */}
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-[#0a4a4a] flex items-center gap-2 font-poppins">
                  <FaPhone className="text-[#F59E0B] flex-shrink-0" size={14} />
                  <span>Mobile Number</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  aria-label="Mobile number for admin login"
                  aria-describedby="phone-hint"
                  className="w-full p-3 sm:p-4 text-base sm:text-lg rounded-xl bg-white border-2 border-[#0a4a4a]/20 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/30 outline-none transition-all placeholder:text-[#0a4a4a]/40 font-poppins"
                />
                <p id="phone-hint" className="text-xs text-[#0a4a4a]/60 font-poppins">
                  10 digits • Must start with 6, 7, 8, or 9
                </p>
              </div>

              {/* Submit Button - Mobile optimized */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-[#0a4a4a] hover:bg-[#0a4a4a]/90 text-white py-3 sm:py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm sm:text-base font-poppins"
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    Send OTP <FaArrowRight size={14} className="hidden sm:inline" />
                  </>
                )}
              </motion.button>

              {/* Security Note - Mobile responsive */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#0a4a4a]/70 bg-[#F59E0B]/10 p-2.5 sm:p-3 rounded-lg border border-[#F59E0B]/20 font-poppins">
                <FaShieldAlt className="text-[#F59E0B] flex-shrink-0" size={14} />
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
              className="space-y-4 sm:space-y-6"
            >
              {/* Phone Display - Mobile optimized */}
              <div className="text-center p-3 sm:p-4 bg-[#F59E0B]/10 rounded-lg border-2 border-[#F59E0B]/30">
                <p className="text-xs sm:text-sm text-[#0a4a4a] font-poppins break-words">
                  Code sent to{" "}
                  <span className="font-semibold text-[#F59E0B]">+91 {phone}</span>
                </p>
              </div>

              {/* OTP Input Fields - Mobile responsive */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-medium text-[#0a4a4a] font-poppins block">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3">
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
                      className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-lg sm:text-xl md:text-2xl font-bold rounded-lg sm:rounded-xl border-2 border-[#0a4a4a]/30 bg-white focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/30 outline-none transition-all font-poppins"
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons - Mobile optimized */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtpArray(["", "", "", "", "", ""]);
                    setError("");
                    setResendTimer(0);
                  }}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0a4a4a]/10 text-[#0a4a4a] rounded-lg sm:rounded-xl font-medium text-sm sm:text-base hover:bg-[#0a4a4a]/20 transition-all duration-200 active:scale-95 font-poppins"
                >
                  Back
                </button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0a4a4a] hover:bg-[#0a4a4a]/90 text-white rounded-lg sm:rounded-xl font-medium text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-poppins"
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

              {/* Resend Button - Mobile responsive */}
              <div className="text-center pt-2 sm:pt-3 border-t border-[#0a4a4a]/10">
                {resendTimer > 0 ? (
                  <p className="text-xs sm:text-sm text-[#0a4a4a]/60 font-poppins">
                    Resend code in <span className="font-semibold text-[#F59E0B]">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending || resendTimer > 0}
                    className="text-xs sm:text-sm text-[#F59E0B] hover:text-[#F59E0B]/80 font-semibold transition-colors font-poppins break-words px-2"
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
