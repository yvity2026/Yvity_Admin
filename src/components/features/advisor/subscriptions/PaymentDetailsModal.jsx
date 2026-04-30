"use client";

import React from "react";
import {
  MdOutlineClose,
  MdOutlineDownload,
  MdOutlineCheckCircle,
  MdOutlineErrorOutline,
} from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";

/**
 * Payment Details Modal Component
 * Displays comprehensive payment information
 * 
 * Usage:
 * <PaymentDetailsModal 
 *   isOpen={isOpen}
 *   payment={paymentData}
 *   onClose={handleClose}
 *   onDownload={handleDownload}
 * />
 */
const PaymentDetailsModal = ({
  isOpen,
  payment,
  onClose,
  onDownload,
  isDownloading = false,
}) => {
  if (!isOpen || !payment) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <MdOutlineCheckCircle className="text-green-600 text-3xl" />;
      case "failed":
        return <MdOutlineErrorOutline className="text-red-600 text-3xl" />;
      case "processing":
        return <HiOutlineExclamationCircle className="text-yellow-600 text-3xl" />;
      default:
        return <HiOutlineExclamationCircle className="text-gray-600 text-3xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-50 border-green-200";
      case "failed":
        return "bg-red-50 border-red-200";
      case "processing":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Payment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MdOutlineClose size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Status Section */}
            <div
              className={`border rounded-lg p-6 flex items-center gap-4 ${getStatusColor(
                payment.status
              )}`}
            >
              {getStatusIcon(payment.status)}
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="text-lg font-bold capitalize text-gray-900">
                  {payment.status === "paid" && "Successfully Completed"}
                  {payment.status === "failed" && "Payment Failed"}
                  {payment.status === "processing" && "Processing"}
                  {payment.status === "created" && "Pending"}
                </p>
              </div>
            </div>

            {/* Amount Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Transaction Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                {payment.currency || "₹"}{" "}
                {(payment.amount / 100).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Transaction ID: {payment.id.slice(0, 12)}...
              </p>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Plan
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
                  {payment.plan_id || "N/A"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Payment Method
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
                  {payment.payment_method || "N/A"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Order ID
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                  {payment.razorpay_order_id || "N/A"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Payment ID
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                  {payment.razorpay_payment_id || "N/A"}
                </p>
              </div>
            </div>

            {/* Dates Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Transaction Date
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {payment.paid_at_formatted || "Pending"}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Created At
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {payment.created_at_formatted}
                </p>
              </div>
            </div>

            {/* Failure Reason (if applicable) */}
            {payment.failure_reason && (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <p className="text-xs text-red-600 uppercase tracking-wide font-semibold">
                  Failure Reason
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {payment.failure_reason}
                </p>
              </div>
            )}

            {/* Additional Details */}
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Additional Information
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Webhook Verified:</span>{" "}
                  {payment.webhook_verified ? "✓ Yes" : "✗ No"}
                </p>
                {payment.receipt && (
                  <p>
                    <span className="font-semibold">Receipt:</span>{" "}
                    {payment.receipt}
                  </p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-600 font-semibold">
                🔒 Secure & Encrypted
              </p>
              <p className="text-xs text-blue-600 mt-1">
                All payment information is encrypted and stored securely. This
                document is for your records.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>

            {payment.status === "paid" && (
              <button
                onClick={() => onDownload(payment.id)}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdOutlineDownload
                  className={isDownloading ? "animate-bounce" : ""}
                />
                {isDownloading ? "Downloading..." : "Download Details"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetailsModal;
