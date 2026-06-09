"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchAmbassadors(search = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  const query = params.toString();
  const res = await fetch(`/api/admin/ambassadors${query ? `?${query}` : ""}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch ambassadors");
  return json;
}

async function postAmbassadors(payload) {
  const res = await fetch("/api/admin/ambassadors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to save ambassador program");
  return json;
}

export function useAmbassadors(search = "") {
  return useQuery({
    queryKey: ["admin-ambassadors", search],
    queryFn: () => fetchAmbassadors(search),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useAmbassadorActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postAmbassadors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ambassadors"] });
    },
  });

  return {
    updateSettings: (config) => mutation.mutateAsync({ action: "update_settings", config }),
    pauseProgram: () => mutation.mutateAsync({ action: "pause_program" }),
    resumeProgram: () => mutation.mutateAsync({ action: "resume_program" }),
    promoteAmbassador: (userId, payload = {}) =>
      mutation.mutateAsync({ action: "promote_ambassador", userId, ...payload }),
    approveReward: (rewardId) => mutation.mutateAsync({ action: "approve_reward", rewardId }),
    previewCampaignAudience: (audience) =>
      mutation.mutateAsync({ action: "preview_campaign_audience", audience }),
    createCampaign: (payload) => mutation.mutateAsync({ action: "create_campaign", ...payload }),
    sendCampaign: (campaignId) => mutation.mutateAsync({ action: "send_campaign", campaignId }),
    createRewardCampaign: (payload) =>
      mutation.mutateAsync({ action: "create_reward_campaign", ...payload }),
    updateRewardCampaign: (campaignId, payload) =>
      mutation.mutateAsync({ action: "update_reward_campaign", campaignId, ...payload }),
    duplicateRewardCampaign: (campaignId) =>
      mutation.mutateAsync({ action: "duplicate_reward_campaign", campaignId }),
    pauseRewardCampaign: (campaignId) =>
      mutation.mutateAsync({ action: "pause_reward_campaign", campaignId }),
    activateRewardCampaign: (campaignId) =>
      mutation.mutateAsync({ action: "activate_reward_campaign", campaignId }),
    deleteRewardCampaign: (campaignId) =>
      mutation.mutateAsync({ action: "delete_reward_campaign", campaignId }),
    isProcessing: mutation.isPending,
  };
}
