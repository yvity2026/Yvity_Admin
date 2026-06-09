"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import {
  useAdvisorReviewActions,
  useAdvisorReviews,
} from "@/hooks/TanstankQuery/useAdvisorReviews";
import AdvisorReviewsSearchBar from "./AdvisorReviewsSearchBar";
import AdvisorReviewsTable from "./AdvisorReviewsTable";
import AdvisorReviewsSkeleton from "./AdvisorReviewsSkeleton";
import AdvisorReviewModal from "./AdvisorReviewModal";
import AdvisorReviewsQuickActions from "./AdvisorReviewsQuickActions";
import { AdminErrorState } from "@/components/admin/ui";

const REVIEWS_PER_PAGE = 10;

function buildOverviewMetrics(overview = {}) {
  return [
    {
      id: "total",
      label: "Total reviews",
      value: Number(overview.totalReviews || 0).toLocaleString("en-IN"),
      emoji: "💬",
      hint: "All client → advisor reviews",
      accent: "teal",
    },
    {
      id: "reported",
      label: "Reported reviews",
      value: Number(overview.reportedReviews || 0).toLocaleString("en-IN"),
      emoji: "🚩",
      hint: "User-submitted reports",
      accent: "gold",
    },
    {
      id: "hidden",
      label: "Hidden reviews",
      value: Number(overview.hiddenReviews || 0).toLocaleString("en-IN"),
      emoji: "👁",
      hint: "Removed from public profile",
      accent: "slate",
    },
    {
      id: "pending",
      label: "Reviews pending action",
      value: Number(overview.pendingActionReviews || 0).toLocaleString("en-IN"),
      emoji: "⏳",
      hint: "Reported and still live",
      accent: "coral",
    },
  ];
}

export default function AdminAdvisorReviewsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [queue, setQueue] = useState("reported");
  const [reason, setReason] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);

  const { hide, restore, isProcessing } = useAdvisorReviewActions();

  const params = useMemo(
    () => ({
      page,
      limit: REVIEWS_PER_PAGE,
      q: appliedQuery,
      queue,
      reason,
    }),
    [page, appliedQuery, queue, reason],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useAdvisorReviews(params);

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, queue, reason]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedQuery(query.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query]);

  const overviewMetrics = buildOverviewMetrics(data?.overview);
  const reviews = data?.data || [];
  const pagination = data?.pagination;

  const runHide = async (review, note = "") => {
    if (!review?.id) return;
    try {
      await hide(review.id, note);
      toast.success("Review hidden from public profile");
      if (selectedReview?.id === review.id) setSelectedReview(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to hide review");
    }
  };

  const runRestore = async (review, note = "") => {
    if (!review?.id) return;
    try {
      await restore(review.id, note);
      toast.success("Review restored to public profile");
      if (selectedReview?.id === review.id) setSelectedReview(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to restore review");
    }
  };

  if (isLoading) {
    return <AdvisorReviewsSkeleton />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load advisor reviews"
        message={error?.message || "Something went wrong while loading advisor reviews."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            ⭐ Advisor reviews
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Reported review moderation
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Triage user reports on advisor testimonials — hide abusive or fake reviews, restore when
            resolved, and jump to advisor or customer profiles.
          </p>
          {isFetching && !isLoading && (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing list…</p>
          )}
        </section>

        <section className="rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
          <p className="mb-4 font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Overview
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        <AdvisorReviewsSearchBar
          query={query}
          onQueryChange={setQuery}
          queue={queue}
          onQueueChange={setQueue}
          reason={reason}
          onReasonChange={setReason}
        />

        <AdvisorReviewsTable
          reviews={reviews}
          onInspect={setSelectedReview}
          onHide={runHide}
          onRestore={runRestore}
          isProcessing={isProcessing}
        />

        {pagination && pagination.total > 0 && (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="reviews"
          />
        )}
      </div>

      <AnimatePresence>
        {selectedReview && (
          <AdvisorReviewModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
            onHide={() => runHide(selectedReview)}
            onRestore={() => runRestore(selectedReview)}
            isProcessing={isProcessing}
            quickActions={
              <AdvisorReviewsQuickActions
                review={selectedReview}
                onHide={() => runHide(selectedReview)}
                onRestore={() => runRestore(selectedReview)}
                isProcessing={isProcessing}
              />
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
