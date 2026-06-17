"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchDashboard() {
  const res = await fetch("/api/admin/overview");
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch dashboard");
  }

  return data;
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: fetchDashboard,

    staleTime: 0,

    refetchOnWindowFocus: true,
  });
}