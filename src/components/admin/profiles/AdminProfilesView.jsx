"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useProfiles } from "@/hooks/TanstankQuery/useProfiles";
import ProfilesSearchBar from "./ProfilesSearchBar";
import ProfilesTable from "./ProfilesTable";
import ProfilesSkeleton from "./ProfilesSkeleton";
import { AdminErrorState } from "@/components/admin/ui";

const PROFILES_PER_PAGE = 10;

function buildOverviewMetrics(overview = {}) {
  const hero = Number(overview.featuredHero) || 0;
  const landing = Number(overview.featuredLanding) || 0;

  return [
    {
      id: "total",
      label: "Total profiles",
      value: Number(overview.totalProfiles || 0).toLocaleString("en-IN"),
      emoji: "📄",
      hint: "All advisor profiles",
      accent: "teal",
    },
    {
      id: "published",
      label: "Published profiles",
      value: Number(overview.publishedProfiles || 0).toLocaleString("en-IN"),
      emoji: "✅",
      hint: "Live on platform",
      accent: "success",
    },
    {
      id: "pending",
      label: "Pending profiles",
      value: Number(overview.pendingProfiles || 0).toLocaleString("en-IN"),
      emoji: "⏳",
      hint: "Awaiting review",
      accent: "gold",
    },
    {
      id: "rejected",
      label: "Rejected profiles",
      value: Number(overview.rejectedProfiles || 0).toLocaleString("en-IN"),
      emoji: "✕",
      hint: "Action required",
      accent: "coral",
    },
    {
      id: "hidden",
      label: "Hidden profiles",
      value: Number(overview.hiddenProfiles || 0).toLocaleString("en-IN"),
      emoji: "👁",
      hint: "Not public",
      accent: "slate",
    },
    {
      id: "featured",
      label: "Featured profiles",
      value: `${hero} · ${landing}`,
      emoji: "⭐",
      hint: "Hero · Landing",
      accent: "gold",
    },
  ];
}

function AttentionStrip({ attention = {}, onFilterPending }) {
  const items = [
    {
      id: "pending",
      label: "Pending review",
      count: attention.pendingReview || 0,
      onClick: onFilterPending,
    },
    {
      id: "verification",
      label: "Verification pending",
      count: attention.verificationPending || 0,
    },
    {
      id: "updates",
      label: "Update requests",
      count: attention.updateRequests || 0,
      soon: true,
    },
  ];

  return (
    <section className="rounded-[24px] border border-[#F59E0B]/20 bg-gradient-to-r from-[#FFF9F0] to-[#F8F6F1] px-4 py-4">
      <p className="mb-3 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        Needs attention
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) =>
          item.onClick ? (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0A4A4A] transition hover:bg-[#FFF6E8]"
            >
              {item.label}
              <span className="admin-num rounded-full bg-[#FFF6E8] px-2 py-0.5 text-[11px] text-[#B45309]">
                {item.count}
              </span>
            </button>
          ) : (
            <span
              key={item.id}
              className="inline-flex items-center gap-2 rounded-full border border-[#E6ECEA] bg-white/80 px-3 py-1.5 text-[12px] font-medium text-[#5C7571]"
            >
              {item.label}
              <span className="admin-num rounded-full bg-[#F8FAFC] px-2 py-0.5 text-[11px]">
                {item.count}
              </span>
              {item.soon && (
                <span className="text-[10px] uppercase tracking-[0.12em] text-[#9AB0AB]">
                  Soon
                </span>
              )}
            </span>
          ),
        )}
        <Link
          href="/admin/irdaiapprovals"
          className="inline-flex items-center gap-2 rounded-full bg-[#0A4A4A] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#0D6060]"
        >
          Open approvals queue
        </Link>
      </div>
    </section>
  );
}

export default function AdminProfilesView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [featured, setFeatured] = useState("all");
  const [plan, setPlan] = useState("all");
  const [industry, setIndustry] = useState("all");

  const params = useMemo(
    () => ({
      page,
      limit: PROFILES_PER_PAGE,
      q: appliedQuery,
      status,
      featured,
      plan,
      industry,
    }),
    [page, appliedQuery, status, featured, plan, industry],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useProfiles(params);

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, status, featured, plan, industry]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedQuery(query.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query]);

  const overviewMetrics = buildOverviewMetrics(data?.overview);
  const profiles = data?.data || [];
  const pagination = data?.pagination;
  const attention = data?.attention || {};

  if (isLoading) {
    return <ProfilesSkeleton />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load profiles"
        message={error?.message || "Something went wrong while loading profiles."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            📄 Profiles
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Profile management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Browse advisor profiles, track completion and verification, and jump to review when action is needed.
          </p>
          {isFetching && !isLoading && (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing list…</p>
          )}
        </section>

        <section className="rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
          <p className="mb-4 font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Overview
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        <AttentionStrip
          attention={attention}
          onFilterPending={() => setStatus("pending")}
        />

        <ProfilesSearchBar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
          featured={featured}
          onFeaturedChange={setFeatured}
          plan={plan}
          onPlanChange={setPlan}
          industry={industry}
          onIndustryChange={setIndustry}
        />

        <ProfilesTable profiles={profiles} />

        {pagination && pagination.total > 0 && (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="profiles"
          />
        )}
      </div>
    </div>
  );
}
