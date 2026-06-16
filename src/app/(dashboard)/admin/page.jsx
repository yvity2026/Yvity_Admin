"use client";

import { useMemo } from "react";
import { useAdmin } from "@/context/AuthAdminContext";
import AdminDashboardView from "@/components/admin/dashboard/AdminDashboardView";
import AdminDashboardSkeleton from "@/components/admin/dashboard/AdminDashboardSkeleton";
import { useDashboard } from "@/hooks/TanstankQuery/useDashboard";
import { buildDashboardData } from "@/lib/admin/buildDashboardData";
import { AdminErrorState } from "@/components/admin/ui";

export default function AdminDashboardPage() {
  const { admin } = useAdmin();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard();

  const displayName =
    admin?.name || (admin?.role === "super_admin" ? "Admin" : "Team");

  const dashboardData = useMemo(() => {
    if (!data) return null;
    return buildDashboardData(data, displayName);
  }, [data, displayName]);

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load dashboard"
        message={error?.message || "Something went wrong while fetching overview data."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <AdminDashboardView
      data={dashboardData}
      isLive
      isRefreshing={isFetching && !isLoading}
    />
  );
}
