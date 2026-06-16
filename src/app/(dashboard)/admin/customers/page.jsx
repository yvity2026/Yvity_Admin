"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CustomerProfile from "@/components/CustomerProfile";
import PaginationControls from "@/components/common/PaginationControls";
import { FiUsers, FiUser } from "react-icons/fi";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const CUSTOMERS_PER_PAGE = 10;

function buildPagination(page, limit, total) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startItem = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const endItem = Math.min(safePage * limit, total);
  const DOTS = "...";

  function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  let pageNumbers;
  if (totalPages <= 7) {
    pageNumbers = range(1, totalPages);
  } else {
    const left = Math.max(safePage - 1, 1);
    const right = Math.min(safePage + 1, totalPages);
    const showLeftDots = left > 2;
    const showRightDots = right < totalPages - 1;
    if (!showLeftDots && showRightDots) {
      pageNumbers = [...range(1, 5), DOTS, totalPages];
    } else if (showLeftDots && !showRightDots) {
      pageNumbers = [1, DOTS, ...range(totalPages - 4, totalPages)];
    } else {
      pageNumbers = [1, DOTS, ...range(left, right), DOTS, totalPages];
    }
  }

  return {
    currentPage: safePage,
    totalPages,
    totalItems: total,
    startItem,
    endItem,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
    pageNumbers,
  };
}

function Avatar({ src, initials, size = "md" }) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} relative rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold shrink-0 overflow-hidden`}
    >
      {src ? (
        <Image
          src={src}
          alt={initials || "Customer"}
          fill
          sizes="40px"
          unoptimized
          className="object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function CustomersDashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage,
          limit: CUSTOMERS_PER_PAGE,
        });
        if (debouncedSearch) params.set("q", debouncedSearch);
        const res = await fetch(`/api/admin/customers?${params}`);
        const json = await res.json();
        setCustomers(json.data || []);
        setTotal(json.pagination?.total || 0);
        setTotalPages(json.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [currentPage, debouncedSearch]);

  const pagination = buildPagination(currentPage, CUSTOMERS_PER_PAGE, total);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100 overflow-x-hidden w-full">

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1 — STAT CARDS
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 bg-gray-100 px-6 max-md:px-3.5 pt-6 max-md:pt-3.5 pb-3 shrink-0 w-full">
        <div className="flex flex-col sm:flex-row gap-4 max-w-[280px] sm:max-w-full">

          {/* Total Customers */}
          <div className="bg-white rounded-2xl p-3 shadow-sm flex-1 min-w-[160px] max-w-[240px] max-md:max-w-full">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#eef4f2] flex items-center justify-center shrink-0">
                <FiUsers size={22} stroke="#1a7a5a" strokeWidth={2} />
              </div>
            </div>
            <div className="text-[28px] max-md:text-2xl font-extrabold text-gray-900 leading-tight">
              {loading ? "—" : total}
            </div>
            <div className="text-xs text-gray-400 mt-0.5 font-medium">
              Total Customers
            </div>
          </div>

        </div>
      </div>

      <div className="flex-1 px-6 max-md:px-3.5 pb-6 max-md:pb-3.5 w-full overflow-x-hidden">

        {/* Sub-header */}
        <div className="flex items-center gap-2 mb-1 mt-1">
          <FiUser size={18} stroke="#374151" strokeWidth={2} />
          <span className="text-base font-bold text-gray-900">All Customers</span>
        </div>
        <div className="text-xs text-gray-400 mb-4">
          {loading ? "Loading…" : `${total} registered users`}
        </div>

        {/* Search */}
        <div className="mb-5">
          <div className="flex items-center bg-[#0A4A4A] rounded-full px-6 gap-2.5 h-12">
            <input
              className="border-none bg-transparent outline-none text-sm text-white flex-1 placeholder-white/70"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <HiOutlineArrowNarrowRight size={20} className="text-white cursor-pointer shrink-0" />
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm">

          {/* Mobile swipe hint */}
          <div className="md:hidden text-[10px] text-gray-400 text-center px-3 py-1.5 border-b border-gray-100">
            ← swipe left / right to see all columns →
          </div>

          <div
            className="overflow-x-auto w-full"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Name", "Mobile", "Email", "City", "Profession", "Reviews", "Last Login", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-3 py-2.5 bg-gray-50 border-b border-gray-200 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-500">
                      Loading customers…
                    </td>
                  </tr>
                )}

                {!loading && customers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-gray-500">
                      No customers match the current search.
                    </td>
                  </tr>
                )}

                {!loading && customers.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-3 align-middle">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          src={c.profile_pic}
                          initials={
                            c.name
                              ? c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                              : "??"
                          }
                          size="sm"
                        />
                        <span className="font-semibold text-gray-900 text-[13px] whitespace-nowrap">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.phone ? `+91 ${c.phone}` : "—"}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.email || "—"}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.location || "—"}</td>
                    <td className="px-3 py-3 text-xs text-gray-700 align-middle whitespace-nowrap">{c.profession || "—"}</td>
                    <td className="px-3 py-3 align-middle">
                      <span className="bg-green-100 text-green-800 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap">
                        {`${c.reviewCount} review`}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">{formatDate(c.lastLogin)}</td>
                    <td className="px-3 py-3 text-xs text-gray-500 align-middle whitespace-nowrap">{formatDate(c.joinedAt)}</td>
                    <td className="px-3 py-3 align-middle">
                      <button
                        onClick={() => {
                          setSelectedCustomer(c);
                          setShowCustomerModal(true);
                        }}
                        className="bg-[#0A4A4A] hover:bg-[#155e5e] text-white px-3 py-1 rounded-md text-xs font-medium cursor-pointer border-none"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-3 sm:px-4 lg:px-5">
            <PaginationControls
              pagination={pagination}
              onPageChange={setCurrentPage}
              label="customers"
            />
          </div>
        </div>

      </div>

      {showCustomerModal && (
        <CustomerProfile
          customer={selectedCustomer}
          onClose={() => {
            setShowCustomerModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}
