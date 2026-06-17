"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useAmbassadorActions, useAmbassadors } from "@/hooks/TanstankQuery/useAmbassadors";
import AmbassadorCampaignModal from "./AmbassadorCampaignModal";
import AmbassadorDetailModal from "./AmbassadorDetailModal";
import AmbassadorReferralsModal from "./AmbassadorReferralsModal";
import AmbassadorProgramSettings from "./AmbassadorProgramSettings";
import AmbassadorsActionGrid from "./AmbassadorsActionGrid";
import AmbassadorsSkeleton from "./AmbassadorsSkeleton";
import AmbassadorsTable from "./AmbassadorsTable";
import LeaderboardTable from "./LeaderboardTable";
import ReferralsTable from "./ReferralsTable";
import RewardEngineSection from "./RewardEngineSection";
import RewardsTable from "./RewardsTable";
import { AdminErrorState, AdminSearchInput, AdminTabBar } from "@/components/admin/ui";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "rewards-engine", label: "Rewards Engine" },
  { id: "ambassadors", label: "Ambassadors" },
  { id: "referrals", label: "Referrals" },
  { id: "rewards", label: "Earned Rewards" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "settings", label: "Settings" },
];

function buildMetrics(overview = {}) {
  return [
    {
      id: "total",
      label: "Total ambassadors",
      value: String(overview.totalAmbassadors || 0),
      emoji: "🤝",
      hint: "All enrolled advisors",
      accent: "teal",
    },
    {
      id: "active",
      label: "Active ambassadors",
      value: String(overview.activeAmbassadors || 0),
      emoji: "✅",
      hint: "Currently active",
      accent: "success",
    },
    {
      id: "total-ref",
      label: "Total referrals",
      value: String(overview.totalReferrals || 0),
      emoji: "📋",
      hint: "All sign-ups via referral links",
      accent: "teal",
    },
    {
      id: "referrals",
      label: "Successful referrals",
      value: String(overview.successfulReferrals || 0),
      emoji: "🎯",
      hint: "Qualified Silver/Gold purchases",
      accent: "gold",
    },
    {
      id: "generated",
      label: "Rewards generated",
      value: String(overview.rewardsGenerated || 0),
      emoji: "🎁",
      hint: "Auto-granted by Rewards Engine",
      accent: "coral",
    },
    {
      id: "claimed",
      label: "Rewards claimed",
      value: String(overview.rewardsClaimed || 0),
      emoji: "✨",
      hint: "Redeemed by ambassadors",
      accent: "success",
    },
  ];
}

function SectionTitle({ eyebrow, title, hint }) {
  return (
    <div className="mb-4">
      {eyebrow ? (
        <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A] md:text-[24px]">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-[#5C7571]">{hint}</p> : null}
    </div>
  );
}

