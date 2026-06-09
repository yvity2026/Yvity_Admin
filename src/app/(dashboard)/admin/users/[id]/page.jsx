"use client";

import { use } from "react";
import UserDetailView from "@/components/admin/users/UserDetailView";

export default function UserDetailPage({ params }) {
  const { id } = use(params);

  return <UserDetailView userId={id} />;
}
