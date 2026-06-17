"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiEye } from "react-icons/fi";
import DashboardMetricTile from "@/components/admin/dashboard/DashboardMetricTile";
import CreateAdminModal from "@/components/admin/roles/CreateAdminModal";
import EditPermissionsModal from "@/components/admin/roles/EditPermissionsModal";
import RoleDetailModal from "@/components/admin/roles/RoleDetailModal";
import PaginationControls from "@/components/common/PaginationControls";
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminErrorState,
  AdminPageSkeleton,
  AdminFilterSelect,
  AdminSearchInput,
  AdminTabBar,
  useConfirmDialog,
} from "@/components/admin/ui";
import {
  canAccessRolesSection,
  hasPermission,
} from "@/lib/admin/permissions";
import { useAdmin } from "@/context/AuthAdminContext";
import { useUpdateAdminUser } from "@/hooks/TanstankQuery/useAdminUsers";
import { useRoleActivity, useRolesOverview } from "@/hooks/TanstankQuery/useRolesOverview";
import { getPaginationData } from "@/lib/pagination";

const TABS = [
  { id: "roles", label: "Roles" },
  { id: "admins", label: "Admin users" },
  { id: "activity", label: "Activity logs" },
];

const ADMIN_USERS_PER_PAGE = 8;
const ACTIVITY_PER_PAGE = 10;

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-[26px] border border-[#0A4A4A]/8 bg-white p-5 shadow-[0_8px_30px_rgba(10,74,74,0.05)] ${className}`}
    >
      {children}
    </section>
  );
}

function formatDate(value, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  return withTime ? date.toLocaleString() : date.toLocaleDateString();
}

