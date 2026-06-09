"use client";

export default function AmbassadorProgramSettings({
  config,
  onPause,
  onResume,
  isProcessing = false,
}) {
  const isPaused = config?.status === "paused";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[20px] border border-[#E6ECEA] bg-[#FCFDFC] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
          Referral rules
        </p>
        <ul className="mt-3 space-y-2 text-sm text-[#183534]">
          <li>
            Qualifying plans:{" "}
            <strong>{(config?.referralRules?.qualifyingPlans || []).join(", ") || "—"}</strong>
          </li>
          <li>
            Checkout kinds:{" "}
            <strong>
              {(config?.referralRules?.qualifyingCheckoutKinds || []).join(", ") || "—"}
            </strong>
          </li>
          <li>
            Link param: <strong>{config?.referralRules?.linkParam || "ref"}</strong>
          </li>
        </ul>
      </div>

      <div className="rounded-[20px] border border-[#E6ECEA] bg-[#FCFDFC] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
          Reward rules
        </p>
        <ul className="mt-3 space-y-2 text-sm text-[#183534]">
          <li>
            Reward type:{" "}
            <strong>{config?.rewardRules?.onQualifiedReferral?.rewardType || "discount_coupon"}</strong>
          </li>
          <li>
            Discount:{" "}
            <strong>
              {config?.rewardRules?.onQualifiedReferral?.discountValue || 0}
              {config?.rewardRules?.onQualifiedReferral?.discountType === "fixed" ? " INR" : "%"}
            </strong>
          </li>
          <li>
            Applies to:{" "}
            <strong>
              {(config?.rewardRules?.onQualifiedReferral?.appliesTo || []).join(", ") || "All paid"}
            </strong>
          </li>
        </ul>
      </div>

      <div className="rounded-[20px] border border-[#E6ECEA] bg-[#FCFDFC] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
          Eligibility rules
        </p>
        <ul className="mt-3 space-y-2 text-sm text-[#183534]">
          <li>
            Auto-enroll all advisors:{" "}
            <strong>{config?.eligibilityRules?.autoEnrollAllAdvisors !== false ? "Yes" : "No"}</strong>
          </li>
          <li>
            Free-tier referrers allowed:{" "}
            <strong>{config?.eligibilityRules?.allowFreeReferrers ? "Yes" : "No"}</strong>
          </li>
          <li>
            Requires approval:{" "}
            <strong>{config?.eligibilityRules?.requireApproval ? "Yes" : "No"}</strong>
          </li>
        </ul>
      </div>

      <div className="rounded-[20px] border border-[#E6ECEA] bg-[#FCFDFC] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
          Program status
        </p>
        <p className="mt-3 text-sm text-[#183534]">
          Current status:{" "}
          <strong className={isPaused ? "text-[#B45309]" : "text-[#1A7A5A]"}>
            {isPaused ? "Paused" : "Active"}
          </strong>
        </p>
        <button
          type="button"
          disabled={isProcessing}
          onClick={isPaused ? onResume : onPause}
          className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
            isPaused ? "bg-[#1A7A5A]" : "bg-[#B45309]"
          }`}
        >
          {isPaused ? "Resume program" : "Pause program"}
        </button>
      </div>
    </div>
  );
}
