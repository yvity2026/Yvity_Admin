"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HiOutlineDownload, HiOutlineExclamationCircle } from "react-icons/hi";
import {
  MdOutlineVerifiedUser,
  MdOutlineErrorOutline,
  MdOutlineAccessTime,
  MdOutlineRefresh,
} from "react-icons/md";
import { FaCrown, FaAward } from "react-icons/fa";

// Plan icons configuration
const PLAN_ICONS = {
  gold: { icon: <FaCrown className="text-yellow-500" />, label: "Gold Plan" },
  silver: { icon: <FaAward className="text-gray-400" />, label: "Silver Plan" },
  basic: { icon: <FaAward className="text-orange-400" />, label: "Basic Plan" },
};

// Status configuration
const STATUS_CONFIG = {
  paid: {
    icon: <MdOutlineVerifiedUser className="text-green-600" />,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    label: "Completed",
  },
  failed: {
    icon: <MdOutlineErrorOutline className="text-red-600" />,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    label: "Failed",
  },
  processing: {
    icon: <MdOutlineAccessTime className="text-blue-600" />,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    label: "Processing",
  },
  created: {
    icon: <MdOutlineAccessTime className="text-yellow-600" />,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    label: "Pending",
  },
};

const Pricing_History = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0,
    hasMore: false,
  });

  /**
   * Fetch payment history from API
   */
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/advisor/subscription/payments?limit=${pagination.limit}&offset=${pagination.offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error("Failed to fetch payment history");
      }

      const result = await response.json();

      if (result.success) {
        setPayments(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result.error || "Failed to fetch payments");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to load payment history");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.offset]);

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  /**
   * Download payment details as JSON
   */
  const handleDownloadJSON = async (paymentId) => {
    try {
      setDownloading((prev) => ({ ...prev, [paymentId]: true }));

      const response = await fetch(
        `/api/advisor/subscription/payments/download/${paymentId}?format=json`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download payment details");
      }

      const data = await response.json();

      // Create JSON file and trigger download
      const jsonStr = JSON.stringify(data.data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payment-${paymentId.slice(0, 8)}-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download payment details");
    } finally {
      setDownloading((prev) => ({ ...prev, [paymentId]: false }));
    }
  };

  /**
   * Get plan display info
   */
  const getPlanIcon = (planId) => {
    const planKey = planId?.toLowerCase() || "basic";
    return PLAN_ICONS[planKey] || PLAN_ICONS.basic;
  };

  /**
   * Get status display info
   */
  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.created;
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl px-4 md:px-10 py-7 border border-gray-100">
        <h2 className="text-[16px] font-bold text-[var(--headings-important-text)] font-poppins mb-5">
          Payment History
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <MdOutlineRefresh className="animate-spin mx-auto mb-2 text-2xl text-blue-600" />
            <p className="text-gray-500 text-sm font-nunito">
              Loading payment history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl px-4 md:px-10 py-7 border border-gray-100">
        <h2 className="text-[16px] font-bold text-[var(--headings-important-text)] font-poppins mb-5">
          Payment History
        </h2>
        <div className="flex items-center justify-center py-12 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-2 text-2xl text-red-600" />
            <p className="text-red-600 text-sm font-nunito font-semibold">
              {error}
            </p>
            <button
              onClick={fetchPayments}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (payments.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl px-4 md:px-10 py-7 border border-gray-100">
        <h2 className="text-[16px] font-bold text-[var(--headings-important-text)] font-poppins mb-5">
          Payment History
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 text-sm font-nunito">
              No payment records found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl px-4 md:px-10 py-7 border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[16px] font-bold text-[var(--headings-important-text)] font-poppins">
          Payment History
        </h2>
        <button
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh payment history"
        >
          <MdOutlineRefresh
            className={loading ? "animate-spin" : ""}
            size={16}
          />
          <span className="text-xs font-semibold hidden sm:inline">
            Refresh
          </span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[12px] text-[var(--labels-secondary-info)] font-semibold font-poppins">
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">Plan</th>
              <th className="text-left px-3 py-2">Amount</th>
              <th className="text-left px-3 py-2">Method</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => {
              const statusConfig = getStatusConfig(payment.status);
              const planInfo = getPlanIcon(payment.plan_id);

              return (
                <tr
                  key={payment.id}
                  className="bg-white border border-gray-100 hover:shadow-sm transition-shadow"
                >
                  {/* Date Column */}
                  <td className="px-3 py-3 text-[12px] font-nunito text-gray-700">
                    <div className="space-y-1">
                      <p className="font-semibold">
                        {payment.paid_at_formatted}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {payment.created_at_formatted}
                      </p>
                    </div>
                  </td>

                  {/* Plan Column with Icon */}
                  <td className="px-3 py-3 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{planInfo.icon}</span>
                      <span className="font-semibold">
                        {planInfo.label}
                      </span>
                    </div>
                  </td>

                  {/* Amount Column */}
                  <td className="px-3 py-3 text-[12px] font-semibold text-gray-900">
                    <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
                      {payment.amount_formatted}
                    </span>
                  </td>

                  {/* Payment Method Column */}
                  <td className="px-3 py-3 text-[12px] text-gray-600 font-nunito">
                    <span className="capitalize">
                      {payment.payment_method || "N/A"}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="px-3 py-3">
                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold w-fit ${statusConfig.bgColor} ${statusConfig.textColor}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </td>

                  {/* Action Column - Download */}
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleDownloadJSON(payment.id)}
                      disabled={downloading[payment.id] || payment.status !== "paid"}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                        payment.status === "paid"
                          ? "text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer disabled:opacity-50"
                          : "text-gray-400 bg-gray-50 cursor-not-allowed"
                      }`}
                      title={
                        payment.status === "paid"
                          ? "Download payment details"
                          : "Only paid payments can be downloaded"
                      }
                    >
                      <HiOutlineDownload
                        className={
                          downloading[payment.id] ? "animate-bounce" : ""
                        }
                      />
                      <span className="hidden sm:inline">
                        {downloading[payment.id] ? "Downloading..." : "Download"}
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      {pagination.total > 0 && (
        <div className="mt-4 flex justify-between items-center text-[12px] text-gray-600 font-nunito">
          <p>
            Showing {payments.length} of {pagination.total} payments
          </p>
          {pagination.hasMore && (
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  offset: prev.offset + prev.limit,
                }))
              }
              className="text-blue-600 hover:underline font-semibold"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Pricing_History;