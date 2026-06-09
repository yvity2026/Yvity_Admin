"use client";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PaymentLinksPanel({ links = [], onCopy }) {
  if (!links.length) return null;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-cormorant text-xl font-bold text-[#0A4A4A]">Recent payment links</h2>
        <p className="mt-1 text-sm text-[#5C7571]">Links you generated from admin — pending until paid.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <article
            key={link.id}
            className="rounded-[20px] border border-[#E6ECEA] bg-white p-4 shadow-[0_4px_20px_rgba(10,74,74,0.03)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#183534]">{link.advisorName}</p>
                <p className="text-[12px] text-[#7A928D]">
                  {link.planLabel} · {link.amountLabel}
                </p>
              </div>
              <span className="rounded-full bg-[#FFFBEB] px-2 py-1 text-[10px] font-bold uppercase text-[#B45309]">
                {link.status}
              </span>
            </div>
            {link.couponCode ? (
              <p className="mt-2 font-mono text-[11px] text-[#0A4A4A]">Coupon: {link.couponCode}</p>
            ) : null}
            <p className="mt-2 text-[11px] text-[#7A928D]">
              Created {formatDate(link.createdAt)} · expires {formatDate(link.expiresAt)}
            </p>
            <button
              type="button"
              onClick={() => onCopy?.(link.shareUrl)}
              className="mt-3 rounded-xl border border-[#D7E5E1] px-3 py-2 text-[11px] font-semibold text-[#35504C]"
            >
              Copy link
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
