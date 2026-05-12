import { NextResponse } from "next/server";
import { canAccessRolesSection, hasPermission, normalizePermissions } from "@/lib/admin/permissions";
import { serializeAdminUser, normalizeAdminPhoneNumber } from "@/lib/admin/adminUsers";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const currentAdmin = await getAuthenticatedAdmin();

    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessRolesSection(currentAdmin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch admin users:", error);
      return NextResponse.json(
        { error: "Unable to load admin users" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: (data || []).map(serializeAdminUser),
    });
  } catch (error) {
    console.error("GET /api/admin/roles failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();

    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(currentAdmin, "create_admin_user")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const name = String(body?.name || "").trim();
    const phoneNumber = normalizeAdminPhoneNumber(body?.phone_number);
    const permissions = normalizePermissions(body?.permissions);
    const profileImageUrl =
      typeof body?.profile_image_url === "string" && body.profile_image_url.trim()
        ? body.profile_image_url.trim()
        : null;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number must be a valid 10 digit Indian number or E.164 value" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: existingAdmin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("phone_number", phoneNumber)
      .maybeSingle();

    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin user already exists with this phone number" },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        name,
        phone_number: phoneNumber,
        role: "admin",
        permissions,
        profile_image_url: profileImageUrl,
        created_by: currentAdmin.id,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to create admin user:", error);
      return NextResponse.json(
        { error: error.code === "23505" ? "Phone number already exists" : "Unable to create admin user" },
        { status: error.code === "23505" ? 409 : 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: serializeAdminUser(data) },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/roles failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
