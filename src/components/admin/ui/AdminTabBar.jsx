"use client";

import { createContext, useContext, useId, useMemo, useRef } from "react";

const AdminTabContext = createContext(null);

function useAdminTabContext() {
  return useContext(AdminTabContext);
}

const SIZE_STYLES = {
  default: "rounded-full px-4 py-2 text-xs",
  compact: "rounded-full px-3 py-1 text-[11px]",
};

/**
 * Accessible pill tab bar. Items: { id, label, disabled? }
 */
export default function AdminTabBar({
  items = [],
  value,
  onChange,
  className = "",
  scrollable = true,
  size = "default",
  ariaLabel = "Section tabs",
}) {
  const baseId = useId();
  const listRef = useRef(null);

  const ids = useMemo(
    () => ({
      tabId: (id) => `${baseId}-tab-${id}`,
      panelId: (id) => `${baseId}-panel-${id}`,
    }),
    [baseId],
  );

  const focusTab = (index) => {
    const buttons = listRef.current?.querySelectorAll('[role="tab"]');
    buttons?.[index]?.focus();
  };

  const handleKeyDown = (event, index) => {
    const last = items.length - 1;
    let next = index;

    if (event.key === "ArrowRight") next = index >= last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index <= 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;

    event.preventDefault();
    const item = items[next];
    if (item && !item.disabled) {
      onChange(item.id);
      focusTab(next);
    }
  };

  const sizeClass = SIZE_STYLES[size] || SIZE_STYLES.default;

  return (
    <AdminTabContext.Provider value={ids}>
      <div
        className={`${scrollable ? "mobile-scroll-x -mx-1 px-1" : ""} ${className}`}
        role="tablist"
        aria-label={ariaLabel}
        ref={listRef}
      >
        <div
          className={`flex gap-2 ${
            scrollable ? "min-w-max flex-nowrap md:min-w-0 md:flex-wrap" : "flex-wrap"
          }`}
        >
          {items.map((item, index) => {
            const selected = value === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={ids.tabId(item.id)}
                aria-selected={selected}
                aria-controls={ids.panelId(item.id)}
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                onClick={() => onChange(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`${sizeClass} font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  selected
                    ? "bg-[#0A4A4A] text-white shadow-sm"
                    : "border border-[#E6ECEA] bg-white text-[#0A4A4A] hover:bg-[#F8FAFC]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </AdminTabContext.Provider>
  );
}

/** Helper for tab panels — wrap tab content for aria-labelledby linkage. */
export function AdminTabPanel({ tabId, activeTab, children, className = "", labelledBy }) {
  const ids = useAdminTabContext();
  if (tabId !== activeTab) return null;

  const panelId = ids?.panelId(tabId) || `panel-${tabId}`;
  const labelId = labelledBy || ids?.tabId(tabId);

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={labelId}
      className={className}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
