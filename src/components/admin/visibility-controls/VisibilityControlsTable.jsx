"use client";

import Image from "next/image";
import { FiExternalLink } from "react-icons/fi";

function Avatar({ src, name }) {
  const initials = (name || "A")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#0A4A4A] text-sm font-bold text-white">
      {src ? (
        <Image src={src} alt={name || "Advisor"} fill sizes="40px" unoptimized className="object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center">{initials}</span>
      )}
    </div>
  );
}

function SlotToggle({ active, disabled, onClick, label }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`relative h-7 w-12 rounded-full transition disabled:opacity-50 ${
        active ? "bg-[#0A4A4A]" : "bg-[#D7E5E1]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
          active ? "left-[calc(100%-24px)]" : "left-1"
        }`}
      />
    </button>
  );
}

export default function VisibilityControlsTable({
  profiles = [],
  onToggleHero,
  onToggleLanding,
  isProcessing = false,
  processingId = null,
}) {
  if (!profiles.length) {
    return (
      <div className="rounded-[24px] border border-dashed border-[#D7E5E1] bg-[#FCFDFC] px-4 py-16 text-center">
        <p className="font-cormorant text-2xl font-bold text-[#0A4A4A]">No published profiles</p>
        <p className="mt-2 text-sm text-[#7A928D]">
          Approve advisor profiles first, then feature them here for the landing page.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#E6ECEA] bg-white shadow-[0_8px_30px_rgba(10,74,74,0.04)]">
      <div className="mobile-scroll-x">
        <table className="w-full min-w-[920px] text-left">
          <thead>
            <tr className="border-b border-[#EDF1F0] bg-[#FAFCFB] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A928D]">
              <th className="px-5 py-4">Professional</th>
              <th className="px-5 py-4">City</th>
              <th className="px-5 py-4">Plan</th>
              <th className="px-5 py-4">Hero</th>
              <th className="px-5 py-4">Find Advisors</th>
              <th className="px-5 py-4 text-right">Public profile</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              const busy = isProcessing && processingId === profile.id;
              return (
                <tr key={profile.id} className="border-b border-[#F3F6F5] last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={profile.profilePic} name={profile.profileName} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#183534]">
                          {profile.profileName}
                        </p>
                        <p className="truncate text-[12px] text-[#7A928D]">{profile.userName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5C7571]">{profile.city}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#0A4A4A]">{profile.plan}</td>
                  <td className="px-5 py-4">
                    <SlotToggle
                      active={profile.isHero}
                      disabled={busy}
                      label={`Toggle hero for ${profile.profileName}`}
                      onClick={() => onToggleHero(profile)}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <SlotToggle
                      active={profile.isLanding}
                      disabled={busy}
                      label={`Toggle landing for ${profile.profileName}`}
                      onClick={() => onToggleLanding(profile)}
                    />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {profile.publicUrl ? (
                      <a
                        href={profile.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#D7E5E1] px-3 py-2 text-[11px] font-semibold text-[#0A4A4A]"
                      >
                        <FiExternalLink size={13} />
                        View
                      </a>
                    ) : (
                      <span className="text-[12px] text-[#7A928D]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
