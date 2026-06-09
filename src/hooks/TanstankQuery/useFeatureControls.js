"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchFeatureControls() {
  const res = await fetch("/api/admin/feature-controls");
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch feature controls");
  return json;
}

async function postFeatureControls(payload) {
  const res = await fetch("/api/admin/feature-controls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to save feature controls");
  return json;
}

export function useFeatureControls() {
  return useQuery({
    queryKey: ["admin-feature-controls"],
    queryFn: fetchFeatureControls,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useFeatureControlActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postFeatureControls,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feature-controls"] });
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
    },
  });

  return {
    updateGlobalFlags: (flags) =>
      mutation.mutateAsync({
        action: "update_global",
        flags,
      }),
    updatePlanLimits: (planId, limits) =>
      mutation.mutateAsync({
        action: "update_plan_limits",
        planId,
        limits,
      }),
    resetPlanLimits: (planId) =>
      mutation.mutateAsync({
        action: "reset_plan_limits",
        planId,
      }),
    isProcessing: mutation.isPending,
  };
}
