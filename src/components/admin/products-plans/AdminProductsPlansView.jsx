"use client";

import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useProductsPlans } from "@/hooks/TanstankQuery/useProductsPlans";
import ProductsPlansActionGrid from "./ProductsPlansActionGrid";
import ProductsPlansSkeleton from "./ProductsPlansSkeleton";
import { AdminErrorState } from "@/components/admin/ui";

const PLAN_BADGE = {
  gold: "bg-[#FFF6E8] text-[#B45309] ring-[#F59E0B]/20",
  silver: "bg-[#F8FAFC] text-[#475569] ring-[#CBD5E1]/60",
  free: "bg-[#E8F4F3] text-[#0A4A4A] ring-[#0A4A4A]/10",
  platinum: "bg-[#F5F3FF] text-[#6D28D9] ring-[#C4B5FD]/60",
};

const ACTIVITY_TONES = {
  success: "bg-[#E8F5F0] text-[#1A7A5A]",
  warning: "bg-[#FFF6E8] text-[#B45309]",
  info: "bg-[#E8F4F3] text-[#0A4A4A]",
  gold: "bg-[#FEF3E2] text-[#B45309]",
};

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

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

export default function AdminProductsPlansView() {
  const { data, isLoading, isError, error, refetch, isFetching } = useProductsPlans();

  if (isLoading) return <ProductsPlansSkeleton />;

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load products & plans"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const {
    meta,
    planTiers = [],
    tierMix = [],
    quickStats = [],
    actionCards = [],
    recentUpgrades = [],
    activity = [],
    summaries = {},
    isLive,
  } = data;

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            💳 {meta?.sectionLabel || "Plans and Pricing"}
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Products & Plans
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Subscription overview, revenue, and shortcuts to plans, pricing, coupons, billing, and
            payments — your monetization command center.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px]">
            {isLive ? (
              <span className="rounded-full bg-[#E8F5F0]/20 px-3 py-1 font-semibold text-[#B8F0D8] ring-1 ring-white/20">
                Live data
              </span>
            ) : null}
            <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white/85">
              ARR {summaries.annualRunRateLabel} · This month {summaries.revenueThisMonthLabel}
            </span>
            {isFetching && !isLoading ? (
              <span className="text-[11px] font-medium text-[#FFE7B8]">Refreshing…</span>
            ) : null}
          </div>
        </section>

        <Panel>
          <SectionTitle
            eyebrow="Plan overview"
            title="Members by tier"
            hint="Total members, new this month (upgrades for paid tiers), and collected revenue for paid plans."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {planTiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-[22px] border border-[#E6ECEA] bg-[#FCFDFC] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                      {tier.emoji} {tier.name}
                    </p>
                    <p className="admin-num mt-2 text-[28px] font-bold text-[#0A4A4A]">
                      {tier.totalMembers.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[12px] text-[#7A928D]">Total members</p>
                  </div>
                  <div
                    className="h-12 w-12 rounded-2xl"
                    style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}33` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EEF2F0] pt-4">
                  <div>
                    <p className="admin-num text-[18px] font-bold text-[#183534]">
                      {tier.newMembersThisMonth}
                    </p>
                    <p className="text-[11px] text-[#7A928D]">New this month</p>
                  </div>
                  {tier.isPaid ? (
                    <div>
                      <p className="admin-num text-[18px] font-bold text-[#183534]">
                        {tier.monthlyRevenueLabel}
                      </p>
                      <p className="text-[11px] text-[#7A928D]">Revenue this month</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[18px] font-bold text-[#183534]">—</p>
                      <p className="text-[11px] text-[#7A928D]">No plan revenue</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-8">
            <Panel>
              <SectionTitle eyebrow="Quick stats" title="At a glance" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {quickStats.map((metric, index) => (
                  <DashboardMetricTile key={metric.id} metric={metric} index={index} />
                ))}
              </div>

              <div className="mt-5">
                <p className="mb-3 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                  Tier mix
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {tierMix.map((plan) => (
                    <div
                      key={plan.id}
                      className="rounded-2xl border border-[#E6ECEA] bg-[#FCFDFC] px-3 py-3"
                    >
                      <p className="text-[11px] font-medium text-[#7A928D]">
                        {plan.emoji} {plan.label}
                      </p>
                      <p className="admin-num mt-1 text-[22px] font-bold text-[#0A4A4A]">
                        {plan.count.toLocaleString("en-IN")}
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF2F0]">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${plan.pct}%`, background: plan.color }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-medium text-[#9AB0AB]">{plan.pct}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel>
              <SectionTitle eyebrow="Action cards" title="Manage products" />
              <ProductsPlansActionGrid cards={actionCards} />
            </Panel>
          </div>

          <div className="space-y-5 xl:col-span-4">
            <Panel>
              <SectionTitle eyebrow="Recent upgrades" title="Latest plan changes" />
              <div className="space-y-2">
                {recentUpgrades.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-3 py-8 text-center text-[12px] text-[#7A928D]">
                    No recent upgrades
                  </p>
                ) : (
                  recentUpgrades.map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#183534]">
                          {upgrade.name}
                        </p>
                        <p className="text-[11px] text-[#7A928D]">
                          {upgrade.city || "Unknown"} · {upgrade.time}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${
                            PLAN_BADGE[upgrade.plan] || PLAN_BADGE.silver
                          }`}
                        >
                          {upgrade.plan}
                        </span>
                        <p className="admin-num mt-1 text-[12px] font-bold text-[#0A4A4A]">
                          {upgrade.amount}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            <Panel>
              <SectionTitle eyebrow="Recent activity" title="Monetization feed" />
              <div className="space-y-2">
                {activity.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-3 py-8 text-center text-[12px] text-[#7A928D]">
                    No recent monetization activity
                  </p>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#183534]">{item.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#7A928D]">{item.detail}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            ACTIVITY_TONES[item.tone] || ACTIVITY_TONES.info
                          }`}
                        >
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
