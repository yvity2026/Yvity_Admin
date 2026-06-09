"use client";

import { useEffect, useId, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { adminModalZ } from "./tokens";

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.disabled && el.offsetParent !== null);
}

/**
 * Accessible modal — focus trap, Escape to close, scroll lock.
 */
export default function AdminModal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = "lg",
  className = "",
  closeOnBackdrop = true,
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  const sizeClass = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-5xl",
  }[size] || "max-w-4xl";

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      const focusable = getFocusableElements(panelRef.current);
      (focusable[0] || panelRef.current)?.focus();
    }, 0);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = getFocusableElements(panelRef.current);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 py-6"
      style={{ zIndex: adminModalZ }}
      role="presentation"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-[#0A4A4A]/40" aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative max-h-[92vh] w-full ${sizeClass} overflow-y-auto rounded-[26px] bg-white shadow-2xl outline-none ${className}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#EEF2F0] bg-white px-6 py-5">
          <div>
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
                {eyebrow}
              </p>
            ) : null}
            <h2 id={titleId} className="font-cormorant text-2xl font-bold text-[#0A4A4A]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-2 text-[#0A4A4A] hover:bg-[#F8FAFC]"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="sticky bottom-0 border-t border-[#EEF2F0] bg-white px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
