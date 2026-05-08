"use client";
import { useState, useEffect } from "react";
import PaymentDetails from "@/components/Paymentdetails";
import Link from "next/link";
import { usePayments } from "@/hooks/TanstankQuery/usePayment";
import PaymentsSkeleton from "./loading";
import Image from "next/image";

const transactions = [
  { id: 1, initials: "KM", avatarBg: "bg-[#E8833A]", name: "Krishna Mohan", location: "Nellore, AP", plan: "Gold",   amount: "₹2,999", method: "UPI",        date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
  { id: 2, initials: "PS", avatarBg: "bg-[#3AAFA9]", name: "Priya Sharma",  location: "Nellore, AP", plan: "Gold",   amount: "₹2,999", method: "Card",        date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
  { id: 3, initials: "PS", avatarBg: "bg-[#3AAFA9]", name: "Priya Sharma",  location: "Hyderabad",   plan: "Silver", amount: "₹2,999", method: "Net Banking", date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
  { id: 4, initials: "PS", avatarBg: "bg-[#3AAFA9]", name: "Priya Sharma",  location: "Nellore, AP", plan: "Gold",   amount: "₹2,999", method: "Card",        date: "Jan 2, 2026", txnId: "TXN2025010501", status: "Sucess" },
];

function Avatar({ initials, size = "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${sizeClass} rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}



function PlanBadge({ plan }) {
  const isGold = plan === "gold";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${isGold ? "text-yellow-800 bg-yellow-100 border-yellow-200" : "text-slate-600 bg-slate-100 border-slate-300"}`}>
      {isGold ? "🏅" : "🥈"} {plan}
    </span>
  );
}

export default function PaymentsDashboard() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeNav, setActiveNav]             = useState("Payments");
  const [search, setSearch]                   = useState("");
  const [showSidebar, setShowSidebar]         = useState(false);
  // const [transactions, setTransactions] = useState([]);
  // const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

    const {
    data,
    isLoading,
    error,
  } = usePayments();
const transactions = data?.data || [];
const stats = data?.revenue || {};

  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch("/api/admin/payments");
  //       if (!res.ok) throw new Error("Failed to fetch payments");
  //       const { data, revenue } = await res.json();
  //       setTransactions(data || []);
  //       setStats(revenue || null)
  //     } catch (err) {
  //       console.error(err);
  //       setError("Unable to load payments.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTransactions();
  // }, []);

  const filtered = transactions.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.txnId?.toLowerCase().includes(search.toLowerCase()) ||
      t.method?.toLowerCase().includes(search.toLowerCase())
  );

    if (isLoading) {
    return (
      <PaymentsSkeleton />
    );
  }

  return (
    <div className="flex min-h-screen font-sans bg-[#EDEEE6]">

      {/* Mobile overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/45 z-40 md:hidden" onClick={() => setShowSidebar(false)} />
      )}


      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">


        {/* Body */}
        <main className="flex-1 overflow-y-auto p-[22px_26px] max-md:p-3.5">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">

            {/* Revenue This Month */}
            <div className="bg-white rounded-2xl p-[16px_18px] border border-[#E3E6DC] flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-2">
                  ↑ 18%
                </span>
                <div className="text-[22px] font-extrabold text-[#1A2B22] leading-tight">{stats?.thisMonth}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 font-medium">Revenue This Month</div>
              </div>
              <div className="w-[38px] h-[38px] rounded-xl bg-orange-50 flex items-center justify-center text-[19px]">💰</div>
            </div>

            {/* Gold Plan Revenue */}
            <div className="bg-white rounded-2xl p-[16px_18px] border border-[#E3E6DC] flex justify-between items-start">
              <div className="pt-[22px]">
                <div className="text-[22px] font-extrabold text-[#1A2B22] leading-tight">{stats?.goldPlan}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 font-medium">Gold Plan Revenue</div>
              </div>
              <div className="w-[38px] h-[38px] rounded-xl bg-yellow-50 flex items-center justify-center text-[19px]">🏅</div>
            </div>

            {/* Silver Plan Revenue */}
            <div className="bg-white rounded-2xl p-[16px_18px] border border-[#E3E6DC] flex justify-between items-start">
              <div className="pt-[22px]">
                <div className="text-[22px] font-extrabold text-[#1A2B22] leading-tight">{stats?.silverPlan}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 font-medium">Silver Plan Revenue</div>
              </div>
              <div className="w-[38px] h-[38px] rounded-xl bg-slate-50 flex items-center justify-center text-[19px]">🥈</div>
            </div>
          </div>

          {/* Recent Transactions panel */}
          <div className="bg-white rounded-2xl border border-[#E3E6DC] p-[18px_22px]">

            {/* Panel title */}
            <div className="flex items-center gap-2 mb-3.5">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#1C3829" strokeWidth="1.8" strokeLinecap="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="#1C3829" strokeWidth="1.8" />
                <line x1="9" y1="12" x2="15" y2="12" stroke="#1C3829" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="9" y1="16" x2="13" y2="16" stroke="#1C3829" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="font-bold text-[13px] text-[#1A2B22]">Recent Transactions</span>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-3 mb-4 items-stretch md:items-center">
              <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 flex-1 h-12">
                <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.45)" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="M21 21l-4.35-4.35" strokeWidth="2" />
                </svg>
                <input
                  type="text"
                  className="border-none bg-transparent outline-none text-[13px] text-white flex-1 min-w-0 placeholder-white/70"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="text-white text-lg cursor-pointer shrink-0">→</div>
              </div>
            </div>

            {/* Mobile scroll hint */}
            <div className="md:hidden text-[11px] text-gray-400 text-right mb-1">
              ← Scroll to see all columns →
            </div>

            {/* Table */}
            <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
              <table className="min-w-[750px] w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#E3E6DC]">
                    {["Adviser", "Plan", "Amount", "Method", "Date", "Txn Id", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left pb-2.5 pr-3 text-[10px] font-bold text-gray-400 tracking-[0.07em] uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn, i) => (
                    <tr
                      key={txn.id}
                      className={`hover:bg-gray-50 ${i < filtered.length - 1 ? "border-b border-[#F3F6F0]" : ""}`}
                    >
                      {/* Adviser */}
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <div className="w-[30px] h-[30px] rounded-full overflow-hidden shrink-0 relative bg-gray-200">
  <Image
    src={txn.profile_pic || "/default-avatar.png"}
    alt={txn.name || "User"}
    fill
    className="object-cover"
  />
</div>
                          <div>
                            <div className="text-xs font-semibold text-[#1A2B22]">{txn.name}</div>
                            <div className="text-[10px] text-gray-400">{txn.location}</div>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="pr-3"><PlanBadge plan={txn.plan} /></td>

                      {/* Amount */}
                      <td className="pr-3 text-xs font-semibold text-[#1A2B22]">{txn.amount}</td>

                      {/* Method */}
                      <td className="pr-3 text-xs text-gray-500">{txn.method}</td>

                      {/* Date */}
                      <td className="pr-3 text-xs text-gray-500">{txn.date}</td>

                      {/* Txn ID */}
                      <td className="pr-3 text-[11px] text-gray-400 font-mono">{`TXN${txn.txn_id}`}</td>

                      {/* Status */}
                      <td className="pr-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-800 bg-green-100 border border-green-300 px-2.5 py-0.5 rounded-full">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="#166534" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {txn.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <button
                          onClick={() => setSelectedPayment(txn)}
                          className="bg-[#0A4A4A] hover:bg-[#155e5e] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-7 text-gray-400 text-[13px]">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedPayment && (
        <PaymentDetails data={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
}
