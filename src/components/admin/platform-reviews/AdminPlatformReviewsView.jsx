"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { RequestTestimonialModal } from "@/components/features/Modals/RequestTestimonial";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import {
  usePlatformReviewActions,
  usePlatformReviews,
} from "@/hooks/TanstankQuery/usePlatformReviews";
import PlatformReviewsSearchBar from "./PlatformReviewsSearchBar";
import PlatformReviewsTable from "./PlatformReviewsTable";
import PlatformReviewsSkeleton from "./PlatformReviewsSkeleton";
import PlatformReviewModal from "./PlatformReviewModal";
import PlatformReviewsQuickActions from "./PlatformReviewsQuickActions";
import TestimonialRequestsPanel from "./TestimonialRequestsPanel";
import { AdminErrorState } from "@/components/admin/ui";
import BulkTestimonialRequestModal from "./BulkTestimonialRequestModal";
import { DEFAULT_TESTIMONIAL_AUDIENCE } from "@/hooks/TanstankQuery/useTestimonialAudience";

const REVIEWS_PER_PAGE = 10;

function buildOverviewMetrics(overview = {}) {
  return [
    {
      id: "total",
      label: "Total reviews",
      value: Number(overview.totalReviews || 0).toLocaleString("en-IN"),
      emoji: "⭐",
      hint: "About YVITY platform",
      accent: "teal",
    },
    {
      id: "average",
      label: "Average rating",
      value: overview.averageRating ? `${overview.averageRating}/5` : "—",
      emoji: "📊",
      hint: "Across all reviews",
      accent: "gold",
    },
    {
      id: "text",
      label: "Text reviews",
      value: Number(overview.textReviews || 0).toLocaleString("en-IN"),
      emoji: "📝",
      hint: "Written testimonials",
      accent: "slate",
    },
    {
      id: "audio",
      label: "Audio reviews",
      value: Number(overview.audioReviews || 0).toLocaleString("en-IN"),
      emoji: "🎙",
      hint: "Voice testimonials",
      accent: "teal",
    },
    {
      id: "video",
      label: "Video reviews",
      value: Number(overview.videoReviews || 0).toLocaleString("en-IN"),
      emoji: "🎬",
      hint: "Video testimonials",
      accent: "gold",
    },
    {
      id: "published",
      label: "Published",
      value: Number(overview.publishedReviews || 0).toLocaleString("en-IN"),
      emoji: "✅",
      hint: "Live on landing",
      accent: "success",
    },
    {
      id: "replied",
      label: "YVITY replied",
      value: Number(overview.withPlatformReply || 0).toLocaleString("en-IN"),
      emoji: "↩️",
      hint: "Platform responses",
      accent: "teal",
    },
  ];
}

function AttentionStrip({ attention = {}, newToday = 0, onFilterPending }) {
  return (
    <section className="rounded-[24px] border border-[#F59E0B]/20 bg-gradient-to-r from-[#FFF9F0] to-[#F8F6F1] px-4 py-4">
      <p className="mb-3 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        Needs attention
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onFilterPending}
          className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B]/30 bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0A4A4A] transition hover:bg-[#FFF6E8]"
        >
          Pending approval
          <span className="admin-num rounded-full bg-[#FFF6E8] px-2 py-0.5 text-[11px] text-[#B45309]">
            {attention.pendingReview || 0}
          </span>
        </button>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E6ECEA] bg-white/80 px-3 py-1.5 text-[12px] font-medium text-[#5C7571]">
          Submitted today
          <span className="admin-num rounded-full bg-[#F8FAFC] px-2 py-0.5 text-[11px]">
            {newToday}
          </span>
        </span>
        <Link
          href="/testimonial"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-full bg-[#0A4A4A] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#0D6060]"
        >
          Open public form
        </Link>
      </div>
    </section>
  );
}

