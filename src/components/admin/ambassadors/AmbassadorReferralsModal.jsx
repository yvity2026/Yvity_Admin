"use client";

import { useEffect, useState } from "react";
import AdminModal from "@/components/admin/ui/AdminModal";

export default function AmbassadorReferralsModal({ ambassador, onClose }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ambassador?.userId) return;
    setLoading(true);
    void fetch("/api/admin/ambassadors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get_ambassador_referrals",
        userId: ambassador.userId,
      }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) setReferrals(json.referrals || []);
      })
      .finally(() => setLoading(false));
  }, [ambassador?.userId]);

  if (!ambassador) return null;

  return (
    <AdminModal
      open={Boolean(ambassador)}
      onClose={onClose}
      eyebrow="Referrals"
      title={ambassador.name}
      size="md"
    >
      {loading ? (
        <p className="text-sm text-[#7A928D]">Loading referrals…</p>
      ) : referrals.length === 0 ? (
        <p className="text-sm text-[#7A928D]">No referrals yet.</p>
      ) : (
        <div className="space-y-2">
          {referrals.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#EEF2F0] bg-[#FCFDFC] px-3 py-3"
            >
              <div>
                <p className="font-semibold text-[#183534]">{row.referredUserName}</p>
                <p className="text-[11px] capitalize text-[#7A928D]">{row.status}</p>
              </div>
              <div className="text-right text-[11px] text-[#7A928D]">
                <p>{row.planPurchased || (row.status === "registered" ? "Free" : "—")}</p>
                <p>
                  {row.registeredAt
                    ? new Date(row.registeredAt).toLocaleDateString("en-IN")
                    : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminModal>
  );
}