function StatusPill({ active }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active ? "bg-[#DDF5E8] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function AdminRolesPermissionsView() {
  const { admin, loading: adminLoading } = useAdmin();
  const { data, isLoading, isError, error, refetch } = useRolesOverview();
  const { data: activityData, isLoading: activityLoading } = useRoleActivity();
  const updateAdminUser = useUpdateAdminUser();
  const { confirm, dialogProps } = useConfirmDialog();

  const [tab, setTab] = useState("roles");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] = useState(null);
  const [readOnlyModal, setReadOnlyModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleReadOnly, setRoleReadOnly] = useState(false);
  const [adminPage, setAdminPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  const canView = canAccessRolesSection(admin);
  const canCreateAdmin = hasPermission(admin, "create_admin_user");
  const canEditPermissions = hasPermission(admin, "roles_permissions");
  const canDeleteAdminUsers = hasPermission(admin, "delete_admin_user");

  const overview = data?.overview || {};
  const roles = data?.roles || [];
  const adminUsers = data?.adminUsers || [];
  const activityRows = activityData?.data || [];

  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((row) => {
      const matchesSearch =
        (row.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (row.phone_number || "").toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" ? true : row.role_template === roleFilter || row.role === roleFilter;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? row.is_active
            : !row.is_active;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [adminUsers, search, roleFilter, statusFilter]);

  const adminPagination = getPaginationData(filteredAdmins, adminPage, ADMIN_USERS_PER_PAGE);
  const activityPagination = getPaginationData(activityRows, activityPage, ACTIVITY_PER_PAGE);

  useEffect(() => {
    setAdminPage(1);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    if (adminPage > adminPagination.totalPages) setAdminPage(adminPagination.totalPages || 1);
  }, [adminPage, adminPagination.totalPages]);

  const overviewMetrics = [
    { id: "roles", label: "Total roles", value: String(overview.totalRoles || 0), emoji: "🔐", accent: "teal" },
    { id: "active", label: "Active admin users", value: String(overview.activeAdminUsers || 0), emoji: "👤", accent: "success" },
    { id: "custom", label: "Custom roles", value: String(overview.customRoles || 0), emoji: "⚙", accent: "gold" },
  ];

  const handleDisableAdmin = async (adminUser) => {
    const { confirmed } = await confirm({
      title: "Disable admin access",
      message: `Disable access for ${adminUser.name}? They will no longer be able to log in.`,
      confirmLabel: "Disable access",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await updateAdminUser.mutateAsync({
        id: adminUser.id,
        payload: { is_active: false },
      });
      toast.success("Admin access disabled");
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to disable admin");
    }
  };

  if (adminLoading || isLoading) {
    return <AdminPageSkeleton layout="default" />;
  }

  if (!canView) {
    return (
      <div className="p-6">
        <Panel>
          <h1 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">Access restricted</h1>
          <p className="mt-2 text-sm text-[#5C7571]">
            You do not have permission to open Roles & Permissions.
          </p>
        </Panel>
      </div>
    );
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Unable to load"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative min-h-full font-poppins text-[#183534]">
      <div className="space-y-5 p-3 sm:p-4 md:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/10 bg-gradient-to-br from-[#0A4A4A] via-[#0D6060] to-[#0A4A4A] px-5 py-5 text-white shadow-[0_20px_60px_rgba(10,74,74,0.18)]">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">
            🔐 Roles & Permissions
          </p>
          <h1 className="mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px]">
            Admin access control
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-white/75">
            Manage role templates, assign permissions, and monitor admin activity across YVITY.
          </p>
        </section>

        <Panel>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {overviewMetrics.map((metric, index) => (
              <DashboardMetricTile key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </Panel>

        <AdminTabBar
          items={TABS}
          value={tab}
          onChange={setTab}
          ariaLabel="Roles and permissions sections"
          scrollable
        />

        {tab === "roles" && (
          <Panel>
            <div className="mb-4">
              <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A]">Role list</h2>
              <p className="mt-1 text-sm text-[#5C7571]">
                System roles with default permission sets. Super Admin has full access.
              </p>
            </div>
            <div className="overflow-x-auto rounded-[16px] border border-[#EEF2F0]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                  <tr>
                    <th className="px-4 py-3">Role name</th>
                    <th className="px-4 py-3">Users assigned</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-t border-[#EEF2F0]">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#0A4A4A]">{role.name}</p>
                        <p className="mt-1 text-xs text-[#7A928D]">{role.description}</p>
                      </td>
                      <td className="admin-num px-4 py-4 font-semibold">{role.usersAssigned}</td>
                      <td className="px-4 py-4">
                        <StatusPill active={role.status === "active"} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRole(role);
                              setRoleReadOnly(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#0A4A4A]/20 px-3 py-1.5 text-xs font-semibold text-[#0A4A4A]"
                          >
                            <FiEye /> View
                          </button>
                          {canEditPermissions && role.isEditable ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRole(role);
                                setRoleReadOnly(false);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#0A4A4A] px-3 py-1.5 text-xs font-semibold text-white"
                            >
                              <FiEdit2 /> Edit
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        {tab === "admins" && (
          <Panel>
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A]">Admin users</h2>
                <p className="mt-1 text-sm text-[#5C7571]">
                  Assign roles and control what each admin can access.
                </p>
              </div>
              {canCreateAdmin ? (
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-full bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Create admin
                </button>
              ) : null}
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-3">
              <AdminSearchInput
                label="Search admins"
                size="compact"
                value={search}
                onChange={setSearch}
                placeholder="Name or phone"
              />
              <AdminFilterSelect label="Role" value={roleFilter} onChange={setRoleFilter}>
                <option value="all">All roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </AdminFilterSelect>
              <AdminFilterSelect label="Status" value={statusFilter} onChange={setStatusFilter}>
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </AdminFilterSelect>
            </div>

            <div className="overflow-x-auto rounded-[16px] border border-[#EEF2F0]">
              <table className="min-w-[900px] w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                  <tr>
                    <th className="px-4 py-3">Admin name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last login</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminPagination.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <AdminEmptyState
                          title="No admin users match the current filters."
                          className="m-4 border-none bg-transparent"
                        />
                      </td>
                    </tr>
                  ) : (
                    adminPagination.items.map((adminUser) => {
                      const isOwnAccount = admin?.id === adminUser.id;
                      const rowReadOnly =
                        !canEditPermissions ||
                        (admin?.role !== "super_admin" && isOwnAccount) ||
                        (adminUser.role === "super_admin" && admin?.role !== "super_admin");

                      return (
                        <tr key={adminUser.id} className="border-t border-[#EEF2F0]">
                          <td className="px-4 py-4">
                            <p className="font-semibold text-[#0A4A4A]">{adminUser.name}</p>
                            <p className="text-xs text-[#7A928D]">{adminUser.phone_number}</p>
                          </td>
                          <td className="px-4 py-4">{adminUser.role_template_label || "Admin"}</td>
                          <td className="px-4 py-4">
                            <StatusPill active={adminUser.is_active} />
                          </td>
                          <td className="px-4 py-4 text-[#5C7571]">
                            {formatDate(adminUser.last_login_at, true)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAdminUser(adminUser);
                                  setReadOnlyModal(rowReadOnly);
                                }}
                                className="rounded-full border border-[#0A4A4A]/20 px-3 py-1.5 text-xs font-semibold text-[#0A4A4A]"
                              >
                                {rowReadOnly ? "View" : "Edit role"}
                              </button>
                              {canDeleteAdminUsers && !isOwnAccount && adminUser.role !== "super_admin" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDisableAdmin(adminUser)}
                                  className="rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#991B1B]"
                                >
                                  Disable access
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <PaginationControls
              pagination={adminPagination}
              onPageChange={setAdminPage}
              label="admin users"
            />
          </Panel>
        )}

        {tab === "activity" && (
          <Panel>
            <div className="mb-4">
              <h2 className="font-cormorant text-[22px] font-bold text-[#0A4A4A]">Activity logs</h2>
              <p className="mt-1 text-sm text-[#5C7571]">
                Recent admin actions from complaints workflow and audited PII access.
              </p>
            </div>

            {activityLoading ? (
              <AdminPageSkeleton layout="compact" />
            ) : (
              <>
                <div className="overflow-x-auto rounded-[16px] border border-[#EEF2F0]">
                  <table className="min-w-[800px] w-full text-left text-sm">
                    <thead className="bg-[#F8FAFC] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                      <tr>
                        <th className="px-4 py-3">Admin name</th>
                        <th className="px-4 py-3">Action performed</th>
                        <th className="px-4 py-3">Module</th>
                        <th className="px-4 py-3">Date & time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityPagination.items.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-0">
                            <AdminEmptyState
                              title="No activity recorded yet."
                              className="m-4 border-none bg-transparent"
                            />
                          </td>
                        </tr>
                      ) : (
                        activityPagination.items.map((row) => (
                          <tr key={row.id} className="border-t border-[#EEF2F0]">
                            <td className="px-4 py-4 font-medium">{row.adminName}</td>
                            <td className="px-4 py-4">{row.action}</td>
                            <td className="px-4 py-4">{row.module}</td>
                            <td className="px-4 py-4 text-[#5C7571]">
                              {formatDate(row.createdAt, true)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  pagination={activityPagination}
                  onPageChange={setActivityPage}
                  label="activity entries"
                />
              </>
            )}
          </Panel>
        )}
      </div>

      {showCreateModal ? (
        <CreateAdminModal
          roleTemplates={roles.filter((r) => r.id !== "super_admin")}
          onClose={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      ) : null}

      {selectedAdminUser ? (
        <EditPermissionsModal
          adminUserId={selectedAdminUser.id}
          readOnly={readOnlyModal}
          roleTemplates={roles.filter((r) => r.id !== "super_admin")}
          onClose={() => {
            setSelectedAdminUser(null);
            setReadOnlyModal(false);
            refetch();
          }}
        />
      ) : null}

      {selectedRole ? (
        <RoleDetailModal
          role={selectedRole}
          readOnly={roleReadOnly}
          onClose={() => {
            setSelectedRole(null);
            setRoleReadOnly(false);
          }}
          onSaved={() => refetch()}
        />
      ) : null}

      <AdminConfirmDialog {...dialogProps} />
    </div>
  );
}
