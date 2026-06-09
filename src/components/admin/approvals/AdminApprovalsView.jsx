"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import RejectModal from "@/components/RejectModal";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import {
  useApprovalActions,
  useApprovals,
  useProfileUpdateActions,
} from "@/hooks/TanstankQuery/useApprovals";
import ApprovalsSearchBar from "./ApprovalsSearchBar";
import ApprovalsTable from "./ApprovalsTable";
import ApprovalsSkeleton from "./ApprovalsSkeleton";
import ApprovalRequestModal from "./ApprovalRequestModal";
import ApprovalsQuickActions from "./ApprovalsQuickActions";
import ProfileUpdateRequestsTable from "./ProfileUpdateRequestsTable";
import ProfileUpdateReviewModal from "./ProfileUpdateReviewModal";
import { AdminErrorState } from "@/components/admin/ui";

const APPROVALS_PER_PAGE = 10;

function buildOverviewMetrics(overview = {}) {
  return [
    {
      id: "pending",
      label: "Pending approvals",
      value: Number(overview.pendingApprovals || 0).toLocaleString("en-IN"),
      emoji: "⏳",
      hint: "Awaiting review",
      accent: "gold",
    },
    {
      id: "approvedToday",
      label: "Approved today",
      value: Number(overview.approvedToday || 0).toLocaleString("en-IN"),
      emoji: "✅",
      hint: "Processed today",
      accent: "success",
    },
    {
      id: "rejectedToday",
      label: "Rejected today",
      value: Number(overview.rejectedToday || 0).toLocaleString("en-IN"),
      emoji: "✕",
      hint: "Sent back today",
      accent: "coral",
    },
    {
      id: "updates",
      label: "Profile update requests",
      value: Number(overview.profileUpdateRequests || 0).toLocaleString("en-IN"),
      emoji: "📝",
      hint: "Pending profile changes",
      accent: "teal",
    },
  ];
}

export default function AdminApprovalsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [requestType, setRequestType] = useState("all");
  const [status, setStatus] = useState("all");
  const [changeType, setChangeType] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [openReject, setOpenReject] = useState(false);
  const [rejectContext, setRejectContext] = useState("approval");

  const { approve, reject, isProcessing } = useApprovalActions();
  const {
    approve: approveProfileUpdate,
    reject: rejectProfileUpdate,
    isProcessing: isProfileUpdateProcessing,
  } = useProfileUpdateActions();

  const params = useMemo(
    () => ({
      page,
      limit: APPROVALS_PER_PAGE,
      q: appliedQuery,
      requestType,
      status,
      changeType,
    }),
    [page, appliedQuery, requestType, status, changeType],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useApprovals(params);

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, requestType, status, changeType]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedQuery(query.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const overviewMetrics = buildOverviewMetrics(data?.overview);
  const approvals = data?.data || [];
  const profileUpdates = data?.profileUpdates || [];
  const pagination = data?.pagination;

  const approveSubmission = async (row) => {
    const id = row?.id;
    if (!id || isProcessing) return;

    try {
      await approve(id);
      toast.success("Request approved successfully");
      setSelectedApproval(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to approve request");
    }
  };

  const rejectSubmission = async ({ reason, note }) => {
    if (!selectedApproval?.id || isProcessing) return;

    try {
      await reject({
        advisorId: selectedApproval.id,
        reason,
        note,
      });
      toast.success("Request rejected");
      setOpenReject(false);
      setSelectedApproval(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to reject request");
    }
  };

  const openRejectFlow = (row) => {
    setSelectedApproval(row);
    setRejectContext("approval");
    setOpenReject(true);
  };

  const approveUpdateRequest = async (row) => {
    const id = row?.id;
    if (!id || isProfileUpdateProcessing) return;

    try {
      await approveProfileUpdate({ requestId: id });
      toast.success("Profile update approved");
      setSelectedUpdate(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to approve profile update");
    }
  };

  const openRejectUpdateFlow = (row) => {
    setSelectedUpdate(row);
    setRejectContext("profileUpdate");
    setOpenReject(true);
  };

  const rejectUpdateRequest = async ({ reason, note }) => {
    if (!selectedUpdate?.id || isProfileUpdateProcessing) return;

    try {
      await rejectProfileUpdate({
        requestId: selectedUpdate.id,
        reason,
        note,
      });
      toast.success("Profile update rejected");
      setOpenReject(false);
      setSelectedUpdate(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to reject profile update");
    }
  };

  if (isLoading) return <ApprovalsSkeleton />;

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load approvals"
        message={error?.message || "Something went wrong while loading approval requests."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            🛡 Approvals
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Advisor approval desk
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            When an advisor finishes profile setup, their request appears here. Verify uploaded
            documents against each service, then approve to publish the profile live or reject with
            a reason.
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

        <ApprovalsSearchBar
          query={query}
          onQueryChange={setQuery}
          requestType={requestType}
          onRequestTypeChange={setRequestType}
          status={status}
          onStatusChange={setStatus}
          changeType={changeType}
          onChangeTypeChange={setChangeType}
        />

        <section className="space-y-3">
          <div>
            <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Approval list
            </p>
          </div>
          <ApprovalsTable
            approvals={approvals}
            onView={setSelectedApproval}
            onApprove={approveSubmission}
            onReject={openRejectFlow}
            isProcessing={isProcessing}
          />
        </section>

        <section className="space-y-3">
          <div>
            <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              Profile update requests
            </p>
            <p className="mt-1 text-sm text-[#5C7571]">
              Service changes · profile changes · verification updates
            </p>
          </div>
          <ProfileUpdateRequestsTable
            requests={profileUpdates}
            onReview={setSelectedUpdate}
          />
        </section>

        {pagination && pagination.total > 0 && (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="requests"
          />
        )}
      </div>

      <AnimatePresence>
        {selectedApproval && (
          <ApprovalRequestModal
            approval={selectedApproval}
            onClose={() => setSelectedApproval(null)}
            onApprove={() => approveSubmission(selectedApproval)}
            onReject={() => openRejectFlow(selectedApproval)}
            isProcessing={isProcessing}
            quickActions={
              <ApprovalsQuickActions
                approval={selectedApproval}
                onApprove={() => approveSubmission(selectedApproval)}
                onReject={() => openRejectFlow(selectedApproval)}
                isProcessing={isProcessing}
              />
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedUpdate && (
          <ProfileUpdateReviewModal
            request={selectedUpdate}
            onClose={() => setSelectedUpdate(null)}
            onApprove={() => approveUpdateRequest(selectedUpdate)}
            onReject={() => openRejectUpdateFlow(selectedUpdate)}
            isProcessing={isProfileUpdateProcessing}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openReject && (
          <RejectModal
            open={openReject}
            onClose={() => {
              setOpenReject(false);
            }}
            onConfirm={rejectContext === "profileUpdate" ? rejectUpdateRequest : rejectSubmission}
            isSubmitting={
              rejectContext === "profileUpdate" ? isProfileUpdateProcessing : isProcessing
            }
            title={
              rejectContext === "profileUpdate"
                ? "Reject profile update"
                : "Reject IRDAI Submission"
            }
            warningText={
              rejectContext === "profileUpdate"
                ? "The advisor will be notified and asked to resubmit their changes."
                : 'This will mark the advisor\'s profile as "Action Required"'
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
