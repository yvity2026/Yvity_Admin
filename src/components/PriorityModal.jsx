"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AdminModal from "@/components/admin/ui/AdminModal";

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

  if (!advisor) return null;

  const updatePriority = async ({ type, value, replaceAdvisorId = null }) => {
    try {
      setLoadingType(type);

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

  const handleToggle = async (type) => {
    const isHero = type === "hero";

    const currentState = isHero ? hero : lan;

    const setter = isHero ? setHero : setLan;

    setter(!currentState);

    const success = await updatePriority({
      type,
      value: !currentState,
    });

    if (!success) {
      setter(currentState);
    }
  };

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

  const Toggle = ({ active, onClick, color, disabled }) => {
    return (
      <motion.button
        whileTap={{ scale: 0.94 }}
        disabled={disabled}
        onClick={onClick}
        className={`relative h-7 w-14 overflow-hidden rounded-full transition ${
          active ? color : "bg-gray-300"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md"
          style={{
            left: active ? "calc(100% - 24px)" : "4px",
          }}
        />
      </motion.button>
    );
  };

  return (
    <>
      <AdminModal
        open={Boolean(advisor)}
        onClose={onClose}
        title="Priority"
        size="sm"
        className="bg-[#f8f8f8]"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-700">Hero</h3>
              <p className="mt-1 text-sm text-black">{`${heroCount}/3`}</p>
            </div>

            <Toggle
              active={hero}
              disabled={loadingType === "hero"}
              onClick={() => handleToggle("hero")}
              color="bg-[#1a7a5a]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-700">LAN</h3>
              <p className="mt-1 text-sm text-black">{`${landingCount}/6`}</p>
            </div>

            <Toggle
              active={lan}
              disabled={loadingType === "lan"}
              onClick={() => handleToggle("lan")}
              color="bg-[#e8a020]"
            />
          </div>
        </div>
      </AdminModal>

      <AdminModal
        open={limitModal.open}
        onClose={() =>
          setLimitModal({
            open: false,
            type: "",
            existingMembers: [],
          })
        }
        title="Limit Reached"
        size="md"
        footer={
          <button
            type="button"
            onClick={() =>
              setLimitModal({
                open: false,
                type: "",
                existingMembers: [],
              })
            }
            className="w-full rounded-2xl bg-gray-100 py-3 font-medium transition hover:bg-gray-200"
          >
            Cancel
          </button>
        }
      >
        <p className="mb-4 text-sm text-gray-500">Remove one existing advisor to continue.</p>

        <div className="max-h-[400px] space-y-3 overflow-y-auto">
          {limitModal.existingMembers?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 p-4"
            >
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-gray-800">{member.name}</h3>
                <p className="truncate text-sm text-gray-500">{member.city}</p>
              </div>

              <button
                type="button"
                onClick={() => replaceMember(member.id)}
                disabled={loadingType === limitModal.type}
                className="shrink-0 rounded-xl bg-[#1a3330] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Replace
              </button>
            </div>
          ))}
        </div>
      </AdminModal>
    </>
  );
}
