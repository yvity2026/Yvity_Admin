"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PermissionsChecklist from "@/components/admin/roles/PermissionsChecklist";
import { DEFAULT_ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { useCreateAdminUser } from "@/hooks/TanstankQuery/useAdminUsers";

function initialFormState() {
  return {
    name: "",
    phone_number: "",
    permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
  };
}

export default function CreateAdminModal({ onClose }) {
  const [form, setForm] = useState(initialFormState);
  const createAdminUser = useCreateAdminUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createAdminUser.mutateAsync(form);
      toast.success("Admin user created successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create admin user");
    }
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Admin User</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a new admin and choose exactly what they can access.
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
                placeholder="Enter admin name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                value={form.phone_number}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    phone_number: event.target.value,
                  }))
                }
                placeholder="9876543210 or +919876543210"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
              />
              <p className="mt-2 text-xs text-gray-500">
                The login flow currently supports Indian admin numbers.
              </p>
            </div>
          </div>

          <PermissionsChecklist
            permissions={form.permissions}
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={createAdminUser.isPending}
              className="rounded-xl bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
            >
              {createAdminUser.isPending ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
