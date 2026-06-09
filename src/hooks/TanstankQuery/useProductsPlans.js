"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchProductsPlans() {
  const res = await fetch("/api/admin/products-plans");
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || "Failed to fetch products & plans overview");
  return json;
}

export function useProductsPlans() {
  return useQuery({
    queryKey: ["admin-products-plans"],
    queryFn: fetchProductsPlans,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
