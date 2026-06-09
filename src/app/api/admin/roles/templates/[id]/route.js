import { NextResponse } from "next/server";
import { hasPermission, normalizePermissions } from "@/lib/admin/permissions";
import { getRoleTemplateById } from "@/lib/admin/roleDefinitions";
import { getAllTemplateOverrides, saveTemplateOverride } from "@/lib/admin/roleTemplateStore";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";

export async function GET(_request, { params }) {
  try {
    const currentAdmin = await getAuthenticatedAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const template = getRoleTemplateById(id, getAllTemplateOverrides());
    if (!template) {
      return NextResponse.json({ error: "Role template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    console.error("GET /api/admin/roles/templates/[id] failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    if (currentAdmin.role !== "super_admin") {
      return NextResponse.json({ error: "Only Super Admin can edit role templates" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const permissions = normalizePermissions(body?.permissions);

    const base = getRoleTemplateById(id);
    if (!base) {
      return NextResponse.json({ error: "Role template not found" }, { status: 404 });
    }
    if (!base.isEditable) {
      return NextResponse.json({ error: "This role template cannot be edited" }, { status: 400 });
    }

    saveTemplateOverride(id, permissions);
    const updated = getRoleTemplateById(id, getAllTemplateOverrides());
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/admin/roles/templates/[id] failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: error.message?.includes("cannot be edited") ? 400 : 500 },
    );
  }
}
