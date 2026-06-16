import { createAdminClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { mapProfileRow } from "@/lib/admin/profiles/mapProfileRecord";
import { listLocalProfiles, useLocalProfiles } from "@/lib/local-data/profiles";
import { NextResponse } from "next/server";
import { escapeIlike } from "@/lib/search/escapeIlike";

async function resolveSearchProfileIds(supabase, query) {
  const term = escapeIlike(query.trim());
  if (!term) return null;

  const ids = new Set();
  const like = `%${term}%`;

  const { data: profileMatches } = await supabase
    .from("advisor_profiles")
    .select("id, advisor_id")
    .or(`designation.ilike.${like},profile_slug.ilike.${like}`);

  for (const row of profileMatches || []) {
    if (row.id) ids.add(row.id);
  }

  const { data: userMatches } = await supabase
    .from("users")
    .select("id, name")
    .or(`name.ilike.${like},city.ilike.${like},profession.ilike.${like}`);

  const userIds = (userMatches || []).map((row) => row.id).filter(Boolean);

  if (userIds.length) {
    const { data: linkedProfiles } = await supabase
      .from("advisor_profiles")
      .select("id")
      .in("advisor_id", userIds);

    for (const row of linkedProfiles || []) {
      if (row.id) ids.add(row.id);
    }
  }

  if (/^[0-9a-f-]{8,36}$/i.test(term)) {
    if (term.length === 36) {
      const { data: exactUser } = await supabase
        .from("advisor_profiles")
        .select("id")
        .eq("advisor_id", term);

      for (const row of exactUser || []) {
        if (row.id) ids.add(row.id);
      }

      ids.add(term);
    } else {
      const { data: idMatches } = await supabase
        .from("advisor_profiles")
        .select("id")
        .filter("id", "ilike", `%${term}%`);

      for (const row of idMatches || []) {
        if (row.id) ids.add(row.id);
      }
    }
  }

  return Array.from(ids);
}

async function attachServices(supabase, rows = []) {
  const advisorIds = rows.map((row) => row.advisor_id).filter(Boolean);
  if (!advisorIds.length) return rows;

  const { data: services } = await supabase
    .from("advisor_services")
    .select("advisor_id, service_type, company")
    .in("advisor_id", advisorIds);

  const byAdvisor = new Map();
  for (const service of services || []) {
    const list = byAdvisor.get(service.advisor_id) || [];
    list.push(service);
    byAdvisor.set(service.advisor_id, list);
  }

  return rows.map((row) => ({
    ...row,
    _services: byAdvisor.get(row.advisor_id) || [],
  }));
}

async function fetchOverview(supabase) {
  const [
    totalRes,
    publishedRes,
    pendingRes,
    rejectedRes,
    hiddenRes,
    heroRes,
    landingRes,
    verificationPendingRes,
    updateRequestsRes,
  ] = await Promise.all([
    supabase.from("advisor_profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "active")
      .eq("profile_status", true)
      .eq("ispublic_profile", true),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "under_review"),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "action_required"),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("ispublic_profile", false),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_hero", true),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_landing", true),
    supabase
      .from("advisor_profiles")
      .select("*", { count: "exact", head: true })
      .eq("account_status", "under_review")
      .not("iridai_certificate_url", "is", null),
    supabase
      .from("profile_update_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const pendingCount = pendingRes.count || 0;

  return {
    totalProfiles: totalRes.count || 0,
    publishedProfiles: publishedRes.count || 0,
    pendingProfiles: pendingCount,
    rejectedProfiles: rejectedRes.count || 0,
    hiddenProfiles: hiddenRes.count || 0,
    featuredHero: heroRes.count || 0,
    featuredLanding: landingRes.count || 0,
    attention: {
      pendingReview: pendingCount,
      verificationPending: verificationPendingRes.count || 0,
      updateRequests: updateRequestsRes.count || 0,
    },
  };
}

export async function GET(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "10", 10), 1), 50);
    const q = (searchParams.get("q") || "").trim();
    const status = searchParams.get("status") || "all";
    const featured = searchParams.get("featured") || "all";
    const plan = searchParams.get("plan") || "all";
    const industry = searchParams.get("industry") || "all";

    if (useLocalProfiles()) {
      const result = listLocalProfiles({
        page,
        limit,
        q,
        status,
        featured,
        plan,
        industry,
      });
      return NextResponse.json(result);
    }

    const supabase = createAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const overviewData = await fetchOverview(supabase);
    const searchIds = q ? await resolveSearchProfileIds(supabase, q) : null;

    if (searchIds && searchIds.length === 0) {
      return NextResponse.json({
        success: true,
        overview: overviewData,
        attention: overviewData.attention,
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    let query = supabase
      .from("advisor_profiles")
      .select(
        `
        *,
        user:users(id, name, city, profession, selfie_url, account_status)
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false });

    if (searchIds) {
      query = query.in("id", searchIds);
    }

    if (status === "published") {
      query = query
        .eq("account_status", "active")
        .eq("profile_status", true)
        .eq("ispublic_profile", true);
    } else if (status === "pending") {
      query = query.eq("account_status", "under_review");
    } else if (status === "rejected") {
      query = query.eq("account_status", "action_required");
    } else if (status === "hidden") {
      query = query.eq("ispublic_profile", false);
    }

    if (featured === "hero") {
      query = query.eq("is_hero", true);
    } else if (featured === "landing") {
      query = query.eq("is_landing", true);
    }

    if (plan !== "all") {
      query = query.eq("subscription_plan", plan);
    }

    if (industry !== "all") {
      query = query.ilike("designation", `%${escapeIlike(industry)}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("GET /api/admin/profiles failed:", error);
      return NextResponse.json(
        { error: "Unable to load profiles", details: error.message },
        { status: 500 },
      );
    }

    const rowsWithServices = await attachServices(supabase, data || []);

    return NextResponse.json({
      success: true,
      overview: overviewData,
      attention: overviewData.attention,
      data: rowsWithServices.map((row) => mapProfileRow(row, row._services || [])),
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/profiles failed:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { profileId, action } = body;

    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    if (!["hide", "unhide"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("advisor_profiles")
      .update({
        ispublic_profile: action === "unhide",
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .select("id, ispublic_profile")
      .maybeSingle();

    if (error) {
      console.error("PATCH /api/admin/profiles failed:", error);
      return NextResponse.json({ error: "Unable to update profile" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("PATCH /api/admin/profiles failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
