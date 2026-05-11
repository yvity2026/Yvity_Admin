"use client"

import { getFirstAccessibleAdminRoute } from "@/lib/admin/permissions";
import { useAdmin } from "@/context/AuthAdminContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";

export default function Home() {
  const { admin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!loading && admin) {
      router.replace(getFirstAccessibleAdminRoute(admin));
    }
  }, [admin, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (admin) return null; // will redirect

  return <AdminLogin />;
}
