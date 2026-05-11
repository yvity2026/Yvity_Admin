"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PermissionsChecklist from "@/components/admin/roles/PermissionsChecklist";
import { DEFAULT_ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { useAdminUser, useUpdateAdminUser } from "@/hooks/TanstankQuery/useAdminUsers";

function buildFormState(adminUser) {
  return {
    name: adminUser.name || "",
    is_active: adminUser.is_active ?? true,
    permissions: {
      ...DEFAULT_ADMIN_PERMISSIONS,
      ...(adminUser.permissions || {}),
    },
  };
}

function EditPermissionsForm({ adminUser, readOnly, onClose }) {
  const updateAdminUser = useUpdateAdminUser();
  const [form, setForm] = useState(() => buildFormState(adminUser));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (readOnly || !adminUser) {
      return;
    }

    try {
      await updateAdminUser.mutateAsync({
        id: adminUser.id,
        payload: {
          name: form.name,
          is_active: form.is_active,
          permissions: form.permissions,
        },
      });

      toast.success("Admin permissions updated successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update admin user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                name: event.target.value,
              }))
            }
            disabled={readOnly}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A] disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Phone Number
          </label>
          <input
            value={adminUser.phone_number || ""}
            disabled
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-gray-100 bg-[#F8F6F1] p-4 md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Role
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {adminUser.role}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Status
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {form.is_active ? "Active" : "Inactive"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Created
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {adminUser.created_at
              ? new Date(adminUser.created_at).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Last Login
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {adminUser.last_login_at
              ? new Date(adminUser.last_login_at).toLocaleString()
              : "Never"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Account Status</p>
            <p className="text-xs text-gray-500">
              Inactive admins can no longer receive or verify OTP login.
            </p>
          </div>

          <label className="inline-flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {form.is_active ? "Active" : "Inactive"}
            </span>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((currentForm) => ({
                  ...currentForm,
                  is_active: event.target.checked,
                }))
              }
              disabled={readOnly}
              className="h-4 w-4 rounded border-gray-300 text-[#0A4A4A] focus:ring-[#0A4A4A]"
            />
          </label>
        </div>
      </div>

      <PermissionsChecklist
        permissions={form.permissions}
        disabled={readOnly}
        setPermissions={(valueOrUpdater) =>
          setForm((currentForm) => ({
            ...currentForm,
            permissions:
              typeof valueOrUpdater === "function"
                ? valueOrUpdater(currentForm.permissions)
                : valueOrUpdater,
          }))
        }
      />

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600"
        >
          Close
        </button>
        {!readOnly && (
          <button
            type="submit"
            disabled={updateAdminUser.isPending}
            className="rounded-xl bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
          >
            {updateAdminUser.isPending ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </form>
  );
}

export default function EditPermissionsModal({
  adminUserId,
  readOnly = false,
  onClose,
}) {
  const { data, isLoading, isError, error } = useAdminUser(
    adminUserId,
    Boolean(adminUserId),
  );

  const adminUser = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {readOnly ? "View Permissions" : "Edit Permissions"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review this admin account and update access when needed.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            x
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3 px-6 py-6">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        ) : isError || !adminUser ? (
          <div className="px-6 py-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">
                {error?.message || "Unable to load this admin user."}
              </p>
            </div>
          </div>
        ) : (
          <EditPermissionsForm
            key={adminUser.id}
            adminUser={adminUser}
            readOnly={readOnly}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
