"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function buildAdvisorReviewsQuery(params = {}) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.queue && params.queue !== "all") search.set("queue", params.queue);
  if (params.reason && params.reason !== "all") search.set("reason", params.reason);
  if (params.type && params.type !== "all") search.set("type", params.type);
  if (params.reply && params.reply !== "all") search.set("reply", params.reply);
  if (params.plan && params.plan !== "all") search.set("plan", params.plan);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function fetchAdvisorReviews(params) {
  const res = await fetch(
    `/api/admin/advisor-testimonials${buildAdvisorReviewsQuery(params)}`,
  );
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || json.details || "Failed to fetch advisor reviews");
  }

  return json;
}

export function useAdvisorReviews(params = {}) {
  return useQuery({
    queryKey: ["admin-advisor-reviews", params],
    queryFn: () => fetchAdvisorReviews(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

async function moderateAdvisorReview({ reviewId, action, note }) {
  const res = await fetch("/api/admin/advisor-testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviewId, action, note }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to update advisor review");
  }

  return json;
}

export function useAdvisorReviewActions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: moderateAdvisorReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-advisor-reviews"] });
    },
  });

  return {
    hide: (reviewId, note) => mutation.mutateAsync({ reviewId, action: "hide", note }),
    restore: (reviewId, note) =>
      mutation.mutateAsync({ reviewId, action: "restore", note }),
    remove: (reviewId, note) => mutation.mutateAsync({ reviewId, action: "remove", note }),
    saveNote: (reviewId, note) =>
      mutation.mutateAsync({ reviewId, action: "save_note", note }),
    isProcessing: mutation.isPending,
  };
}
