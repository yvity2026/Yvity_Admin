"use client";

import { adminInputClass } from "./tokens";

export default function AdminInput({ className = "", ...props }) {
  return <input className={`${adminInputClass} ${className}`} {...props} />;
}
