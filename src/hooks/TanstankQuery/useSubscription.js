// hooks/useSubscriptions.js
"use client";

import { useQuery } from "@tanstack/react-query";

const fetchSubscriptions = async ({ queryKey }) => {
  const [_key, page, limit] = queryKey;

  const res = await fetch(
    `/api/admin/subscriptions?page=${page}&limit=${limit}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch subscriptions");
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Something went wrong");
  }

  return json;
};

export function useSubscriptions(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["subscriptions", page, limit],
    queryFn: fetchSubscriptions,

    keepPreviousData: true,

    staleTime: 1000 * 60 * 5, // 5 mins
    gcTime: 1000 * 60 * 10,

    retry: 2,

    refetchOnWindowFocus: false,

    select: (data) => ({
      subscriptions: data.data || [],
      pagination: data.pagination || {},
    }),
  });
}