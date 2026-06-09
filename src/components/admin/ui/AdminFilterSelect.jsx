"use client";

import { useId } from "react";
import { adminFilterSelectClass } from "./tokens";

const LABEL_CLASS =
  "mb-1 block font-poppins text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]";

/**
 * Labeled select or date filter control.
 */
export default function AdminFilterSelect({
  label,
  value,
  onChange,
  children,
  type = "select",
  disabled = false,
  className = "",
  ...props
}) {
  const id = useId();
  const controlClass = `${adminFilterSelectClass} disabled:cursor-not-allowed disabled:opacity-50`;

  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      {type === "date" ? (
        <input
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={controlClass}
          disabled={disabled}
          {...props}
        />
      ) : (
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={controlClass}
          disabled={disabled}
          {...props}
        >
          {children}
        </select>
      )}
    </div>
  );
}
