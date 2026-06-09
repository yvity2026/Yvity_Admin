"use client";

import AdminButton from "./AdminButton";

export default function AdminErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center font-poppins ${className}`}
      role="alert"
    >
      <p className="font-cormorant text-2xl font-bold text-[#0A4A4A]">{title}</p>
      {message ? <p className="max-w-md text-sm text-[#5C7571]">{message}</p> : null}
      {onRetry ? (
        <AdminButton variant="primary" onClick={onRetry}>
          {retryLabel}
        </AdminButton>
      ) : null}
      {action}
    </div>
  );
}
