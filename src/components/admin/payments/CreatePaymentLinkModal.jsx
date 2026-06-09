"use client";

import { useMemo, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";

export default function CreatePaymentLinkModal({
  advisors = [],
  planOptions = [],
  onClose,
  onCreate,
  isProcessing = false,
}) {
  const [userId, setUserId] = useState(advisors[0]?.userId || "");
  const [planId, setPlanId] = useState(planOptions[0]?.id || "gold");
  const [checkoutKind, setCheckoutKind] = useState("purchase");
  const [couponCode, setCouponCode] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  const selectedPlan = useMemo(
    () => planOptions.find((plan) => plan.id === planId),
    [planOptions, planId],
  );

  const handleCreate = async () => {
    const response = await onCreate?.({
      userId,
      planId,
      checkoutKind,
      couponCode: couponCode.trim() || null,
      note: note.trim() || null,
    });
    if (response) setResult(response);
  };

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Payment link"
      title="Send checkout link"
      size="md"
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 rounded-xl bg-[#F3F4F6] py-3 text-sm font-semibold text-[#35504C]"
          >
            {result ? "Done" : "Cancel"}
          </button>
          {!result ? (
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={isProcessing || !userId || !planId}
              className="flex-1 rounded-xl bg-[#0A4A4A] py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isProcessing ? "Creating…" : "Generate link"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(result.message || result.shareUrl || "")}
              className="flex-1 rounded-xl bg-[#0A4A4A] py-3 text-sm font-semibold text-white"
            >
              Copy message
            </button>
          )}
        </div>
      }
    >
      <p className="mb-4 text-sm text-[#5C7571]">
        Advisor opens My Space, membership checkout pre-fills plan and optional coupon.
      </p>

      <div className="space-y-4">
        {!result ? (
          <>
            <Field label="Advisor">
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={INPUT_CLASS}
              >
                {advisors.map((advisor) => (
                  <option key={advisor.userId} value={advisor.userId}>
                    {advisor.name} · {advisor.currentPlan} · {advisor.email || advisor.userId}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Plan">
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className={INPUT_CLASS}
                >
                  {planOptions.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} · {plan.priceLabel}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Checkout type">
                <select
                  value={checkoutKind}
                  onChange={(e) => setCheckoutKind(e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="purchase">New purchase</option>
                  <option value="upgrade">Upgrade</option>
                  <option value="renew">Renewal</option>
                </select>
              </Field>
            </div>

            {selectedPlan ? (
              <p className="rounded-xl bg-[#E8F4F3] px-4 py-3 text-sm text-[#0A4A4A]">
                Base sale price: {selectedPlan.priceLabel}
              </p>
            ) : null}

            <Field label="Coupon code (optional)">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="YVITY-ABC123"
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Internal note (optional)">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
          </>
        ) : (
          <div className="space-y-4">
            <p className="rounded-xl bg-[#E8F5F0] px-4 py-3 text-sm text-[#1A7A5A]">
              Link created for {result.link?.advisorName} — {result.link?.amountLabel}
            </p>
            <Field label="Share URL">
              <textarea readOnly rows={3} value={result.shareUrl || ""} className={INPUT_CLASS} />
            </Field>
            <Field label="WhatsApp / email message">
              <textarea readOnly rows={8} value={result.message || ""} className={INPUT_CLASS} />
            </Field>
          </div>
        )}
      </div>
    </AdminModal>
  );
}

const INPUT_CLASS =
  "w-full rounded-xl border border-[#D7E5E1] bg-white px-4 py-3 text-sm text-[#183534] outline-none focus:border-[#0A4A4A] focus:ring-2 focus:ring-[#0A4A4A]/10";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
        {label}
      </label>
      {children}
    </div>
  );
}