function Panel({ children, className = "", id }) {
  return (
    <section
      id={id}
      className={`rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

export default function AdminAmbassadorsView() {
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [selectedAmbassador, setSelectedAmbassador] = useState(null);
  const [referralsAmbassador, setReferralsAmbassador] = useState(null);
  const [leaderboardTab, setLeaderboardTab] = useState("monthly");
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignPreset, setCampaignPreset] = useState({ name: "", message: "" });

  const { data, isLoading, isError, error, refetch, isFetching } = useAmbassadors(search);
  const { pauseProgram, resumeProgram, isProcessing } = useAmbassadorActions();

  const handleQuickAction = (card) => {
    if (card.action === "create_campaign") {
      setCampaignPreset({
        name:
          card.id === "notify"
            ? `Ambassador update · ${new Date().toLocaleDateString("en-IN")}`
            : "",
        message:
          card.id === "notify"
            ? "Reminder: share your YVITY referral link with fellow advisors. Free sign-ups are tracked, and you earn rewards when they purchase Silver or Gold."
            : "",
      });
      setCampaignModalOpen(true);
      return;
    }

    if (card.href?.startsWith("#")) {
      const target = document.querySelector(card.href);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (isLoading) return <AmbassadorsSkeleton />;

  if (data?._localOnly) {
    return (
      <AdminErrorState
        title="Ambassador program — coming soon"
        message="The referral and rewards program is not yet available in the cloud environment."
      />
    );
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load ambassador program"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const metrics = buildMetrics(data?.overview);
  const leaderboard =
    leaderboardTab === "monthly" ? data?.leaderboard?.monthly : data?.leaderboard?.allTime;

  const handlePause = async () => {
    try {
      await pauseProgram();
      toast.success("Ambassador program paused");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to pause program");
    }
  };

  const handleResume = async () => {
    try {
      await resumeProgram();
      toast.success("Ambassador program resumed");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to resume program");
    }
  };

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            🤝 Ambassador Program
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Referrals & rewards engine
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Dynamic milestone rewards — no code changes. Program status:{" "}
            <strong>{data?.overview?.programStatusLabel || "Active"}</strong>.
          </p>
          {isFetching && !isLoading ? (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing…</p>
          ) : null}
        </section>

        <AdminTabBar
          items={TABS}
          value={tab}
          onChange={setTab}
          ariaLabel="Ambassador program sections"
          scrollable
        />

        {(tab === "overview" || tab === "ambassadors" || tab === "leaderboard") && (
          <Panel>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
              {metrics.map((metric, index) => (
                <DashboardMetricTile key={metric.id} metric={metric} index={index} />
              ))}
            </div>
          </Panel>
        )}

        {tab === "overview" && (
          <>
            <Panel>
              <SectionTitle eyebrow="Quick actions" title="Program actions" />
              <AmbassadorsActionGrid
                cards={data?.quickActions || []}
                onAction={handleQuickAction}
              />
            </Panel>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <Panel className="xl:col-span-7">
                <SectionTitle
                  eyebrow="Automation"
                  title="How rewards work"
                  hint="Admin defines campaigns → referral qualifies → engine auto-grants reward to ambassador account."
                />
                <div className="rounded-[20px] border border-[#E6ECEA] bg-[#FCFDFC] p-4 text-sm text-[#183534]">
                  <div className="space-y-3">
                    {[
                      "Create reward campaigns in Rewards Engine (e.g. 5 referrals = 1 month Silver)",
                      "Advisor shares referral link",
                      "Referred advisor registers (tracked even on Free)",
                      "Referred advisor purchases Silver or Gold",
                      "System counts successful referrals",
                      "Reward auto-generated and assigned — no manual approval",
                    ].map((step, index, arr) => (
                      <div key={step}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F4F3] text-[11px] font-bold text-[#0A4A4A]">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                        {index < arr.length - 1 ? (
                          <p className="ml-3 pl-4 text-[#9AB0AB]">↓</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel className="xl:col-span-5" id="leaderboard">
                <SectionTitle eyebrow="Top ambassadors" title="Leaderboard preview" />
                <LeaderboardTable rows={(data?.leaderboard?.monthly || []).slice(0, 5)} periodLabel="Monthly" />
              </Panel>
            </div>
          </>
        )}

        {tab === "rewards-engine" && (
          <Panel>
            <RewardEngineSection
              campaigns={data?.rewardEngine?.campaigns || []}
              rewardTypes={data?.rewardEngine?.rewardTypes || []}
            />
          </Panel>
        )}

        {tab === "ambassadors" && (
          <Panel>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <SectionTitle
                eyebrow="Referral tracking"
                title="Ambassadors"
                hint="Reward earned and claimed counts update automatically from the Rewards Engine."
              />
              <AdminSearchInput
                label="Search ambassadors"
                size="compact"
                value={search}
                onChange={setSearch}
                placeholder="Name, code, or email"
                className="w-full max-w-sm"
              />
            </div>
            <AmbassadorsTable
              ambassadors={data?.ambassadors || []}
              onView={setSelectedAmbassador}
              onViewReferrals={setReferralsAmbassador}
            />
          </Panel>
        )}

        {tab === "referrals" && (
          <Panel>
            <SectionTitle eyebrow="Referrals" title="Referral log" />
            <ReferralsTable referrals={data?.referrals || []} />
          </Panel>
        )}

        {tab === "rewards" && (
          <Panel>
            <SectionTitle
              eyebrow="Earned rewards"
              title="Auto-generated rewards"
              hint="Rewards appear here when ambassadors hit campaign milestones. No manual issue step required."
            />
            <RewardsTable rewards={data?.rewards || []} />
          </Panel>
        )}

        {tab === "leaderboard" && (
          <Panel>
            <SectionTitle eyebrow="Leaderboard" title="Top ambassadors" />
            <div className="mb-4 flex gap-2">
              {["monthly", "allTime"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLeaderboardTab(key)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                    leaderboardTab === key
                      ? "bg-[#0A4A4A] text-white"
                      : "bg-[#F8FAFC] text-[#5C7571]"
                  }`}
                >
                  {key === "monthly" ? "Monthly top" : "All-time top"}
                </button>
              ))}
            </div>
            <LeaderboardTable
              rows={leaderboard || []}
              periodLabel={leaderboardTab === "monthly" ? "Monthly" : "All time"}
            />
          </Panel>
        )}

        {tab === "settings" && (
          <Panel>
            <SectionTitle eyebrow="Program settings" title="Rules & status" />
            <AmbassadorProgramSettings
              config={data?.config}
              onPause={handlePause}
              onResume={handleResume}
              isProcessing={isProcessing}
            />
          </Panel>
        )}
      </div>

      <AnimatePresence>
        <AmbassadorCampaignModal
          open={campaignModalOpen}
          onClose={() => setCampaignModalOpen(false)}
          audiences={data?.campaignAudiences || []}
          campaigns={data?.campaigns || []}
          initialName={campaignPreset.name}
          initialMessage={campaignPreset.message}
        />

        {selectedAmbassador ? (
          <AmbassadorDetailModal
            ambassador={selectedAmbassador}
            onClose={() => setSelectedAmbassador(null)}
          />
        ) : null}

        {referralsAmbassador ? (
          <AmbassadorReferralsModal
            ambassador={referralsAmbassador}
            onClose={() => setReferralsAmbassador(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
