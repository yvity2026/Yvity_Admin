"use client";

import { STATUS_STYLES, formatCaseDate, RowActions } from "./caseTableShared";

export default function ReportsTable({ items = [], onOpen, onAssign, onResolve, isProcessing }) {
  if (!items.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-4 py-10 text-center text-sm text-[#7A928D]">
        No profile, review, service, or user reports match these filters.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="hidden lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Reported item</th>
              <th className="px-5 py-4">Reported by</th>
              <th className="px-5 py-4">Reason</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#F3F6F5] last:border-0">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#183534]">{item.reportedItemLabel}</p>
                  <p className="text-[12px] text-[#7A928D]">{item.reportSubtypeLabel}</p>
                </td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{item.reporterName}</td>
                <td className="px-5 py-4 text-sm text-[#35504C]">{item.reasonLabel}</td>
                <td className="px-5 py-4 text-sm text-[#5C7571]">{formatCaseDate(item.createdAt)}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[item.status] || STATUS_STYLES.open}`}
                  >
                    {item.statusLabel}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <RowActions
                    item={item}
                    onOpen={onOpen}
                    onAssign={onAssign}
                    onResolve={onResolve}
                    isProcessing={isProcessing}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#F3F6F5] lg:hidden">
        {items.map((item) => (
          <div key={item.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#183534]">{item.reportedItemLabel}</p>
                <p className="text-[12px] text-[#7A928D]">{item.reportSubtypeLabel}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[item.status] || STATUS_STYLES.open}`}
              >
                {item.statusLabel}
              </span>
            </div>
            <p className="text-[12px] text-[#5C7571]">
              {item.reporterName} · {item.reasonLabel} · {formatCaseDate(item.createdAt)}
            </p>
            <RowActions
              item={item}
              onOpen={onOpen}
              onAssign={onAssign}
              onResolve={onResolve}
              isProcessing={isProcessing}
              stacked
            />
          </div>
        ))}
      </div>
    </div>
  );
}
