"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminModal from "@/components/admin/ui/AdminModal";
import RolePermissionsChecklist from "@/components/admin/roles/RolePermissionsChecklist";
import { DEFAULT_ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { countEnabledUiPermissions } from "@/lib/admin/rolePermissionGroups";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export default function RoleDetailModal({ role, readOnly = false, onClose, onSaved }) {
  const [permissions, setPermissions] = useState({
    ...DEFAULT_ADMIN_PERMISSIONS,
    ...(role?.permissions || {}),
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPermissions({
      ...DEFAULT_ADMIN_PERMISSIONS,
      ...(role?.permissions || {}),
    });
  }, [role]);

  if (!role) return null;

  const { enabled, total } = countEnabledUiPermissions(permissions);
  const canEdit = !readOnly && role.isEditable;

  const handleSave = async () => {
    if (!canEdit) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/roles/templates/${role.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to save role");
      toast.success("Role permissions updated");
      onSaved?.(json.data);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      open
      onClose={onClose}
      eyebrow="Role details"
      title={role.name}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E6ECEA] px-5 py-2.5 text-sm font-semibold text-[#5C7571]"
          >
            Close
          </button>
          {canEdit ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save role"}
            </button>
          ) : null}
        </div>
      }
    >
      <p className="mb-5 text-sm text-[#5C7571]">{role.description}</p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Created", formatDate(role.createdAt)],
          ["Assigned users", String(role.usersAssigned ?? 0)],
          ["Status", role.status || "active"],
          ["Permissions", `${enabled}/${total}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-[#7A928D]">{label}</p>
            <p className="mt-1 font-semibold capitalize text-[#0A4A4A]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-3 font-poppins text-sm font-semibold text-[#0A4A4A]">Permissions</p>
        <RolePermissionsChecklist
          permissions={permissions}
          setPermissions={setPermissions}
          disabled={!canEdit}
        />
      </div>
    </AdminModal>
  );
}
