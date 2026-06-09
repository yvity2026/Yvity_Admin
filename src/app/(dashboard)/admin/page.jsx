"use client";

import { useMemo } from "react";
import { useAdmin } from "@/context/AuthAdminContext";
import AdminDashboardView from "@/components/admin/dashboard/AdminDashboardView";
import AdminDashboardSkeleton from "@/components/admin/dashboard/AdminDashboardSkeleton";
import { useDashboard } from "@/hooks/TanstankQuery/useDashboard";
import { buildDashboardData } from "@/lib/admin/buildDashboardData";
import {
  DASHBOARD_MOCK,
  USE_DASHBOARD_MOCK,
} from "@/lib/admin/dashboardMockData";
import { AdminErrorState } from "@/components/admin/ui";

export default function AdminDashboardPage() {
  const { admin } = useAdmin();
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard();

  const displayName =
    admin?.name || (admin?.role === "super_admin" ? "Admin" : "Team");

  const dashboardData = useMemo(() => {
    if (USE_DASHBOARD_MOCK) {
      return {
        ...DASHBOARD_MOCK,
        meta: {
          ...DASHBOARD_MOCK.meta,
          adminName: displayName,
        },
      };
    }

    if (!data) {
      return null;
    }

    return buildDashboardData(data, displayName);
  }, [data, displayName]);

  if (!USE_DASHBOARD_MOCK && isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (!USE_DASHBOARD_MOCK && isError) {
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
      showMockBadge={USE_DASHBOARD_MOCK}
      isLive={!USE_DASHBOARD_MOCK}
      isRefreshing={!USE_DASHBOARD_MOCK && isFetching && !isLoading}
    />
  );
}
