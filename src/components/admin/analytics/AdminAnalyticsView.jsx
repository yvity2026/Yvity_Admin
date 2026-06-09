"use client";

import { useMemo, useState } from "react";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useAnalytics } from "@/hooks/TanstankQuery/useAnalytics";
import { exportRowsToCsv } from "@/lib/admin/analytics/analyticsUtils";
import AnalyticsBarChart from "./AnalyticsBarChart";
import AnalyticsDoughnutChart from "./AnalyticsDoughnutChart";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import {
  AdminErrorState,
  AdminPanel,
  AdminSectionTitle,
  AdminTabBar,
} from "@/components/admin/ui";

const TABS = [
  { id: "founder", label: "Founder insights" },
  { id: "users", label: "Users" },
  { id: "professionals", label: "Professionals" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "platform", label: "Platform" },
  { id: "growth", label: "Growth" },
  { id: "yvity-score", label: "YVITY Score" },
];

function MetricGrid({ metrics = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <DashboardMetricTile key={metric.id} metric={metric} index={index} />
      ))}
    </div>
  );
}

function DistributionTable({ rows = [], onExport }) {
  return (
    <div>
      <div className="mb-3 flex justify-end">
        {onExport ? (
          <button
            type="button"
            onClick={onExport}
            className="rounded-full border border-[#E6ECEA] px-3 py-1 text-[11px] font-semibold text-[#0A4A4A] hover:bg-[#E8F4F3]"
          >
            Export CSV
          </button>
        ) : null}
      </div>
      <div className="overflow-x-auto rounded-[16px] border border-[#E6ECEA]">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
            <tr>
              <th className="px-4 py-3">Label</th>
              <th className="px-4 py-3">Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-[#7A928D]">
                  No data
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id || row.label} className="border-t border-[#EEF2F0]">
                  <td className="px-4 py-3 font-medium text-[#183534]">{row.label}</td>
                  <td className="admin-num px-4 py-3 font-semibold">{row.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminAnalyticsView() {
  const [tab, setTab] = useState("founder");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    industry: "all",
    state: "all",
    city: "all",
  });

  const { data, isLoading, isError, error, refetch, isFetching } = useAnalytics(filters);
  const filterOptions = data?.meta?.filterOptions || {};

  const exportRows = (filename, rows) => {
    exportRowsToCsv(filename, rows, [
      { key: "label", label: "Label" },
      { key: "count", label: "Count" },
    ]);
  };

  const founderMetrics = useMemo(() => {
    const f = data?.founderInsights || {};
    return [
      { id: "pg", label: "Platform growth", value: `${f.platformGrowthRate ?? 0}%`, emoji: "📈", hint: "Last 30 days", accent: "teal" },
      { id: "pr", label: "Professional growth", value: `${f.professionalGrowthRate ?? 0}%`, emoji: "👨‍💼", hint: "Last 30 days", accent: "success" },
      { id: "rg", label: "Revenue growth", value: `${f.revenueGrowthRate ?? 0}%`, emoji: "💰", hint: "Last 30 days", accent: "gold" },
      { id: "pc", label: "Profile completion", value: `${f.profileCompletionRate ?? 0}%`, emoji: "📄", hint: "Average", accent: "teal" },
      { id: "va", label: "Verification approval", value: `${f.verificationApprovalRate ?? 0}%`, emoji: "🛡", hint: "Approval rate", accent: "success" },
      { id: "fs", label: "Free → Silver", value: `${f.freeToSilverRate ?? 0}%`, emoji: "🥈", hint: "Conversion", accent: "gold" },
      { id: "sg", label: "Silver → Gold", value: `${f.silverToGoldRate ?? 0}%`, emoji: "🥇", hint: "Conversion", accent: "coral" },
    ];
  }, [data]);

  if (isLoading) return <AnalyticsSkeleton />;

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load analytics"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const ua = data?.userAnalytics || {};
  const pa = data?.professionalAnalytics || {};
  const sa = data?.subscriptionAnalytics || {};
  const pla = data?.platformAnalytics || {};
  const ga = data?.growthAnalytics || {};
  const ys = data?.yvityScoreAnalytics || {};
  const f = data?.founderInsights || {};

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            📊 Analytics
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            YVITY insights dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Real-time statistics from your platform data. Filter by date, industry, and location.
            Export any distribution table to CSV.
          </p>
          {isFetching && !isLoading ? (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing…</p>
          ) : null}
        </section>

        <AdminPanel>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#7A928D]">
              From
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm text-[#183534]"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#7A928D]">
              To
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm text-[#183534]"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#7A928D]">
              Industry
              <select
                value={filters.industry}
                onChange={(e) => setFilters((p) => ({ ...p, industry: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm text-[#183534]"
              >
                <option value="all">All industries</option>
                {filterOptions.industries?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#7A928D]">
              State
              <select
                value={filters.state}
                onChange={(e) => setFilters((p) => ({ ...p, state: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm text-[#183534]"
              >
                <option value="all">All states</option>
                {filterOptions.states?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-[#7A928D]">
              City
              <select
                value={filters.city}
                onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-[#E6ECEA] px-3 py-2 text-sm text-[#183534]"
              >
                <option value="all">All cities</option>
                {filterOptions.cities?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </AdminPanel>

        <AdminTabBar items={TABS} value={tab} onChange={setTab} ariaLabel="Analytics sections" scrollable />

        {tab === "founder" && (
          <>
            <AdminPanel>
              <AdminSectionTitle eyebrow="Founder insights" title="Most important metrics" />
              <MetricGrid metrics={founderMetrics} />
            </AdminPanel>
            <AdminPanel>
              <AdminSectionTitle eyebrow="Top performing" title="Platform leaders" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Industry", f.topIndustry],
                  ["Category", f.topCategory],
                  ["Service", f.topService],
                  ["Company", f.topCompany],
                  ["State", f.topState],
                  ["City", f.topCity],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-[#7A928D]">{label}</p>
                    <p className="mt-1 font-semibold text-[#0A4A4A]">{value || "—"}</p>
                  </div>
                ))}
              </div>
            </AdminPanel>
          </>
        )}

        {tab === "users" && (
          <>
            <AdminPanel>
              <AdminSectionTitle eyebrow="User analytics" title="Overview" />
              <MetricGrid
                metrics={[
                  { id: "tu", label: "Total users", value: String(ua.overview?.totalUsers || 0), emoji: "👥", accent: "teal" },
                  { id: "tp", label: "Professionals", value: String(ua.overview?.totalProfessionals || 0), emoji: "👨‍💼", accent: "success" },
                  { id: "tc", label: "Customers", value: String(ua.overview?.totalCustomers || 0), emoji: "🙋", accent: "gold" },
                  { id: "rt", label: "Today", value: String(ua.registration?.today || 0), emoji: "📅", accent: "teal" },
                  { id: "rw", label: "This week", value: String(ua.registration?.thisWeek || 0), emoji: "📆", accent: "success" },
                  { id: "rm", label: "This month", value: String(ua.registration?.thisMonth || 0), emoji: "🗓", accent: "coral" },
                  { id: "ry", label: "This year", value: String(ua.registration?.thisYear || 0), emoji: "📈", accent: "teal" },
                ]}
              />
            </AdminPanel>
            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel>
                <AdminSectionTitle title="Gender distribution" />
                <AnalyticsDoughnutChart items={ua.gender || []} />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Age distribution" />
                <AnalyticsBarChart
                  labels={(ua.age || []).map((r) => r.label)}
                  values={ua.age || []}
                />
              </AdminPanel>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel>
                <AdminSectionTitle title="State-wise users" />
                <DistributionTable
                  rows={ua.location?.states || []}
                  onExport={() => exportRows("users-by-state.csv", ua.location?.states || [])}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="City-wise users" />
                <DistributionTable
                  rows={ua.location?.cities || []}
                  onExport={() => exportRows("users-by-city.csv", ua.location?.cities || [])}
                />
              </AdminPanel>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel>
                <AdminSectionTitle title="Daily registrations (30 days)" />
                <AnalyticsBarChart
                  labels={(ua.growth?.daily || []).map((r) => r.label)}
                  values={ua.growth?.daily || []}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Monthly registrations (12 months)" />
                <AnalyticsBarChart
                  labels={(ua.growth?.monthly || []).map((r) => r.label)}
                  values={ua.growth?.monthly || []}
                />
              </AdminPanel>
            </div>
          </>
        )}

        {tab === "professionals" && (
          <>
            <AdminPanel>
              <MetricGrid
                metrics={[
                  {
                    id: "pro",
                    label: "Total professionals",
                    value: String(pa.overview?.totalProfessionals || 0),
                    emoji: "👨‍💼",
                    accent: "teal",
                  },
                ]}
              />
            </AdminPanel>
            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel>
                <AdminSectionTitle title="Industry distribution" />
                <AnalyticsBarChart
                  labels={(pa.industry || []).map((r) => r.label)}
                  values={pa.industry || []}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Category distribution" />
                <AnalyticsDoughnutChart items={pa.category || []} />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Service distribution" />
                <DistributionTable
                  rows={pa.service || []}
                  onExport={() => exportRows("services.csv", pa.service || [])}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Company distribution" />
                <DistributionTable
                  rows={pa.company || []}
                  onExport={() => exportRows("companies.csv", pa.company || [])}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Designation distribution" />
                <DistributionTable rows={pa.designation || []} />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="State-wise professionals" />
                <DistributionTable
                  rows={pa.location?.states || []}
                  onExport={() => exportRows("professionals-by-state.csv", pa.location?.states || [])}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="City-wise professionals" />
                <DistributionTable
                  rows={pa.location?.cities || []}
                  onExport={() => exportRows("professionals-by-city.csv", pa.location?.cities || [])}
                />
              </AdminPanel>
            </div>
          </>
        )}

        {tab === "subscriptions" && (
          <>
            <AdminPanel>
              <MetricGrid
                metrics={[
                  { id: "free", label: "Free", value: String(sa.plans?.[0]?.count || 0), emoji: "🆓", accent: "teal" },
                  { id: "silver", label: "Silver", value: String(sa.plans?.[1]?.count || 0), emoji: "🥈", accent: "gold" },
                  { id: "gold", label: "Gold", value: String(sa.plans?.[2]?.count || 0), emoji: "🥇", accent: "coral" },
                  { id: "rt", label: "Today revenue", value: sa.revenue?.todayLabel || "₹0", emoji: "💳", accent: "success" },
                  { id: "rm", label: "Monthly revenue", value: sa.revenue?.monthlyLabel || "₹0", emoji: "📊", accent: "teal" },
                  { id: "ry", label: "Yearly revenue", value: sa.revenue?.yearlyLabel || "₹0", emoji: "📈", accent: "gold" },
                ]}
              />
            </AdminPanel>
            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel>
                <AdminSectionTitle title="Plan distribution" />
                <AnalyticsDoughnutChart items={sa.plans || []} />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Monthly revenue trend" />
                <AnalyticsBarChart
                  labels={(sa.revenue?.monthlyTrend || []).map((r) => r.label)}
                  values={sa.revenue?.monthlyTrend || []}
                  valueKey="amount"
                  color="rgba(245, 158, 11, 0.85)"
                  hoverColor="#D97706"
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Plan conversions" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#FCFDFC] p-4 ring-1 ring-[#EEF2F0]">
                    <p className="text-[11px] text-[#7A928D]">Free → Silver</p>
                    <p className="admin-num mt-1 text-2xl font-bold">{sa.conversions?.freeToSilver ?? 0}</p>
                    <p className="text-[11px] text-[#7A928D]">{sa.conversions?.freeToSilverRate ?? 0}%</p>
                  </div>
                  <div className="rounded-2xl bg-[#FCFDFC] p-4 ring-1 ring-[#EEF2F0]">
                    <p className="text-[11px] text-[#7A928D]">Silver → Gold</p>
                    <p className="admin-num mt-1 text-2xl font-bold">{sa.conversions?.silverToGold ?? 0}</p>
                    <p className="text-[11px] text-[#7A928D]">{sa.conversions?.silverToGoldRate ?? 0}%</p>
                  </div>
                </div>
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Renewals" />
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Upcoming renewals:</strong> {sa.renewals?.upcoming ?? 0}
                  </p>
                  <p>
                    <strong>Expired plans:</strong> {sa.renewals?.expired ?? 0}
                  </p>
                  <p>
                    <strong>Renewed:</strong> {sa.renewals?.renewed ?? 0}
                  </p>
                </div>
              </AdminPanel>
            </div>
          </>
        )}

        {tab === "platform" && (
          <div className="grid gap-5 xl:grid-cols-2">
            <AdminPanel>
              <AdminSectionTitle title="Profile analytics" />
              <MetricGrid
                metrics={[
                  { id: "pub", label: "Published", value: String(pla.profiles?.published || 0), emoji: "✅", accent: "success" },
                  { id: "pen", label: "Pending", value: String(pla.profiles?.pending || 0), emoji: "⏳", accent: "gold" },
                  { id: "hid", label: "Hidden", value: String(pla.profiles?.hidden || 0), emoji: "👁", accent: "teal" },
                  { id: "fea", label: "Featured", value: String(pla.profiles?.featured || 0), emoji: "⭐", accent: "coral" },
                ]}
              />
            </AdminPanel>
            <AdminPanel>
              <AdminSectionTitle title="Profile completion" />
              <p className="text-sm">
                Average: <strong>{pla.completion?.average ?? 0}%</strong>
              </p>
              <p className="mt-2 text-sm">
                Fully completed: <strong>{pla.completion?.fullyCompleted ?? 0}</strong>
              </p>
              <p className="mt-1 text-sm">
                Incomplete: <strong>{pla.completion?.incomplete ?? 0}</strong>
              </p>
            </AdminPanel>
            <AdminPanel>
              <AdminSectionTitle title="Platform reviews" />
              <DistributionTable
                rows={[
                  { label: "Text", count: pla.platformReviews?.text || 0 },
                  { label: "Audio", count: pla.platformReviews?.audio || 0 },
                  { label: "Video", count: pla.platformReviews?.video || 0 },
                ]}
              />
            </AdminPanel>
            <AdminPanel>
              <AdminSectionTitle title="Advisor reviews" />
              <DistributionTable
                rows={[
                  { label: "Total", count: pla.advisorReviews?.total || 0 },
                  { label: "Reported", count: pla.advisorReviews?.reported || 0 },
                  { label: "Hidden", count: pla.advisorReviews?.hidden || 0 },
                ]}
              />
            </AdminPanel>
            <AdminPanel>
              <AdminSectionTitle title="Testimonials" />
              <DistributionTable
                rows={[
                  { label: "Text", count: pla.testimonials?.text || 0 },
                  { label: "Audio", count: pla.testimonials?.audio || 0 },
                  { label: "Video", count: pla.testimonials?.video || 0 },
                ]}
              />
            </AdminPanel>
            <AdminPanel>
              <AdminSectionTitle title="Verification" />
              <AnalyticsDoughnutChart
                items={[
                  { label: "Approved", count: pla.verification?.approved || 0 },
                  { label: "Rejected", count: pla.verification?.rejected || 0 },
                  { label: "Pending", count: pla.verification?.pending || 0 },
                ]}
              />
            </AdminPanel>
          </div>
        )}

        {tab === "growth" && (
          <>
            <AdminPanel>
              <MetricGrid
                metrics={[
                  { id: "nr", label: "New registrations", value: String(ga.overview?.newRegistrations || 0), emoji: "👥", accent: "teal" },
                  { id: "np", label: "New profiles", value: String(ga.overview?.newProfiles || 0), emoji: "📄", accent: "success" },
                  { id: "ns", label: "New subscribers", value: String(ga.overview?.newSubscribers || 0), emoji: "💳", accent: "gold" },
                  { id: "amb", label: "Ambassadors", value: String(ga.ambassadors?.totalAmbassadors || 0), emoji: "🤝", accent: "teal" },
                  { id: "aab", label: "Active ambassadors", value: String(ga.ambassadors?.activeAmbassadors || 0), emoji: "✨", accent: "success" },
                  { id: "ref", label: "Referrals", value: String(ga.ambassadors?.totalReferrals || 0), emoji: "🔗", accent: "gold" },
                  { id: "sref", label: "Successful referrals", value: String(ga.ambassadors?.successfulReferrals || 0), emoji: "✅", accent: "success" },
                  { id: "rew", label: "Rewards", value: String(ga.ambassadors?.rewardsGenerated || 0), emoji: "🎁", accent: "coral" },
                ]}
              />
            </AdminPanel>
            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel>
                <AdminSectionTitle title="Top states" />
                <DistributionTable rows={ga.topLocations?.states || []} />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top cities" />
                <DistributionTable rows={ga.topLocations?.cities || []} />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top industries" />
                <DistributionTable
                  rows={ga.topIndustries || []}
                  onExport={() => exportRows("top-industries.csv", ga.topIndustries || [])}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top categories" />
                <DistributionTable
                  rows={ga.topCategories || []}
                  onExport={() => exportRows("top-categories.csv", ga.topCategories || [])}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top services" />
                <DistributionTable
                  rows={ga.topServices || []}
                  onExport={() => exportRows("top-services.csv", ga.topServices || [])}
                />
              </AdminPanel>
            </div>
          </>
        )}

        {tab === "yvity-score" && (
          <>
            <AdminPanel>
              <MetricGrid
                metrics={[
                  { id: "avg", label: "Average score", value: String(ys.overview?.average || 0), emoji: "📊", accent: "teal" },
                  { id: "hi", label: "Highest", value: String(ys.overview?.highest || 0), emoji: "🏆", accent: "gold" },
                  { id: "lo", label: "Lowest", value: String(ys.overview?.lowest || 0), emoji: "📉", accent: "coral" },
                ]}
              />
            </AdminPanel>
            <div className="grid gap-5 xl:grid-cols-2">
              <AdminPanel>
                <AdminSectionTitle title="Score distribution" />
                <AnalyticsBarChart
                  labels={(ys.distribution || []).map((r) => r.label)}
                  values={ys.distribution || []}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Quality analytics" />
                <div className="space-y-2 text-sm">
                  <p>
                    Avg completion: <strong>{ys.quality?.avgCompletion ?? 0}%</strong>
                  </p>
                  <p>
                    Avg testimonial score: <strong>{ys.quality?.avgTestimonialScore ?? "—"}</strong>
                  </p>
                  <p>
                    Avg recommendation score: <strong>{ys.quality?.avgRecommendationScore ?? "—"}</strong>
                  </p>
                </div>
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top 10 overall" />
                <DistributionTable
                  rows={(ys.topOverall || []).map((r) => ({
                    label: `${r.name} — ${r.industry || "—"}, ${r.city || "—"}`,
                    count: r.score,
                  }))}
                  onExport={() =>
                    exportRows(
                      "top-yvity-overall.csv",
                      (ys.topOverall || []).map((r) => ({
                        label: r.name,
                        count: r.score,
                      })),
                    )
                  }
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top 10 male professionals" />
                <DistributionTable
                  rows={(ys.topMale || []).map((r) => ({
                    label: `${r.name} — ${r.city || "—"}`,
                    count: r.score,
                  }))}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top 10 female professionals" />
                <DistributionTable
                  rows={(ys.topFemale || []).map((r) => ({
                    label: `${r.name} — ${r.city || "—"}`,
                    count: r.score,
                  }))}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top by industry" />
                <DistributionTable rows={ys.topByIndustry || []} />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top states by score" />
                <DistributionTable
                  rows={(ys.topByLocation?.states || []).map((r) => ({
                    label: `${r.label} (avg ${r.avgScore ?? "—"})`,
                    count: r.count,
                  }))}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Top cities by score" />
                <DistributionTable
                  rows={(ys.topByLocation?.cities || []).map((r) => ({
                    label: `${r.label} (avg ${r.avgScore ?? "—"})`,
                    count: r.count,
                  }))}
                />
              </AdminPanel>
              <AdminPanel>
                <AdminSectionTitle title="Performance highlights" />
                <div className="space-y-3 text-sm">
                  {ys.performance?.mostImproved ? (
                    <p>
                      <strong>Most improved:</strong> {ys.performance.mostImproved.name} —{" "}
                      {ys.performance.mostImproved.metric}
                    </p>
                  ) : null}
                  {ys.performance?.highestRising ? (
                    <p>
                      <strong>Highest rising:</strong> {ys.performance.highestRising.name} —{" "}
                      {ys.performance.highestRising.metric}
                    </p>
                  ) : null}
                  {ys.performance?.mostActive ? (
                    <p>
                      <strong>Most active:</strong> {ys.performance.mostActive.name} —{" "}
                      {ys.performance.mostActive.metric}
                    </p>
                  ) : null}
                </div>
              </AdminPanel>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
