"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
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

function PermissionSummary({ permissionSummary = [] }) {
  return (
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
  );
}

function getRoleLabel(role) {
  return role === "super_admin" ? "Super Admin" : "Admin";
}

function getCreatedByLabel(adminUser, adminUsersById) {
  if (!adminUser.created_by) {
    return "Created by System";
  }

  const creator = adminUsersById[adminUser.created_by];

  if (!creator) {
    return "Created by Admin";
  }

  return `Created by ${creator.name} (${getRoleLabel(creator.role)})`;
}

function DeleteAdminConfirmationModal({ adminName, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-990 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-5 shadow-2xl">
        <p className="text-base font-semibold text-gray-900">Delete Admin User</p>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Permanently remove {adminName} from the database?
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
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
  const [adminPendingDelete, setAdminPendingDelete] = useState(null);
  const [deletingAdminId, setDeletingAdminId] = useState(null);
  const deactivateAdminUser = useDeactivateAdminUser();

  const canViewRolesSection = canAccessRolesSection(admin);
  const canCreateAdmin = hasPermission(admin, "create_admin_user");
  const canEditPermissions = hasPermission(admin, "roles_permissions");
  const canDeleteAdminUsers = hasPermission(admin, "delete_admin_user");
  const adminUsers = data?.data || [];
  const adminUsersById = adminUsers.reduce((accumulator, adminUser) => {
    accumulator[adminUser.id] = adminUser;
    return accumulator;
  }, {});

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

  const handleDeleteAdmin = (adminUser) => {
    setAdminPendingDelete(adminUser);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminPendingDelete) {
      return;
    }

    try {
      setDeletingAdminId(adminPendingDelete.id);
      await deactivateAdminUser.mutateAsync(adminPendingDelete.id);
      toast.success("Admin user deleted successfully");
      setAdminPendingDelete(null);
    } catch (deleteError) {
      toast.error(deleteError.message || "Failed to delete admin user");
    } finally {
      setDeletingAdminId(null);
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
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#EEF2F0] p-3 sm:p-4 lg:p-6">
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mb-5 xl:grid-cols-4">
        {[
          { label: "Total Admin Users", value: totalAdmins },
          { label: "Active Accounts", value: activeAdmins },
          { label: "Roles Access Enabled", value: rolesAccessCount },
          { label: "Create Access Enabled", value: createAccessCount },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Admin Users</h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-500">
              Create admin users and manage what each one can access in the dashboard.
            </p>
          </div>

          {canCreateAdmin && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="cursor-pointer w-full rounded-xl bg-[#0A4A4A] px-5 py-3 text-sm font-semibold text-white sm:w-auto"
            >
              Create Admin
            </button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or phone number"
            className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A] sm:col-span-2 xl:col-span-1"
          />

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-6 space-y-4 xl:hidden">
          {filteredAdminUsers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-500">
              No admin users match the current filters.
            </div>
          )}

          {filteredAdminUsers.map((adminUser) => {
            const permissionSummary = getPermissionSummary(adminUser.permissions);
            const isOwnAccount = admin?.id === adminUser.id;
            const isDeletingThisAdmin =
              deactivateAdminUser.isPending && deletingAdminId === adminUser.id;
            const rowReadOnly =
              !canEditPermissions ||
              (admin?.role !== "super_admin" && isOwnAccount) ||
              (adminUser.role === "super_admin" && admin?.role !== "super_admin");
            const canDeleteRow =
              canDeleteAdminUsers &&
              !isOwnAccount &&
              adminUser.role === "admin";

            return (
              <div
                key={adminUser.id}
                className="rounded-2xl border border-gray-100 bg-[#FCFCFB] p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-gray-900">
                      {adminUser.name}
                    </p>
                    <p className="text-sm text-gray-500">{adminUser.phone_number}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {getCreatedByLabel(adminUser, adminUsersById)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#0A4A4A]/10 px-3 py-1 text-xs font-semibold uppercase text-[#0A4A4A]">
                      {adminUser.role}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        adminUser.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {adminUser.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Permissions
                    </p>
                    <PermissionSummary permissionSummary={permissionSummary} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Created
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {formatDate(adminUser.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAdminUser(adminUser);
                      setReadOnlyModal(rowReadOnly);
                    }}
                    className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#0A4A4A] px-4 py-2.5 text-sm font-semibold text-[#0A4A4A] sm:w-auto"
                    aria-label={rowReadOnly ? "View admin user" : "Edit admin user"}
                  >
                    {rowReadOnly ? <FiEye /> : <FiEdit2 />}
                    <span>{rowReadOnly ? "View" : "Edit"}</span>
                  </button>

                  {canDeleteRow && (
                    <button
                      type="button"
                      onClick={() => handleDeleteAdmin(adminUser)}
                      disabled={deactivateAdminUser.isPending}
                      className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                      aria-label="Delete admin user"
                    >
                      <FiTrash2 />
                      <span>{isDeletingThisAdmin ? "Deleting..." : "Delete"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 hidden overflow-x-auto xl:block">
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
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No admin users match the current filters.
                  </td>
                </tr>
              )}

              {filteredAdminUsers.map((adminUser) => {
                const permissionSummary = getPermissionSummary(adminUser.permissions);
                const isOwnAccount = admin?.id === adminUser.id;
                const isDeletingThisAdmin =
                  deactivateAdminUser.isPending && deletingAdminId === adminUser.id;
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
                          {getCreatedByLabel(adminUser, adminUsersById)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {adminUser.phone_number}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#0A4A4A]/10 px-3 py-1 text-xs font-semibold uppercase whitespace-nowrap text-[#0A4A4A]">
                        {adminUser.role === "super_admin" ? "Super Admin" : "Admin"}
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
                      <PermissionSummary permissionSummary={permissionSummary} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(adminUser.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAdminUser(adminUser);
                            setReadOnlyModal(rowReadOnly);
                          }}
                          className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-[#0A4A4A] px-4 py-2 text-xs font-semibold text-[#0A4A4A]"
                          aria-label={rowReadOnly ? "View admin user" : "Edit admin user"}
                        >
                          {rowReadOnly ? <FiEye /> : <FiEdit2 />}
                          <span>{rowReadOnly ? "View" : "Edit"}</span>
                        </button>

                        {canDeleteRow && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(adminUser)}
                            disabled={deactivateAdminUser.isPending}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 disabled:cursor-wait disabled:opacity-60"
                            aria-label="Delete admin user"
                          >
                            <FiTrash2 />
                            <span>{isDeletingThisAdmin ? "Deleting..." : "Delete"}</span>
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

      {adminPendingDelete && (
        <DeleteAdminConfirmationModal
          adminName={adminPendingDelete.name}
          loading={deactivateAdminUser.isPending}
          onCancel={() => {
            if (deactivateAdminUser.isPending) {
              return;
            }

            setAdminPendingDelete(null);
          }}
          onConfirm={confirmDeleteAdmin}
        />
      )}
    </div>
  );
}
