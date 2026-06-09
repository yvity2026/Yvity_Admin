"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaComment } from "react-icons/fa";
import { FiCheck, FiSearch, FiShield, FiUser } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useUsers } from "@/hooks/TanstankQuery/useUsers";

const SELECT_CLASS =
  "h-11 w-full rounded-2xl border border-[#D6E2DF] bg-white px-3 text-sm text-[#1E3E3C] outline-none transition-colors focus:border-[#0A4A4A]";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RequestTestimonialModal({
  onClose,
  initialUserType = "all",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [userType, setUserType] = useState(initialUserType);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useMemo(
    () => ({
      page: 1,
      limit: 8,
      q: appliedQuery,
      userType,
      status: "active",
    }),
    [appliedQuery, userType],
  );

  const { data, isLoading, isFetching } = useUsers(searchParams);
  const users = data?.data || [];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAppliedQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!selectedUser?.id) {
      setErrorMessage("Select a user from search results.");
      return;
    }

    setIsSubmittingRequest(true);

    try {
      const response = await fetch("/api/admin/testimonials/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          message,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setErrorMessage(json?.error || "Failed to send request.");
        toast.error(json?.error || "Failed to send request.");
        return;
      }

      toast.success(`Testimonial request sent to ${selectedUser.name}.`);
      onClose();
    } catch (error) {
      setErrorMessage(error?.message || "Failed to send request.");
      toast.error(error?.message || "Failed to send request.");
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#031818]/60 p-4 backdrop-blur-[3px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="flex max-h-[90vh] w-[95vw] max-w-xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbfa_100%)] shadow-[0_30px_90px_rgba(8,51,51,0.22)]"
      >
        <div className="relative shrink-0 overflow-hidden border-b border-[#E4ECEA] px-5 py-5 md:px-6">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(10,74,74,0.16),_transparent_70%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE1DC] bg-[#EEF7F4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0A4A4A]">
                <FaComment className="text-xs" />
                WhatsApp Request
              </span>
              <h2 className="mt-3 text-[24px] font-bold text-[#143534]">
                Request a testimonial
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5B7571]">
                Search and pick a user — mobile is resolved securely on the server.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="relative z-10 rounded-full bg-white p-2 text-[#496562] shadow-sm ring-1 ring-[#D7E5E1] transition-colors hover:bg-[#F4F8F7]"
            >
              <MdClose className="text-lg" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 md:px-6">
          <div className="rounded-[22px] border border-[#DCE7E4] bg-[linear-gradient(135deg,_#F0FAF7_0%,_#E8F5F2_100%)] p-4 text-sm leading-6 text-[#315450]">
            <div className="mb-2 flex items-center gap-2 font-semibold text-[#0A4A4A]">
              <FiShield size={15} />
              PII-safe individual send
            </div>
            Search by name, city, service, company, profession, or user ID. Only masked
            numbers appear here; WhatsApp uses the real mobile from the database.
          </div>

          {selectedUser ? (
            <div className="rounded-2xl border border-[#CFE1DC] bg-[#F4FAF8] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7A928D]">
                    Selected recipient
                  </p>
                  <p className="mt-1 text-base font-bold text-[#183534]">{selectedUser.name}</p>
                  <p className="mt-1 text-sm text-[#5C7571]">
                    {selectedUser.userTypeLabel} · {selectedUser.city || "—"} ·{" "}
                    {selectedUser.phoneMasked}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-full border border-[#D7E5E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#496562]"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AB0AB]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, city, service, company, or user ID"
                    className="h-11 w-full rounded-2xl border border-[#D6E2DF] bg-white pl-10 pr-4 text-sm text-[#1E3E3C] outline-none transition-colors focus:border-[#0A4A4A]"
                    autoFocus
                  />
                </div>

                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="all">All users</option>
                  <option value="customer">Customers</option>
                  <option value="professional">Professionals</option>
                </select>
              </div>

              <div className="rounded-2xl border border-[#E6ECEA] bg-white">
                {(isLoading || isFetching) && (
                  <p className="px-4 py-6 text-center text-sm text-[#7A928D]">Searching…</p>
                )}

                {!isLoading && !isFetching && users.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-[#7A928D]">
                    {appliedQuery
                      ? "No active users match this search."
                      : "Type a name or filter to find users."}
                  </p>
                )}

                {!isLoading &&
                  users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="flex w-full items-center justify-between gap-3 border-b border-[#F1F5F4] px-4 py-3 text-left transition last:border-b-0 hover:bg-[#F8FBFA]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#183534]">{user.name}</p>
                        <p className="mt-0.5 truncate text-xs text-[#7A928D]">
                          {user.userTypeLabel}
                          {user.plan !== "—" ? ` · ${user.plan}` : ""} · {user.city || "—"} ·{" "}
                          {formatDate(user.registeredAt)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-xs text-[#64748B]">{user.phoneMasked}</p>
                        <p className="text-[10px] text-[#9AB0AB]">{user.shortId}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </>
          )}

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-[#183A39]">
              Personal message <span className="text-[#7E9490]">(optional)</span>
            </label>
            <textarea
              rows={4}
              className="resize-none rounded-[22px] border border-[#D6E2DF] bg-white px-4 py-3 text-sm text-[#1E3E3C] outline-none transition-colors focus:border-[#0A4A4A]"
              placeholder="e.g. Hi Ravi, your feedback about YVITY would really help us improve."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="rounded-2xl border border-dashed border-[#C8D9D5] bg-[#FAFDFC] px-4 py-3 text-xs leading-6 text-[#58726E]">
            Shared link preview:{" "}
            <span className="font-semibold text-[#0A4A4A]">/testimonial</span>
          </div>

          {errorMessage ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#FFD7D7] bg-[#FFF5F5] px-4 py-3 text-sm text-[#C33A3A]"
            >
              {errorMessage}
            </motion.p>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-[#E4ECEA] px-5 py-5 md:px-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmittingRequest || !selectedUser}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0A4A4A] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#116060] hover:shadow-[0_14px_36px_rgba(10,74,74,0.22)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmittingRequest ? (
              "Sending…"
            ) : selectedUser ? (
              <>
                <FiCheck size={16} />
                Send to {selectedUser.name}
              </>
            ) : (
              <>
                <FiUser size={16} />
                Select a user first
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