export default function AdminPlatformReviewsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [queue, setQueue] = useState("attention");
  const [type, setType] = useState("all");
  const [respondent, setRespondent] = useState("all");
  const [rating, setRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [audienceFilters, setAudienceFilters] = useState(DEFAULT_TESTIMONIAL_AUDIENCE);

  const { approve, hide, restore, sendReply, isProcessing } = usePlatformReviewActions();

  const params = useMemo(
    () => ({
      page,
      limit: REVIEWS_PER_PAGE,
      q: appliedQuery,
      queue,
      type,
      respondent,
      rating,
    }),
    [page, appliedQuery, queue, type, respondent, rating],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = usePlatformReviews(params);

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, queue, type, respondent, rating]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedQuery(query.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const overviewMetrics = buildOverviewMetrics(data?.overview);
  const reviews = data?.data || [];
  const pagination = data?.pagination;
  const attention = data?.attention || {};
  const newToday = data?.overview?.newToday || 0;

  const handleApprove = async (reply = "") => {
    if (!selectedReview?.id) return;
    try {
      await approve(selectedReview.id, reply);
      toast.success("Testimonial published on landing page");
      setSelectedReview(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to approve testimonial");
    }
  };

  const handleHide = async () => {
    if (!selectedReview?.id) return;
    try {
      await hide(selectedReview.id);
      toast.success("Testimonial hidden from landing page");
      setSelectedReview(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to hide testimonial");
    }
  };

  const handleRestore = async () => {
    if (!selectedReview?.id) return;
    try {
      await restore(selectedReview.id);
      toast.success("Testimonial restored to landing page");
      setSelectedReview(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to restore testimonial");
    }
  };

  const handleSendReply = async (reply) => {
    if (!selectedReview?.id || !reply.trim()) return;
    try {
      await sendReply(selectedReview.id, reply);
      toast.success("Platform reply saved");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to save reply");
    }
  };

  if (isLoading) return <PlatformReviewsSkeleton />;

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load platform testimonials"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            ⭐ Platform testimonials
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            YVITY platform review desk
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Same testimonial format as advisor reviews — text, audio, or video — but reviewers share
            feedback about the YVITY platform. Approve before they appear on the landing page.
          </p>
          {isFetching && !isLoading && (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing list…</p>
          )}
        </section>

        <section className="rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
          <p className="mb-4 font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Overview
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-7">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        <PlatformReviewsQuickActions
          onSendRequest={() => setShowRequestModal(true)}
          onSendBulk={() => setShowBulkModal(true)}
          onFilterPending={() => setQueue("attention")}
          onFilterHidden={() => setQueue("hidden")}
        />

        <AttentionStrip
          attention={attention}
          newToday={newToday}
          onFilterPending={() => setQueue("attention")}
        />

        <PlatformReviewsSearchBar
          query={query}
          onQueryChange={setQuery}
          queue={queue}
          onQueueChange={setQueue}
          type={type}
          onTypeChange={setType}
          respondent={respondent}
          onRespondentChange={setRespondent}
          rating={rating}
          onRatingChange={setRating}
        />

        <PlatformReviewsTable reviews={reviews} onInspect={setSelectedReview} />

        {pagination && pagination.total > 0 && (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="testimonials"
          />
        )}

        <TestimonialRequestsPanel
          filters={audienceFilters}
          onFiltersChange={setAudienceFilters}
          onSendIndividual={() => setShowRequestModal(true)}
          onSendBulk={() => setShowBulkModal(true)}
        />
      </div>

      <AnimatePresence>
        {selectedReview && (
          <PlatformReviewModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
            onApprove={handleApprove}
            onHide={handleHide}
            onRestore={handleRestore}
            onSendReply={handleSendReply}
            isProcessing={isProcessing}
          />
        )}
        {showRequestModal && (
          <RequestTestimonialModal
            initialUserType={
              audienceFilters.userType === "all" ? "all" : audienceFilters.userType
            }
            onClose={() => setShowRequestModal(false)}
          />
        )}
        {showBulkModal && (
          <BulkTestimonialRequestModal
            filters={audienceFilters}
            onFiltersChange={setAudienceFilters}
            onClose={() => setShowBulkModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
