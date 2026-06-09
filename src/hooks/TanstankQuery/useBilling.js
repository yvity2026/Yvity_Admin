"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function buildBillingQueryKey(params = {}) {
  return [
    "admin-billing",
    params.filter || "all",
    params.sort || "expiry_asc",
    params.search || "",
    params.page || 1,
    params.limit || 20,
  ];
}

async function fetchBilling(params = {}) {
  const query = new URLSearchParams();
  if (params.filter) query.set("filter", params.filter);
  if (params.sort) query.set("sort", params.sort);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await fetch(`/api/admin/billing?${query.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch billing");
  return json;
}

async function postBilling(payload) {
  const res = await fetch("/api/admin/billing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to save billing");
  return json;
}

export function useBilling(params = {}) {
  return useQuery({
    queryKey: buildBillingQueryKey(params),
    queryFn: () => fetchBilling(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useBillingActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postBilling,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-billing"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
  });

  return {
    extendSubscription: (userId, options = {}) =>
      mutation.mutateAsync({
        action: "extend_subscription",
        userId,
        ...options,
      }),
    isProcessing: mutation.isPending,
  };
}
