"use client";

import { useEffect } from "react";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return null;
}

export default function InitPage() {
  useEffect(() => {
    const userId = getCookie("yvity_user_id");

    if (!userId) {
      window.location.href = "http://localhost:3000";
      return;
    }

    // 🔥 let server handle redirect + cookie
    fetch("/api/auth/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    }).then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      }
    });
  }, []);

  return <p>Loading...</p>;
}