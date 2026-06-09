"use client";

import {
  ROLE_PERMISSION_UI_GROUPS,
  applyUiPermissionToggle,
  isUiPermissionChecked,
} from "@/lib/admin/rolePermissionGroups";
import { DEFAULT_ADMIN_PERMISSIONS } from "@/lib/admin/permissions";

export default function RolePermissionsChecklist({
  permissions,
  setPermissions,
  disabled = false,
}) {
  const handleToggle = (item) => {
    if (disabled) return;
    const checked = !isUiPermissionChecked(permissions, item);
    setPermissions((current) => applyUiPermissionToggle(current, item, checked));
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const next = { ...permissions };
    ROLE_PERMISSION_UI_GROUPS.forEach((group) => {
      group.items.forEach((item) => {
        item.keys.forEach((key) => {
          next[key] = true;
        });
      });
    });
    setPermissions(next);
  };

  const handleDeselectAll = () => {
    if (disabled) return;
    setPermissions({ ...DEFAULT_ADMIN_PERMISSIONS });
  };

  return (
    <div className="space-y-4">
      {!disabled ? (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="rounded-full border border-[#0A4A4A]/20 px-3 py-1.5 text-xs font-semibold text-[#0A4A4A]"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="rounded-full border border-[#E6ECEA] px-3 py-1.5 text-xs font-semibold text-[#5C7571]"
          >
            Deselect all
          </button>
        </div>
      ) : null}

      <div className="space-y-5">
        {ROLE_PERMISSION_UI_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="mb-3 font-poppins text-xs font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              {group.emoji} {group.label}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.items.map((item) => {
                const checked = isUiPermissionChecked(permissions, item);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                      checked
                        ? "border-[#0A4A4A] bg-[#E8F4F3]"
                        : "border-[#EEF2F0] bg-[#FCFDFC]"
                    } ${disabled ? "cursor-default" : "cursor-pointer hover:border-[#0A4A4A]/30"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(item)}
                      disabled={disabled}
                      className="h-4 w-4 rounded border-[#CBD5D2] text-[#0A4A4A] focus:ring-[#0A4A4A]"
                    />
                    <span className="text-sm font-medium text-[#183534]">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
