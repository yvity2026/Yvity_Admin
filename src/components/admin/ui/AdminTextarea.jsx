"use client";

import { adminInputClass } from "./tokens";

export default function AdminTextarea({ className = "", ...props }) {
  return <textarea className={`${adminInputClass} resize-y ${className}`} {...props} />;
}
