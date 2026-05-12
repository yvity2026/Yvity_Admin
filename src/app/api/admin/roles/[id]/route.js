import { NextResponse } from "next/server";
import { canAccessRolesSection, hasPermission, normalizePermissions } from "@/lib/admin/permissions";
import { serializeAdminUser } from "@/lib/admin/adminUsers";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

async function getTargetAdmin(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
}

function buildSessionCookiePayload(adminUser) {
  return {
    admin_id: adminUser.id,
    role: adminUser.role,
    permissions: normalizePermissions(adminUser.permissions),
  };
}

export async function GET(_request, { params }) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();

    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessRolesSection(currentAdmin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const adminUser = await getTargetAdmin(id);

    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    if (adminUser.role === "super_admin" && currentAdmin.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: serializeAdminUser(adminUser) });
  } catch (error) {
    console.error("GET /api/admin/roles/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();

    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(currentAdmin, "roles_permissions")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const existingAdminUser = await getTargetAdmin(id);

    if (!existingAdminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    if (
      existingAdminUser.role === "super_admin" &&
      currentAdmin.role !== "super_admin"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (currentAdmin.role !== "super_admin" && currentAdmin.id === id) {
      return NextResponse.json(
        { error: "Admins cannot edit their own permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (body?.name !== undefined) {
      const name = String(body.name || "").trim();

      if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }

      updates.name = name;
    }

    if (body?.permissions !== undefined) {
      updates.permissions = normalizePermissions(body.permissions);
    }

    if (body?.profile_image_url !== undefined) {
      updates.profile_image_url =
        typeof body.profile_image_url === "string" && body.profile_image_url.trim()
          ? body.profile_image_url.trim()
          : null;
    }

    if (body?.is_active !== undefined) {
      if (typeof body.is_active !== "boolean") {
        return NextResponse.json(
          { error: "is_active must be a boolean value" },
          { status: 400 },
        );
      }

      updates.is_active = body.is_active;
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_users")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to update admin user:", error);
      return NextResponse.json(
        { error: "Unable to update admin user" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      success: true,
      data: serializeAdminUser(data),
    });

    if (currentAdmin.id === data.id) {
      if (!data.is_active) {
        response.cookies.set("admin_session", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 0,
          expires: new Date(0),
          path: "/",
        });
      } else {
        response.cookies.set(
          "admin_session",
          JSON.stringify(buildSessionCookiePayload(data)),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          },
        );
      }
    }

    return response;
  } catch (error) {
    console.error("PUT /api/admin/roles/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();

    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(currentAdmin, "delete_admin_user")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const existingAdminUser = await getTargetAdmin(id);

    if (!existingAdminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    if (existingAdminUser.role !== "admin") {
      return NextResponse.json(
        { error: "Only admin users can be deleted from this action" },
        { status: 403 },
      );
    }

    if (currentAdmin.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 403 },
      );
    }

    const supabase = createAdminClient();
    const { error: clearCreatedByError } = await supabase
      .from("admin_users")
      .update({
        created_by: null,
        updated_at: new Date().toISOString(),
      })
      .eq("created_by", id);

    if (clearCreatedByError) {
      console.error("Failed to clear created_by references:", clearCreatedByError);
      return NextResponse.json(
        { error: "Unable to delete admin user" },
        { status: 500 },
      );
    }

    const { data, error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Failed to delete admin user:", error);
      return NextResponse.json(
        { error: "Unable to delete admin user" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeAdminUser(data),
    });
  } catch (error) {
    console.error("DELETE /api/admin/roles/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
