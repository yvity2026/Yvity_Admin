"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchAdvisors(activeFilter) {
  const params = new URLSearchParams();

  // Plan filters
  if (activeFilter === "gold") {
    params.append("plan", "gold");
  }

  if (activeFilter === "silver") {
    params.append("plan", "silver");
  }

  if (activeFilter === "free") {
    params.append("plan", "free");
  }

  // Status filters
  if (activeFilter === "pending") {
    params.append("account_status", "under_review");
  }

  if (activeFilter === "suspended") {
    params.append("account_status", "action_required");
  }

  const res = await fetch(`/api/admin/advisors?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch advisors");
  }

  return res.json();
}

export function useAdvisors(activeFilter) {
  return useQuery({
    queryKey: ["advisors", activeFilter],

    queryFn: () => fetchAdvisors(activeFilter),

    staleTime: 1000 * 60 * 5,
  });
}