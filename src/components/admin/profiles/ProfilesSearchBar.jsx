"use client";

import { AdminFilterBar, AdminFilterSelect, AdminSearchInput } from "@/components/admin/ui";

export default function ProfilesSearchBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  featured,
  onFeaturedChange,
  plan,
  onPlanChange,
  industry,
  onIndustryChange,
}) {
  return (
    <AdminFilterBar title="Search profiles">
      <AdminSearchInput
        label="Keywords"
        value={query}
        onChange={onQueryChange}
        placeholder="Profile name, user name, or user ID"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <AdminFilterSelect label="Status" value={status} onChange={onStatusChange}>
          <option value="all">All profiles</option>
          <option value="published">Published</option>
          <option value="pending">Pending review</option>
          <option value="rejected">Rejected</option>
          <option value="hidden">Hidden</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Featured" value={featured} onChange={onFeaturedChange}>
          <option value="all">All featured</option>
          <option value="hero">Hero profiles</option>
          <option value="landing">Landing profiles</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Plan" value={plan} onChange={onPlanChange}>
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Industry" value={industry} onChange={onIndustryChange}>
          <option value="all">All industries</option>
          <option value="life">Life insurance</option>
          <option value="health">Health insurance</option>
          <option value="general">General insurance</option>
        </AdminFilterSelect>
      </div>
    </AdminFilterBar>
  );
}
