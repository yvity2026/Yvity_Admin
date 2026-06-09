"use client";

import Link from "next/link";

export default function ProductsPlansActionGrid({ cards = [] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={card.href}
          className="group flex min-h-[120px] flex-col justify-between rounded-[22px] border border-[#E6ECEA] bg-[#FCFDFC] p-4 transition hover:border-[#0A4A4A]/20 hover:bg-white hover:shadow-[0_10px_28px_rgba(10,74,74,0.08)]"
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-[26px] leading-none" aria-hidden>
              {card.emoji}
            </span>
            {card.badge > 0 ? (
              <span className="admin-num rounded-full bg-[#FFF6E8] px-2 py-0.5 text-[10px] font-bold text-[#B45309] ring-1 ring-[#F59E0B]/20">
                {card.badge}
              </span>
            ) : null}
          </div>
          <div>
            <p className="font-cormorant text-[20px] font-bold uppercase tracking-wide text-[#0A4A4A]">
              {card.label}
            </p>
            <p className="mt-1 text-[12px] font-medium text-[#7A928D]">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
