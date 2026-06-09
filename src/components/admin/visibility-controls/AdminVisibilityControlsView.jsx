"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import {
  useVisibilityActions,
  useVisibilityControls,
} from "@/hooks/TanstankQuery/useVisibilityControls";
import VisibilityControlsTable from "./VisibilityControlsTable";
import VisibilityReplaceModal from "./VisibilityReplaceModal";
import { AdminErrorState, AdminFilterSelect, AdminPageSkeleton, AdminSearchInput } from "@/components/admin/ui";

const PER_PAGE = 20;

function buildMetrics(overview = {}) {
  return [
    {
      id: "hero",
      label: "Hero slots",
      value: `${overview.heroUsed || 0}/${overview.heroLimit || 3}`,
      emoji: "⭐",
      hint: "Top landing hero card",
      accent: "gold",
    },
    {
      id: "landing",
      label: "Find Advisors slots",
      value: `${overview.landingUsed || 0}/${overview.landingLimit || 6}`,
      emoji: "🔍",
      hint: "Default landing grid",
      accent: "teal",
    },
    {
      id: "published",
      label: "Published profiles",
      value: Number(overview.publishedProfiles || 0).toLocaleString("en-IN"),
      emoji: "✓",
      hint: "Eligible to feature",
      accent: "success",
    },
  ];
}

export default function AdminVisibilityControlsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [slot, setSlot] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [replaceModal, setReplaceModal] = useState(null);

  const params = useMemo(
    () => ({ page, limit: PER_PAGE, q: appliedQuery, slot }),
    [page, appliedQuery, slot],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useVisibilityControls(params);
  const { updateVisibility, isProcessing } = useVisibilityActions();

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, slot]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedQuery(query.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const applyToggle = async (profile, slotType, nextValue, replaceProfileId = null) => {
    setProcessingId(profile.id);
    const payload = {
      profileId: profile.id,
      ...(slotType === "hero" ? { isHero: nextValue } : { isLanding: nextValue }),
      ...(replaceProfileId ? { replaceProfileId, slotType } : {}),
    };

    try {
      await updateVisibility(payload);
      toast.success(
        nextValue
          ? `${profile.profileName} added to ${slotType === "hero" ? "Hero" : "Find Advisors"}`
          : `${profile.profileName} removed from ${slotType === "hero" ? "Hero" : "Find Advisors"}`,
      );
      setReplaceModal(null);
    } catch (actionError) {
      if (actionError.status === 409 && actionError.members?.length) {
        setReplaceModal({
          profile,
          slotType,
          members: actionError.members,
        });
        return;
      }
      toast.error(actionError.message || "Failed to update visibility");
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggle = (profile, slotType) => {
    const isHero = slotType === "hero";
    const current = isHero ? profile.isHero : profile.isLanding;
    applyToggle(profile, slotType, !current);
  };

  const handleReplace = (replaceProfileId) => {
    if (!replaceModal) return;
    applyToggle(replaceModal.profile, replaceModal.slotType, true, replaceProfileId);
  };

  if (isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load visibility controls"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  const overviewMetrics = buildMetrics(data?.overview);

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            Visibility controls
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Landing page featuring
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Choose which published profiles appear on the public landing page — 3 Hero slots and 6
            Find Advisors slots (9 featured appearances total). Visitors can open those public
            profiles without login; searching the full directory requires customer login.
            Placement fees and payment links are managed separately under Payments.
          </p>
          {isFetching && !isLoading && (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing…</p>
          )}
        </section>

        <section className="rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Slot usage
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        <section className="admin-glass-card rounded-[24px] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <AdminSearchInput
              label="Search profiles"
              size="compact"
              value={query}
              onChange={setQuery}
              placeholder="Professional name, user, or city"
              className="flex-1"
            />
            <AdminFilterSelect
              label="Slot"
              value={slot}
              onChange={setSlot}
              className="w-full lg:w-56"
            >
              <option value="all">All published</option>
              <option value="hero">Hero featured</option>
              <option value="landing">Find Advisors featured</option>
            </AdminFilterSelect>
          </div>
        </section>

        <VisibilityControlsTable
          profiles={data?.data || []}
          onToggleHero={(profile) => handleToggle(profile, "hero")}
          onToggleLanding={(profile) => handleToggle(profile, "landing")}
          isProcessing={isProcessing}
          processingId={processingId}
        />

        {data?.pagination?.total > 0 && (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: data.pagination.total }),
              data.pagination.page,
              data.pagination.limit,
            )}
            onPageChange={setPage}
            label="profiles"
          />
        )}
      </div>

      <AnimatePresence>
        {replaceModal && (
          <VisibilityReplaceModal
            slotLabel={replaceModal.slotType === "hero" ? "Hero" : "Find Advisors"}
            members={replaceModal.members}
            onReplace={handleReplace}
            onClose={() => setReplaceModal(null)}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
