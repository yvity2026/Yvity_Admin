const PLANS = {
  free: 0,
  silver: 999,
  gold: 2999,
};
function normalizePlan(plan) {
  return (plan || "").toLowerCase().trim();
}
const DAYS = 365;

function getDailyRate(plan) {
  const key = normalizePlan(plan);

  if (!PLANS[key]) {
    console.error("Invalid plan:", plan);
    return 0;
  }

  return PLANS[key] / DAYS;
}

export function calculateUpgrade({ fromPlan, toPlan, startDate }) {
  const now = new Date();
  const start = new Date(startDate);

  const usedDays = Math.floor(
    (now - start) / (1000 * 60 * 60 * 24)
  );

  const remainingDays = Math.max(DAYS - usedDays, 0);

  const fromRate = getDailyRate(fromPlan);
  const toRate = getDailyRate(toPlan);

  const unusedCredit = fromRate * remainingDays;
  const newPlanCost = toRate * remainingDays;

  const payable = Math.max(newPlanCost - unusedCredit, 0);

  console.log("DEBUG:", {
    fromPlan,
    toPlan,
    fromRate,
    toRate,
    remainingDays,
    payable,
  });

  return {
    remainingDays,
    payable: Math.round(payable * 100),
  };
}