"use client";

import Link from "next/link";
import { HERO_SLOT_LIMIT, LANDING_SLOT_LIMIT } from "@/lib/admin/visibility/limits";

const PRODUCT_META = {
  hero_placement: {
    emoji: "⭐",
    slotLabel: `${HERO_SLOT_LIMIT} slots`,
    accent: "border-[#F59E0B]/35 bg-gradient-to-br from-[#FFFBEB] to-white",
    manageHref: "/admin/visibility-controls",
  },
  find_advisors_placement: {
    emoji: "🔍",
    slotLabel: `${LANDING_SLOT_LIMIT} slots`,
    accent: "border-[#0A4A4A]/15 bg-gradient-to-br from-[#E8F4F3] to-white",
    manageHref: "/admin/visibility-controls",
  },
};

function formatInr(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export default function FeaturedPlacementPricing({ products = [], onEdit }) {
  if (!products.length) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[#E6ECEA] bg-[#FAFCFB] px-4 py-3 text-sm text-[#5C7571]">
        Featured placements are <strong className="text-[#183534]">separate paid products</strong> —
        not included in subscription plans. Set prices here; assign slots from{" "}
        <Link href="/admin/visibility-controls" className="font-semibold text-[#0A4A4A] underline">
          Visibility controls
        </Link>
        ; send payment links from{" "}
        <Link href="/admin/payments" className="font-semibold text-[#0A4A4A] underline">
          Payments
        </Link>
        .
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => {
          const meta = PRODUCT_META[product.id] || {
            emoji: "📌",
            slotLabel: "Limited slots",
            accent: "border-[#E6ECEA] bg-white",
            manageHref: "/admin/visibility-controls",
          };

          return (
            <article
              key={product.id}
              className={`rounded-[24px] border p-5 shadow-[0_8px_30px_rgba(10,74,74,0.04)] ${meta.accent}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                    Featured product
                  </p>
                  <h3 className="mt-1 flex items-center gap-2 font-cormorant text-2xl font-bold text-[#183534]">
                    <span aria-hidden>{meta.emoji}</span>
                    {product.name}
                  </h3>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    product.status === "active"
                      ? "bg-[#E8F5F0] text-[#1A7A5A]"
                      : "bg-[#F8FAFC] text-[#64748B]"
                  }`}
                >
                  {product.statusLabel}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#5C7571]">{product.description}</p>

              <div className="mt-4">
                {product.hasDiscount ? (
                  <div className="flex flex-wrap items-end gap-2">
                    <p className="text-sm text-[#94A3B8] line-through">{product.listPriceLabel}</p>
                    <p className="text-2xl font-bold text-[#183534]">{product.priceLabel}</p>
                    <span className="rounded-full bg-[#FFFBEB] px-2 py-0.5 text-[10px] font-semibold text-[#B45309]">
                      {product.discountPercent}% off
                    </span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-[#183534]">{product.priceLabel}</p>
                )}
                <p className="mt-1 text-[12px] text-[#7A928D]">
                  {product.durationDays}-day term · {meta.slotLabel}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(product)}
                  className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
                >
                  Edit pricing
                </button>
                <Link
                  href={meta.manageHref}
                  className="rounded-xl border border-[#D7E5E1] bg-white px-3 py-2 text-[11px] font-semibold text-[#35504C]"
                >
                  Manage slots
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
        <div className="mobile-scroll-x">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">List price</th>
                <th className="px-5 py-4">Sale price</th>
                <th className="px-5 py-4">Term</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#F3F6F5] last:border-0">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#183534]">{product.name}</p>
                    <p className="text-[12px] text-[#7A928D]">{product.id}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5C7571]">
                    {formatInr(product.listPriceInr)}
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-[#0A4A4A]">
                    {formatInr(product.salePriceInr)}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5C7571]">
                    {product.durationDays} days
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        product.status === "active"
                          ? "bg-[#E8F5F0] text-[#1A7A5A]"
                          : "bg-[#F8FAFC] text-[#64748B]"
                      }`}
                    >
                      {product.statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit?.(product)}
                      className="rounded-xl bg-[#0A4A4A] px-3 py-2 text-[11px] font-semibold text-white"
                    >
                      Edit pricing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
