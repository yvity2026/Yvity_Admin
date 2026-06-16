export function escapeIlike(value) {
  return String(value || "").replace(/[%_,]/g, "");
}
