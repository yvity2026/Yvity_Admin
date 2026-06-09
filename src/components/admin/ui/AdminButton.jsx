"use client";

const variants = {
  primary: "bg-[#0A4A4A] text-white hover:bg-[#083838] disabled:opacity-60",
  secondary:
    "border border-[#E6ECEA] bg-white text-[#0A4A4A] hover:bg-[#F8FAFC] disabled:opacity-60",
  ghost: "text-[#0A4A4A] hover:bg-[#F8FAFC] disabled:opacity-60",
  danger: "bg-[#991B1B] text-white hover:bg-[#7F1D1D] disabled:opacity-60",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

export default function AdminButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
