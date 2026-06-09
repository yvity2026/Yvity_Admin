"use client";

import AdminModal from "@/components/admin/ui/AdminModal";

export default function AmbassadorDetailModal({ ambassador, onClose }) {
  if (!ambassador) return null;

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Ambassador"
      title={ambassador.name}
      size="md"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-[#E6ECEA] py-3 text-sm font-semibold text-[#5C7571]"
        >
          Close
        </button>
      }
    >
      <div className="space-y-3 text-sm text-[#183534]">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#FCFDFC] p-3 ring-1 ring-[#EEF2F0]">
            <p className="text-[11px] text-[#7A928D]">Total referrals</p>
            <p className="admin-num mt-1 text-xl font-bold">{ambassador.totalReferrals}</p>
          </div>
          <div className="rounded-2xl bg-[#FCFDFC] p-3 ring-1 ring-[#EEF2F0]">
            <p className="text-[11px] text-[#7A928D]">Successful</p>
            <p className="admin-num mt-1 text-xl font-bold">{ambassador.successfulReferrals}</p>
          </div>
          <div className="rounded-2xl bg-[#FCFDFC] p-3 ring-1 ring-[#EEF2F0]">
            <p className="text-[11px] text-[#7A928D]">Rewards earned</p>
            <p className="admin-num mt-1 text-xl font-bold text-[#1A7A5A]">
              {ambassador.rewardsEarned ?? 0}
            </p>
          </div>
          <div className="rounded-2xl bg-[#FCFDFC] p-3 ring-1 ring-[#EEF2F0]">
            <p className="text-[11px] text-[#7A928D]">Rewards claimed</p>
            <p className="admin-num mt-1 text-xl font-bold">{ambassador.rewardsClaimed ?? 0}</p>
          </div>
        </div>

        <p>
          <span className="font-semibold">User ID:</span>{" "}
          <span className="font-mono text-[12px]">{ambassador.userId}</span>
        </p>
        <p>
          <span className="font-semibold">Plan:</span> {ambassador.planLabel}
        </p>
        <p>
          <span className="font-semibold">Referral code:</span> {ambassador.referralCode}
        </p>
        <p className="break-all">
          <span className="font-semibold">Referral link:</span> {ambassador.referralLink}
        </p>
        <p className="text-[11px] text-[#7A928D]">
          Opens the advisor app registration page. Ensure Yvity_Users is running on port 3002 (
          <code className="font-mono">npm run dev</code> in Yvity_Users).
        </p>
        <p>
          <span className="font-semibold">Status:</span> {ambassador.statusLabel}
        </p>
      </div>
    </AdminModal>
  );
}
