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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200 px-4">
      {/* 🌈 Animated Background Bloom */}
      <div className="absolute w-[500px] h-[500px] bg-purple-300/30 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-blue-300/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-pulse" />

      {/* 🧊 Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative z-10 backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full">
            <img
              src="/images/Adivisor/Navbar/navlogo.png"
              alt="YVITY Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            key={`title-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            {step === "phone" ? "Admin Access" : "Verify OTP"}
          </motion.h1>
          <p className="text-gray-600 text-sm">
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
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2 items-start"
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
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
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
                  className="w-full p-4 text-lg rounded-xl bg-white/80 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all placeholder:text-gray-400"
                />
                <p id="phone-hint" className="text-xs text-gray-500">
                  10 digits • Must start with 6, 7, 8, or 9
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg"
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
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                <FaShieldAlt className="text-blue-600" />
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
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  Code sent to{" "}
                  <span className="font-semibold text-blue-600">+91 {phone}</span>
                </p>
              </div>

              {/* OTP Input Fields */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
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
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-300 bg-white/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
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
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 active:scale-95"
                >
                  Back
                </button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              <div className="text-center pt-2 border-t border-gray-200">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in <span className="font-semibold text-blue-600">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending || resendTimer > 0}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
