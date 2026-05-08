"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchApprovals() {
  const res = await fetch("/api/admin/approvals");

  if (!res.ok) {
    throw new Error("Failed to fetch approvals");
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error("Failed to update approval");
  }

  return res.json();
}

export function useApprovals() {
  return useQuery({
    queryKey: ["approvals"],
    queryFn: fetchApprovals,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useApprovalActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateApproval,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["approvals"],
      });
    },
  });

  return {
    approve: (advisorId) =>
      mutation.mutate({
        action: "approve",
        advisorId,
      }),

    reject: ({ advisorId, reason, note }) =>
      mutation.mutate({
        action: "reject",
        advisorId,
        reason,
        note,
      }),

    isProcessing: mutation.isPending,
  };
}