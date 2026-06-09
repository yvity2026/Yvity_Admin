"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminModal from "@/components/admin/ui/AdminModal";
import { useAmbassadorActions } from "@/hooks/TanstankQuery/useAmbassadors";

const EMPTY = {
  name: "",
  description: "",
  referralTarget: 5,
  rewardType: "discount_coupon",
  rewardValue: "",
  startDate: "",
  endDate: "",
  status: "active",
};

export default function RewardCampaignFormModal({
  open,
  onClose,
  rewardTypes = [],
  initialCampaign = null,
  mode = "create",
}) {
  const { createRewardCampaign, updateRewardCampaign, isProcessing } = useAmbassadorActions();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (!open) return;
    if (initialCampaign) {
      setForm({
        name: initialCampaign.name || "",
        description: initialCampaign.description || "",
        referralTarget: initialCampaign.referralTarget || 1,
        rewardType: initialCampaign.rewardType || "discount_coupon",
        rewardValue: initialCampaign.rewardValue || "",
        startDate: initialCampaign.startDate || "",
        endDate: initialCampaign.endDate || "",
        status: initialCampaign.status === "paused" ? "paused" : "active",
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, initialCampaign]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === "edit" && initialCampaign?.id) {
        await updateRewardCampaign(initialCampaign.id, form);
        toast.success("Campaign updated");
      } else {
        await createRewardCampaign(form);
        toast.success("Campaign created");
      }
      onClose();
    } catch (error) {
      toast.error(error.message || "Could not save campaign");
    }
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      eyebrow="Rewards engine"
      title={mode === "edit" ? "Edit campaign" : "Create campaign"}
      size="md"
      footer={
        <button
          type="submit"
          form="reward-campaign-form"
          disabled={isProcessing}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#0A4A4A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0D6060] disabled:opacity-60"
        >
          {isProcessing ? "Saving…" : mode === "edit" ? "Save changes" : "Create campaign"}
        </button>
      }
    >
      <form
        id="reward-campaign-form"
        className="space-y-4"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
            Campaign name
          </span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
            Description
          </span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full resize-y rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
            Referral target (successful referrals)
          </span>
          <input
            type="number"
            min={1}
            required
            value={form.referralTarget}
            onChange={(e) =>
              setForm((p) => ({ ...p, referralTarget: Number(e.target.value) || 1 }))
            }
            className="w-full rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
              Reward type
            </span>
            <select
              value={form.rewardType}
              onChange={(e) => setForm((p) => ({ ...p, rewardType: e.target.value }))}
              className="w-full rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
            >
              {rewardTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
              Reward value
            </span>
            <input
              required
              placeholder="e.g. 1 Month, 50% Discount, ₹500 Coupon"
              value={form.rewardValue}
              onChange={(e) => setForm((p) => ({ ...p, rewardValue: e.target.value }))}
              className="w-full rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
              Start date
            </span>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              className="w-full rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
              End date
            </span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              className="w-full rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#53807E]">
            Campaign status
          </span>
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            className="w-full rounded-xl border border-[#E4E2DB] px-4 py-3 text-sm outline-none ring-[#0A4A4A]/20 focus:ring-2"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </label>
      </form>
    </AdminModal>
  );
}
