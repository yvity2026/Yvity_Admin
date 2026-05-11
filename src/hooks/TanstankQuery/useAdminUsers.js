"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function parseJsonResponse(response) {
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json?.error || "Something went wrong");
  }

  return json;
}

async function fetchAdminUsers() {
  const response = await fetch("/api/admin/roles");
  return parseJsonResponse(response);
}

async function fetchAdminUser(id) {
  const response = await fetch(`/api/admin/roles/${id}`);
  return parseJsonResponse(response);
}

async function createAdminUser(payload) {
  const response = await fetch("/api/admin/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

async function updateAdminUser({ id, payload }) {
  const response = await fetch(`/api/admin/roles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(response);
}

async function deactivateAdminUser(id) {
  const response = await fetch(`/api/admin/roles/${id}`, {
    method: "DELETE",
  });

  return parseJsonResponse(response);
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}

export function useAdminUser(id, enabled = true) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => fetchAdminUser(id),
    enabled: Boolean(id && enabled),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["auth-admin"] });
    },
  });
}

export function useDeactivateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateAdminUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
      queryClient.invalidateQueries({ queryKey: ["auth-admin"] });
    },
  });
}
