"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useComplaintActions, useComplaints } from "@/hooks/TanstankQuery/useComplaints";
import ComplaintsSearchBar from "./ComplaintsSearchBar";
import ComplaintsSkeleton from "./ComplaintsSkeleton";
import { AdminErrorState } from "@/components/admin/ui";
import ComplaintModal from "./ComplaintModal";
import ReportsTable from "./ReportsTable";
import SupportTicketsTable from "./SupportTicketsTable";
import ComplaintsQuickActions from "./ComplaintsQuickActions";

const CASES_PER_PAGE = 10;

function buildOverviewMetrics(overview = {}) {
  return [
    {
      id: "openReports",
      label: "Open reports",
      value: Number(overview.openReports || 0).toLocaleString("en-IN"),
      emoji: "🚩",
      hint: "Content & profile reports",
      accent: "gold",
    },
    {
      id: "openComplaints",
      label: "Open complaints",
      value: Number(overview.openComplaints || 0).toLocaleString("en-IN"),
      emoji: "📩",
      hint: "Support & billing tickets",
      accent: "teal",
    },
    {
      id: "resolved",
      label: "Resolved cases",
      value: Number(overview.resolvedCases || 0).toLocaleString("en-IN"),
      emoji: "✅",
      hint: "Action taken",
      accent: "success",
    },
    {
      id: "closed",
      label: "Closed cases",
      value: Number(overview.closedCases || 0).toLocaleString("en-IN"),
      emoji: "✕",
      hint: "Dismissed / no action",
      accent: "slate",
    },
    {
      id: "priority",
      label: "High priority cases",
      value: Number(overview.highPriorityCases || 0).toLocaleString("en-IN"),
      emoji: "⚠️",
      hint: "High & critical active",
      accent: "coral",
    },
  ];
}

export default function AdminComplaintsView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [reportType, setReportType] = useState("all");
  const [complaintCategory, setComplaintCategory] = useState("all");
  const [selectedCase, setSelectedCase] = useState(null);
  const [revealedContact, setRevealedContact] = useState(null);

  const { take, startReview, resolve, dismiss, addNote, viewPii, isProcessing } =
    useComplaintActions();

  const params = useMemo(
    () => ({
      page,
      limit: CASES_PER_PAGE,
      q: appliedQuery,
      kind,
      status,
      priority,
      reportType,
      complaintCategory,
    }),
    [page, appliedQuery, kind, status, priority, reportType, complaintCategory],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useComplaints(params);

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, kind, status, priority, reportType, complaintCategory]);

  useEffect(() => {
    const timer = window.setTimeout(() => setAppliedQuery(query.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setRevealedContact(null);
  }, [selectedCase?.id]);

  const permissions = data?.permissions || {};
  const overviewMetrics = buildOverviewMetrics(data?.overview);
  const allCases = data?.data || [];
  const reports = allCases.filter((row) => row.caseKind === "report");
  const tickets = allCases.filter((row) => row.caseKind === "complaint");
  const pagination = data?.pagination;

  const runTake = async (item) => {
    if (!item?.id) return;
    try {
      const result = await take(item.id);
      if (selectedCase?.id === item.id) setSelectedCase(result.data);
      toast.success("Case assigned");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to assign case");
    }
  };

  const runStartReview = async () => {
    if (!selectedCase?.id) return;
    try {
      const result = await startReview(selectedCase.id);
      setSelectedCase(result.data);
      toast.success("Case marked in progress");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to update case");
    }
  };

  const runResolve = async (item, note = "") => {
    const target = item || selectedCase;
    if (!target?.id) return;
    try {
      await resolve(target.id, note);
      toast.success("Case resolved");
      setSelectedCase(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to resolve case");
    }
  };

  const runClose = async (note = "") => {
    if (!selectedCase?.id) return;
    try {
      await dismiss(selectedCase.id, note);
      toast.success("Case closed");
      setSelectedCase(null);
    } catch (actionError) {
      toast.error(actionError.message || "Failed to close case");
    }
  };

  const handleAddNote = async (note) => {
    if (!selectedCase?.id || !note.trim()) return;
    try {
      const result = await addNote(selectedCase.id, note);
      setSelectedCase(result.data);
      toast.success("Resolution notes saved");
    } catch (actionError) {
      toast.error(actionError.message || "Failed to save notes");
    }
  };

  const handleViewPii = async () => {
    if (!selectedCase?.id) return;
    try {
      const result = await viewPii(selectedCase.id);
      setRevealedContact(result.contact);
      toast.success("Reporter contact revealed (audit logged)");
    } catch (actionError) {
      toast.error(actionError.message || "Unable to reveal contact");
    }
  };

  if (isLoading) return <ComplaintsSkeleton />;

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load reports & complaints"
        message={error?.message || "Something went wrong while loading cases."}
        onRetry={() => refetch()}
      />
    );
  }

  const showReports = kind === "all" || kind === "report";
  const showTickets = kind === "all" || kind === "complaint";

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            🚩 Reports & complaints
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Trust & safety desk
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/75">
            Triage user reports and support complaints in one place — assign, progress, resolve, or
            close with audited PII access.
          </p>
          {isFetching && !isLoading && (
            <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">Refreshing queue…</p>
          )}
        </section>

        <section className="rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
          <p className="mb-4 font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Overview
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        <ComplaintsSearchBar
          query={query}
          onQueryChange={setQuery}
          kind={kind}
          onKindChange={setKind}
          status={status}
          onStatusChange={setStatus}
          priority={priority}
          onPriorityChange={setPriority}
          reportType={reportType}
          onReportTypeChange={setReportType}
          complaintCategory={complaintCategory}
          onComplaintCategoryChange={setComplaintCategory}
        />

        {showReports && (
          <section className="space-y-3">
            <div>
              <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                Reports
              </p>
              <p className="mt-1 text-sm text-[#5C7571]">
                Profile · review · service · user reports
              </p>
            </div>
            <ReportsTable
              items={reports}
              onOpen={setSelectedCase}
              onAssign={runTake}
              onResolve={runResolve}
              isProcessing={isProcessing}
            />
          </section>
        )}

        {showTickets && (
          <section className="space-y-3">
            <div>
              <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                Complaints
              </p>
              <p className="mt-1 text-sm text-[#5C7571]">
                Support · payment · subscription · technical · verification
              </p>
            </div>
            <SupportTicketsTable
              items={tickets}
              onOpen={setSelectedCase}
              onAssign={runTake}
              onResolve={runResolve}
              isProcessing={isProcessing}
            />
          </section>
        )}

        {pagination && pagination.total > 0 && (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="cases"
          />
        )}
      </div>

      <AnimatePresence>
        {selectedCase && (
          <ComplaintModal
            complaint={selectedCase}
            onClose={() => setSelectedCase(null)}
            onTake={() => runTake(selectedCase)}
            onStartReview={runStartReview}
            onResolve={() => runResolve(selectedCase)}
            onDismiss={runClose}
            onAddNote={handleAddNote}
            onViewPii={handleViewPii}
            revealedContact={revealedContact}
            isProcessing={isProcessing}
            canManage={permissions.canManage !== false}
            canViewPii={permissions.canViewPii === true}
            quickActions={
              <ComplaintsQuickActions
                complaint={selectedCase}
                onAssign={() => runTake(selectedCase)}
                onStartReview={runStartReview}
                onResolve={() => runResolve(selectedCase)}
                onClose={runClose}
                isProcessing={isProcessing}
              />
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
