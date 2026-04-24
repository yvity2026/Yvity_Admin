"use client";

import { Film, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import AddIntroVideoButton from "@/components/features/advisor/dashboard/add-intro-video-button";
import { useAuth } from "@/context/AuthUserContext";

const actionCardClassName =
  "bg-white py-6 px-4 rounded-2xl hover:border-[#124B48] hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer border border-[#E2E1DC] shadow-none";

function ActionContent({ action }) {
  const Icon = action.icon;

  return (
    <>
      <Icon
        className="text-gray-700 group-hover:text-[#124B48] transition-colors"
        strokeWidth={1.5}
      />
      <span className="text-[clamp(8px,1vw,12px)] font-bold text-[#374151]">
        {action.label}
      </span>
    </>
  );
}

export default function QuickActions() {
  const { advisor, loading } = useAuth();
  const hasIntroVideo = Boolean(advisor?.intro_url);
  const actions = [
    { label: "View Profile", icon: FaEye, href: "/advisor/profile" },
    { label: "Share Profile", icon: Share2 },
    { label: "Testimonials", icon: MessageSquare, href: "/advisor/testimonials" },
    {
      label:
        loading && !advisor
          ? "Intro Video"
          : hasIntroVideo
            ? "Reupload Intro Video"
            : "Add Intro Video",
      icon: Film,
      action: "intro-video",
    },
    { label: "Download QR", icon: IoQrCode },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-[#111827] text-[clamp(12px,1.5vw,16px)]">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action) => {
          if (action.href) {
            return (
              <Link
                key={action.label}
                href={action.href}
                className={actionCardClassName}
              >
                <ActionContent action={action} />
              </Link>
            );
          }

          if (action.action === "intro-video") {
            return (
              <AddIntroVideoButton
                key={action.label}
                className={actionCardClassName}
                uploadingLabel="Uploading..."
              >
                <ActionContent action={action} />
              </AddIntroVideoButton>
            );
          }

          return (
            <button
              key={action.label}
              type="button"
              className={actionCardClassName}
              disabled
            >
              <div className="opacity-50">
                <ActionContent action={action} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
