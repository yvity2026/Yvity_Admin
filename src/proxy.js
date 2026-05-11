import { NextResponse } from "next/server";
import {
  ADMIN_SECTION_ROUTE_MAP,
  canAccessSidebarItem,
  getFirstAccessibleAdminRoute,
} from "@/lib/admin/permissions";

function getMatchedSection(pathname, pathType) {
  return ADMIN_SECTION_ROUTE_MAP.find((section) => {
    const prefixes =
      pathType === "api" ? section.apiPrefixes || [] : section.pagePrefixes || [];

    return prefixes.some((prefix) => {
      if (prefix === "/admin") {
        return pathname === "/admin";
      }

      return pathname.startsWith(prefix);
    });
  });
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const session = JSON.parse(adminSession.value);
      if (!session?.admin_id || !session?.role) {
        if (isAdminApi) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.redirect(new URL("/", request.url));
      }

      if (pathname === "/admin/unauthorized") {
        return NextResponse.next();
      }

      const pathType = isAdminApi ? "api" : "page";
      const matchedSection = getMatchedSection(pathname, pathType);

      if (matchedSection) {
        const isAllowed = canAccessSidebarItem(
          session,
          matchedSection.permissionKey,
          matchedSection.alternatePermissionKeys || [],
        );

        if (!isAllowed) {
          if (isAdminApi) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
          }

          const redirectTarget = getFirstAccessibleAdminRoute(session);
          const safeTarget =
            redirectTarget === pathname ? "/admin/unauthorized" : redirectTarget;

          return NextResponse.redirect(new URL(safeTarget, request.url));
        }
      }
    } catch {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
