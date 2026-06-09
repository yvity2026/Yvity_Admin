"use client";

import { AdminFilterBar, AdminFilterSelect, AdminSearchInput } from "@/components/admin/ui";

export default function PlatformReviewsSearchBar({
  query,
  onQueryChange,
  queue,
  onQueueChange,
  type,
  onTypeChange,
  respondent,
  onRespondentChange,
  rating,
  onRatingChange,
}) {
  return (
    <AdminFilterBar title="Search platform testimonials">
      <AdminSearchInput
        label="Keywords"
        value={query}
        onChange={onQueryChange}
        placeholder="Reviewer name, city, profession, or review text"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <AdminFilterSelect label="Queue" value={queue} onChange={onQueueChange}>
          <option value="all">All reviews</option>
          <option value="attention">Pending approval</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="User type" value={respondent} onChange={onRespondentChange}>
          <option value="all">All user types</option>
          <option value="customer">Customers</option>
          <option value="professional">Professionals</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Format" value={type} onChange={onTypeChange}>
          <option value="all">All types</option>
          <option value="text">Text</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </AdminFilterSelect>

        <AdminFilterSelect label="Rating" value={rating} onChange={onRatingChange}>
          <option value="all">All ratings</option>
          <option value="5">5 star</option>
          <option value="4">4 star</option>
          <option value="3">3 star</option>
          <option value="2">2 star</option>
          <option value="1">1 star</option>
        </AdminFilterSelect>
      </div>
    </AdminFilterBar>
  );
}
