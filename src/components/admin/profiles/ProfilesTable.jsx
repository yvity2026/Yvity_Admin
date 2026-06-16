"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiExternalLink, FiEye, FiEyeOff, FiMoreHorizontal, FiShield } from "react-icons/fi";
import { AdminEmptyState } from "@/components/admin/ui";

const STATUS_STYLES = {
  published: "bg-[#E8F5F0] text-[#1A7A5A]",
  pending: "bg-[#FFF6E8] text-[#B45309]",
  rejected: "bg-[#FFF1F0] text-[#DC2626]",
  hidden: "bg-[#F8FAFC] text-[#475569]",
  deleted: "bg-[#FFF1F0] text-[#DC2626]",
};

const VERIFY_STYLES = {
  verified: "bg-[#E8F4F3] text-[#0A4A4A]",
  pending: "bg-[#FFF6E8] text-[#B45309]",
  rejected: "bg-[#FFF1F0] text-[#DC2626]",
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

function Avatar({ src, name }) {
  const initials = (name || "P")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#0A4A4A] text-sm font-bold text-white">
      {src ? (
        <Image src={src} alt={name || "Profile"} fill sizes="40px" unoptimized className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">{initials}</span>
      )}
    </div>
  );
}

function RowMenu({ profile, onToggleHide }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2">
      {profile.publicUrl && profile.profileStatus === "published" ? (
        <a
          href={profile.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#D7E5E1] bg-white px-3 py-2 text-[11px] font-semibold text-[#0A4A4A] transition hover:bg-[#F4F8F7]"
        >
          <FiExternalLink size={13} />
          Public
        </a>
      ) : (
        <Link
          href={`/admin/users/${profile.userId}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0D6060]"
        >
          <FiEye size={13} />
          View
        </Link>
      )}

      {profile.canReview && (
        <Link
          href="/admin/irdaiapprovals"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#F59E0B] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#D97706]"
        >
          <FiShield size={13} />
          Review
        </Link>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
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
            <div className="absolute right-0 z-20 mt-1 min-w-[160px] rounded-2xl border border-[#E6ECEA] bg-white p-1.5 shadow-[0_12px_32px_rgba(10,74,74,0.12)]">
              <Link
                href={`/admin/users/${profile.userId}`}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-medium text-[#183534] hover:bg-[#F4F8F7]"
                onClick={() => setOpen(false)}
              >
                <FiEye size={13} />
                View user
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onToggleHide?.(profile);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-medium text-[#183534] hover:bg-[#F4F8F7]"
              >
                {profile.isHidden ? (
                  <>
                    <FiEye size={13} />
                    Unhide profile
                  </>
                ) : (
                  <>
                    <FiEyeOff size={13} />
                    Hide profile
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProfilesTable({ profiles = [], onToggleHide }) {
  if (!profiles.length) {
    return (
      <AdminEmptyState
        title="No profiles found"
        description="Try adjusting search or filters."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#0A4A4A]/8 bg-white shadow-[0_8px_30px_rgba(10,74,74,0.05)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[1040px] text-left">
          <thead>
            <tr className="border-b border-[#E6ECEA] bg-[#FCFDFC] text-[11px] uppercase tracking-[0.12em] text-[#7A928D]">
              <th className="px-4 py-3 font-semibold">Profile</th>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Industry</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Complete</th>
              <th className="px-4 py-3 font-semibold">Verification</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b border-[#F1F5F4] last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={profile.profilePic} name={profile.profileName} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#183534]">
                        {profile.profileName}
                      </p>
                      <p className="truncate text-[11px] text-[#7A928D]">
                        {profile.isHero && "Hero · "}
                        {profile.isLanding && "Landing · "}
                        {profile.profileSlug || profile.userShortId}
                      </p>
                      {profile.userAccountStatus === "deleted" && (
                        <span className="mt-0.5 inline-block rounded-full bg-[#FFF1F0] px-2 py-0.5 text-[10px] font-bold uppercase text-[#DC2626]">
                          User deleted
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[13px] font-medium text-[#183534]">{profile.userName}</p>
                  <p className="admin-num text-[11px] text-[#7A928D]">{profile.userShortId}</p>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#5C7571]">{profile.industry}</td>
                <td className="admin-num px-4 py-3 text-[12px] font-semibold text-[#0A4A4A]">
                  {profile.plan}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      STATUS_STYLES[profile.profileStatus] || STATUS_STYLES.pending
                    }`}
                  >
                    {profile.profileStatusLabel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#EEF2F0]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0D6060] to-[#F59E0B]"
                        style={{ width: `${profile.completionPct}%` }}
                      />
                    </div>
                    <span className="admin-num text-[11px] font-bold text-[#0A4A4A]">
                      {profile.completionPct}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                      VERIFY_STYLES[profile.verificationStatus] || VERIFY_STYLES.pending
                    }`}
                  >
                    {profile.verificationLabel}
                  </span>
                </td>
                <td className="admin-num px-4 py-3 text-[12px] text-[#5C7571]">
                  {formatDate(profile.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <RowMenu profile={profile} onToggleHide={onToggleHide} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
