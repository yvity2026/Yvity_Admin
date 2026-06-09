"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchCoupons() {
  const res = await fetch("/api/admin/coupons");
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch coupons");
  return json;
}

async function postCoupons(payload) {
  const res = await fetch("/api/admin/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to save coupon");
  return json;
}

export function useCoupons() {
  return useQuery({
    queryKey: ["admin-coupons"],
    queryFn: fetchCoupons,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useCouponActions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postCoupons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });

  return {
    createCoupon: (payload) => mutation.mutateAsync({ action: "create", ...payload }),
    revokeCoupon: (couponId) => mutation.mutateAsync({ action: "revoke", couponId }),
    isProcessing: mutation.isPending,
  };
}
