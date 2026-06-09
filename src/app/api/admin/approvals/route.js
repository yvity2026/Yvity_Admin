import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import {
  approveLocalProfile,
  listLocalApprovals,
  rejectLocalProfile,
  useLocalApprovals,
} from "@/lib/local-data/advisor-approvals";
import { goldAppBaseUrl } from "@/lib/local-data/paths";
import {
  computeApprovalOverview,
  mapApprovalRow,
} from "@/lib/admin/approvals/mapApprovalRecord";
import { listLocalProfileUpdateRequests } from "@/lib/local-data/profile-update-requests";
import {
  filterApprovalRows,
  paginateRows,
} from "@/lib/admin/approvals/filterApprovals";

function useGoldApprovalsApi() {
  if (process.env.YVITY_GOLD_APPROVALS_API === "false") return false;
  return useLocalApprovals();
}

function parseListParams(searchParams) {
  return {
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 10,
    q: searchParams.get("q") || "",
    status: searchParams.get("status") || "all",
    plan: searchParams.get("plan") || "all",
    featured: searchParams.get("featured") || "all",
    queue: searchParams.get("queue") || "all",
    requestType: searchParams.get("requestType") || "all",
    changeType: searchParams.get("changeType") || "all",
  };
}

async function fetchGoldApprovals() {
  const base = goldAppBaseUrl();
  const res = await fetch(`${base}/api/admin/approvals`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || "Unable to load approvals from YVITY Gold");
  }
  return json;
}

async function postGoldApproval(payload) {
  const base = goldAppBaseUrl();
  const res = await fetch(`${base}/api/admin/approvals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error || "Unable to update approval in YVITY Gold");
  }
  return json;
}

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

function buildApprovalsResponse(allRows, params, profileUpdates = []) {
  const overview = computeApprovalOverview(allRows, profileUpdates);
  const filtered = filterApprovalRows(allRows, params);
  const { data, pagination } = paginateRows(
    filtered,
    params.page,
    params.limit,
  );

  return {
    success: true,
    data,
    profileUpdates,
    stats: {
      pending: overview.pendingApprovals,
      approvedToday: overview.approvedToday,
      rejectedToday: overview.rejectedToday,
      profileUpdates: overview.profileUpdateRequests,
    },
    overview,
    attention: overview.attention,
    pagination,
  };
}

export async function GET(request) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = parseListParams(new URL(request.url).searchParams);

    if (useLocalApprovals()) {
      return NextResponse.json(listLocalApprovals(params));
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

    const allRows = (data || []).map((item) =>
      mapApprovalRow(
        {
          ...item,
          submitted_at: item.created_at,
          advisor_id: item.advisor_id,
          source: "supabase",
        },
        item.user || {},
        [],
      ),
    );

    const profileUpdates = listLocalProfileUpdateRequests(params);

    return NextResponse.json(buildApprovalsResponse(allRows, params, profileUpdates));
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

  const { action, advisorId, is_hero, is_landing, replaceAdvisorId, priorityType, reason, note } =
    payload;

  if (!advisorId) {
    return NextResponse.json(
      { error: "advisorId is required" },
      { status: 400 },
    );
  }

  if (action !== undefined && !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (useGoldApprovalsApi() && (action === "approve" || action === "reject")) {
    try {
      return NextResponse.json(
        await postGoldApproval({
          action,
          advisorId,
          reason: reason || note,
          note,
        }),
      );
    } catch (error) {
      console.error("Gold approvals POST failed, falling back to local files", error);
    }
  }

  if (useLocalApprovals()) {
    if (action === "approve") {
      const profile = approveLocalProfile(advisorId);
      if (!profile) {
        return NextResponse.json({ error: "Advisor profile not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        advisor: {
          id: profile.id,
          advisor_id: profile.user_id,
          account_status: profile.account_status,
          profile_status: profile.profile_status,
        },
      });
    }

    if (action === "reject") {
      const profile = rejectLocalProfile(
        advisorId,
        reason || note || "Profile requires changes",
      );
      if (!profile) {
        return NextResponse.json({ error: "Advisor profile not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        advisor: {
          id: profile.id,
          advisor_id: profile.user_id,
          account_status: profile.account_status,
          profile_status: profile.profile_status,
        },
      });
    }

    if (is_hero !== undefined || is_landing !== undefined) {
      return NextResponse.json(
        { error: "Hero and landing priority are not available for local approvals yet" },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  }

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
