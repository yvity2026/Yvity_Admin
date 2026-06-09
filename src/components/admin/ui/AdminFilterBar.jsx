"use client";

import { FiFilter } from "react-icons/fi";

/**
 * Sticky filter panel wrapper with accessible fieldset/legend.
 */
export default function AdminFilterBar({
  title,
  children,
  asForm = false,
  onSubmit,
  className = "",
}) {
  const fieldset = (
    <fieldset className={`space-y-3 ${className}`}>
      <legend className="flex w-full items-center gap-2 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        <FiFilter className="shrink-0 text-[#7A928D]" size={16} aria-hidden />
        {title}
      </legend>
      {children}
    </fieldset>
  );

  return (
    <div className="admin-glass-card sticky top-[60px] z-20 rounded-[24px] p-4 shadow-[0_8px_30px_rgba(10,74,74,0.06)]">
      {asForm ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          {fieldset}
        </form>
      ) : (
        fieldset
      )}
    </div>
  );
}
