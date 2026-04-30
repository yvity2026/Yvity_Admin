"use client";

import { ArrowRight, Clapperboard, ThumbsUp, Video } from "lucide-react";
import Link from "next/link";
import AddIntroVideoButton from "@/components/features/advisor/dashboard/add-intro-video-button";
import { useAuth } from "@/context/AuthUserContext";

function CtaContent() {
  return (
    <>
      Add <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
    </>
  );
}

export default function ImproveScore() {
  const { advisor, loading } = useAuth();
  const hasIntroVideo = Boolean(advisor?.intro_url);
  const items = [
    {
      icon: Video,
      title: "Add 1 Video testimonial",
      pts: "+3 pts",
      href: "/advisor/testimonials",
    },
    {
      icon: ThumbsUp,
      title: "Get 2 more recommendations",
      pts: "+4 pts",
      href: "/advisor/recommendations",
    },
    {
      icon: Clapperboard,
      title:
        loading && !advisor
          ? "Intro video"
          : hasIntroVideo
            ? "Reupload intro video"
            : "Add intro video",
      pts: "+2 pts",
      action: "intro-video",
      cta: loading && !advisor ? "..." : hasIntroVideo ? "Reupload" : "Add",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="font-bold text-[#111827] text-[clamp(12px,1.5vw,16px)] mb-6">
        Improve Your Score
      </h3>

      <div className="space-y-3 flex-1">
        {items.map((item) => (
          <div
            key={item.title}
            className="relative group flex items-center justify-between p-3.5 rounded-xl border border-[#E2E1DC] bg-[#F7F6F1] shadow-none"
          >
            {/* Content */}
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-[#124B48]" />
              <span className="text-[clamp(12px,1.5vw,16px)] font-medium text-[#374151]">
                {item.title}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[clamp(10px,1vw,14px)] font-bold text-[#2E7D32]">
                {item.pts}
              </span>
              {/* Conditional rendering for item action */}
              <div className="group-hover:opacity-50 group-hover:blur-sm group-hover:pointer-events-none transition-all">
                {item.action === "intro-video" ? (
                  <AddIntroVideoButton
                    className="bg-[#0A4A4A] hover:bg-[#076868] hover:shadow-[0_0_8px_2px_rgba(13,96,96,0.25)] transition-colors text-[#F59E0B] px-4 py-2 rounded-lg text-[clamp(10px,1vw,14px)] font-semibold flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                    uploadingLabel="Uploading..."
                  >
                    <>
                      {item.cta || "Add"}{" "}
                      <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                    </>
                  </AddIntroVideoButton>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="bg-[#0A4A4A] hover:bg-[#076868] hover:shadow-[0_0_8px_2px_rgba(13,96,96,0.25)] transition-colors text-[#F59E0B] px-4 py-2 rounded-lg text-[clamp(10px,1vw,14px)] font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <CtaContent />
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="bg-[#0A4A4A] text-[#F59E0B] px-4 py-2 rounded-lg text-[clamp(10px,1vw,14px)] font-semibold flex items-center gap-1.5 cursor-not-allowed opacity-70"
                  >
                    <CtaContent />
                  </button>
                )}
              </div>
            </div>

            {/* Hover effect: "Locked" text */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 backdrop-blur-sm opacity-0 group-hover:opacity-100 group-hover:bg-black/40 group-hover:backdrop-blur-sm transition-all duration-300 rounded-xl">
              {/* Lock icon */}
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 8a5 5 0 0110 0v2h1a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2h1V8zm2 2h6V8a3 3 0 10-6 0v2z"
                  clipRule="evenodd"
                />
              </svg>

              {/* Lock text */}
              <span className="text-white text-xs font-medium tracking-wide">
                Upgrade plan
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
