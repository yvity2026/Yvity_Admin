"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchDashboard() {
  const res = await fetch("/api/admin/overview");

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard");
  }

  return res.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: fetchDashboard,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}