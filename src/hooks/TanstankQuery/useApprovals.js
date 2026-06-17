"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function buildApprovalsQuery(params = {}) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.status && params.status !== "all") search.set("status", params.status);
  if (params.plan && params.plan !== "all") search.set("plan", params.plan);
  if (params.requestType && params.requestType !== "all") {
    search.set("requestType", params.requestType);
  }
  if (params.changeType && params.changeType !== "all") {
    search.set("changeType", params.changeType);
  }
  if (params.featured && params.featured !== "all") {
    search.set("featured", params.featured);
  }
  if (params.queue && params.queue !== "all") search.set("queue", params.queue);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function fetchApprovals(params) {
  const res = await fetch(`/api/admin/approvals${buildApprovalsQuery(params)}`);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to fetch approvals");
  }

  return json;
}

async function updateApproval({ action, advisorId, reason, note }) {
  const res = await fetch("/api/admin/approvals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      advisorId,
      reason,
      note,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to update approval");
  }

  return json;
}

export function useApprovals(params = {}) {
  return useQuery({
    queryKey: ["admin-approvals", params],
    queryFn: () => fetchApprovals(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

async function updateProfileUpdateRequest({ action, requestId, reason, note, verificationNotes }) {
  const res = await fetch("/api/admin/profile-update-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      requestId,
      reason,
      note,
      verificationNotes,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json?.error || "Failed to update profile request");
  }

  return json;
}

function invalidateApprovalQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["admin-approvals"] });
  queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
  queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
}

export function useApprovalActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateApproval,

    onSuccess: () => {
      invalidateApprovalQueries(queryClient);
    },
  });

  return {
    approve: (advisorId) =>
      mutation.mutateAsync({
        action: "approve",
        advisorId,
      }),

    reject: ({ advisorId, reason, note }) =>
      mutation.mutateAsync({
        action: "reject",
        advisorId,
        reason,
        note,
      }),

    isProcessing: mutation.isPending,
  };
}

export function useProfileUpdateActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProfileUpdateRequest,

    onSuccess: () => {
      invalidateApprovalQueries(queryClient);
    },
  });

  return {
    approve: ({ requestId, verificationNotes }) =>
      mutation.mutateAsync({
        action: "approve",
        requestId,
        verificationNotes,
      }),

    reject: ({ requestId, reason, note }) =>
      mutation.mutateAsync({
        action: "reject",
        requestId,
        reason,
        note,
      }),

    isProcessing: mutation.isPending,
  };
}
