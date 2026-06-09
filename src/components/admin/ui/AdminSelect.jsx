"use client";

import { adminInputClass } from "./tokens";

export default function AdminSelect({ className = "", children, ...props }) {
  return (
    <select className={`${adminInputClass} ${className}`} {...props}>
      {children}
    </select>
  );
}
