"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthUserContext";

export default function Home() {
  const router = useRouter();
  const user = useAuth();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (user) {
  //     router.replace("/dashboard"); // ✅ better than push
  //   } else {
  //     setLoading(false);
  //   }
  // }, [user, router]);

  // if (loading) return <div>Loading...</div>;

  // return <div>Landing Page</div>;
  redirect("/dashboard")
}