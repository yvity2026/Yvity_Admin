"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowLeft, FiChevronRight } from "react-icons/fi";
import { isNavItemActive } from "@/lib/admin/navConfig";

const SECTION_STYLES = {
  dashboard: {
    label: "Dashboard",
    gradient: "from-[#0A4A4A] to-[#0D6060]",
    accent: "bg-[#E8F4F3] text-[#0A4A4A]",
  },
  userManagement: {
    label: "User Management",
    gradient: "from-[#0A4A4A] to-[#107171]",
    accent: "bg-[#E8F4F3] text-[#0A4A4A]",
  },
  profileManagement: {
    label: "Profile Management",
    gradient: "from-[#0D6060] to-[#0A4A4A]",
    accent: "bg-[#FFF6E8] text-[#B45309]",
  },
  productsPlans: {
    label: "Plans and Pricing",
    gradient: "from-[#B45309] to-[#D97706]",
    accent: "bg-[#FFF6E8] text-[#B45309]",
  },
  ambassadors: {
    label: "Ambassador Program",
    gradient: "from-[#0A4A4A] to-[#53807E]",
    accent: "bg-[#E8F4F3] text-[#0A4A4A]",
  },
  administration: {
    label: "Administration",
    gradient: "from-[#334155] to-[#0A4A4A]",
    accent: "bg-[#F1F5F9] text-[#334155]",
  },
};

function getSectionStyle(section) {
  return (
    SECTION_STYLES[section.sectionId] || {
      label: section.title || "Menu",
      gradient: "from-[#0A4A4A] to-[#0D6060]",
      accent: "bg-[#E8F4F3] text-[#0A4A4A]",
    }
  );
}

export default function MobileMenuHub({
  open,
  onClose,
  sections,
  pathname,
  currentPageTitle = "Dashboard",
  currentSectionLabel = null,
  currentSectionId = null,
}) {
  const [activeSectionId, setActiveSectionId] = useState(null);

  useEffect(() => {
    if (!open) {
      setActiveSectionId(null);
    }
  }, [open]);

  const activeSection = sections.find(
    (section) => section.sectionId === activeSectionId,
  );

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#0A4A4A]/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[80] flex max-h-[min(88dvh,720px)] flex-col overflow-hidden rounded-t-[28px] bg-[#F8F6F1] shadow-[0_-20px_60px_rgba(10,74,74,0.22)] md:hidden"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <div className="flex shrink-0 items-center justify-center py-3">
              <span className="h-1 w-12 rounded-full bg-[#E4E2DB]" />
            </div>

            <div className="flex shrink-0 items-center justify-between px-5 pb-3">
              {activeSection ? (
                <button
                  type="button"
                  onClick={() => setActiveSectionId(null)}
                  className="flex items-center gap-2 font-cormorant text-lg font-bold text-[#0A4A4A]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-[#E4E2DB]">
                    <FiArrowLeft size={18} />
                  </span>
                  {getSectionStyle(activeSection).label}
                </button>
              ) : (
                <div>
                  <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
                    Explore
                  </p>
                  <h2 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">
                    Admin sections
                  </h2>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0A4A4A] shadow-sm ring-1 ring-[#E4E2DB]"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
              <AnimatePresence mode="wait">
                {!activeSection ? (
                  <motion.div
                    key="sections"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="space-y-3"
                  >
                    {currentSectionId ? (
                      <button
                        type="button"
                        onClick={() => setActiveSectionId(currentSectionId)}
                        className="flex w-full items-center justify-between rounded-[18px] bg-white px-4 py-3 text-left shadow-[0_6px_20px_rgba(10,74,74,0.07)] ring-1 ring-[#F59E0B]/40"
                      >
                        <div className="min-w-0">
                          <p className="font-poppins text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                            Current section
                          </p>
                          <p className="truncate font-cormorant text-base font-bold text-[#0A4A4A]">
                            {currentSectionLabel || "Open section"}
                          </p>
                        </div>
                        <FiChevronRight className="shrink-0 text-[#8BBEBE]" size={16} />
                      </button>
                    ) : null}

                    <div className="grid grid-cols-2 gap-3">
                    {sections.map((section) => {
                      const style = getSectionStyle(section);
                      const count = section.navitems.length;

                      if (count === 1 && section.sectionId === "dashboard") {
                        const item = section.navitems[0];
                        const active = isNavItemActive(pathname, item);

                        return (
                          <Link
                            key={section.sectionId}
                            href={item.link}
                            onClick={onClose}
                            className={`col-span-2 overflow-hidden rounded-[22px] bg-gradient-to-br ${style.gradient} p-4 text-white shadow-lg ${
                              active ? "ring-2 ring-[#F59E0B]" : ""
                            }`}
                          >
                            <p className="font-poppins text-[11px] uppercase tracking-wide text-white/70">
                              Quick access
                            </p>
                            <p className="mt-1 font-cormorant text-xl font-bold">{item.label}</p>
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={section.sectionId}
                          type="button"
                          onClick={() => setActiveSectionId(section.sectionId)}
                          className="overflow-hidden rounded-[22px] bg-white p-4 text-left shadow-[0_8px_24px_rgba(10,74,74,0.08)] ring-1 ring-[#E4E2DB]/80 active:scale-[0.98]"
                        >
                          <div
                            className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${style.accent}`}
                          >
                            {count} links
                          </div>
                          <p className="font-cormorant text-lg font-bold leading-tight text-[#0A4A4A]">
                            {style.label}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[#7A928D]">
                            <span className="font-poppins text-[11px]">Open section</span>
                            <FiChevronRight size={14} />
                          </div>
                        </button>
                      );
                    })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeSection.sectionId}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {activeSection.navitems.map((item) => {
                      const active = isNavItemActive(pathname, item);

                      return (
                        <Link
                          key={item.id}
                          href={item.link}
                          onClick={onClose}
                          className={`flex items-center gap-3 rounded-[20px] bg-white p-4 shadow-[0_6px_20px_rgba(10,74,74,0.07)] ring-1 transition-transform active:scale-[0.98] ${
                            active
                              ? "ring-[#F59E0B] bg-[#FFFBF5]"
                              : "ring-[#E4E2DB]/80"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg ${
                              active
                                ? "bg-[#0A4A4A] text-[#F59E0B]"
                                : "bg-[#E8F4F3] text-[#0A4A4A]"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-cormorant text-base font-bold text-[#0A4A4A]">
                              {item.label}
                            </p>
                            <p className="font-poppins text-[11px] text-[#7A928D]">
                              Tap to open
                            </p>
                          </div>
                          <FiChevronRight className="shrink-0 text-[#8BBEBE]" size={16} />
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
