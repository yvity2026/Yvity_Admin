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
      heroCount: 0,
      lanCount: 0,
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
      if (item.is_hero) {
        stats.heroCount += 1;
      }

      if (item.is_landing) {
        stats.lanCount += 1;
      }

      return {
        id: item.id,
        user_id: item.advisor_id,
        name: user.name || "Advisor",
        email: user.email || null,
        phone: user.mobile || null,
        profile_pic: user.selfie_url,
        location: user.city || "Unknown, IN",
        licenseUrl: item.iridai_certificate_url,
        isVerified: item.profile_status,
        status,
        submittedAt: item.created_at,
        updatedAt: item.updated_at,
        licenseNo: item.services[0].license,
        plan: item.subscription_plan || item.plan || "Free",
        is_hero: item.is_hero || false,
        is_landing: item.is_landing || false,
      };
    });

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

  const { action, advisorId, is_hero, is_landing, replaceAdvisorId, priorityType } = payload;
  console.log(payload);

  // advisorId required
  if (!advisorId) {
    return NextResponse.json(
      { error: "advisorId is required" },
      { status: 400 },
    );
  }

  // optional validation for action
  if (action !== undefined && !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // optional validation for booleans
  if (is_hero !== undefined && typeof is_hero !== "boolean") {
    return NextResponse.json(
      { error: "is_hero must be boolean" },
      { status: 400 },
    );
  }

  if (is_landing !== undefined && typeof is_landing !== "boolean") {
    return NextResponse.json(
      { error: "is_landing must be boolean" },
      { status: 400 },
    );
  }

  if (
    replaceAdvisorId !== undefined &&
    (typeof replaceAdvisorId !== "string" || !replaceAdvisorId)
  ) {
    return NextResponse.json(
      { error: "replaceAdvisorId must be a valid advisor id" },
      { status: 400 },
    );
  }

  if (
    priorityType !== undefined &&
    !["hero", "lan"].includes(priorityType)
  ) {
    return NextResponse.json(
      { error: "priorityType must be either hero or lan" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  if (replaceAdvisorId && priorityType) {
    const demotionField = priorityType === "hero" ? "is_hero" : "is_landing";
    const { error: demotionError } = await supabase
      .from("advisor_profiles")
      .update({
        [demotionField]: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", replaceAdvisorId);

    if (demotionError) {
      return NextResponse.json(
        { error: "Failed to replace existing priority advisor" },
        { status: 500 },
      );
    }
  }

  if (is_hero === true) {
    const { data: heroMembers, error: heroError } = await supabase
      .from("advisor_profiles")
      .select("id, user:users(name, city)")
      .eq("is_hero", true)
      .neq("id", advisorId);

    if (heroError) {
      return NextResponse.json(
        { error: "Failed to validate hero priority" },
        { status: 500 },
      );
    }

    if (heroMembers.length >= 3 && !(replaceAdvisorId && priorityType === "hero")) {
      return NextResponse.json(
        {
          error: "Hero limit reached",
          members: heroMembers.map((member) => ({
            id: member.id,
            name: member.user?.name || "Advisor",
            city: member.user?.city || "Unknown",
          })),
        },
        { status: 409 },
      );
    }
  }

  if (is_landing === true) {
    const { data: landingMembers, error: landingError } = await supabase
      .from("advisor_profiles")
      .select("id, user:users(name, city)")
      .eq("is_landing", true)
      .neq("id", advisorId);

    if (landingError) {
      return NextResponse.json(
        { error: "Failed to validate landing priority" },
        { status: 500 },
      );
    }

    if (landingMembers.length >= 6 && !(replaceAdvisorId && priorityType === "lan")) {
      return NextResponse.json(
        {
          error: "LAN limit reached",
          members: landingMembers.map((member) => ({
            id: member.id,
            name: member.user?.name || "Advisor",
            city: member.user?.city || "Unknown",
          })),
        },
        { status: 409 },
      );
    }
  }

  const updates = {
    updated_at: new Date().toISOString(),
  };

  if (action === "approve") {
    updates.profile_status = true;
    updates.account_status = "active";
  }

  if (action === "reject") {
    updates.profile_status = false;
    updates.account_status = "action_required";
  }

  if (is_hero !== undefined) {
    updates.is_hero = is_hero;
  }

  if (is_landing !== undefined) {
    updates.is_landing = is_landing;
  }

  const { data: advisor, error } = await supabase
    .from("advisor_profiles")
    .update(updates)
    .eq("id", advisorId)
    .select("id, advisor_id, is_hero, is_landing, account_status, profile_status")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update advisor" },
      { status: 500 },
    );
  }

  // 2. fetch user BEFORE updating roles
  const { data: user } = await supabase
    .from("users")
    .select("id, roles")
    .eq("id", advisor.advisor_id)
    .single();

  if (user) {
    const currentRoles = Array.isArray(user.roles) ? user.roles : [];

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
