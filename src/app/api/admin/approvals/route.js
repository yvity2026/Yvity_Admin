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
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("advisor_profiles")
      .select("*, user:users(id, email, name, mobile, city, selfie_url)")
      .in("account_status", ["under_review", "active", "action_required"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin approvals query failed", error);
      return NextResponse.json(
        { error: "Unable to load approvals" },
        { status: 500 },
      );
    }

    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    const output = (data || []).map((item) => {
      const user = item.user || {};
      const status =
        item.account_status === "active"
          ? "approved"
          : item.account_status === "action_required"
            ? "rejected"
            : "pending";

      stats[status] += 1;

      return {
        id: item.id,
        user_id: item.advisor_id,
        name: user.name || "Advisor",
        email: user.email || null,
        phone: user.mobile || null,
        profile_pic : user.selfie_url,
        location: user.city || "Unknown, IN",
        licenseUrl: item.iridai_certificate_url,
        isVerified: item.profile_status,
        status,
        submittedAt: item.created_at,
        updatedAt: item.updated_at,
        licenseNo: item.services[0].license,
        plan : item.subscription_plan,

      };
    });

    console.log(output)

    return NextResponse.json({ data: output, stats });
  } catch (error) {
    console.error("Admin approvals GET failed", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
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
