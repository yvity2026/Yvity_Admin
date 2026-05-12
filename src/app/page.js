"use client"

import { getFirstAccessibleAdminRoute } from "@/lib/admin/permissions";
import { useAdmin } from "@/context/AuthAdminContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import YVITYLoadingPage from "./loading/page";

export default function Home() {
  const { admin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && admin) {
      router.replace(getFirstAccessibleAdminRoute(admin));
    }
  }, [admin, loading, router]);

  if (loading) return <YVITYLoadingPage />;

  if (admin) return null; // will redirect

  return <AdminLogin />;
};