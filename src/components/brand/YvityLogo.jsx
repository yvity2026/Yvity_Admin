import Image from "next/image";

export const YVITY_LOGO_SRC = "/images/yvity-logo.png";
export const YVITY_NAME = "YVITY";

const SURFACE_STYLES = {
  none: "",
  cream:
    "rounded-2xl bg-[#F8F6F1] shadow-[0_2px_14px_rgba(10,74,74,0.1)] ring-1 ring-white/90",
};

export default function YvityLogo({
  showName = false,
  namePosition = "below",
  size = "md",
  layout = "square",
  surface = "none",
  className = "",
  imageClassName = "",
  nameClassName = "",
}) {
  const sizes = {
    sm: { box: "h-10 w-10", horizontal: "h-8 w-auto", text: "text-lg" },
    md: { box: "h-14 w-14 sm:h-16 sm:w-16", horizontal: "h-10 w-auto", text: "text-xl sm:text-2xl" },
    lg: { box: "h-20 w-20 sm:h-24 sm:w-24", horizontal: "h-12 w-auto", text: "text-2xl sm:text-3xl" },
  };

  const current = sizes[size] || sizes.md;
  const surfaceClass = SURFACE_STYLES[surface] || SURFACE_STYLES.none;
  const padClass = surface === "cream" ? "px-3 py-2" : "";
  const nameClasses = `font-cormorant font-bold tracking-wide text-[#0A4A4A] ${current.text} ${nameClassName}`;

  const logoImage =
    layout === "horizontal" ? (
      <Image
        src={YVITY_LOGO_SRC}
        alt={`${YVITY_NAME} logo`}
        width={140}
        height={48}
        className={`object-contain ${current.horizontal} ${imageClassName}`}
        priority
      />
    ) : (
      <div className={`relative ${current.box}`}>
        <Image
          src={YVITY_LOGO_SRC}
          alt={`${YVITY_NAME} logo`}
          fill
          className={`object-contain ${imageClassName}`}
          priority
        />
      </div>
    );

  if (showName && namePosition === "right") {
    return (
      <div
        className={`flex items-center gap-2.5 ${surfaceClass} ${padClass} ${className}`}
      >
        {logoImage}
        <span className={nameClasses}>{YVITY_NAME}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`flex shrink-0 items-center justify-center ${surfaceClass} ${padClass} ${
          layout === "square" ? `relative ${current.box}` : ""
        }`}
      >
        {logoImage}
      </div>
      {showName && namePosition === "below" ? (
        <span className={nameClasses}>{YVITY_NAME}</span>
      ) : null}
    </div>
  );
}
