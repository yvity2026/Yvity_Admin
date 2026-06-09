"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function buildPaymentsQueryKey(params = {}) {
  return [
    "admin-payments",
    params.filter || "all",
    params.search || "",
    params.sort || "recent",
    params.page || 1,
    params.limit || 20,
  ];
}

async function fetchPayments(params = {}) {
  const query = new URLSearchParams();
  if (params.filter) query.set("filter", params.filter);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await fetch(`/api/admin/payments?${query.toString()}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch payments");
  return json;
}

async function postPayments(payload) {
  const res = await fetch("/api/admin/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to save payment");
  return json;
}

export function usePayments(params = {}) {
  return useQuery({
    queryKey: buildPaymentsQueryKey(params),
    queryFn: () => fetchPayments(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function usePaymentActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postPayments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
    },
  });

  return {
    createPaymentLink: (payload) =>
      mutation.mutateAsync({
        action: "create_payment_link",
        ...payload,
      }),
    isProcessing: mutation.isPending,
  };
}
