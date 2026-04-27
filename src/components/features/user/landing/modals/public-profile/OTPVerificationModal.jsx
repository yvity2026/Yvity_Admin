"use client";
import { ModalWrapper } from "@/app/components/layout/ModalWrapper";
import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";

const OTPVerificationModal = ({ open, onClose, mobileNumber, onVerify, loading = false }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [open]);

  const handleInputChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Move to next input if digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(pastedData)) {
      setError("Please paste a valid 6-digit OTP");
      return;
    }
    setOtp(pastedData.split(""));
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    onVerify(otpCode);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setCanResend(false);
    setError("");
    // Call resend API here if needed
  };

  if (!open) return null;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white rounded-[2rem] shadow-xl w-[calc(100vw-2rem)] sm:w-full max-w-md overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            <h2 className="text-[clamp(14px,1.5vw,18px)] font-bold text-slate-900">
              Verify OTP
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div className="text-center space-y-1">
            <p className="text-sm text-gray-600">
              A 6-digit verification code has been sent to
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {mobileNumber}
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="space-y-4">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="•"
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 rounded-xl transition-all ${
                    error
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:bg-blue-50"
                  }`}
                  disabled={loading}
                  autoComplete="off"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500 text-center font-medium">{error}</p>
            )}
          </div>

          {/* Timer and Resend */}
          <div className="text-center space-y-2">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Resend OTP in <span className="font-bold text-blue-600">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
              >
                Didn't receive code? Resend OTP
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Verifying...
              </>
            ) : (
              <>
                <FiCheckCircle size={18} />
                Verify OTP
              </>
            )}
          </button>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center">
            This OTP will expire in 10 minutes
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default OTPVerificationModal;
