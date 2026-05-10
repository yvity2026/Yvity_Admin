"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function AdminLogin() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
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
      setError("Enter valid 10-digit number");
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
      setError("Enter complete OTP");
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
      setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch {
      setError("Unable to resend OTP right now");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌈 Background Bloom */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-200" />

      <div className="absolute w-[500px] h-[500px] bg-purple-300/30 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-300/30 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* 🧊 Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="relative z-10 backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <div className="flex justify-center mb-4">
          <img
            src="/images/Adivisor/Navbar/navlogo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Admin Login
        </h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

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
              <div>
                <label className="text-sm text-gray-600">Mobile Number</label>

                <input
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="9876543210"
                  className="w-full mt-2 p-3 rounded-xl bg-white/80 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
                <FaArrowRight />
              </motion.button>
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
              <p className="text-center text-sm text-gray-600">
                OTP sent to +91 {phone}
              </p>

              {/* OTP BOXES */}
              <div className="flex justify-center gap-3">
                {otpArray.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    whileFocus={{ scale: 1.1 }}
                    className="w-12 h-14 text-center rounded-xl border bg-white/80 text-lg font-semibold focus:ring-2 focus:ring-blue-300 outline-none transition-all"
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtpArray(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="flex-1 bg-gray-200 py-3 rounded-xl hover:bg-gray-300 transition"
                >
                  Back
                </button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl shadow-md disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify"}
                </motion.button>
              </div>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-sm text-center text-gray-500 hover:text-blue-600 transition w-full"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}