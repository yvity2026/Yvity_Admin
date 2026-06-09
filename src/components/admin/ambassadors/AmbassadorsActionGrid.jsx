"use client";

import Link from "next/link";
import toast from "react-hot-toast";

export default function AmbassadorsActionGrid({ cards = [], onAction }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((card) => {
        const className =
          "group flex min-h-[110px] w-full flex-col justify-between rounded-[22px] border border-[#E6ECEA] bg-[#FCFDFC] p-4 text-left transition hover:border-[#0A4A4A]/20 hover:bg-white hover:shadow-[0_10px_28px_rgba(10,74,74,0.08)]";

        const content = (
          <>
            <span className="text-[24px] leading-none" aria-hidden>
              {card.emoji}
            </span>
            <div>
              <p className="font-cormorant text-[18px] font-bold text-[#0A4A4A]">{card.label}</p>
              <p className="mt-1 text-[12px] font-medium text-[#7A928D]">{card.description}</p>
            </div>
          </>
        );

        if (card.action) {
          return (
            <button
              key={card.id}
              type="button"
              className={className}
              onClick={() => {
                if (onAction) {
                  onAction(card);
                  return;
                }
                toast.error("This action is not available right now.");
              }}
            >
              {content}
            </button>
          );
        }

        if (card.href?.startsWith("#")) {
          return (
            <a key={card.id} href={card.href} className={className}>
              {content}
            </a>
          );
        }

        if (card.href) {
          return (
            <Link key={card.id} href={card.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <div key={card.id} className={`${className} opacity-60`}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
