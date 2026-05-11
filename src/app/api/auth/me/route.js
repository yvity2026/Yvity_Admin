import { normalizePermissions } from "@/lib/admin/permissions";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const response = NextResponse.json({
      success: true,
      data: {
        ...admin,
        permissions: normalizePermissions(admin.permissions),
      },
    });

    response.cookies.set(
      "admin_session",
      JSON.stringify({
        admin_id: admin.id,
        role: admin.role,
        permissions: normalizePermissions(admin.permissions),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
