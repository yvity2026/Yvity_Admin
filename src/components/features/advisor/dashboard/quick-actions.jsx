"use client";

import { useEffect, useRef, useState } from "react";
import { Film, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { FaEye } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import AddIntroVideoButton from "@/components/features/advisor/dashboard/add-intro-video-button";
import { useAuth } from "@/context/AuthUserContext";
import {
  advisorQrCodeImageSettings,
  advisorQrCodeLevel,
} from "@/lib/advisor/qrBranding";
import { resolveAdvisorProfileSlug } from "@/lib/advisor/profileSlug";

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
  const { user, advisor, loading } = useAuth();
  const qrRef = useRef(null);
  const [appOrigin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : "",
  );
  const [serverBaseUrl, setServerBaseUrl] = useState("");
  const hasIntroVideo = Boolean(advisor?.intro_url);

  useEffect(() => {
    let isMounted = true;

    async function fetchPublicBaseUrl() {
      try {
        const response = await fetch("/api/config/public-base-url", {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result?.baseUrl || !isMounted) {
          return;
        }

        setServerBaseUrl(result.baseUrl);
      } catch (error) {
        console.error("Failed to load public base URL:", error);
      }
    }

    fetchPublicBaseUrl();

    return () => {
      isMounted = false;
    };
  }, []);

  const advisorProfileSlug = resolveAdvisorProfileSlug(
    advisor?.profile_slug,
    user?.name,
  );
  const advisorProfileId = advisor?.advisor_id || user?.id || "";
  const publicProfilePath = advisorProfileSlug
    ? `/dashboard/${advisorProfileSlug}`
    : advisorProfileId
      ? `/dashboard/${advisorProfileId}`
      : "";
  const publicBaseUrl = serverBaseUrl || appOrigin;
  const normalizedBaseUrl = publicBaseUrl
    ? publicBaseUrl.replace(/\/+$/, "")
    : "";
  const publicProfileUrl =
    normalizedBaseUrl && publicProfilePath
      ? `${normalizedBaseUrl}${publicProfilePath}`
      : publicProfilePath;
  const qrDownloadFileName = `${advisorProfileSlug || "advisor"}-qr.png`;
  const canShareProfile = Boolean(publicProfileUrl || publicProfilePath);
  const canDownloadQr = Boolean(publicProfileUrl || publicProfilePath);

  const shareProfileOnWhatsApp = () => {
    const profileLink = publicProfileUrl || publicProfilePath;
    if (!profileLink) return;

    const message = encodeURIComponent(profileLink);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = qrDownloadFileName;
    link.click();
  };

  const actions = [
    { label: "View Profile", icon: FaEye, href: "/advisor/profile" },
    { label: "Share Profile", icon: Share2, action: "share-profile" },
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
    { label: "Download QR", icon: IoQrCode, action: "download-qr" },
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
              <>
              <AddIntroVideoButton
                key={action.label}
                className={actionCardClassName}
                plan = {advisor?.subscription_plan.toLowerCase() === "gold"}
                uploadingLabel="Uploading..."
              >
                <ActionContent action={action} />
              </AddIntroVideoButton>
              </>
            );
          }

          if (action.action === "download-qr") {
            return (
              <button
                key={action.label}
                type="button"
                className={actionCardClassName}
                onClick={downloadQR}
                disabled={!canDownloadQr}
              >
                <ActionContent action={action} />
              </button>
            );
          }

          if (action.action === "share-profile") {
            return (
              <button
                key={action.label}
                type="button"
                className={actionCardClassName}
                onClick={shareProfileOnWhatsApp}
                disabled={!canShareProfile}
              >
                <ActionContent action={action} />
              </button>
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
      <div ref={qrRef} className="hidden" aria-hidden="true">
        {canDownloadQr ? (
          <QRCodeCanvas
            value={publicProfileUrl || publicProfilePath}
            size={180}
            level={advisorQrCodeLevel}
            imageSettings={advisorQrCodeImageSettings}
          />
        ) : null}
      </div>
    </div>
  );
}
