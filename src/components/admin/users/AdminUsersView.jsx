"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import PaginationControls from "@/components/common/PaginationControls";
import { getPaginationData } from "@/lib/pagination";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import { useUserActions, useUsers } from "@/hooks/TanstankQuery/useUsers";
import UsersSearchBar from "./UsersSearchBar";
import UsersTable from "./UsersTable";
import UsersSkeleton from "./UsersSkeleton";
import {
  AdminConfirmDialog,
  AdminErrorState,
  AdminPageHero,
  AdminPageShell,
  AdminPanel,
  useConfirmDialog,
} from "@/components/admin/ui";

const USERS_PER_PAGE = 10;

function buildOverviewMetrics(overview = {}) {
  return [
    {
      id: "total-users",
      label: "Total users",
      value: Number(overview.totalUsers || 0).toLocaleString("en-IN"),
      emoji: "👥",
      hint: "All accounts",
      accent: "teal",
    },
    {
      id: "professionals",
      label: "Total professionals",
      value: Number(overview.totalProfessionals || 0).toLocaleString("en-IN"),
      emoji: "👨‍💼",
      hint: "Advisor profiles",
      accent: "teal",
    },
    {
      id: "customers",
      label: "Total customers",
      value: Number(overview.totalCustomers || 0).toLocaleString("en-IN"),
      emoji: "🙋",
      hint: "Non-advisor users",
      accent: "slate",
    },
    {
      id: "active",
      label: "Active users",
      value: Number(overview.activeUsers || 0).toLocaleString("en-IN"),
      emoji: "✅",
      hint: "Currently active",
      accent: "success",
    },
    {
      id: "suspended",
      label: "Suspended users",
      value: Number(overview.suspendedUsers || 0).toLocaleString("en-IN"),
      emoji: "⏸",
      hint: "Deactivated accounts",
      accent: "coral",
    },
    {
      id: "today",
      label: "New registrations today",
      value: Number(overview.registrationsToday || 0).toLocaleString("en-IN"),
      emoji: "📈",
      hint: "Users + professionals",
      accent: "gold",
    },
  ];
}

export default function AdminUsersView() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [userType, setUserType] = useState("all");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [registeredFrom, setRegisteredFrom] = useState("");
  const [registeredTo, setRegisteredTo] = useState("");

  const params = useMemo(
    () => ({
      page,
      limit: USERS_PER_PAGE,
      q: appliedQuery,
      userType,
      status,
      plan,
      registeredFrom,
      registeredTo,
    }),
    [page, appliedQuery, userType, status, plan, registeredFrom, registeredTo],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(params);
  const userActions = useUserActions();
  const { confirm, dialogProps } = useConfirmDialog();

  useEffect(() => {
    setPage(1);
  }, [appliedQuery, userType, status, plan, registeredFrom, registeredTo]);

  useEffect(() => {
    if (userType === "customer" && plan !== "all") {
      setPlan("all");
    }
  }, [userType, plan]);

  const overviewMetrics = buildOverviewMetrics(data?.overview);
  const users = data?.data || [];
  const pagination = data?.pagination;

  const handleSearchSubmit = () => {
    setAppliedQuery(query.trim());
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedQuery(query.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query]);

  const runUserAction = async (user, action) => {
    const labels = {
      suspend: "suspend",
      activate: "activate",
      delete: "delete",
    };

    const label = labels[action];
    if (!label) return;

    const ok = await confirm({
      title:
        action === "delete"
          ? "Delete user"
          : action === "suspend"
            ? "Suspend user"
            : "Activate user",
      message:
        action === "delete"
          ? `Delete ${user.name}? This soft-deletes the account.`
          : `${action === "suspend" ? "Suspend" : "Activate"} ${user.name}?`,
      confirmLabel:
        action === "delete" ? "Delete" : action === "suspend" ? "Suspend" : "Activate",
      variant: action === "activate" ? "primary" : "danger",
    });

    if (!ok) return;

    try {
      await userActions.mutateAsync({ id: user.id, action });
      toast.success(`User ${action === "delete" ? "deleted" : `${action}d`} successfully`);
      refetch();
    } catch (actionError) {
      toast.error(actionError.message || "Action failed");
    }
  };

  if (isLoading) {
    return <UsersSkeleton />;
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load users"
        message={error?.message || "Something went wrong while loading users."}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <AdminPageShell>
        <AdminPageHero
          eyebrow="👥 Users"
          title="User management"
          description="Search by name, city, service, company, or user ID. Contact details stay masked unless viewed on the profile."
          refreshing={isFetching && !isLoading}
          refreshingLabel="Refreshing list…"
        />

        <AdminPanel>
          <p className="mb-4 font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
            Overview
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </AdminPanel>

        <UsersSearchBar
          query={query}
          onQueryChange={setQuery}
          userType={userType}
          onUserTypeChange={setUserType}
          status={status}
          onStatusChange={setStatus}
          plan={plan}
          onPlanChange={setPlan}
          registeredFrom={registeredFrom}
          onRegisteredFromChange={setRegisteredFrom}
          registeredTo={registeredTo}
          onRegisteredToChange={setRegisteredTo}
          onSubmit={handleSearchSubmit}
        />

        <UsersTable
          users={users}
          onSuspend={(user) => runUserAction(user, "suspend")}
          onActivate={(user) => runUserAction(user, "activate")}
        />

        {pagination && pagination.total > 0 && (
          <PaginationControls
            pagination={getPaginationData(
              Array.from({ length: pagination.total }),
              pagination.page,
              pagination.limit,
            )}
            onPageChange={setPage}
            label="users"
          />
        )}
      <AdminConfirmDialog {...dialogProps} />
    </AdminPageShell>
  );
}
