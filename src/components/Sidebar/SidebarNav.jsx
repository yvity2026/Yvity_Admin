"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { isNavItemActive } from "@/lib/admin/navConfig";

function sectionKey(section, index) {
  return section.sectionId || section.title || `section-${index}`;
}

function getDefaultOpenSections(sections, pathname) {
  const open = new Set();

  sections.forEach((section, index) => {
    if (!section.title) return;

    const hasActive = section.navitems.some((item) =>
      isNavItemActive(pathname, item),
    );

    if (hasActive) {
      open.add(sectionKey(section, index));
    }
  });

  if (open.size === 0) {
    const firstTitled = sections.findIndex((section) => section.title);
    if (firstTitled >= 0) {
      open.add(sectionKey(sections[firstTitled], firstTitled));
    }
  }

  return open;
}

function NavLink({
  item,
  pathname,
  collapsed,
  fallbackRoute,
  onNavigate,
  setTooltip,
}) {
  const isActive = isNavItemActive(pathname, item);

  return (
    <motion.div
      onMouseEnter={() =>
        setTooltip?.((prev) => ({
          ...prev,
          visible: true,
          text: item.label,
        }))
      }
      onMouseLeave={() =>
        setTooltip?.((prev) => ({ ...prev, visible: false }))
      }
      onMouseMove={(event) =>
        setTooltip?.((prev) => ({
          ...prev,
          x: event.clientX + 12,
          y: event.clientY + 12,
        }))
      }
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`group relative flex w-full cursor-pointer items-center rounded-xl transition-all duration-300
        ${collapsed ? "justify-center py-2" : "gap-3 px-3 py-2.5 max-md:min-h-[44px]"}
        ${
          isActive
            ? "bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/10"
            : "hover:bg-white/8"
        }
      `}
    >
      <Link
        href={item.link || fallbackRoute}
        onClick={onNavigate}
        className={`flex w-full items-center transition-colors duration-300
          ${collapsed ? "justify-center" : "gap-3"}
        `}
      >
        <span
          className={`text-lg transition-colors duration-300
            ${isActive ? "text-[#F59E0B]" : "text-[#8BBEBE] group-hover:text-white"}
          `}
        >
          {item.icon}
        </span>

        {!collapsed && (
          <span
            className={`whitespace-nowrap font-cormorant text-[16px] font-bold transition-colors duration-300
              ${isActive ? "text-white" : "text-[#B8D4D4] group-hover:text-white"}
            `}
          >
            {item.label}
          </span>
        )}
      </Link>

      {!collapsed && isActive ? (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#F59E0B]" />
      ) : null}
    </motion.div>
  );
}

function AccordionSection({
  section,
  sectionIndex,
  isOpen,
  onToggle,
  pathname,
  collapsed,
  fallbackRoute,
  onNavigate,
  setTooltip,
}) {
  const hasActive = section.navitems.some((item) =>
    isNavItemActive(pathname, item),
  );

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-9 w-full items-center justify-between rounded-xl px-3 text-left transition-colors duration-200
          ${isOpen || hasActive ? "bg-white/6" : "hover:bg-white/5"}
        `}
      >
        <span
          className={`font-cormorant text-[13px] font-bold uppercase tracking-[1px]
            ${hasActive ? "text-[#F59E0B]" : "text-[#8BBEBE]"}
          `}
        >
          {section.title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#8BBEBE]"
        >
          <FiChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-1 pl-1 pt-1">
              {section.navitems.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  fallbackRoute={fallbackRoute}
                  onNavigate={onNavigate}
                  setTooltip={setTooltip}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function SidebarNav({
  sections,
  pathname,
  collapsed,
  fallbackRoute,
  onNavigate,
  setTooltip,
}) {
  const [openSections, setOpenSections] = useState(() =>
    getDefaultOpenSections(sections, pathname),
  );

  const sectionKeys = useMemo(
    () => sections.map((section, index) => sectionKey(section, index)),
    [sections],
  );

  useEffect(() => {
    setOpenSections((previous) => {
      const next = new Set(previous);

      sections.forEach((section, index) => {
        if (!section.title) return;

        if (
          section.navitems.some((item) => isNavItemActive(pathname, item))
        ) {
          next.add(sectionKey(section, index));
        }
      });

      return next;
    });
  }, [pathname, sections]);

  const toggleSection = (key) => {
    setOpenSections((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (collapsed) {
    return (
      <div className="space-y-1 px-2">
        {sections.flatMap((section) =>
          section.navitems.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              pathname={pathname}
              collapsed={collapsed}
              fallbackRoute={fallbackRoute}
              onNavigate={onNavigate}
              setTooltip={setTooltip}
            />
          )),
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 px-3">
      {sections.map((section, index) => {
        const key = sectionKeys[index];

        if (!section.title) {
          return (
            <div key={key} className="mb-3 space-y-0.5">
              {section.navitems.map((item) => (
                <NavLink
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  fallbackRoute={fallbackRoute}
                  onNavigate={onNavigate}
                  setTooltip={setTooltip}
                />
              ))}
            </div>
          );
        }

        return (
          <AccordionSection
            key={key}
            section={section}
            sectionIndex={index}
            isOpen={openSections.has(key)}
            onToggle={() => toggleSection(key)}
            pathname={pathname}
            collapsed={collapsed}
            fallbackRoute={fallbackRoute}
            onNavigate={onNavigate}
            setTooltip={setTooltip}
          />
        );
      })}
    </div>
  );
}
