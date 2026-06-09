"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function parseJsonResponse(response) {
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json?.error || "Something went wrong");
  return json;
}

async function fetchRolesOverview() {
  const response = await fetch("/api/admin/roles/overview");
  return parseJsonResponse(response);
}

async function fetchRoleActivity() {
  const response = await fetch("/api/admin/roles/activity");
  return parseJsonResponse(response);
}

export function useRolesOverview() {
  return useQuery({
    queryKey: ["roles-overview"],
    queryFn: fetchRolesOverview,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}

export function useRoleActivity() {
  return useQuery({
    queryKey: ["roles-activity"],
    queryFn: fetchRoleActivity,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });
}

export function useInvalidateRolesOverview() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["roles-overview"] });
    queryClient.invalidateQueries({ queryKey: ["roles-activity"] });
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };
}
