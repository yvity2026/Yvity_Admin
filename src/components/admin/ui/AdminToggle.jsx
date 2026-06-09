"use client";

export default function AdminToggle({ checked, onChange, label, hint, id }) {
  const controlId = id || `toggle-${label?.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] px-4 py-3">
      <div>
        <p id={`${controlId}-label`} className="text-sm font-semibold text-[#183534]">
          {label}
        </p>
        {hint ? <p className="text-xs text-[#7A928D]">{hint}</p> : null}
      </div>
      <button
        type="button"
        id={controlId}
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${controlId}-label`}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#0A4A4A]" : "bg-[#CBD5D2]"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
