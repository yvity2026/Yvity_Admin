"use client";

import { useQuery } from "@tanstack/react-query";

function buildProfilesQuery(params = {}) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.status && params.status !== "all") search.set("status", params.status);
  if (params.featured && params.featured !== "all") search.set("featured", params.featured);
  if (params.plan && params.plan !== "all") search.set("plan", params.plan);
  if (params.industry && params.industry !== "all") search.set("industry", params.industry);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function fetchProfiles(params) {
  const res = await fetch(`/api/admin/profiles${buildProfilesQuery(params)}`);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || json.details || "Failed to fetch profiles");
  }

  return json;
}

export function useProfiles(params = {}) {
  return useQuery({
    queryKey: ["admin-profiles", params],
    queryFn: () => fetchProfiles(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
