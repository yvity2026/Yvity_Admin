"use client";

import { useQuery } from "@tanstack/react-query";
import { buildNotificationItems } from "@/lib/admin/buildNotificationItems";
import { canAccessSidebarItem } from "@/lib/admin/permissions";

async function fetchNotificationCounts() {
  const res = await fetch("/api/admin/overview");

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
}

export function useAdminNotifications(admin) {
  return useQuery({
    queryKey: ["admin-notifications"],
    queryFn: fetchNotificationCounts,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    select: (data) =>
      buildNotificationItems(data?.quickActions || {}, admin, canAccessSidebarItem),
  });
}
