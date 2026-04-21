"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
}

export default function InitPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const userId = getCookie("yvity_user_id");

      if (!userId) {
        router.push("/");
        return;
      }

      await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      router.push("/dashboard");
    };

    run();
  }, []);

  return <p>Setting up session...</p>;
}