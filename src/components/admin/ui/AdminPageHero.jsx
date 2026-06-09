"use client";

import { adminHeroClass } from "./tokens";

/**
 * Gradient hero band used at the top of admin list/detail pages.
 */
export default function AdminPageHero({
  eyebrow,
  title,
  description,
  refreshing = false,
  refreshingLabel = "Refreshing…",
  hideTitleOnMobile = false,
  children,
  className = "",
}) {
  return (
    <section className={`${adminHeroClass} ${className}`}>
      {eyebrow ? (
        <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/70">{eyebrow}</p>
      ) : null}
      <h1
        className={`mt-2 font-cormorant text-[30px] font-bold leading-tight md:text-[36px] ${
          hideTitleOnMobile ? "hidden md:block" : ""
        }`}
      >
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-white/75">{description}</p>
      ) : null}
      {refreshing ? (
        <p className="mt-3 text-[11px] font-medium text-[#FFE7B8]">{refreshingLabel}</p>
      ) : null}
      {children}
    </section>
  );
}
