"use client";

import Link from "next/link";

/**
 * Empty-state shell for admin sections shipping in later phases.
 */
export default function AdminSectionPlaceholder({
  title,
  description,
  status = "placeholder",
  legacyLink,
  legacyLabel,
}) {
  return (
    <div className="min-h-full p-4 md:p-8">
      <div className="admin-glass-card mx-auto max-w-2xl rounded-2xl p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F8F6F1] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0A4A4A]">
          <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
          {status === "live" ? "Live" : "Coming soon"}
        </div>

        <h1 className="font-poppins text-2xl font-bold text-[#0A4A4A]">{title}</h1>

        <p className="mt-3 text-sm leading-relaxed text-[#53807E]">{description}</p>

        {legacyLink && legacyLabel ? (
          <div className="mt-6 rounded-lg border border-dashed border-[#E4E2DB] bg-[#F8F6F1]/60 p-4">
            <p className="text-sm text-[#53807E]">
              A working version of this area is still available at the legacy route.
            </p>
            <Link
              href={legacyLink}
              className="mt-3 inline-flex items-center text-sm font-semibold text-[#0A4A4A] underline-offset-2 hover:underline"
            >
              Open {legacyLabel} →
            </Link>
          </div>
        ) : null}

        <p className="mt-6 text-xs text-[#8BBEBE]">
          Phase 0 foundation — navigation and permissions are wired; data and actions ship next.
        </p>
      </div>
    </div>
  );
}
