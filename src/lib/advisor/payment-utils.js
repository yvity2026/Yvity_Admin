/**
 * Payment utilities for formatting and processing payment data
 */

/**
 * Format payment amount with currency
 */
export const formatPaymentAmount = (amount, currency = "₹") => {
  return `${currency} ${(amount / 100).toFixed(2)}`;
};

/**
 * Format payment date
 */
export const formatPaymentDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format payment time
 */
export const formatPaymentTime = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Generate invoice filename
 */
export const generateInvoiceFilename = (paymentId) => {
  return `payment-${paymentId.slice(0, 8)}-${new Date().getTime()}.json`;
};

/**
 * Validate payment data
 */
export const validatePaymentData = (payment) => {
  const required = ["id", "user_id", "amount", "status", "created_at"];
  return required.every((field) => payment.hasOwnProperty(field));
};

/**
 * Export payment to CSV format
 */
export const exportPaymentToCSV = (payments) => {
  const headers = [
    "Payment ID",
    "Date",
    "Plan",
    "Amount",
    "Currency",
    "Status",
    "Method",
    "Order ID",
  ];

  const rows = payments.map((payment) => [
    payment.id.slice(0, 8),
    formatPaymentDate(payment.created_at),
    payment.plan_id || "N/A",
    (payment.amount / 100).toFixed(2),
    payment.currency || "INR",
    payment.status,
    payment.payment_method || "N/A",
    payment.razorpay_order_id || "N/A",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `payment-history-${new Date().getTime()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export payment to JSON format
 */
export const exportPaymentToJSON = (payments) => {
  const jsonStr = JSON.stringify(payments, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `payment-history-${new Date().getTime()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Calculate total amount from payments
 */
export const calculateTotalAmount = (payments) => {
  return payments
    .filter((p) => p.status === "paid")
    .reduce((total, payment) => total + payment.amount, 0);
};

/**
 * Get payment statistics
 */
export const getPaymentStats = (payments) => {
  return {
    total: payments.length,
    completed: payments.filter((p) => p.status === "paid").length,
    failed: payments.filter((p) => p.status === "failed").length,
    processing: payments.filter((p) => p.status === "processing").length,
    totalAmount: calculateTotalAmount(payments),
  };
};
