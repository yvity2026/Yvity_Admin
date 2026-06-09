"use client";

import { adminPagePadding } from "./tokens";

/**
 * Standard page wrapper — consistent padding and typography.
 */
export default function AdminPageShell({ children, className = "" }) {
  return (
    <div className={`relative min-h-full font-poppins text-[#183534] ${className}`}>
      <div className={adminPagePadding}>{children}</div>
    </div>
  );
}
