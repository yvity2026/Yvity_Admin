"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function PriorityModal({
  onClose,
  advisor,
  landingCount,
  heroCount,
  onUpdated,
  initialHero = false,
  initialLan = false,
}) {
  const [hero, setHero] = useState(initialHero);
  const [lan, setLan] = useState(initialLan);

  const [loadingType, setLoadingType] = useState(null);

  const [limitModal, setLimitModal] = useState({
    open: false,
    type: "",
    existingMembers: [],
  });

  // =========================================================
  // SAFETY
  // =========================================================

  if (!advisor) return null;

  // =========================================================
  // API CALL
  // =========================================================

  const updatePriority = async ({ type, value, replaceAdvisorId = null }) => {
    try {
      setLoadingType(type);

      // =====================================================
      // BUILD PAYLOAD
      // =====================================================

      let payload = {
        advisorId: advisor.id,
      };

      if (type === "hero") {
        payload.is_hero = value;
        payload.is_landing = lan;
      }

      if (type === "lan") {
        payload.is_hero = hero;
        payload.is_landing = value;
      }

      // =====================================================
      // IF REPLACING MEMBER
      // =====================================================

      if (replaceAdvisorId) {
        payload.replaceAdvisorId = replaceAdvisorId;
        payload.priorityType = type;
      }

      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      // =====================================================
      // LIMIT REACHED
      // =====================================================

      if (res.status === 409) {
        setLimitModal({
          open: true,
          type,
          existingMembers: result.members || [],
        });

        toast.error(`${type === "hero" ? "Hero" : "LAN"} limit reached`);

        return false;
      }

      if (!res.ok) {
        throw new Error(result.error || "Failed to update priority");
      }

      toast.success(`${type === "hero" ? "Hero" : "LAN"} updated successfully`);
      await onUpdated?.();

      return true;
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Something went wrong");

      return false;
    } finally {
      setLoadingType(null);
    }
  };

  // =========================================================
  // TOGGLE HANDLER
  // =========================================================

  const handleToggle = async (type) => {
    const isHero = type === "hero";

    const currentState = isHero ? hero : lan;

    const setter = isHero ? setHero : setLan;

    // optimistic update
    setter(!currentState);

    const success = await updatePriority({
      type,
      value: !currentState,
    });

    // rollback
    if (!success) {
      setter(currentState);
    }
  };

  // =========================================================
  // REPLACE MEMBER
  // =========================================================

  const replaceMember = async (memberId) => {
    try {
      setLoadingType(limitModal.type);

      const success = await updatePriority({
        type: limitModal.type,
        value: true,
        replaceAdvisorId: memberId,
      });

      if (!success) {
        throw new Error("Replacement failed");
      }

      if (limitModal.type === "hero") {
        setHero(true);
      }

      if (limitModal.type === "lan") {
        setLan(true);
      }

      setLimitModal({
        open: false,
        type: "",
        existingMembers: [],
      });

      toast.success("Priority replaced successfully");
      await onUpdated?.();
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to replace advisor");

      if (limitModal.type === "hero") {
        setHero(false);
      }

      if (limitModal.type === "lan") {
        setLan(false);
      }
    } finally {
      setLoadingType(null);
    }
  };

  // =========================================================
  // TOGGLE
  // =========================================================

  const Toggle = ({ active, onClick, color, disabled }) => {
    return (
      <motion.button
        whileTap={{ scale: 0.94 }}
        disabled={disabled}
        onClick={onClick}
        className={`relative w-14 h-7 rounded-full transition overflow-hidden ${
          active ? color : "bg-gray-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
          style={{
            left: active ? "calc(100% - 24px)" : "4px",
          }}
        />
      </motion.button>
    );
  };

  return (
    <>
      {/* MAIN MODAL */}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.22 }}
          className="relative w-full max-w-md rounded-[28px] bg-[#f8f8f8] shadow-2xl overflow-hidden"
        >
          {/* Header */}

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#fff3dc] flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#c57a00"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </div>

              <h2 className="text-[24px] font-bold text-[#1a3330]">Priority</h2>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
            >
              ✕
            </button>
          </div>

          {/* BODY */}

          <div className="px-6 py-6 space-y-6">
            {/* HERO */}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-700">
                  Hero
                </h3>

                <p className="text-sm text-black mt-1">{`${heroCount}/3`}</p>
              </div>

              <Toggle
                active={hero}
                disabled={loadingType === "hero"}
                onClick={() => handleToggle("hero")}
                color="bg-[#1a7a5a]"
              />
            </div>

            {/* LAN */}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-700">LAN</h3>

                <p className="text-sm text-black mt-1">{`${landingCount}/6`}</p>
              </div>

              <Toggle
                active={lan}
                disabled={loadingType === "lan"}
                onClick={() => handleToggle("lan")}
                color="bg-[#e8a020]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* LIMIT MODAL */}

      <AnimatePresence>
        {limitModal.open && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-[28px] bg-white shadow-2xl overflow-hidden"
            >
              {/* Header */}

              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1a3330]">
                  Limit Reached
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Remove one existing advisor to continue.
                </p>
              </div>

              {/* Members */}

              <div className="max-h-[400px] overflow-y-auto p-4 sm:p-6 space-y-3">
                {limitModal.existingMembers?.map((member) => (
                  <div
                    key={member.id}
                    className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {member.name}
                      </h3>

                      <p className="text-sm text-gray-500 truncate">
                        {member.city}
                      </p>
                    </div>

                    <button
                      onClick={() => replaceMember(member.id)}
                      disabled={loadingType === limitModal.type}
                      className="shrink-0 px-4 py-2 rounded-xl bg-[#1a3330] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      Replace
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}

              <div className="px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() =>
                    setLimitModal({
                      open: false,
                      type: "",
                      existingMembers: [],
                    })
                  }
                  className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
