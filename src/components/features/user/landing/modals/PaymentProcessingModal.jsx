"use client";

import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const PaymentProcessingModal = ({ isOpen, paymentStatus, planName }) => {
  if (!isOpen) return null;

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "processing":
        return {
          title: "Processing Payment",
          description: "Your payment is being processed. Please wait...",
          icon: "⏳",
        };
      case "verifying":
        return {
          title: "Verifying Payment",
          description: "We're verifying your payment details...",
          icon: "✔️",
        };
      case "activating":
        return {
          title: "Activating Plan",
          description: "Activating your subscription and updating your profile...",
          icon: "🚀",
        };
      default:
        return {
          title: "Processing",
          description: "Please wait while we process your request...",
          icon: "⏳",
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-white/20 p-8"
      >
        {/* Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6 text-center"
        >
          {status.icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {status.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-center text-sm mb-6">
          {status.description}
        </p>

        {/* Plan Info */}
        {planName && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-xs text-gray-500 mb-1">Plan</p>
            <p className="text-lg font-semibold text-gray-900">{planName}</p>
          </div>
        )}

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center">
          Do not close this window or navigate away
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentProcessingModal;
