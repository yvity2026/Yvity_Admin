import { NextResponse } from "next/server";
import { canAccessRolesSection } from "@/lib/admin/permissions";
import { serializeAdminUser } from "@/lib/admin/adminUsers";
import {
  getAllRoleTemplates,
  getRoleTemplateLabel,
  resolveAdminRoleTemplate,
} from "@/lib/admin/roleDefinitions";
import { getAllTemplateOverrides } from "@/lib/admin/roleTemplateStore";
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
      console.error("Failed to fetch admin users for roles overview:", error);
      return NextResponse.json({ error: "Unable to load roles overview" }, { status: 500 });
    }

    const adminUsers = (data || []).map(serializeAdminUser);
    const activeAdminUsers = adminUsers.filter((row) => row.is_active).length;
    const customRoles = adminUsers.filter((row) => row.role_template === "custom").length;

    const overrides = getAllTemplateOverrides();
    const templates = getAllRoleTemplates(overrides).map((template) => {
      const assignedUsers = adminUsers.filter((row) => {
        if (template.id === "super_admin") return row.role === "super_admin";
        return row.role_template === template.id;
      });

      return {
        ...template,
        usersAssigned: assignedUsers.length,
        assignedUserIds: assignedUsers.map((row) => row.id),
      };
    });

    return NextResponse.json({
      success: true,
      overview: {
        totalRoles: templates.length,
        activeAdminUsers,
        customRoles,
        totalAdminUsers: adminUsers.length,
      },
      roles: templates,
      adminUsers,
      roleLabels: adminUsers.reduce((acc, row) => {
        acc[row.id] = getRoleTemplateLabel(resolveAdminRoleTemplate(row));
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("GET /api/admin/roles/overview failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
