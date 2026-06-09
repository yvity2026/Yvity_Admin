"use client";

import { AdminFilterBar, AdminFilterSelect, AdminSearchInput } from "@/components/admin/ui";

export default function ComplaintsSearchBar({
  query,
  onQueryChange,
  kind,
  onKindChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  reportType,
  onReportTypeChange,
  complaintCategory,
  onComplaintCategoryChange,
}) {
  return (
    <AdminFilterBar title="Search & filters">
      <AdminSearchInput
        label="Keywords"
        value={query}
        onChange={onQueryChange}
        placeholder="Case ID, user name, or description"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <AdminFilterSelect label="Kind" value={kind} onChange={onKindChange}>
          <option value="all">All</option>
          <option value="report">Reports</option>
          <option value="complaint">Complaints</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Status" value={status} onChange={onStatusChange}>
          <option value="all">All status</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Priority" value={priority} onChange={onPriorityChange}>
          <option value="all">All priority</option>
          <option value="high_priority">High priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </AdminFilterSelect>

        <AdminFilterSelect
          label="Report type"
          value={reportType}
          onChange={onReportTypeChange}
          disabled={kind === "complaint"}
        >
          <option value="all">All report types</option>
          <option value="profile">Profile reports</option>
          <option value="review">Review reports</option>
          <option value="service">Service reports</option>
          <option value="user">User reports</option>
        </AdminFilterSelect>

        <AdminFilterSelect
          label="Category"
          value={complaintCategory}
          onChange={onComplaintCategoryChange}
          disabled={kind === "report"}
        >
          <option value="all">All categories</option>
          <option value="support">Support requests</option>
          <option value="payment">Payment issues</option>
          <option value="subscription">Subscription issues</option>
          <option value="technical">Technical issues</option>
          <option value="verification">Verification issues</option>
        </AdminFilterSelect>
      </div>
    </AdminFilterBar>
  );
}
