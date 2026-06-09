"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function buildPlatformReviewsQuery(params = {}) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.status && params.status !== "all") search.set("status", params.status);
  if (params.queue && params.queue !== "all") search.set("queue", params.queue);
  if (params.type && params.type !== "all") search.set("type", params.type);
  if (params.respondent && params.respondent !== "all") {
    search.set("respondent", params.respondent);
  }
  if (params.rating && params.rating !== "all") {
    search.set("rating", params.rating);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function fetchPlatformReviews(params) {
  const res = await fetch(
    `/api/admin/platform-testimonials${buildPlatformReviewsQuery(params)}`,
  );
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || json.details || "Failed to fetch platform reviews");
  }

  return json;
}

export function usePlatformReviews(params = {}) {
  return useQuery({
    queryKey: ["admin-platform-reviews", params],
    queryFn: () => fetchPlatformReviews(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

async function updatePlatformReview({ reviewId, action, reply }) {
  const res = await fetch("/api/admin/platform-testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewId, action, reply }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to update platform review");
  }

  return json;
}

export function usePlatformReviewActions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updatePlatformReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-platform-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["platform-testimonials-public"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  return {
    approve: (reviewId, reply) =>
      mutation.mutateAsync({ reviewId, action: "approve", reply }),
    hide: (reviewId) => mutation.mutateAsync({ reviewId, action: "hide" }),
    restore: (reviewId) => mutation.mutateAsync({ reviewId, action: "restore" }),
    sendReply: (reviewId, reply) =>
      mutation.mutateAsync({ reviewId, action: "send_reply", reply }),
    isProcessing: mutation.isPending,
  };
}
