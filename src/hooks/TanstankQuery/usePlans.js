"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchPlans() {
  const res = await fetch("/api/admin/plans");
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch plans");
  return json;
}

async function postPlans(payload) {
  const res = await fetch("/api/admin/plans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to save plan");
  return json;
}

export function usePlans() {
  return useQuery({
    queryKey: ["admin-plans"],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

export function usePlanActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postPlans,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["admin-feature-controls"] });
    },
  });

  return {
    updateEntitlements: (planId, entitlements) =>
      mutation.mutateAsync({
        action: "update_entitlements",
        planId,
        ...entitlements,
      }),
    isProcessing: mutation.isPending,
  };
}
