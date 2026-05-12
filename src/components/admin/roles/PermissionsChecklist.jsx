"use client";

import {
  DEFAULT_ADMIN_PERMISSIONS,
  PERMISSION_KEYS,
  PERMISSION_LABELS,
} from "@/lib/admin/permissions";

export default function PermissionsChecklist({
  permissions,
  setPermissions,
  disabled = false,
}) {
  const handleToggle = (permissionKey) => {
    if (disabled) {
      return;
    }

    setPermissions((currentPermissions) => ({
      ...currentPermissions,
      [permissionKey]: !currentPermissions[permissionKey],
    }));
  };

  const handleSelectAll = () => {
    if (disabled) {
      return;
    }

    setPermissions(
      PERMISSION_KEYS.reduce((accumulator, permissionKey) => {
        accumulator[permissionKey] = true;
        return accumulator;
      }, {}),
    );
  };

  const handleDeselectAll = () => {
    if (disabled) {
      return;
    }

    setPermissions({ ...DEFAULT_ADMIN_PERMISSIONS });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Permissions</p>
          <p className="text-xs text-gray-500">
            Choose the sidebar sections and admin actions this user can access.
          </p>
        </div>

        {!disabled && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="cursor-pointer rounded-md border border-[#0A4A4A]/20 px-3 py-1.5 text-xs font-semibold text-[#0A4A4A]"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600"
            >
              Deselect All
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PERMISSION_KEYS.map((permissionKey) => (
          <label
            key={permissionKey}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
              permissions[permissionKey]
                ? "border-[#0A4A4A] bg-[#0A4A4A]/5"
                : "border-gray-200 bg-white"
            } ${disabled ? "cursor-default" : "cursor-pointer hover:border-[#0A4A4A]/40"}`}
          >
            <input
              type="checkbox"
              checked={Boolean(permissions[permissionKey])}
              onChange={() => handleToggle(permissionKey)}
              disabled={disabled}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0A4A4A] focus:ring-[#0A4A4A]"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {PERMISSION_LABELS[permissionKey]}
              </p>
              <p className="text-xs text-gray-500">
                {permissionKey === "create_admin_user"
                  ? "Allows opening the create-admin flow."
                  : permissionKey === "delete_admin_user"
                    ? "Allows deleting other admin users."
                  : permissionKey === "roles_permissions"
                    ? "Allows access to the Roles & Permissions section."
                    : `Shows the ${PERMISSION_LABELS[permissionKey]} section in the sidebar.`}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
