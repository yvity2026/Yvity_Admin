"use client";

import { useId } from "react";
import { FiSearch } from "react-icons/fi";
import { adminSearchInputClass, adminSearchInputCompactClass } from "./tokens";

const LABEL_CLASS =
  "mb-1.5 block font-poppins text-[11px] font-semibold text-[#7A928D]";

/**
 * Labeled search field for admin list filters.
 */
export default function AdminSearchInput({
  label,
  value,
  onChange,
  placeholder,
  id: idProp,
  size = "default",
  className = "",
  ...props
}) {
  const autoId = useId();
  const id = idProp || autoId;
  const isCompact = size === "compact";

  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <div className={isCompact ? undefined : "relative"}>
        {!isCompact ? (
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AB0AB]"
            size={16}
            aria-hidden
          />
        ) : null}
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={isCompact ? adminSearchInputCompactClass : adminSearchInputClass}
          {...props}
        />
      </div>
    </div>
  );
}
