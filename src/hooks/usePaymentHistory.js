/**
 * Custom hook for managing payment history data
 */

import { useState, useCallback, useEffect } from "react";

export const usePaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    limit: 50,
    offset: 0,
    total: 0,
    hasMore: false,
  });

  /**
   * Fetch payment history from API
   */
  const fetchPayments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        limit: params.limit || pagination.limit,
        offset: params.offset || pagination.offset,
        ...(params.status && { status: params.status }),
      });

      const response = await fetch(
        `/api/advisor/subscription/payments?${queryParams}`,
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
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  /**
   * Download payment details
   */
  const downloadPaymentDetails = useCallback(async (paymentId, format = "json") => {
    try {
      const response = await fetch(
        `/api/advisor/subscription/payments/download/${paymentId}?format=${format}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download payment details");
      }

      const data = await response.json();

      // Handle different formats
      if (format === "csv") {
        // CSV export logic
        const csv = convertToCSV(data.data);
        downloadFile(csv, `payment-${paymentId}.csv`, "text/csv");
      } else {
        // JSON export logic
        const jsonStr = JSON.stringify(data.data, null, 2);
        downloadFile(jsonStr, `payment-${paymentId}.json`, "application/json");
      }

      return true;
    } catch (err) {
      console.error("Download error:", err);
      throw err;
    }
  }, []);

  /**
   * Helper to download file
   */
  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Convert JSON to CSV
   */
  const convertToCSV = (data) => {
    const headers = Object.keys(data);
    const values = Object.values(data).map((v) =>
      typeof v === "object" ? JSON.stringify(v) : v
    );
    return [headers.join(","), values.join(",")].join("\n");
  };

  /**
   * Refetch payments
   */
  const refetch = useCallback(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    pagination,
    fetchPayments,
    downloadPaymentDetails,
    refetch,
    setPagination,
  };
};
