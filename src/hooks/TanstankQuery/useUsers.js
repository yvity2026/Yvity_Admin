"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function buildUsersQuery(params = {}) {
  const search = new URLSearchParams();

  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.q) search.set("q", params.q);
  if (params.userType && params.userType !== "all") search.set("userType", params.userType);
  if (params.status && params.status !== "all") search.set("status", params.status);
  if (params.plan && params.plan !== "all") search.set("plan", params.plan);
  if (params.registeredFrom) search.set("registeredFrom", params.registeredFrom);
  if (params.registeredTo) search.set("registeredTo", params.registeredTo);

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function fetchUsers(params) {
  const res = await fetch(`/api/admin/users${buildUsersQuery(params)}`);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || json.details || "Failed to fetch users");
  }

  return json;
}

async function fetchUser(id) {
  const res = await fetch(`/api/admin/users/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

async function patchUser({ id, action, reason }) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, reason }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || "Failed to update user");
  }

  return json;
}

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => fetchUsers(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useUserActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUser,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["admin-user", variables.id] });
      }
    },
  });
}
