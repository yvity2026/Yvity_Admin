"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.slot && params.slot !== "all") search.set("slot", params.slot);
  const query = search.toString();
  return query ? `?${query}` : "";
}

async function fetchVisibilityControls(params) {
  const res = await fetch(`/api/admin/visibility-controls${buildQuery(params)}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to load visibility controls");
  return json;
}

async function updateVisibility(payload) {
  const res = await fetch("/api/admin/visibility-controls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(json?.error || "Failed to update visibility");
    error.status = res.status;
    error.members = json?.members || [];
    throw error;
  }
  return json;
}

export function useVisibilityControls(params = {}) {
  return useQuery({
    queryKey: ["admin-visibility-controls", params],
    queryFn: () => fetchVisibilityControls(params),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

export function useVisibilityActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateVisibility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-visibility-controls"] });
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  return {
    updateVisibility: (payload) => mutation.mutateAsync(payload),
    isProcessing: mutation.isPending,
  };
}
