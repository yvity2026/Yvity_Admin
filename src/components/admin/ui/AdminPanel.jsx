"use client";

import { adminPanelClass } from "./tokens";

export default function AdminPanel({ children, className = "", as: Tag = "section" }) {
  return <Tag className={`${adminPanelClass} ${className}`}>{children}</Tag>;
}
