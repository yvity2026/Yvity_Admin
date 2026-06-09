"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function parseJson(response) {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json?.error || "Request failed");
  return json;
}

export function usePlatformSettings() {
  return useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      return parseJson(res);
    },
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useSettingsActions() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["platform-settings"] });

  const saveSettings = useMutation({
    mutationFn: async (settings) => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      return parseJson(res);
    },
    onSuccess: invalidate,
  });

  const runAction = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return parseJson(res);
    },
    onSuccess: invalidate,
  });

  return {
    saveSettings,
    runAction,
    isProcessing: saveSettings.isPending || runAction.isPending,
  };
}
