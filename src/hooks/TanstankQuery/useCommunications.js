"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function parseJson(response) {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json?.error || "Request failed");
  return json;
}

export function useCommunicationsOverview() {
  return useQuery({
    queryKey: ["communications-overview"],
    queryFn: async () => {
      const res = await fetch("/api/admin/communications/overview");
      return parseJson(res);
    },
    staleTime: 1000 * 20,
    refetchOnWindowFocus: true,
  });
}

export function useCommunicationActions() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["communications-overview"] });
  };

  const createCampaign = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/admin/communications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return parseJson(res);
    },
    onSuccess: invalidate,
  });

  const sendCampaign = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/communications/${id}/send`, { method: "POST" });
      return parseJson(res);
    },
    onSuccess: invalidate,
  });

  const duplicateCampaign = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/communications/${id}/duplicate`, { method: "POST" });
      return parseJson(res);
    },
    onSuccess: invalidate,
  });

  const previewAudience = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/admin/communications/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return parseJson(res);
    },
  });

  const createAnnouncement = useMutation({
    mutationFn: async (payload) => {
      const res = await fetch("/api/admin/communications/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return parseJson(res);
    },
    onSuccess: invalidate,
  });

  return {
    createCampaign,
    sendCampaign,
    duplicateCampaign,
    previewAudience,
    createAnnouncement,
    isProcessing:
      createCampaign.isPending ||
      sendCampaign.isPending ||
      duplicateCampaign.isPending ||
      createAnnouncement.isPending,
  };
}
