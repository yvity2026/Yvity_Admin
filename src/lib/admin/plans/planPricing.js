export function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function formatPriceLabel(salePriceInr, billingCycle = "year") {
  const price = Number(salePriceInr) || 0;
  if (price <= 0) return "₹0";
  if (billingCycle === "year") return `${formatInr(price)}/year`;
  if (billingCycle === "month") return `${formatInr(price)}/month`;
  return formatInr(price);
}

export function computeDiscountPercent(listPriceInr, salePriceInr) {
  const list = Number(listPriceInr) || 0;
  const sale = Number(salePriceInr) || 0;
  if (list <= 0 || sale >= list) return 0;
  return Math.round(((list - sale) / list) * 100);
}

export function hasActiveDiscount(listPriceInr, salePriceInr) {
  const list = Number(listPriceInr) || 0;
  const sale = Number(salePriceInr) || 0;
  return list > 0 && sale < list;
}

export function slugifyPlanId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
