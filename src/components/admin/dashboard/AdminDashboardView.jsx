"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiClock, FiSend } from "react-icons/fi";
import { getTimeOfDayGreeting } from "@/lib/admin/greeting";
import DashboardMetricTile from "./DashboardMetricTile";
import DashboardQuickActionsRail from "./DashboardQuickActionsRail";
import DashboardRevenueChart from "./DashboardRevenueChart";

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A] md:text-[24px]">
          {title}
        </h2>
      </div>
      {action}
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

const ACTIVITY_TONES = {
  success: "bg-[#E8F5F0] text-[#1A7A5A]",
  warning: "bg-[#FFF6E8] text-[#B45309]",
  info: "bg-[#E8F4F3] text-[#0A4A4A]",
  gold: "bg-[#FEF3E2] text-[#B45309]",
};

const PLAN_BADGE = {
  gold: "bg-[#FFF6E8] text-[#B45309] ring-[#F59E0B]/20",
  silver: "bg-[#F8FAFC] text-[#475569] ring-[#CBD5E1]/60",
  free: "bg-[#E8F4F3] text-[#0A4A4A] ring-[#0A4A4A]/10",
};

export default function AdminDashboardView({
  data,
  showMockBadge = false,
  isLive = false,
  isRefreshing = false,
}) {
  if (!data) return null;

  const { meta, platformGrowth, revenue, operations, activity, quickActions } = data;
  const greeting = getTimeOfDayGreeting();

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-[#0A4A4A]/[0.03] to-transparent" />

      <div className="relative p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Hero — full width */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 overflow-hidden rounded-[22px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-4 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)] sm:rounded-[28px] sm:px-5 sm:py-6 md:px-7 md:py-7"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
                🏠 Dashboard
              </p>
              <h1 className="mt-2 font-cormorant text-[26px] font-bold leading-tight sm:text-[30px] md:text-[36px]">
                {greeting}, {meta.adminName}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/75">
                Platform health, revenue, and operations — everything that needs your attention in one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {showMockBadge && (
                <span className="rounded-full bg-[#F59E0B]/20 px-3 py-1 text-[11px] font-semibold text-[#FFE7B8] ring-1 ring-[#F59E0B]/30">
                  Preview data
                </span>
              )}
              {isLive && (
                <span className="rounded-full bg-[#E8F5F0]/20 px-3 py-1 text-[11px] font-semibold text-[#B8F0D8] ring-1 ring-white/20">
                  Live data
                </span>
              )}
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/90 backdrop-blur-sm">
                <FiClock size={14} />
                {isRefreshing ? "Refreshing…" : meta.updatedAt}
              </span>
            </div>
          </div>
        </motion.section>

        {/* Mobile quick actions — above fold */}
        <div className="mb-5 xl:hidden">
          <DashboardQuickActionsRail actions={quickActions} variant="sheet" />
        </div>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          {/* Main column */}
          <div className="min-w-0 flex-1 space-y-5">
            {/* Platform growth */}
            <Panel>
              <SectionTitle eyebrow="Growth" title="Platform growth" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {platformGrowth.map((item, index) => (
                  <DashboardMetricTile key={item.id} metric={item} index={index} />
                ))}
              </div>
            </Panel>

            {/* Revenue & subscriptions */}
            <Panel>
              <SectionTitle
                eyebrow="Finance"
                title="Revenue & subscriptions"
                action={
                  <span className="rounded-full bg-[#E8F4F3] px-3 py-1 text-[11px] font-semibold text-[#0A4A4A]">
                    {meta.periodLabel}
                  </span>
                }
              />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {revenue.plans.map((plan) => (
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
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-[#E8F4F3] to-[#FFF9F0] px-4 py-3 ring-1 ring-[#0A4A4A]/8">
                    <p className="text-[11px] font-medium text-[#7A928D]">💰 Monthly revenue</p>
                    <p className="admin-num mt-1 text-[28px] font-bold text-[#0A4A4A]">
                      {revenue.monthly}
                    </p>
                  </div>

                  <div className="mt-4">
                    <DashboardRevenueChart months={revenue.months} />
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="mb-3 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                    🔄 Recent upgrades
                  </p>
                  <div className="space-y-2">
                    {revenue.recentUpgrades.length === 0 && (
                      <p className="rounded-2xl border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-3 py-8 text-center text-[12px] text-[#7A928D]">
                        No recent plan upgrades
                      </p>
                    )}
                    {revenue.recentUpgrades.map((upgrade) => (
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
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            {/* Platform operations */}
            <Panel>
              <SectionTitle eyebrow="Operations" title="Platform operations" />
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {operations.map((item, index) => (
                  <DashboardMetricTile key={item.id} metric={item} index={index} />
                ))}
              </div>
            </Panel>

            {/* Recent activity */}
            <Panel>
              <SectionTitle
                eyebrow="Live feed"
                title="Recent activity"
                action={
                  <Link
                    href="/admin/communications"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F4F3] px-3 py-1 text-[11px] font-semibold text-[#0A4A4A] transition hover:bg-[#D7EDE9]"
                  >
                    <FiSend size={12} />
                    Comms
                  </Link>
                }
              />
              <div className="space-y-2">
                {activity.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-3 py-8 text-center text-[12px] text-[#7A928D]">
                    No recent activity yet
                  </p>
                )}
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-3 py-3"
                  >
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F59E0B]" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] font-semibold text-[#183534]">{item.title}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ACTIVITY_TONES[item.tone]}`}
                        >
                          new
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-[#5C7571]">{item.detail}</p>
                      <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9AB0AB]">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Desktop right rail */}
          <aside className="hidden w-full shrink-0 xl:block xl:w-[300px]">
            <DashboardQuickActionsRail actions={quickActions} variant="rail" />
          </aside>
        </div>
      </div>
    </div>
  );
}
