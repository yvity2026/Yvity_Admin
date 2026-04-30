"use client";

import { startTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthUserContext";

const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;
const ACCEPTED_VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|avi)$/i;
const ACCEPTED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "video/x-msvideo",
]);

function isAcceptedVideo(file) {
  if (!file) return false;

  if (ACCEPTED_VIDEO_TYPES.has(file.type)) {
    return true;
  }

  return ACCEPTED_VIDEO_EXTENSIONS.test(file.name || "");
}

export default function AddIntroVideoButton({
  children,
  className = "",
  plan = false,
  uploadingLabel = "Uploading...",
}) {
  const router = useRouter();
  const { advisor, setAdvisor } = useAuth();
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    const hadIntroVideo = Boolean(advisor?.intro_url);

    if (!file) return;

    if (!isAcceptedVideo(file)) {
      toast.error("Upload MP4, MOV, WEBM, AVI, or M4V video");
      return;
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      toast.error("Video must be 50MB or smaller");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      setIsUploading(true);

      const response = await fetch("/api/advisor/intro-video", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || result?.message || "Failed to upload intro video",
        );
      }

      if (result?.data?.profile) {
        setAdvisor(result.data.profile);
      }

      toast.success(
        hadIntroVideo
          ? "Intro video reuploaded and score refreshed"
          : "Intro video uploaded and score updated",
      );
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Intro video upload failed", error);
      toast.error(error.message || "Failed to upload intro video");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/x-msvideo,.mp4,.webm,.mov,.m4v,.avi"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className={` relative overflow-hidden group ${className}`}
        onClick={handleClick}
        disabled={isUploading}
        aria-busy={isUploading}
      >
        {isUploading ? uploadingLabel : children}

        {/* Hover updrade overlay */}

        {!plan && (
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
        )}
      </button>
    </>
  );
}
