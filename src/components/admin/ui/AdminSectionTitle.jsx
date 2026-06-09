"use client";

export default function AdminSectionTitle({
  eyebrow,
  title,
  hint,
  className = "",
  titleClassName = "",
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {eyebrow ? (
        <p className="font-poppins text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-cormorant text-[22px] font-bold text-[#0A4A4A] md:text-[24px] ${titleClassName}`}
      >
        {title}
      </h2>
      {hint ? <p className="mt-1 text-sm text-[#5C7571]">{hint}</p> : null}
    </div>
  );
}
