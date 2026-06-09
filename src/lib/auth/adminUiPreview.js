/** Client-safe UI preview for admin login (no API / DB). Enable with NEXT_PUBLIC_ADMIN_UI_PREVIEW=true */

export const ADMIN_UI_PREVIEW_OTP = "123456";

export function isAdminUiPreviewEnabled() {
  return process.env.NEXT_PUBLIC_ADMIN_UI_PREVIEW === "true";
}

export function buildPreviewAdminSession() {
  return {
    admin_id: "ui-preview-admin",
    role: "super_admin",
    permissions: {},
  };
}

/** Sets a non-httpOnly cookie so proxy/layout accept preview access. Dev only. */
export function setPreviewAdminSessionCookie() {
  if (typeof document === "undefined") return;

  const value = encodeURIComponent(JSON.stringify(buildPreviewAdminSession()));
  const maxAge = 60 * 60 * 24 * 7;

  document.cookie = `admin_session=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearPreviewAdminSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "admin_session=; path=/; max-age=0; SameSite=Lax";
}
