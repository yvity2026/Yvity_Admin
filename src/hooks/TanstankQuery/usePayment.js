
"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchPayments() {
  const res = await fetch("/api/admin/payments");

  if (!res.ok) {
    throw new Error("Failed to fetch payments");
  }

  return res.json();
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],

    queryFn: fetchPayments,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}