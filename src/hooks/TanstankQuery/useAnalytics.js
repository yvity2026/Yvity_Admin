"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchAnalytics(filters = {}) {
  const params = new URLSearchParams();
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.industry && filters.industry !== "all") params.set("industry", filters.industry);
  if (filters.state && filters.state !== "all") params.set("state", filters.state);
  if (filters.city && filters.city !== "all") params.set("city", filters.city);

  const query = params.toString();
  const res = await fetch(`/api/admin/analytics${query ? `?${query}` : ""}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to load analytics");
  return json;
}

export function useAnalytics(filters = {}) {
  return useQuery({
    queryKey: ["admin-analytics", filters],
    queryFn: () => fetchAnalytics(filters),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}
