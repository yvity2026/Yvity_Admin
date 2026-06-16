"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiEye, FiMoreHorizontal } from "react-icons/fi";
import { AdminEmptyState } from "@/components/admin/ui";

function Avatar({ src, name }) {
  const initials = (name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#F59E0B] text-sm font-bold text-white">
      {src ? (
        <Image src={src} alt={name || "User"} fill sizes="40px" unoptimized className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">{initials}</span>
      )}
    </div>
  );
}

const STATUS_STYLES = {
  active: "bg-[#E8F5F0] text-[#1A7A5A]",
  suspended: "bg-[#FFF6E8] text-[#B45309]",
  deleted: "bg-[#FFF1F0] text-[#DC2626]",
};

const TYPE_STYLES = {
  professional: "bg-[#E8F4F3] text-[#0A4A4A]",
  customer: "bg-[#F8FAFC] text-[#475569]",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function RowMenu({ user, onSuspend, onActivate, onDelete, onRestore }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded-xl border border-[#E6ECEA] p-2 text-[#5C7571] transition hover:border-[#0A4A4A]/20 hover:text-[#0A4A4A]"
        aria-label="More actions"
      >
        <FiMoreHorizontal size={16} />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute right-0 z-20 mt-1 min-w-[150px] rounded-2xl border border-[#E6ECEA] bg-white p-1.5 shadow-[0_12px_32px_rgba(10,74,74,0.12)]">
            <Link
              href={`/admin/users/${user.id}`}
              className="block rounded-xl px-3 py-2 text-[12px] font-medium text-[#183534] hover:bg-[#F4F8F7]"
              onClick={() => setOpen(false)}
            >
              Edit
            </Link>
            {user.status === "active" && (
              <button
                type="button"
                onClick={() => { setOpen(false); onSuspend?.(user); }}
                className="block w-full rounded-xl px-3 py-2 text-left text-[12px] font-medium text-[#B45309] hover:bg-[#FFF6E8]"
              >
                Suspend
              </button>
            )}
            {user.status === "suspended" && (
              <>
                <button
                  type="button"
                  onClick={() => { setOpen(false); onActivate?.(user); }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-[12px] font-medium text-[#1A7A5A] hover:bg-[#E8F5F0]"
                >
                  Activate
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); onDelete?.(user); }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-[12px] font-medium text-[#DC2626] hover:bg-[#FFF1F0]"
                >
                  Delete
                </button>
              </>
            )}
            {user.status === "deleted" && (
              <button
                type="button"
                onClick={() => { setOpen(false); onRestore?.(user); }}
                className="block w-full rounded-xl px-3 py-2 text-left text-[12px] font-medium text-[#1A7A5A] hover:bg-[#E8F5F0]"
              >
                Restore
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function UsersTable({ users = [], onSuspend, onActivate, onDelete, onRestore }) {
  if (!users.length) {
    return (
      <AdminEmptyState
        title="No users found"
        description="Try adjusting search or filters."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/8 bg-white shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-[#E6ECEA] bg-[#FCFDFC] text-[11px] uppercase tracking-[0.12em] text-[#7A928D]">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">User ID</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
              <th className="px-4 py-3 font-semibold">Last login</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#F1F5F4] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.profilePic} name={user.name} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#183534]">{user.name}</p>
                      <p className="truncate text-[11px] text-[#7A928D]">
                        {user.city || "—"}
                        {user.companies?.length ? ` · ${user.companies[0]}` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="admin-num px-4 py-3 text-[12px] font-medium text-[#5C7571]">
                  {user.shortId}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${TYPE_STYLES[user.userType] || TYPE_STYLES.customer}`}
                  >
                    {user.userTypeLabel}
                  </span>
                </td>
                <td className="admin-num px-4 py-3 text-[12px] font-semibold text-[#0A4A4A]">
                  {user.plan}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${STATUS_STYLES[user.status] || STATUS_STYLES.active}`}
                  >
                    {user.statusLabel}
                  </span>
                </td>
                <td className="admin-num px-4 py-3 text-[12px] text-[#5C7571]">
                  {formatDate(user.registeredAt)}
                </td>
                <td className="admin-num px-4 py-3 text-[12px] text-[#5C7571]">
                  {formatDate(user.lastLogin)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
                    >
                      <FiEye size={13} />
                      View
                    </Link>
                    <RowMenu user={user} onSuspend={onSuspend} onActivate={onActivate} onDelete={onDelete} onRestore={onRestore} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
