import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";

async function parseAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("admin_session")?.value;

  if (!sessionValue) {
    return null;
  }

  try {
    return JSON.parse(sessionValue);
  } catch (error) {
    console.error("Invalid admin session cookie", error);
    return null;
  }
}

async function requireAdmin() {
  const session = await parseAdminSession();
  if (!session || !session.admin_id || !session.role) {
    return null;
  }
  return session;
}

export async function GET() {
  try {
    const adminSession = requireAdmin();
    console.log(adminSession);
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("advisor_profiles")
      .select("*, user:users(id, email, name, mobile, city)")
      .eq("account_status", "under_review")
      .eq("profile_status", false)
      .order("created_at", { ascending: false });
    console.log(data);
    if (error) {
      console.error("Admin approvals query failed", error);
      return NextResponse.json(
        { error: "Unable to load pending approvals" },
        { status: 500 },
      );
    }

    const output = (data || []).map((item) => {
      let user = item.user || {};
      let metadata = user.raw_user_meta_data;

      if (typeof metadata === "string") {
        try {
          metadata = JSON.parse(metadata);
        } catch {
          metadata = {};
        }
      }

      const name =
        metadata?.full_name ||
        metadata?.name ||
        user.email?.split("@")[0] ||
        "Advisor";
      const location = metadata?.city || "Unknown, IN";

      return {
        id: item.id,
        user_id: item.user_id,
        name: user.name,
        email: user.email || null,
        phone: user.mobile || null,
        location: user.city,
        licenseUrl: item.iridai_certificate_url,
        isVerified: item.profile_status,
        submittedAt: item.created_at,
        updatedAt: item.updated_at,
      };
    });

    return NextResponse.json({ data: output });
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(request) {
  const adminSession = await requireAdmin();

  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, advisorId } = payload;

  if (!advisorId || !["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // 1. update advisor profile
  const updates = {
    updated_at: new Date().toISOString(),
    profile_status: action === "approve",
    account_status:
      action === "approve" ? "active" : "action_required",
  };

  const { data: advisor, error } = await supabase
    .from("advisor_profiles")
    .update(updates)
    .eq("id", advisorId)
    .select("id, advisor_id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update advisor" },
      { status: 500 }
    );
  }

  // 2. fetch user BEFORE updating roles
  const { data: user } = await supabase
    .from("users")
    .select("id, roles")
    .eq("id", advisor.advisor_id)
    .single();

  if (user) {
    const currentRoles = Array.isArray(user.roles)
      ? user.roles
      : [];

    const updatedRoles = [...new Set([...currentRoles, "advisor"])];

    await supabase
      .from("users")
      .update({
        roles: updatedRoles,
      })
      .eq("id", user.id);
  }

  return NextResponse.json({
    success: true,
    advisor,
  });
}
