"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  canAccessRolesSection,
  getPermissionSummary,
  hasPermission,
} from "@/lib/admin/permissions";
import { useAdmin } from "@/context/AuthAdminContext";
import {
  useAdminUsers,
  useDeactivateAdminUser,
} from "@/hooks/TanstankQuery/useAdminUsers";
import CreateAdminModal from "@/components/admin/roles/CreateAdminModal";
import EditPermissionsModal from "@/components/admin/roles/EditPermissionsModal";

function formatDate(value, withTime = false) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return withTime ? date.toLocaleString() : date.toLocaleDateString();
}

export default function RolesPermissionsPage() {
  const { admin, loading: adminLoading } = useAdmin();
  const { data, isLoading, isError, error } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] = useState(null);
  const [readOnlyModal, setReadOnlyModal] = useState(false);
  const deactivateAdminUser = useDeactivateAdminUser();

  const canViewRolesSection = canAccessRolesSection(admin);
  const canCreateAdmin = hasPermission(admin, "create_admin_user");
  const canEditPermissions = hasPermission(admin, "roles_permissions");
  const canDeleteAdminUsers = hasPermission(admin, "delete_admin_user");
  const adminUsers = data?.data || [];

  const filteredAdminUsers = adminUsers.filter((adminUser) => {
    const matchesSearch =
      (adminUser.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (adminUser.phone_number || "").toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ? true : adminUser.role === roleFilter;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? adminUser.is_active
          : !adminUser.is_active;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalAdmins = adminUsers.length;
  const activeAdmins = adminUsers.filter((adminUser) => adminUser.is_active).length;
  const rolesAccessCount = adminUsers.filter((adminUser) =>
    Boolean(adminUser.permissions?.roles_permissions),
  ).length;
  const createAccessCount = adminUsers.filter((adminUser) =>
    Boolean(adminUser.permissions?.create_admin_user),
  ).length;

  const handleDeleteAdmin = async (adminUser) => {
    const confirmed = window.confirm(
      `Delete ${adminUser.name}? This will permanently remove the admin from the database.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deactivateAdminUser.mutateAsync(adminUser.id);
      toast.success("Admin user deleted successfully");
    } catch (deleteError) {
      toast.error(deleteError.message || "Failed to delete admin user");
    }
  };

  if (adminLoading || isLoading) {
    return <div className="p-6 text-sm text-gray-500">Loading admin users...</div>;
  }

  if (!canViewRolesSection) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-lg font-bold text-amber-900">Access Restricted</h1>
          <p className="mt-2 text-sm text-amber-800">
            You do not have permission to open Roles & Permissions.
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-bold text-red-900">Unable to load admin users</h1>
          <p className="mt-2 text-sm text-red-800">
            {error?.message || "Something went wrong while fetching admin users."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2F0] p-4 md:p-6">
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Admin Users", value: totalAdmins },
          { label: "Active Accounts", value: activeAdmins },
          { label: "Roles Access Enabled", value: rolesAccessCount },
          { label: "Create Access Enabled", value: createAccessCount },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create admin users and manage what each one can access in the dashboard.
            </p>
          </div>

          {canCreateAdmin && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-xl bg-[#0A4A4A] px-5 py-3 text-sm font-semibold text-white"
            >
              Create Admin
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or phone number"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse">
            <thead>
              <tr>
                {[
                  "Name",
                  "Phone",
                  "Role",
                  "Status",
                  "Permissions",
                  "Created",
                  "Last Login",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAdminUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No admin users match the current filters.
                  </td>
                </tr>
              )}

              {filteredAdminUsers.map((adminUser) => {
                const permissionSummary = getPermissionSummary(adminUser.permissions);
                const isOwnAccount = admin?.id === adminUser.id;
                const rowReadOnly =
                  !canEditPermissions ||
                  (admin?.role !== "super_admin" && isOwnAccount) ||
                  (adminUser.role === "super_admin" && admin?.role !== "super_admin");
                const canDeleteRow =
                  canDeleteAdminUsers &&
                  !isOwnAccount &&
                  adminUser.role === "admin";

                return (
                  <tr key={adminUser.id} className="border-b border-gray-100">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {adminUser.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created by {adminUser.created_by ? "Admin" : "System"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {adminUser.phone_number}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#0A4A4A]/10 px-3 py-1 text-xs font-semibold uppercase text-[#0A4A4A]">
                        {adminUser.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          adminUser.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {adminUser.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {permissionSummary.length === 0 ? (
                          <span className="text-sm text-gray-500">No access assigned</span>
                        ) : (
                          permissionSummary.slice(0, 3).map((label) => (
                            <span
                              key={label}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                            >
                              {label}
                            </span>
                          ))
                        )}
                        {permissionSummary.length > 3 && (
                          <span className="rounded-full bg-[#0A4A4A]/10 px-3 py-1 text-xs font-semibold text-[#0A4A4A]">
                            +{permissionSummary.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(adminUser.created_at)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(adminUser.last_login_at, true)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAdminUser(adminUser);
                            setReadOnlyModal(rowReadOnly);
                          }}
                          className="rounded-lg border border-[#0A4A4A] px-4 py-2 text-xs font-semibold text-[#0A4A4A]"
                        >
                          {rowReadOnly ? "View" : "View / Edit"}
                        </button>

                        {canDeleteRow && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(adminUser)}
                            disabled={deactivateAdminUser.isPending}
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 disabled:cursor-wait disabled:opacity-60"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && <CreateAdminModal onClose={() => setShowCreateModal(false)} />}

      {selectedAdminUser && (
        <EditPermissionsModal
          adminUserId={selectedAdminUser.id}
          readOnly={readOnlyModal}
          onClose={() => {
            setSelectedAdminUser(null);
            setReadOnlyModal(false);
          }}
        />
      )}
    </div>
  );
}
