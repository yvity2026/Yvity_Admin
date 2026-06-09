"use client";

export default function AdminField({ label, hint, htmlFor, children, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm ${className}`}>
      {label ? <span className="mb-1 block font-semibold text-[#0A4A4A]">{label}</span> : null}
      {children}
      {hint ? <p className="mt-1 text-xs text-[#7A928D]">{hint}</p> : null}
    </label>
  );
}
