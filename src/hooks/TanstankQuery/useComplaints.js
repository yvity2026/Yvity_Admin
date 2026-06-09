"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function buildComplaintsQuery(params = {}) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.status && params.status !== "all") search.set("status", params.status);
  if (params.priority && params.priority !== "all") search.set("priority", params.priority);
  if (params.kind && params.kind !== "all") search.set("kind", params.kind);
  if (params.reportType && params.reportType !== "all") search.set("reportType", params.reportType);
  if (params.complaintCategory && params.complaintCategory !== "all") {
    search.set("complaintCategory", params.complaintCategory);
  }
  if (params.entityType && params.entityType !== "all") {
    search.set("entityType", params.entityType);
  }
  if (params.reason && params.reason !== "all") search.set("reason", params.reason);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function fetchComplaints(params) {
  const res = await fetch(`/api/admin/complaints${buildComplaintsQuery(params)}`);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || json.details || "Failed to fetch complaints");
  }

  return json;
}

export function useComplaints(params = {}) {
  return useQuery({
    queryKey: ["admin-complaints", params],
    queryFn: () => fetchComplaints(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

async function updateComplaint(payload) {
  const res = await fetch("/api/admin/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to update complaint");
  }

  return json;
}

export function useComplaintActions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-complaints"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  return {
    take: (complaintId) => mutation.mutateAsync({ complaintId, action: "take" }),
    startReview: (complaintId) =>
      mutation.mutateAsync({ complaintId, action: "start_review" }),
    resolve: (complaintId, note) =>
      mutation.mutateAsync({ complaintId, action: "resolve", note }),
    dismiss: (complaintId, note) =>
      mutation.mutateAsync({ complaintId, action: "dismiss", note }),
    addNote: (complaintId, note) =>
      mutation.mutateAsync({ complaintId, action: "add_note", note }),
    viewPii: (complaintId) =>
      mutation.mutateAsync({ complaintId, action: "view_pii" }),
    isProcessing: mutation.isPending,
  };
}
