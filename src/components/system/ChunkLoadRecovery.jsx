"use client";

import { useEffect } from "react";

function isChunkLoadError(reason) {
  if (!reason) return false;
  const message = String(reason?.message || reason);
  const name = String(reason?.name || "");
  return (
    name === "ChunkLoadError" ||
    message.includes("Loading chunk") ||
    message.includes("ChunkLoadError")
  );
}

export default function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = () => {
      const key = "yvity-chunk-reload";
      const last = Number(sessionStorage.getItem(key) || 0);
      if (Date.now() - last < 10000) return;
      sessionStorage.setItem(key, String(Date.now()));
      window.location.reload();
    };

    const onRejection = (event) => {
      if (isChunkLoadError(event.reason)) {
        event.preventDefault();
        reloadOnce();
      }
    };

    const onError = (event) => {
      if (isChunkLoadError(event.error || event.message)) {
        reloadOnce();
      }
    };

    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return null;
}
