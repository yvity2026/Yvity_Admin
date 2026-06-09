"use client";

import { AdminFilterBar, AdminFilterSelect, AdminSearchInput } from "@/components/admin/ui";

export default function AdvisorReviewsSearchBar({
  query,
  onQueryChange,
  queue,
  onQueueChange,
  reason,
  onReasonChange,
}) {
  return (
    <AdminFilterBar title="Reported reviews">
      <AdminSearchInput
        label="Keywords"
        value={query}
        onChange={onQueryChange}
        placeholder="Advisor name, customer name, or review preview"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <AdminFilterSelect label="Queue" value={queue} onChange={onQueueChange}>
          <option value="reported">Reported</option>
          <option value="hidden">Hidden</option>
          <option value="pending">Pending action</option>
          <option value="resolved">Resolved</option>
          <option value="all">All reviews</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Reason" value={reason} onChange={onReasonChange}>
          <option value="all">All reasons</option>
          <option value="harassment">Abuse</option>
          <option value="spam">Spam</option>
          <option value="fake_review">Fake review</option>
          <option value="not_a_client">Not a client</option>
          <option value="privacy">Privacy</option>
          <option value="other">Other</option>
        </AdminFilterSelect>
      </div>
    </AdminFilterBar>
  );
}
