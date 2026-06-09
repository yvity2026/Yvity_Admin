"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchPricing() {
  const res = await fetch("/api/admin/pricing");
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch pricing");
  return json;
}

async function postPricing(payload) {
  const res = await fetch("/api/admin/pricing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to save pricing");
  return json;
}

export function usePricing() {
  return useQuery({
    queryKey: ["admin-pricing"],
    queryFn: fetchPricing,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function usePricingActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postPricing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
    },
  });

  return {
    updatePlan: (planId, updates) =>
      mutation.mutateAsync({
        action: "update",
        planId,
        ...updates,
      }),
    createPlan: (payload) =>
      mutation.mutateAsync({
        action: "create",
        ...payload,
      }),
    updateFeaturedProduct: (productId, updates) =>
      mutation.mutateAsync({
        action: "update_featured",
        productId,
        ...updates,
      }),
    isProcessing: mutation.isPending,
  };
}
