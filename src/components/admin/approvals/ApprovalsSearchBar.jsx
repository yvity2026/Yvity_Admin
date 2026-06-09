"use client";

import { AdminFilterBar, AdminFilterSelect, AdminSearchInput } from "@/components/admin/ui";

export default function ApprovalsSearchBar({
  query,
  onQueryChange,
  requestType,
  onRequestTypeChange,
  status,
  onStatusChange,
  changeType,
  onChangeTypeChange,
}) {
  return (
    <AdminFilterBar title="Search & filters">
      <AdminSearchInput
        label="Keywords"
        value={query}
        onChange={onQueryChange}
        placeholder="Advisor name, industry, service, or user ID"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <AdminFilterSelect label="Request type" value={requestType} onChange={onRequestTypeChange}>
          <option value="all">All types</option>
          <option value="new_profile">New profiles</option>
          <option value="service_verification">Service verification</option>
          <option value="profile_update">Profile updates</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Status" value={status} onChange={onStatusChange}>
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Update type" value={changeType} onChange={onChangeTypeChange}>
          <option value="all">All update types</option>
          <option value="service_changes">Service changes</option>
          <option value="profile_changes">Profile changes</option>
          <option value="verification_updates">Verification updates</option>
        </AdminFilterSelect>
      </div>
    </AdminFilterBar>
  );
}
