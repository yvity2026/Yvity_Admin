export function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function formatPlanLabel(planId) {
  const key = String(planId || "—").toLowerCase();
  if (key === "free") return "Free";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

const STATUS_LABELS = {
  paid: { label: "Paid", tone: "success" },
  created: { label: "Pending", tone: "warning" },
  failed: { label: "Failed", tone: "danger" },
};

export function mapPaymentRow(payment = {}, user = {}) {
  const status = payment.status || "created";
  const statusMeta = STATUS_LABELS[status] || { label: status, tone: "slate" };

  return {
    id: payment.id,
    userId: payment.user_id,
    advisorName: user.fullName || user.name || "Advisor",
    email: user.email || null,
    phone: user.phone || user.mobile || null,
    city: user.city || null,
    planKey: payment.plan_id,
    planLabel: formatPlanLabel(payment.plan_id),
    amountInr: Number(payment.amount_inr) || 0,
    amountLabel: formatInr(payment.amount_inr),
    checkoutKind: payment.checkout_kind || "purchase",
    couponCode: payment.coupon_code || null,
    couponDiscountInr: Number(payment.coupon_discount_inr) || 0,
    creditInr: Number(payment.credit_inr) || 0,
    status,
    statusLabel: statusMeta.label,
    statusTone: statusMeta.tone,
    razorpayOrderId: payment.razorpay_order_id || null,
    razorpayPaymentId: payment.razorpay_payment_id || null,
    createdAt: payment.created_at || null,
    paidAt: payment.paid_at || null,
    paymentMethod: payment.payment_method || "Razorpay",
  };
}

export function mapPaymentLinkRow(link = {}, user = {}) {
  return {
    id: link.id,
    token: link.token,
    userId: link.user_id,
    advisorName: user.fullName || user.name || link.advisor_name || "Advisor",
    email: user.email || link.email || null,
    phone: user.phone || user.mobile || link.phone || null,
    planKey: link.plan_id,
    planLabel: formatPlanLabel(link.plan_id),
    checkoutKind: link.checkout_kind || "purchase",
    couponCode: link.coupon_code || null,
    amountInr: Number(link.amount_inr) || 0,
    amountLabel: formatInr(link.amount_inr),
    status: link.status || "pending",
    shareUrl: link.share_url,
    createdAt: link.created_at,
    expiresAt: link.expires_at,
    note: link.note || null,
  };
}
