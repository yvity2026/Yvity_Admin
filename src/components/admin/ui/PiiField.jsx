"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Displays PII (email/phone) masked by default.
 * On reveal click, calls /api/admin/audit to log the action, then shows full value.
 *
 * Props:
 *   masked  — the masked string to show by default (e.g. "kri•••@gmail.com")
 *   full    — the real value shown after reveal
 *   type    — "email" | "phone"
 *   entityType — e.g. "advisor", "payment" (for audit log)
 *   entityId   — record id (for audit log)
 *   href    — optional: if provided, full value becomes a clickable link
 */
export default function PiiField({ masked, full, type = "email", entityType, entityId, href }) {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!full) {
    return <span className="text-[#AABAB6]">—</span>;
  }

  const handleReveal = async () => {
    if (revealed) {
      setRevealed(false);
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reveal_pii", entityType, entityId, field: type }),
      });
    } catch {
      // audit log failure should not block reveal
    }
    setRevealed(true);
    setLoading(false);
  };

  const displayValue = revealed ? full : masked;

  return (
    <span className="inline-flex items-center gap-1">
      {revealed && href ? (
        <a
          href={href}
          className="text-[#0A4A4A] hover:underline"
        >
          {displayValue}
        </a>
      ) : (
        <span className={revealed ? "text-[#183534]" : "font-mono tracking-wide text-[#7A928D]"}>
          {displayValue}
        </span>
      )}
      <button
        type="button"
        onClick={handleReveal}
        disabled={loading}
        title={revealed ? "Hide" : "Reveal (audited)"}
        className="ml-0.5 rounded p-0.5 text-[#AABAB6] transition hover:text-[#0A4A4A] disabled:opacity-40"
        aria-label={revealed ? "Hide value" : "Reveal value"}
      >
        {revealed ? <FiEyeOff size={11} /> : <FiEye size={11} />}
      </button>
    </span>
  );
}
