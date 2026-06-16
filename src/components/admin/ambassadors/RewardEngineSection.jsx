"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAmbassadorActions } from "@/hooks/TanstankQuery/useAmbassadors";
import {
  AdminConfirmDialog,
  AdminSearchInput,
  AdminTabBar,
  useConfirmDialog,
} from "@/components/admin/ui";
import RewardCampaignFormModal from "./RewardCampaignFormModal";

const STATUS_STYLES = {
  active: "bg-[#E8F5F0] text-[#1A7A5A]",
  paused: "bg-[#FFF6E8] text-[#B45309]",
  expired: "bg-[#F1F5F9] text-[#64748B]",
};

export default function RewardEngineSection({ campaigns = [], rewardTypes = [] }) {
  const {
    duplicateRewardCampaign,
    pauseRewardCampaign,
    activateRewardCampaign,
    deleteRewardCampaign,
    isProcessing,
  } = useAmbassadorActions();
  const { confirm, dialogProps } = useConfirmDialog();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [viewCampaign, setViewCampaign] = useState(null);

  const filtered = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesFilter =
        filter === "all" || campaign.effectiveStatus === filter || campaign.status === filter;
      const haystack = [campaign.name, campaign.description, campaign.rewardValue]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [campaigns, filter, search]);

  const openCreate = () => {
    setSelectedCampaign(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const openEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setFormMode("edit");
    setFormOpen(true);
  };

  const runAction = async (label, action) => {
    try {
      await action();
      toast.success(label);
    } catch (error) {
      toast.error(error.message || "Action failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            🎁 Rewards engine
          </p>
          <h2 className="font-cormorant text-[24px] font-bold text-[#0A4A4A]">
            Referral reward campaigns
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#5C7571]">
            Define milestone rules dynamically. When an ambassador hits the referral target, rewards
            are generated and assigned automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-full bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D6060]"
        >
          + Create campaign
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminTabBar
          items={FILTER_TABS}
          value={filter}
          onChange={setFilter}
          ariaLabel="Reward campaign filters"
          size="compact"
          scrollable
          className="min-w-0 flex-1"
        />
        <AdminSearchInput
          label="Search campaigns"
          size="compact"
          value={search}
          onChange={setSearch}
          placeholder="Campaign name or description"
          className="w-full sm:max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-4 py-14 text-center">
          <p className="text-sm text-[#5C7571]">No reward campaigns yet.</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-3 rounded-full bg-[#0A4A4A] px-4 py-2 text-sm font-semibold text-white"
          >
            Create your first campaign
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((campaign) => (
            <article
              key={campaign.id}
              className="flex flex-col rounded-[22px] border border-[#E6ECEA] bg-[#FCFDFC] p-4 shadow-[0_8px_24px_rgba(10,74,74,0.04)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-cormorant text-[20px] font-bold text-[#0A4A4A]">
                  {campaign.name}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    STATUS_STYLES[campaign.effectiveStatus] || STATUS_STYLES.paused
                  }`}
                >
                  {campaign.statusLabel}
                </span>
              </div>

              {campaign.description ? (
                <p className="mt-2 line-clamp-2 text-[12px] text-[#5C7571]">{campaign.description}</p>
              ) : null}

              <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <dt className="text-[#7A928D]">Referral target</dt>
                  <dd className="admin-num font-bold text-[#0A4A4A]">{campaign.referralTarget}</dd>
                </div>
                <div>
                  <dt className="text-[#7A928D]">Reward type</dt>
                  <dd className="font-semibold text-[#183534]">{campaign.rewardTypeLabel}</dd>
                </div>
                <div>
                  <dt className="text-[#7A928D]">Reward value</dt>
                  <dd className="font-semibold text-[#183534]">{campaign.rewardValue}</dd>
                </div>
                <div>
                  <dt className="text-[#7A928D]">Dates</dt>
                  <dd className="text-[#183534]">
                    {campaign.startDate || "—"} → {campaign.endDate || "—"}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewCampaign(campaign)}
                  className="rounded-full border border-[#E6ECEA] px-2.5 py-1 text-[11px] font-semibold text-[#0A4A4A] hover:bg-white"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(campaign)}
                  className="rounded-full border border-[#E6ECEA] px-2.5 py-1 text-[11px] font-semibold text-[#0A4A4A] hover:bg-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() =>
                    void runAction("Campaign duplicated", () =>
                      duplicateRewardCampaign(campaign.id),
                    )
                  }
                  className="rounded-full border border-[#E6ECEA] px-2.5 py-1 text-[11px] font-semibold text-[#0A4A4A] hover:bg-white disabled:opacity-60"
                >
                  Duplicate
                </button>
                {campaign.effectiveStatus === "active" ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() =>
                      void runAction("Campaign paused", () => pauseRewardCampaign(campaign.id))
                    }
                    className="rounded-full border border-[#B45309]/30 px-2.5 py-1 text-[11px] font-semibold text-[#B45309] hover:bg-[#FFF6E8] disabled:opacity-60"
                  >
                    Pause
                  </button>
                ) : campaign.status !== "expired" && campaign.effectiveStatus !== "expired" ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() =>
                      void runAction("Campaign activated", () =>
                        activateRewardCampaign(campaign.id),
                      )
                    }
                    className="rounded-full border border-[#1A7A5A]/30 px-2.5 py-1 text-[11px] font-semibold text-[#1A7A5A] hover:bg-[#E8F5F0] disabled:opacity-60"
                  >
                    Activate
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    void (async () => {
                      const { confirmed } = await confirm({
                        title: "Delete campaign",
                        message: `Delete "${campaign.name}"? This cannot be undone.`,
                        confirmLabel: "Delete",
                        variant: "danger",
                      });
                      if (!confirmed) return;
                      void runAction("Campaign deleted", () => deleteRewardCampaign(campaign.id));
                    })();
                  }}
                  className="rounded-full border border-[#DC2626]/20 px-2.5 py-1 text-[11px] font-semibold text-[#DC2626] hover:bg-[#FFF1F0] disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <RewardCampaignFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        rewardTypes={rewardTypes}
        initialCampaign={selectedCampaign}
        mode={formMode}
      />

      {viewCampaign ? (
        <div
          className="fixed inset-0 z-[135] flex items-center justify-center bg-[#0A4A4A]/40 p-4"
          onClick={() => setViewCampaign(null)}
        >
          <div
            className="w-full max-w-lg rounded-[24px] bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">{viewCampaign.name}</h3>
            <p className="mt-2 text-sm text-[#5C7571]">{viewCampaign.description || "—"}</p>
            <ul className="mt-4 space-y-2 text-sm text-[#183534]">
              <li>
                <strong>Target:</strong> {viewCampaign.referralTarget} successful referrals
              </li>
              <li>
                <strong>Reward:</strong> {viewCampaign.rewardTypeLabel} · {viewCampaign.rewardValue}
              </li>
              <li>
                <strong>Status:</strong> {viewCampaign.statusLabel}
              </li>
              <li>
                <strong>Period:</strong> {viewCampaign.startDate || "—"} to{" "}
                {viewCampaign.endDate || "—"}
              </li>
            </ul>
            <button
              type="button"
              onClick={() => setViewCampaign(null)}
              className="mt-5 rounded-full bg-[#0A4A4A] px-4 py-2 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <AdminConfirmDialog {...dialogProps} />
    </div>
  );
}
