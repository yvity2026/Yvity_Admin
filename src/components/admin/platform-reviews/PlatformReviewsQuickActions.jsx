"use client";

import { FiEyeOff, FiSend, FiStar, FiUsers } from "react-icons/fi";

export default function PlatformReviewsQuickActions({
  onSendRequest,
  onSendBulk,
  onFilterPending,
  onFilterHidden,
}) {
  const actions = [
    {
      id: "send",
      label: "Send testimonial request",
      icon: FiSend,
      onClick: onSendRequest,
      accent: "bg-[#0A4A4A] text-white hover:bg-[#0D6060]",
    },
    {
      id: "bulk",
      label: "Send bulk testimonial request",
      icon: FiUsers,
      onClick: onSendBulk,
      accent: "border border-[#0A4A4A]/20 bg-[#F4F8F7] text-[#0A4A4A] hover:bg-[#E8F5F0]",
    },
    {
      id: "pending",
      label: "Pending approval",
      icon: FiStar,
      onClick: onFilterPending,
      accent: "border border-[#F59E0B]/30 bg-[#FFF9F0] text-[#B45309] hover:bg-[#FFF6E8]",
    },
    {
      id: "hidden",
      label: "Hidden reviews",
      icon: FiEyeOff,
      onClick: onFilterHidden,
      accent: "border border-[#E6ECEA] bg-white text-[#64748B] hover:bg-[#F8FAFC]",
    },
  ];

  return (
    <section className="rounded-[24px] border border-[#E6ECEA] bg-white p-4 shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <p className="mb-3 font-poppins text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
        Quick actions
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${action.accent}`}
            >
              <Icon size={14} />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
