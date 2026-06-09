"use client";

import { GLOBAL_FLAG_DEFS } from "@/lib/admin/features/featureCatalog";

export default function GlobalFeatureToggles({
  flags = {},
  onToggle,
  isProcessing = false,
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {GLOBAL_FLAG_DEFS.map((flag) => {
        const enabled = Boolean(flags[flag.key]);

        return (
          <label
            key={flag.key}
            className="flex cursor-pointer items-start justify-between gap-4 rounded-[20px] border border-[#E6ECEA] bg-white px-4 py-4 shadow-[0_4px_20px_rgba(10,74,74,0.03)]"
          >
            <div>
              <p className="text-sm font-semibold text-[#183534]">{flag.label}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#5C7571]">{flag.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              disabled={isProcessing}
              onClick={() => onToggle?.(flag.key, !enabled)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                enabled ? "bg-[#0A4A4A]" : "bg-[#CBD5E1]"
              } disabled:opacity-60`}
            >
              <span
                className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition ${
                  enabled ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </label>
        );
      })}
    </div>
  );
}
